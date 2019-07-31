// node ask.train.brainjs.js brain.256x256.json ./dark-light-2/256x256/1.y.jpg 256 256 && eom out.256x256.png

// node ask.train.brainjs.js brain.512x512.json ./dark-light-2/512x512/1.y.jpg 512 512 && eom out.512x512.png

const logger = require('mii-logger.js');
const brain = require('brain.js');
const netTools = require('./netTools.js');
const MNetClass = require('./MNet.js');

const NETWORK = process.argv[ 2 ]; // 'brain.256x256.json';
const IMG_SRC = process.argv[ 3 ];
const W = (+process.argv[ 4 ]);
const H = (+process.argv[ 5 ]);

console.json({ NETWORK, IMG_SRC, W, H});


let data = [];
const dataset0 = console.jsonFromFile( './dataset.256x.256json' );

for( let i in dataset0.input ){
  data.push({
    input: dataset0.input[ i ], // .slice(0, Math.floor( 262144 /4 )), // /2 == 64x64, 
    output: dataset0.output[ i ], // .slice(0, Math.floor( 262144 /4 )),
    // output: [ Math.random() ],
  });
}



if( ! NETWORK || !IMG_SRC || !W || !H ){
  console.error(' No network || img_src: aborting ...');
  console.json({ NETWORK, IMG_SRC, W, H});
  process.exit();
}


function dictToArr( dict ){
  let x = [];
  Object.keys(dict).map((k)=>{ x.push( dict[k] ) })
  return x;
}

(async()=>{

  // NeuralNetworkGPU
  const Net = new brain.NeuralNetwork({
    inputSize: ( 256 ),
    // inputRange: ( data[ 0 ].input.length ),
    hiddenLayers: [ /* data[ 0 ].input.length */ ],
    outputSize: ( 256 ),
    learningRate: 0.05,
    // decayRate: 0.999,
    activation: 'sigmoid',
  });


  Net.fromJSON( console.jsonFromFile( NETWORK ) );

  console.TS('main');

  const imgArray2D = await netTools.pixBuff2DToNormArray2D( IMG_SRC );
  // console.json({imgArray2D});
  const pixBuff2D = [];
  for( let i in imgArray2D ){

    const x = await dictToArr(Net.run( imgArray2D[ i ] ));

    // console.log({x}); process.exit();
    pixBuff2D.push( x );
  }

  // console.json({pixBuff2D});

  const output = `out.${W}x${H}.png`;

  const Img = await netTools.normArray2DToRGBPixBuff2D( pixBuff2D, W, H, IMG_SRC ); // Net.inpLayer.list.length
  await Img.write( output ); 
  console.json({
    output,
    time_t: console.TE('main'),
  });

})();

