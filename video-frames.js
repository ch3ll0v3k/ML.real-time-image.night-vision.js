const logger = require('mii-logger.js');
const extractFrames = require('ffmpeg-extract-frames');

// node video-frames.js video.src/Behemoth-O-Father-O-Satan-O-Sun.Official-Video.mp4 './video.frames/0/frame.%d.png'
// ffmpeg -i video.src/Behemoth-O-Father-O-Satan-O-Sun.Official-Video.mp4 -y ./video.frames/0/frame.%d.png

const input = process.argv[2];
const output = process.argv[3];

if( !input || !output ){
  console.json({
    error: 'No input and/or output ...',
    input,
    output,
  });
  process.exit();
}

(async()=>{

  const res = await extractFrames({
    input, // 'media/1.mp4',
    output, // './frame-%d.png'
    log: (a,b,c)=>{
      console.json({a,b,c});
    }
  });

  console.json({
    done: true,
    res,
  });

})();