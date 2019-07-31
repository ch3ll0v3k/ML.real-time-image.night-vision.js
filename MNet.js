const fs = require('fs');
const synaptic = require('synaptic');
const {Layer, Network, Trainer} = synaptic; 

module.exports = MNet = class{

  constructor( {inp=false, hidNeurons=false, hidLayers=false, out=false, rate=0.05, error=0.05} ){

    this.root = __dirname;
    this.nonce = 0;
    this.rate = rate;
    this.error = error;

    if( !inp || !out ){
      console.log(' aborting: constructor ...');
      return;
    }

    console.json({meta: {
      inp, hidNeurons, hidLayers, out, rate, error
    }});

    this.hidLayers = [];

    if( hidLayers ){

      hidNeurons = (hidNeurons || Math.floor((inp+out) *1.24));

      console.json({hidNeurons, hidLayers});

      for( let i=0; i<hidLayers; i++ )
        this.hidLayers.push( new Layer( hidNeurons ) );
    }

    this.inpLayer = new Layer( inp );
    this.outLayer = new Layer( out );

    if( !hidLayers || !hidNeurons ){
      console.warn(' Warning: Using IN-Layer => project => OUT-Layer');
      console.json({ hidLayers, hidNeurons });

      console.log(' input project => output ')
      this.inpLayer.project( this.outLayer, Layer.connectionType.ALL_TO_ALL );

    }else if( hidLayers < 2 ){
      console.log(' input project => hidden ')
      this.inpLayer.project( this.hidLayers[0] );
      console.log(' hidden project => output ')
      this.hidLayers[ 0 ].project( this.outLayer );

    }else{

      this.inpLayer.project( this.hidLayers[0], Layer.connectionType.ALL_TO_ALL );

      for( let i=0; i<(this.hidLayers.length-1); i++ )
        this.hidLayers[ i ].project( this.hidLayers[ i+1 ], Layer.connectionType.ALL_TO_ALL );

      this.hidLayers[ this.hidLayers.length-1 ].project( this.outLayer, Layer.connectionType.ALL_TO_ALL );
    }

    console.json({
      meta: 'new Network',
      inputs: this.inpLayer.list.length,
      hidLayers: this.hidLayers.length,
      hidNeurons: ( this.hidLayers.length ? this.hidLayers[0].list.length : 0),
      outputs: this.outLayer.list.length,
    });

    this.Net = new Network({
        input: this.inpLayer,
        hidden: this.hidLayers,
        output: this.outLayer
    });

    console.log(' #Configuration done ... ')
    this.trainer = null;
    this.dataset = null;
    // process.exit();

  }

  setRoot( path ){
    this.root = path;
  }

  optimize(){
    this.Net.optimize();
  }

  createTrainer(){
    this.trainer = new Trainer(this.Net);
    return this.trainer;
  }

  train( dataset, options, cb=false ){

    if( !this.trainer ){
      console.info(  ' #Calling: createTrainer() => (new Trainer(this.Net)); in auto mode' );
      this.createTrainer();
    }

    console.info(' #Create: [trainer] => dataset length['+(dataset.length)+']');

    let self = this;
    let time = Date.now();

    // for( let coast of Object.keys(Trainer.cost) ){
    //   console.log({coast})
    //   // {"coast":"CROSS_ENTROPY"}
    //   // {"coast":"MSE"}
    //   // {"coast":"BINARY"}
    // }
    // process.exit();


    console.info(' #Start: [trainer]');
    this.trainer.train(dataset, (options ||{

      rate: this.rate,
      error: this.error,
      iterations: 100,
      shuffle: false,
      log: true,
      // Trainer.cost.CROSS_ENTROPY, Trainer.cost.MSE and Trainer.cost.BINARY
      cost: Trainer.cost.MSE,
      schedule: {
        every: 1, // repeat this task every 500 iterations
        do: function(data) {
          data.dest_error = self.error;
          console.log({data});
          // if (someCondition)
          //   return true; // abort/stop training
          // if( typeof cb === "function" ){
          //   data.nonce = ( ++self.nonce );
          //   data.time = ( Date.now()-time  );
          //   time = Date.now();
          //   cb(data);
          // }
        }
      },
    }));
  }

  toJSON(){
    return JSON.stringify( this.Net.toJSON(), true, 2);
  }

  saveNetworkToFile( fileName, network=false ){
    console.info(' #Saving: [network] => ['+fileName+']');
    const json_t = ( network ? network : this.Net.toJSON() );
    fs.writeFileSync( this.root+'/data/networks/'+fileName, JSON.stringify(json_t) );
  }

  loadNetworkFromFile( fileName ){

    fileName = fileName
      .replace('./data/networks/', '')
      .replace('/data/networks/', '');

    console.info(' #Loading: [network] => ['+fileName+']');
    let raw_t = fs.readFileSync( this.root+'/data/networks/'+fileName, 'utf-8' );
    let json_t = JSON.parse( raw_t );
    this.Net = Network.fromJSON( json_t );

  }

  saveDataSetToFile( fileName, dataset ){
    console.info(' #Saving: [dataset] => ['+fileName+']');
    const json_t = JSON.stringify( dataset, null, 2);
    fs.writeFileSync( this.root+'/data/datasets/'+fileName, json_t );
  }

  loadDatasetFromFile( fileName ){
    console.info(' #Loading: [dataset] => ['+fileName+']');
    let raw_t = fs.readFileSync( this.root+'/data/datasets/'+fileName, 'utf-8' );
    this.dataset = JSON.parse( raw_t );
    return this.dataset;
  }

  activateRaw( inp ){
    return this.Net.activate( inp );
  }

  activateFiltered( inp ){
    return this.Net.activate( inp )
      .map((v)=>{ return Math.floor( (+v)*255 ); });
  }

  propagate( inp, rate=false ){
    return this.Net.propagate( ( rate || this.rate ), inp );
  }

}

// var network_json_t = JSON.stringify( mNet.toJSON(), false, 4);
// fs.writeFileSync( net_name, network_json_t );
// console.log( ' NEW Network created' );
// return;


// console.log( ' #loading network: ' );
// var network_json_t = JSON.parse( fs.readFileSync( net_name ) );
// mNet = synaptic.Network.fromJSON( network_json_t );



// var total_neurons = net_0.neurons().length;




// net_0.activate([0,0]); net_0.propagate( rate, [0] );
// net_0.activate([1,0]); net_0.propagate( rate, [1] );













// ---------------------------------------------------------------------
// function meltIn(){

//     console.log( ' # --------------------------- ' );
//     console.log( ' # MELT-IN ' );

//     for (var i=0; i< total_neurons; i++) {

//         var melted_W = ( 
//             net_0.neurons()[i].neuron['selfconnection'].weight 
//             +
//             net_1.neurons()[i].neuron['selfconnection'].weight 
//         ) / 2;

//         net_0.neurons()[i].neuron['selfconnection'].weight = melted_W;
//         net_1.neurons()[i].neuron['selfconnection'].weight = melted_W;

//         //  = 23.23;
//         // logger.log( mNet.neurons()[i].neuron['selfconnection'].weight );
//         // break;

//     }
// }





