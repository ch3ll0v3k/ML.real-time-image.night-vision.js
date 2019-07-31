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

// node --max-old-space-size=8192 network.train.js

const logger = require('mii-logger.js');
// https://github.com/BrainJS/brain.js
const brain = require('brain.js');
const MNetClass = require('./MNet.js');

let data = [];
const dataset0 = console.jsonFromFile( process.argv[ 2 ] );

const NETWORK = `test.ALL-TO-ALL.inp-${dataset0.input[ 0 ].length}-to-${dataset0.output[ 0 ].length}.json`;

for( let i in dataset0.input ){
  data.push({
    input: dataset0.input[ i ], // .slice(0, Math.floor( 262144 /4 )), // /2 == 64x64, 
    output: dataset0.output[ i ], // .slice(0, Math.floor( 262144 /4 )),
    // output: [ Math.random() ],
  });
}

let Net = null;

const LOAD_NETWORK_FROM_JSON = true;
if( LOAD_NETWORK_FROM_JSON ){
  Net = new MNetClass({});
  Net.loadNetworkFromFile( NETWORK );
  Net.error = 0.0005;

}else{
  Net = new MNetClass({
    inp: ( data[ 0 ].input.length ), 
    hidNeurons: 0,
    hidLayers: 0,
    out: ( data[ 0 ].output.length ),
    rate: 0.075,
    error: 0.0005,
  });
}

Net.train( data );
Net.saveNetworkToFile( NETWORK );

// console.json({activate: Net.activate(data[0].input).map((v)=>{ return (+v)*255; }) })
