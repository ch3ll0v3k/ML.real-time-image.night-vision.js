// http://decsai.ugr.es/cvg/CG/base.htm

// X=1; while true; do wget "http://decsai.ugr.es/cvg/CG/images/base/$X.gif"; X=$(( X+1)); sleep 0.5; done

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



// INPUT => OUPUT
(async (path, filter)=>{

  // return;

  const files = await netTools.readAllImages(path, filter); // './raw/', '.y.jpg');

  for( let file of files ){
    const image = await netTools.Jimp.read( file );

    // from gif to jpg
    // const new_name = `./${ file.replace(filter, '.n.jpg') }`; // dark == Y 
    // image.write( new_name )

    const new_name = `./${ file.replace(filter, '.y.jpg') }`; // dark == Y 
    console.log({out: new_name}); // , res
    image 
      .quality( 100 )
      .grayscale()
      // .fade(0.9)
      // .opacity( 0.9 )
      // .brightness( -0.85 )
      .write( new_name )
      // .write( `./x.png` )

    // return;

  }

})('.', '.n.jpg');

// INPUT => INPUT
(async (path, filter)=>{

  return;

  const files = await netTools.readAllImages(path, filter); // './raw/', '.y.jpg');

  for( let file of files ){
    const image = await netTools.Jimp.read( file );

    // from gif to jpg
    // const new_name = `./${ file.replace(filter, '.n.jpg') }`; // dark == Y 
    // image.write( new_name )

    const new_name = `./${ file.replace(filter, '.n.jpg') }`; // dark == Y 
    console.log({out: new_name}); // , res
    image 
      .quality( 100 )
      // .grayscale()
      // .fade(0.9)
      // .opacity( 0.9 )
      // .brightness( -0.85 )
      // .color([
      //   // { apply: 'hue', params: [10] },
      //   { apply: 'mix', params: ["#005500"] },
      //   // { apply: 'hue', params: [-90] },
      //   // { apply: 'lighten', params: [50] },
      //   // { apply: 'xor', params: ['#002200'] }
      // ])

      .write( new_name )
    // return;

  }

})('.', '.orig.jpg');



