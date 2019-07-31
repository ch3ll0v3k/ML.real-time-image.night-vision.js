// https://github.com/chuckfairy/node-webcam => node-webcam

const NodeWebcam = require( "node-webcam" );
const logger = require('mii-logger.js');
const netTools = require('./netTools.js');
const fs = require('fs');

const MNet = new (require('./_brainjs.ask.512x512.js'))();

const child_process = require('child_process');

async function takeSnap(){
  // 800x600 352x288

  // console.TS('fscam_buffer');
  const fscam_buffer = child_process.execSync( 'fswebcam -q -r 800x600 --jpeg 90 -D 0 -i 0 -d /dev/video0 --no-banner -', {} );
  // console.log({fscam_buffer: console.TE('fscam_buffer')})
  // console.jsonToFile('z.img.json', fscam_buffer);
  // console.log({ fscam_buffer: fscam_buffer.length });
  // fs.writeFileSync('z.img.jpg', fscam_buffer, 'binary');
  // const img = await netTools.Jimp.read( fscam_buffer ); // "./tpl.png"
  // img.write('z.jpg');

  // console.TS('image');
  const image = await MNet.imageBufferToImageBuffer( fscam_buffer, true );
  // console.log({image: console.TE('image')})

  // console.json({
  //   bitmap:{
  //     width: image.bitmap.width,
  //     height: image.bitmap.height,
  //   },
  // });

  setTimeout( ()=>{ takeSnap(); }, 50);

};

takeSnap();


return;

const C310 = {
  as: "1280x720, 800x600, 640x480, 320x240",
  MP: "1.2 MP CMOS",
};

module.exports = UCam = class{

  constructor( params ){

    this.options = {
      width: 800,
      height: 600,
      quality: 100,
      delay: 2,
      saveShots: true, // Save shots in memory
      output: "jpeg", // [jpeg, png] Webcam.OutputTypes
      device: '/dev/video0', // false for default device
      // Webcam.CallbackReturnTypes
      callbackReturn: "location", // [location, buffer, base64]
      verbose: true
    };
    // console.json({options: this.options});

    // this.webcam = NodeWebcam.create( this.options );
    // this.webcam.list( ( list )=>{ console.json({list}); });

  }

  async capture( return_t='location', buffer_name='test_picture', override_options={} ){
    return new Promise( async (res, rej)=>{
      try{

        let tmp_options = { ...this.options, callbackReturn: return_t, ...override_options };

        console.json({tmp_options});

        NodeWebcam.capture( buffer_name, tmp_options, function( err, data ){
          if( err ){
            res({code: 501, msg: err.message, data: null});
            return;
          }
          res({code: 200, msg: 'OK', data});
        });
      }catch(e){
        console.warn( ' #capture: '+e.message);
        console.error( e );
        res({code: 500, msg: e.message, data: null});
      }
    });
  }

  list(){
    return new Promise( async (res, rej)=>{
      try{
        this.webcam.list( async( data )=>{
          // Use another device
          // var anotherCam = NodeWebcam.create( { device: data[ 0 ] } );
          // console.json({data});
          res({code: 200, msg: 'OK', data});
        });
      }catch(e){
        console.warn( ' #capture: '+e.message);
        console.error( e );
        res({code: 500, msg: e.message, data: null});
      }
    });
  }
};



(async ()=>{

  const Cam = new UCam({});
  // console.json({list: await Cam.list()});
  // console.json({});

  const raw_buffer_t = await Cam.capture();

  if( raw_buffer_t.code !== 200 ){
    console.json({raw_buffer_t});
    return;
  }

  // console.log({raw_buffer_t});

  // const image_t = await netTools.imageFromRawBuffer( raw_buffer_t.data, Cam.options.width, Cam.options.height );

  // if( image_t.code !== 200 ){
  //   console.json({image_t});
  //   return;
  // }

  // await image_t.data.write('z.UCam.jpg');

})();


// Default options
// var opts = {
//   width: 1280,
//   height: 720,
//   quality: 100,
//   delay: 0,
//   saveShots: false, // Save shots in memory
//   output: "jpeg", // [jpeg, png] Webcam.OutputTypes
//   device: false, // false for default device
//   // Webcam.CallbackReturnTypes
//   callbackReturn: "buffer", // [location, buffer, base64]
//   verbose: false
// };


// Creates webcam instance

// var Webcam = NodeWebcam.create( opts );

// Will automatically append location output type
// Webcam.capture( "test_picture", function( err, data ) {} );

// Also available for quick use
// NodeWebcam.capture( "test_picture", opts, function( err, data ) {});

// Get list of cameras
// Webcam.list( function( list ) {
//   //Use another device
//   var anotherCam = NodeWebcam.create( { device: list[ 0 ] } );
// });

//Return type with base 64 image

