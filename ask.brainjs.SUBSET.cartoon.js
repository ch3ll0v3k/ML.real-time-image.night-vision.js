// node ask.train.brainjs.js brain.256x256.json ./dark-light-2/256x256/1.y.jpg 256 256 && eom out.256x256.png

// node ask.train.brainjs.js brain.512x512.json ./dark-light-2/512x512/1.y.jpg 512 512 && eom out.512x512.png

const logger = require('mii-logger.js');
const brain = require('brain.js');
const netTools = require('./netTools.js');
const MNetClass = require('./MNet.js');

const NETWORK = process.argv[ 2 ];
const IMG_SRC = process.argv[ 3 ];

if( ! NETWORK || !IMG_SRC ){
  console.error(' No network: aborting ...');
  console.json({ NETWORK, IMG_SRC });
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
    inputSize: 2,
    hiddenLayers: [],
    outputSize: 2,
    learningRate: 0.05,
    activation: 'sigmoid',
  });

  Net.fromJSON( console.jsonFromFile( NETWORK ) );

  const SUBSET = +(NETWORK.split('SUBSET.')[1].split('.cartoon.json')[0]) // dataset.256x256.SUBSET.10.json

  const inp_image = await netTools.Jimp.read( IMG_SRC );
  const W = inp_image.bitmap.width;
  const H = inp_image.bitmap.height;

  console.json({ NETWORK, IMG_SRC, SUBSET, W, H, }); // return;

  const out_image = new netTools.Jimp((W*2), H, '#FF0000'); // const out_image = await netTools.Jimp.read( '' );

  for( let y=0; y<H; y++ ){
    for( let x=0; x<(W-SUBSET); x+=SUBSET ){

      let input_subset = [];

      for( let sub_x=x; sub_x<(x+SUBSET); sub_x++ ){
        const px_inp = netTools.normalizeRGBAPixelArray( inp_image, sub_x, y );
        for( let i in px_inp ){
          // console.log({i, px_inp});
          input_subset.push( px_inp[ i ] );
        }
      }

      // process.exit();
      const netRes = Net.run( input_subset );
      // console.log({netRes});
      // process.exit();

      for( let sub_x=x, i=0; sub_x<(x+SUBSET); sub_x++, i++ ){
        let r = Math.floor( netRes[ (i*3) +0 ] * 255 );
        let g = Math.floor( netRes[ (i*3) +1 ] * 255 );
        let b = Math.floor( netRes[ (i*3) +2 ] * 255 );

        // console.log({ i, r,g,b});

        const hex = netTools.Jimp.rgbaToInt(r, g, b, 255);
        out_image.setPixelColor(hex, (sub_x+W), y);
        out_image.setPixelColor( inp_image.getPixelColour( sub_x, y ), sub_x, y );
      }

      // process.exit();

    }

  }

  // const output = `out.${W}x${H}.SUBSET.${SUBSET}.png`;
  const output = `out.SUBSET.${SUBSET}.cartoon.png`;
  console.log({output});
  await out_image.write( output ); 

})();

