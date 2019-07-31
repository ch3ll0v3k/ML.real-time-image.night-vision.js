// node --max-old-space-size=8192 network.train.js
const logger = require('mii-logger.js');
const brain = require('brain.js');
const netTools = require('./netTools.js');
const MNetClass = require('./MNet.js');

const NETWORK = process.argv[ 2 ];
const IMG_SRC = process.argv[ 3 ];
const W = (+process.argv[ 4 ]);
const H = (+process.argv[ 5 ]);

// console.json({ NETWORK, IMG_SRC, W, H}); process.exit();

if( ! NETWORK || !IMG_SRC || !W || !H ){
  console.error(' No network || img_src: aborting ...');
  console.json({ NETWORK, IMG_SRC, W, H});
  process.exit();
}

const Net = new MNetClass({});
Net.loadNetworkFromFile( NETWORK );

(async()=>{
  const imgArray2D = await netTools.pixBuff2DToNormArray2D( IMG_SRC );
  // console.json({imgArray2D});

  const pixBuff2D = [];
  for( let i in imgArray2D ){
    // const x = await Net.activateFiltered( imgArray2D[ i ] );
    const x = await Net.activateRaw( imgArray2D[ i ] );
    // console.log({x}); process.exit();
    pixBuff2D.push( x );
  }

  // console.json({pixBuff2D});

  const output = `out.${W}x${H}.png`;

  const Img = await netTools.normArray2DToRGBPixBuff2D( pixBuff2D, W, H, IMG_SRC ); // Net.inpLayer.list.length
  await Img.write( output ); 
  console.json({output});

})();

// Net.train( data );
// Net.saveNetworkToFile( NETWORK );

// console.json({activate: Net.activate(data[0].input).map((v)=>{ return (+v)*255; }) })
