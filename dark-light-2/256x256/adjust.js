// http://decsai.ugr.es/cvg/CG/base.htm

const netTools = require('./../../netTools.js');

async function createInputData( path, filter ){

  const files = await netTools.readAllImages(path, filter); // './raw/', '.y.jpg');
  const dataset = {
    input: [],
    output: [],
    meta: [],
  };

  for( let file of files ){

    let inp_name = file.replace( filter, '' );

    const inp_image = await netTools.Jimp.read( `${path}/${file}` ); 
    const inp_pix_arr = await netTools.pixBuff2DToNormArray2D( inp_image );

    const out_image = await netTools.Jimp.read( `${path}/${inp_name}.n.jpg` ); 
    const out_pix_arr = await netTools.pixBuff2DToNormArray2D( out_image );

    dataset.meta.push( inp_name );

    for( let i in inp_pix_arr ){
      dataset.input.push( inp_pix_arr[ i ] );
    }

    for( let i in inp_pix_arr ){
      dataset.output.push( out_pix_arr[ i ] );
    }

  }

  return dataset;
}

(async (path, filter)=>{

  // console.log({path, filter}); return;

  const files = await netTools.readAllImages(path, filter); // './raw/', '.y.jpg');
  const W = 512;
  const H = 512;

  for( let file of files ){
    const image = await netTools.Jimp.read( file );

    const new_name = `./${ file.replace(filter, '.y.jpg') }`; // dark == Y 
    // const new_name = `./${ file.replace(filter, '.jpg') }`; // dark == Y 

    let blur = 1;
    await image 
      .quality( 100 )
      // .resize( W /2, H /2 )
      // .grayscale()
      // .fade(0.9)
      // .opacity( 0.9 )
      // .brightness( -0.85 )
      .gaussian( blur )  // Gaussian blur the image by r pixels (VERY slow)
      // .blur( 1 )      // fast blur the image by r pixels
      .write( new_name )
      // .write( `./x.png` )

    console.log({out: new_name}); // , res
    // return;

    // break;

  }

})('.', '.n.jpg');

