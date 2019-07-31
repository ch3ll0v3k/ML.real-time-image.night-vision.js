const logger = require('mii-logger.js');
const Jimp = require('jimp'); // https://www.npmjs.com/package/jimp

"640.0 * 384.0 * 3.0 == 737,280";
"640.0 * 480.0 * 3.0 == 921,600";
"dataset [0], in[]:196608.0 / 2.0 == 98304.0"

async function readAllImages( path, filter ){
  return new Promise( async(res, rej)=>{
    res( console.listDir( path ).filter((v)=>{ return v.replace( filter, '') != v; }) );
  });
}

function pixBuff2DToNormArray( buff, w=false, h=false ){

  w = w || buff.bitmap.width;
  h = h || buff.bitmap.height;
  let arr = [];

  for( let y=0; y<h; y++ ){
    for( let x=0; x<w; x++ ){
      let hex = buff.getPixelColour(x, y); // returns the colour of that pixel e.g. 0xFFFFFFFF
      let rgb = Jimp.intToRGBA(hex);

      arr.push( (rgb.r + rgb.g + rgb.b) / 3 / 255 );

      // RGBa
      // arr.push( rgb.r / 255 );
      // arr.push( rgb.g / 255 );
      // arr.push( rgb.b / 255 );
      // arr.push( rgb.a / 255 );

    }

    // return arr;

  }
  return arr;
}

async function normArrayToRGBPixBuff2D( normArr, w, h ){

  return new Promise( async(res, rej)=>{

    Jimp.read("./tpl.png", function (err, image) {

      image.resize( w, h );

      for( let y=0; y<h; y++ ){

        for( let px=0, x=0; px<w; x+=4, px++ ){

          // RGBa
          // let r = normArr[ (y * (image.bitmap.width *4) + x)+0 ] * 255;
          // let g = normArr[ (y * (image.bitmap.width *4) + x)+1 ] * 255;
          // let b = normArr[ (y * (image.bitmap.width *4) + x)+2 ] * 255;
          // let a = normArr[ (y * (image.bitmap.width *4) + x)+3 ] * 255;
          // const hex = Jimp.rgbaToInt(r, g, b, a);


          let V = Math.floor( normArr[ (y * image.bitmap.width) + px ] * 255 );
          V = V < 0 ? 0 : V > 255 ? 255 : V;

          const hex = Jimp.rgbaToInt(V, V, V, 255);

          image.setPixelColor(hex, px, y);

        }

        // res( image );
        // return;

      }

      res( image );

    });
  });
}


async function createInputData( path, filter ){

  const files = await readAllImages(path, filter); // './raw/', '.y.jpg');
  const dataset = {
    input: [],
    output: [],
    meta: [],
  };

  for( let file of files ){

    let inp_name = file.replace( filter, '' );

    const inp_image = await Jimp.read( `${path}/${file}` ); 
    const inp_pix_arr = pixBuff2DToNormArray( inp_image );

    const out_image = await Jimp.read( `${path}/${inp_name}.n.jpg` ); 
    const out_pix_arr = pixBuff2DToNormArray( out_image );

    dataset.meta.push( inp_name );
    dataset.input.push( inp_pix_arr );
    dataset.output.push( out_pix_arr );

  }

  return dataset;

}

// console.json({
//   0: console.hash.sha1( '0' ),
//   1: console.hash.sha1( '1' ),
//   2: console.hash.sha1( '2' ),
//   md5: console.hash.md5( 'aaa' ),
// });
// return;

const W = 32 *1;
const H = 32 *1;

// (async ()=>{
//   const inp_image_t = await Jimp.read( './test.jpg' ); 
//   const pix_arr_t = pixBuff2DToNormArray( inp_image_t );
//   console.jsonToFile('test.json', pix_arr_t);
// })();

// (async ()=>{
//   console.log(' start ...');
//   const dataset = await createInputData( `./dark-light-2/${W}x${H}`, '.y.jpg' );
//   console.json({
//     input: dataset.input[1].length,
//     meta: dataset.meta,
//   })
//   console.jsonToFile( './dataset.0.json', dataset, true, 2, true );
// })();
// return;

jsonPixArrToImage('test.out.json');
return;

async function jsonPixArrToImage( file ){
  const pix_arr = console.jsonFromFile( file );
  console.log({file, pix_arr: Object.keys(pix_arr).length, hash: console.hash.sha1( JSON.stringify(pix_arr) )});
  // process.exit();
  (await normArrayToRGBPixBuff2D( pix_arr, W, H )).write(`${ file.replace('.json','') }.jpg`); 
}

(async ()=>{
  for( let i=0; i<13; i++ ){
    await jsonPixArrToImage(i+'.json');
  }
})();
return;

return;
(async ()=>{

  const inp_image = await Jimp.read( './Colorful-Smoke-Transparent-PNG.png' ); 
  const pix_arr = pixBuff2DToNormArray( inp_image );

  const out_image = await normArrayToRGBPixBuff2D( pix_arr, inp_image.bitmap.width, inp_image.bitmap.height );

  out_image
    .write('./Colorful-Smoke-Transparent-PNG.output.png'); 

})();
return;

Jimp.read("./640x384.png", async(err, image)=>{

  const pix_arr = pixBuff2DToNormArray( image );
  // console.log({pix_arr: pix_arr.length})

  const res = await normArrayToRGBPixBuff2D( pix_arr, image.bitmap.width, image.bitmap.height );
  // console.log({res: res.bitmap.width});

});

return;

// Jimp.read("http://www.pngmart.com/files/8/Colorful-Smoke-Transparent-PNG.png", function (err, image) {
Jimp.read("./Colorful-Smoke-Transparent-PNG.png", function (err, image) {

  if( err ){
    console.json({err});
    return;
  }

  // bitmap: { 
  //   width: 1280,
  //   height: 768,
  //   depth: 8,
  //   interlace: false,
  //   palette: false,
  //   color: true,
  //   alpha: true,
  //   bpp: 4,
  //   colorType: 6,
  //   data: Buffer [Uint8Array] [],
  //   gamma: 0
  // };

  // writeAsync: [Function],
  // getBase64Async: [Function],
  // getBuffer: [Function: getBuffer],
  // getBufferAsync: [Function: getBufferAsync],
  // getPixelColour: [Function: getPixelColor],
  // setPixelColour: [Function: setPixelColor] }

  // console.json({ image_dir: console.dir(image) }); return;

  let hex = image.getPixelColour(100, 100); // returns the colour of that pixel e.g. 0xFFFFFFFF
  let rgb = Jimp.intToRGBA(hex);

  let rgb_normalized = Object.keys(rgb).map((key)=>{
    return { [key]: rgb[key]/255};
  })

  console.json({
    hex,
    rgb,
    rgb_normalized,
  });

  const W = 256; // image.bitmap.width /2;
  const H = 256; // image.bitmap.height /2;

  image
    .resize( W, H ) // resize
    // .quality(60) // set JPEG quality
    // .greyscale() // set greyscale
    .write(`${W}x${H}.png`); 

});

