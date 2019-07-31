// http://decsai.ugr.es/cvg/CG/base.htm
// node --max-old-space-size=8192 create-dataset.js

const netTools = require('./netTools.js');

async function createSubsetInputData( path, filter, SUBSET=10 ){

  const dataset = { input: [], output: [] };
  const files = await netTools.readAllImages(path, filter); // './raw/', '.y.jpg');

  for( let file of files ){

    console.log({file});
    let inp_name = file.replace( filter, '' );

    const inp_image = await netTools.Jimp.read( `${path}/${file}` ); 
    const out_image = await netTools.Jimp.read( `${path}/${inp_name}.n.jpg` ); 

    const W = inp_image.bitmap.width;
    const H = inp_image.bitmap.height;

    // pixBuff2DSubsetToNormArray2DSubset(  );

    for( let y=0; y<H; y++ ){
      for( let x=0; x<(W-SUBSET); x+=SUBSET ){

        let input_subset = [];
        let output_subset = [];

        for( let sub_x=x; sub_x<(x+SUBSET); sub_x++ ){
          const px_inp = netTools.normalizeRGBAPixelArray( inp_image, sub_x, y );

          for( let i in px_inp )
            input_subset.push( px_inp[ i ] );

          const px_out = netTools.normalizeRGBAPixelArray( out_image, sub_x, y );
          for( let i in px_out )
            output_subset.push( px_out[ i ] );

        }

        dataset.input.push( input_subset );
        dataset.output.push( output_subset );
      }

      // break;

    }
  }

  return dataset;

}


(async ()=>{

  console.log(' start ...');
  const W = 32 *4 *2 *2;
  const H = 32 *4 *2 *2;
  const SUBSET = (+process.argv[ 2 ]);

  if( !SUBSET ){
    console.warn(' #No SUBSET: aborting ...');
    console.log({SUBSET});
    process.exit();
  }

  console.log({W, H, SUBSET});
  // process.exit();

  const dataset = await createSubsetInputData( `./data-cars-light/colored`, '.y.jpg', SUBSET );

  console.json({
    dataset: dataset.input.length,
    input: dataset.input[1].length,
    output: dataset.output[1].length,
  })

  const dataset_name = `./dataset.${W}x${H}.SUBSET.${SUBSET}.colored.json`;
  console.log({dataset_name})
  console.jsonToFile( dataset_name, dataset, true, 2, true );
  // dataset.512x512.SUBSET.30.colored.json

})();

