// var inData = [
//   {input: [1,0,0,0,0,0,0,0,0,0], output: [1,0,0,0,0,0,0,0,0,0] },
//   {input: [0,1,0,0,0,0,0,0,0,0], output: [0,1,0,0,0,0,0,0,0,0] },
//   {input: [0,0,1,0,0,0,0,0,0,0], output: [0,0,1,0,0,0,0,0,0,0] },
//   {input: [0,0,0,1,0,0,0,0,0,0], output: [0,0,0,1,0,0,0,0,0,0] },
//   {input: [0,0,0,0,1,0,0,0,0,0], output: [0,0,0,0,1,0,0,0,0,0] },
//   {input: [0,0,0,0,0,1,0,0,0,0], output: [0,0,0,0,0,1,0,0,0,0] },
//   {input: [0,0,0,0,0,0,1,0,0,0], output: [0,0,0,0,0,0,1,0,0,0] },
//   {input: [0,0,0,0,0,0,0,1,0,0], output: [0,0,0,0,0,0,0,1,0,0] },
//   {input: [0,0,0,0,0,0,0,0,1,0], output: [0,0,0,0,0,0,0,0,1,0] },
//   {input: [0,0,0,0,0,0,0,0,0,1], output: [0,0,0,0,0,0,0,0,0,1] }
// ];

// https://github.com/BrainJS/brain.js
const synaptic = require('synaptic');
const {Layer, Network, Trainer} = synaptic; 

const MNet = require( './MNet' );

const logger = require('mii-logger.js');

let data = [];
const dataset0 = console.jsonFromFile( './dataset.0.json' );

for( let i in dataset0.input ){
  data.push({
    input: dataset0.input[ i ], // .slice(0,10),
    output: dataset0.output[ i ], // .slice(0,10),
    // output: [ Math.random() ],
  });
}

let mNet = null;

console.log(' # init ...');
if( true ){
  const num = Math.floor( data[0].input.length/500 );
  mNet = new MNet( num, num, 1, num );
  // mNet.setRoot( __dirname );
  // mNet.saveNetworkToFile( MAIN_NETWORK_NAME );
  // let dataset = NetTools.createDataSet(10);
  // mNet.saveDataSetToFile( MAIN_DATASET_NAME, dataset );

}else{
  mNet = new MNet();
  mNet.setRoot( __dirname );
  mNet.loadNetworkFromFile( MAIN_NETWORK_NAME );

}

process.exit();

console.log(' # createTrainer');
mNet.createTrainer();
mNet.train( data, null, (r)=>{
  console.log({r});
});

// mNet.saveNetworkToFile( MAIN_NETWORK_NAME );






return;

// console.json( data.length ); return;

const _learningRate = 0.05;

let net = new brain.NeuralNetwork({
  activation: 'sigmoid', // [sigmoid, relu, leaky-relu, tanh]
  hiddenLayers: [1],
  learningRate: _learningRate
});

function _eval(){
  for( let i in data ){
    console.log(` processing => ${i} ...`);
    console.jsonToFile(`${i}.json`, net.run( data[i].input ) );
  }
}

net = net.fromJSON( console.jsonFromFile('net.json') );

// for( let i in data ){
//   console.log(` processing => ${i} ...`);
//   console.json({
//     input: {
//       hash: console.hash.sha256( data[i].input.toString() ),
//       length: data[i].input.length,
//     },
//     output: {
//       hash: console.hash.sha256( data[i].output.toString() ),
//       length: data[i].output.length,
//     },
//   });
// }
// return;


// let prevErr = 0;
// net.train( data, {
//   errorThresh: 0.000001,
//   iterations: 1000,
//   log: true,
//   logPeriod: 1,
//   learningRate: _learningRate,
//   callback : function(data){
//     // console.log( data );
//     console.log( `diff: ${ prevErr - data.error }, error: ${ data.error }` );
//     prevErr = data.error
//     // if( data.iterations >= 900 ){
//     //   setTimeout( ()=>{ _eval(); }, 2000);
//     // }
//     // for( let i in data ){
//     //   const res = net.run( data[i].input );
//     //   console.json({
//     //     processing: i, 
//     //     input: console.hash.sha256( data[i].input.toString() ), 
//     //     res: console.hash.sha256( res.toString() ),
//     //     dest_res: console.hash.sha256( data[i].output.toString() ),
//     //   });
//     // }
//   }
// });

// for( let i in data ){
//   console.log(` processing => ${i}: hash: ${ console.hash.sha256( data[i].input.toString() ) }`);
//   const res = net.run( data[i].input );
//   console.jsonToFile(`${i}.json`, res );
//   console.log( console.hash.sha256( res.toString() ) );
// }


console.jsonToFile( 'net.json', net.toJSON() );

(async ()=>{

  const res = await net.run( data[i].input );
  console.json({
    processing: i, 
    input: console.hash.sha256( data[i].input.toString() ), 
    res: console.hash.sha256( res.toString() ),
    dest_res: console.hash.sha256( data[i].output.toString() ),
  });

  // for( let i in data ){
  //   const res = await net.run( data[i].input );
  //   console.json({
  //     processing: i, 
  //     input: console.hash.sha256( data[i].input.toString() ), 
  //     res: console.hash.sha256( res.toString() ),
  //     dest_res: console.hash.sha256( data[i].output.toString() ),
  //   });
  // }

})();




