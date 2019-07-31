


readTextFile(
  "dataset.256x256.json"
  // "dataset.512x512.json"
  ,function(text){
  const dataset0 = JSON.parse(text);

  let data = [];
  for( let i in dataset0.input ){
    data.push({
      input: dataset0.input[ i ], // .slice(0, Math.floor( 262144 /4 )), // /2 == 64x64, 
      output: dataset0.output[ i ], // .slice(0, Math.floor( 262144 /4 )),
      // output: [ Math.random() ],
    });
  }

  const learningRate = 0.1;
  // NeuralNetworkGPU, NeuralNetwork
  const Net = new brain.NeuralNetworkGPU({
    inputSize: ( data[ 0 ].input.length ),
    // inputRange: ( data[ 0 ].input.length ),
    hiddenLayers: [ /* data[ 0 ].input.length */ ],
    outputSize: ( data[ 0 ].output.length ),
    learningRate,
    // decayRate: 0.999,
    activation: 'sigmoid',
  });

  console.log(' => ');
  Net.train( data,{
    iterations: 10,    // the maximum times to iterate the training data --> number greater than 0
    errorThresh: 0.0005,   // the acceptable error percentage from training data --> number between 0 and 1
    log: true,           // true to use console.log, when a function is supplied it is used --> Either true or a function
    logPeriod: 1,        // iterations between logging out --> number greater than 0
    learningRate,    // scales with delta to effect training rate --> number between 0 and 1
    momentum: 0.05,        // scales with next layer's change value --> number between 0 and 1
    callback: null,       // a periodic call back that can be triggered while training --> null or function
    callbackPeriod: 10,   // the number of iterations through the training data between callback calls --> number greater than 0
    timeout: Infinity     // the max number of milliseconds to train for --> number greater than 0
  } );


  // dataset.256x256.json
  // Net.fromJSON( console.jsonFromFile( NETWORK ) );

});
