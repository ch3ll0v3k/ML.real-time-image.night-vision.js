// node ask.train.brainjs.js brain.256x256.json ./dark-light-2/256x256/1.y.jpg 256 256 && eom out.256x256.png

// node ask.train.brainjs.js brain.512x512.json ./dark-light-2/512x512/1.y.jpg 512 512 && eom out.512x512.png
// node ask.brainjs.SUBSET.js brain.SUBSET.30.json ./dark-light-2/512x512/1.y.jpg && eom out.SUBSET.30.png
// node ask.brainjs.SUBSET.js brain.SUBSET.40.json ./dark-light-2/512x512/1.y.jpg && eom out.SUBSET.40.png

const logger = require('mii-logger.js');
const brain = require('brain.js');
const netTools = require('./netTools.js');

const NETWORK = process.argv[ 2 ];
const IMG_SRC = process.argv[ 3 ];

if( ! NETWORK || !IMG_SRC ){
  console.error(' No network: aborting ...');
  console.json({ NETWORK, IMG_SRC });
  process.exit();
}

const SUBSET = +(NETWORK.split('SUBSET.')[1].split('.json')[0]) // dataset.256x256.SUBSET.10.json

// create empty-network
const Net = new brain.NeuralNetwork({ // NeuralNetworkGPU
  inputSize: 2,
  hiddenLayers: [],
  outputSize: 2,
  learningRate: 0.05,
  activation: 'sigmoid',
});

// load pre-trained network
Net.fromJSON( console.jsonFromFile( NETWORK ) );

async function ask( subset, img_src ){

  const inp_image = await netTools.Jimp.read( img_src );

  // await inp_image.resize( inp_image.bitmap.width/2.7, inp_image.bitmap.height/2.7 );

  const W = inp_image.bitmap.width;
  const H = inp_image.bitmap.height;

  // console.json({ NETWORK, img_src, subset, W, H, }); // return;

  const out_image = new netTools.Jimp((W*2), H, '#FF0000'); // const out_image = await netTools.Jimp.read( '' );

  const TRS_HOLD = 250;
  // 200.0 * 1.25 == 250

  for( let y=0; y<H; y++ ){
    for( let x=0; x<(W-subset); x+=subset ){

      let input_subset = [];

      for( let sub_x=x; sub_x<(x+subset); sub_x++ ){
        input_subset.push( netTools.normalizeRGBAPixel( inp_image, sub_x, y ) );
      }

      const netRes = Net.run( input_subset );

      for( let sub_x=x, i=0; sub_x<(x+subset); sub_x++, i++ ){
        let V = Math.floor( netRes[ i ] * 255 );
        V = V < 0 ? 0 : V > TRS_HOLD ? TRS_HOLD : V;

        // const hex = netTools.Jimp.rgbaToInt(V, Math.floor(V*1.15), V, 255);
        const hex = netTools.Jimp.rgbaToInt(V, V, V, 255);
        out_image.setPixelColor(hex, (sub_x+W), y);
        out_image.setPixelColor( inp_image.getPixelColour( sub_x, y ), sub_x, y );
      }

    }

  }

  // const output = `out.${W}x${H}.SUBSET.${subset}.png`;
  // const output = `/ssd/tmp/0/out.SUBSET.${subset}.png`;
  const output = `out.SUBSET.${subset}.png`;
  console.log({output});
  await out_image.write( output ); 

};


let frames_c = 0;
let total_uSec = 0;
let avg_uSec = 0;

(async ()=>{


  await ask( SUBSET, IMG_SRC );
  return;


  // STREAM:
  const PATTERN = './video.frames/0/frame.{{INDEX}}.png'; // 'video.frames/0/frame.274.png'
  // const PATTERN = './video.frames/0/frame.{{INDEX}}.jpg';
  const MAX_FRAMES = 12578;

  let INDEX=1000;
  while( INDEX < MAX_FRAMES ){

    INDEX += 3;

    console.TS('frame');
    const frame = PATTERN.replace('{{INDEX}}', INDEX);

    await ask( SUBSET, frame );
    const uSec_t = console.TE('frame');

    frames_c++;
    total_uSec += uSec_t;
    avg_uSec = (total_uSec /frames_c);
    console.json({
      frame,
      frames_c,
      total_uSec,
      avg_uSec,
    });

    // process.exit();
    // break;

  }

})();
