const logger = require('mii-logger.js');
const Jimp = require('jimp'); // https://www.npmjs.com/package/jimp

async function readAllImages( path, filter ){
  return new Promise( async(res, rej)=>{
    res( console.listDir( path ).filter((v)=>{ return v.replace( filter, '') != v; }) );
  });
}


function normalizeRGBAPixel( pixBuff, x, y ){
  const hex = pixBuff.getPixelColour(x, y); // returns the colour of that pixel e.g. 0xFFFFFFFF
  const pixel = Jimp.intToRGBA( hex );
  // return ( pixel.r +pixel.g +pixel.b +pixel.a ) / 4 / 255;
  return ( pixel.r +pixel.g +pixel.b ) / 3 / 255;
}

function normalizeRGBAPixelArray( pixBuff, x, y ){
  const hex = pixBuff.getPixelColour(x, y); // returns the colour of that pixel e.g. 0xFFFFFFFF
  const pixel = Jimp.intToRGBA( hex );
  // return ( pixel.r +pixel.g +pixel.b +pixel.a ) / 4 / 255;
  return [ pixel.r/255, pixel.g/255, pixel.b/255 ];
}

async function pixBuff2DToNormArray2D( src, resize_w=false, resize_h=false ){

  // From file or from buffer
  buff = typeof (src === "string" || !src.bitmap) ? ( await Jimp.read( src ) ) : src;

  if( resize_w && resize_h ){
    await buff.resize( resize_w, resize_h );
    console.log({resize: true, width: buff.bitmap.width, height: buff.bitmap.height});
  }

  let w = buff.bitmap.width;
  let h = buff.bitmap.height;
  let arr = [];

  for( let y=0; y<h; y++ ){
    let y_arr = [];
    for( let x=0; x<w; x++ ){
      let hex = buff.getPixelColour(x, y); // returns the colour of that pixel e.g. 0xFFFFFFFF
      let rgb = Jimp.intToRGBA(hex);
      y_arr.push( (rgb.r + rgb.g + rgb.b) / 3 / 255 );
    }
    arr.push( y_arr );
  }

  return arr;
}

async function normArray2DToRGBPixBuff2D( normArray2D, w, h, orig_img_src=false, scal_w=false ){

  return new Promise( async(res, rej)=>{

    const res_img = await Jimp.read("./tpl.png");
    const src_img = orig_img_src ? await Jimp.read( orig_img_src ) : false;

    // image.crop( x, y, w, h ); 
    // w = scal_w ? Math.floor( scal_w * w ) : w;

    await src_img.resize( w, h );
    await res_img.resize( (orig_img_src)?(w*2):(w), h );

    for( let y=0; y<h; y++ ){
      for( let x=0; x<w; x++ ){
        let V = Math.floor( normArray2D[ y ][ x ] * 255 );
        V = V < 0 ? 0 : V > 255 ? 255 : V;
        const hex = Jimp.rgbaToInt(V, V, V, 255);
        res_img.setPixelColor(hex, orig_img_src?(w+x):(x), y);
      }
    }

    if( orig_img_src )
    for( let y=0; y<h; y++ ){
      for( let x=0; x<w; x++ ){
        const hex = src_img.getPixelColor(x, y);
        // const hex = Jimp.rgbaToInt(hex.r, hex.g, hex.b, hex.a);
        // let rgb = Jimp.intToRGBA(hex);
        res_img.setPixelColor(hex, x, y);
      }
    }

    res( res_img );

  });
}

// buffer is expected to be four-channel (rgba) image data.
async function imageFromRawBuffer( buffer, width=1280, height=720 ){
  return new Promise( async(res, rej)=>{
    try{
      new Jimp({ data: buffer, width, height }, async(err, image) => {
        // this image is 1280 x 768, pixels are loaded from the given buffer.
        console.log({err});
        console.log({image});

        if( err ){
          res({code: 501, msg: err.message, data: null});
          return;
        }
        res({code: 200, msg: 'OK', data: image});
      });
    }catch(e){
      console.warn( ' #capture: '+e.message);
      console.error( e );
      res({code: 500, msg: e.message, data: null});
    }
  });
}


module.exports.Jimp = Jimp;
module.exports.pixBuff2DToNormArray2D = pixBuff2DToNormArray2D;
module.exports.normArray2DToRGBPixBuff2D = normArray2DToRGBPixBuff2D;
module.exports.readAllImages = readAllImages;
module.exports.imageFromRawBuffer = imageFromRawBuffer;
module.exports.normalizeRGBAPixel = normalizeRGBAPixel;
module.exports.normalizeRGBAPixelArray = normalizeRGBAPixelArray;
