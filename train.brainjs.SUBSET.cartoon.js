// node --max-old-space-size=8192 network.train.brainjs.js ./dataset.256x.256json 
// node --max-old-space-size=8192 network.train.brainjs.js ./dataset.512x.512json
// while true; do node --max-old-space-size=8192 network.train.brainjs.js ./dataset.512x.512json; sync; done
// while true; do node --max-old-space-size=8192 ./train.brainjs.SUBSET.js ./dataset.512x512.SUBSET.30.json; sync; done

const logger = require('mii-logger.js');
const brain = require('brain.js');

let data = [];
const DATASET_NAME = process.argv[ 2 ];
const dataset0 = console.jsonFromFile( DATASET_NAME );

for( let i in dataset0.input ){
  data.push({
    input: dataset0.input[ i ], // .slice(0, Math.floor( 262144 /4 )), // /2 == 64x64, 
    output: dataset0.output[ i ], // .slice(0, Math.floor( 262144 /4 )),
    // output: [ Math.random() ],
  });
}

console.log({dataset_l: data.length});

const SUBSET = +(DATASET_NAME.split('SUBSET.')[1].split('.cartoon.json')[0]) // dataset.256x256.SUBSET.10.json
const NETWORK = `brain.SUBSET.${ SUBSET }.cartoon.json`;

const learningRate = 0.05;

// NeuralNetworkGPU, NeuralNetwork
const Net = new brain.NeuralNetwork({
  inputSize: ( data[ 0 ].input.length ),
  // inputRange: ( data[ 0 ].input.length ),
  hiddenLayers: [ /* data[ 0 ].input.length */ ],
  outputSize: ( data[ 0 ].output.length ),
  learningRate,
  // decayRate: 0.999,
  activation: 'sigmoid',
});

if( console.isFile( NETWORK ) ){
  console.info(` #Loading network from: ${NETWORK} `);
  Net.fromJSON( console.jsonFromFile( NETWORK ) );
}

console.log(' => ');
Net.train( data,{
  iterations: 10,    // the maximum times to iterate the training data --> number greater than 0
  errorThresh: 0.00005,   // the acceptable error percentage from training data --> number between 0 and 1
  log: true,           // true to use console.log, when a function is supplied it is used --> Either true or a function
  logPeriod: 1,        // iterations between logging out --> number greater than 0
  learningRate,    // scales with delta to effect training rate --> number between 0 and 1
  momentum: 0.05,        // scales with next layer's change value --> number between 0 and 1
  callback: null,       // a periodic call back that can be triggered while training --> null or function
  callbackPeriod: 10,   // the number of iterations through the training data between callback calls --> number greater than 0
  timeout: Infinity     // the max number of milliseconds to train for --> number greater than 0
} );
console.jsonToFile( NETWORK, Net.toJSON() );

function dictToArr( dict ){
  let x = [];
  Object.keys(dict).map((k)=>{ x.push( dict[k] ) })
  return x;
}

// console.json({output: dictToArr(Net.run( data[ 0 ].input )) });

