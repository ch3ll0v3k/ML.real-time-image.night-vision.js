async function loadJSONFromURL(file, callback) {

  return new Promise( async(res, rej)=>{

    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
        res( JSON.parse(rawFile.responseText) );
      }
    }
    rawFile.send(null);
  });

}

