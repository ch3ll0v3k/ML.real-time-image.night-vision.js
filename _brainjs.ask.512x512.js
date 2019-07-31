// node ask.train.brainjs.js brain.256x256.json ./dark-light-2/256x256/1.y.jpg 256 256 && eom out.256x256.png

// node ask.train.brainjs.js brain.512x512.json ./dark-light-2/512x512/1.y.jpg 512 512 && eom out.512x512.png

const logger = require('mii-logger.js');
const brain = require('brain.js');
const netTools = require('./netTools.js');
const MNetClass = require('./MNet.js');

module.exports = MNet = class{

  constructor(){
    this.W = 512;
    this.H = 512;
    this.NETWORK = `brain.${ this.W }x${ this.H }.json`;
    this.Net = new brain.NeuralNetwork({
      inputSize: 1,
      hiddenLayers: [ /* data[ 0 ].input.length */ ],
      outputSize: 1,
      learningRate: 0.05,
      activation: 'sigmoid',
    });
    this.Net.fromJSON( console.jsonFromFile( this.NETWORK ) );
  }

  async imageBufferToImageBuffer( buffer_t, save=false, save_format='png' ){

      const imgArray2D = await netTools.pixBuff2DToNormArray2D( buffer_t, this.W, this.H );

      const pixBuff2D = [];
      for( let i in imgArray2D ){
        const x = await this.dictToArr( this.Net.run( imgArray2D[ i ] ));
        pixBuff2D.push( x );
      }

      const output = `out.${ this.W }x${ this.H }.${ save_format }`;
      const image = await netTools.normArray2DToRGBPixBuff2D( pixBuff2D, this.W, this.H, buffer_t, 1.33333333333 ); // Net.inpLayer.list.length
      if( save ){
        await image.write( output ); 
        console.log({save, output})
      }

      return image

  }

  dictToArr( dict ){
    let x = [];
    Object.keys(dict).map((k)=>{ x.push( dict[k] ) })
    return x;
  }

}



// (async()=>{


//   console.TS('main');

//   const imgArray2D = await netTools.pixBuff2DToNormArray2D( IMG_SRC );
//   // console.json({imgArray2D});
//   const pixBuff2D = [];
//   for( let i in imgArray2D ){

//     const x = await dictToArr(Net.run( imgArray2D[ i ] ));

//     // console.log({x}); process.exit();
//     pixBuff2D.push( x );
//   }

//   // console.json({pixBuff2D});

//   const output = `out.${W}x${H}.png`;

//   const Img = await netTools.normArray2DToRGBPixBuff2D( pixBuff2D, W, H, IMG_SRC ); // Net.inpLayer.list.length
//   await Img.write( output ); 
//   console.json({
//     output,
//     time_t: console.TE('main'),
//   });

// })();

