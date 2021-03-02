const url = './Norvig-Big.txt';

const keyValue = "dict.1.1.20210302T153125Z.f722fdf8971d34ab.68fda368f316bb051470b44212d4b1e161e20be4";

function fetchURL() {
  const logFileText = async file => {
    const response = await fetch(file)
    const text = await response.text()
    var regex = /((?!([0-9]|\d]))[\w]+){2}/g
    const found = text.match(regex)
    var obj = {};

    found.forEach(function (el, i, arr) {
      obj[el.toLowerCase()] = obj[el.toLowerCase()] ? ++obj[el.toLowerCase()] : 1;
    });

    var sortable = [];
    for (var word in obj) {
      sortable.push([word, obj[word]]);
    }

    sortable.sort(function (a, b) {
      return b[1] - a[1];
    });

    var tempArray = sortable.slice(0,10);

    for (let index = 0; index < tempArray.length; index++) {
      const element = tempArray[index][0];
      const count =  tempArray[index][1];
      let jsonUrl = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key='+keyValue+'&lang=en-ru&text='+ element;
      fetch(jsonUrl).then(res => res.json()).then((out) => {
        console.log("JSON RESPONSE : " , out);
        out.def.map((data, idx) =>{
         
          if(idx == 0) {
            let element = document.createElement('b');
            
            element.innerHTML =  'Word (Occurance):  ' + data.text+'(' +count+')'; 

            let br = document.createElement('br');
            document.getElementById('result').appendChild(br);
        
            document.getElementById('result').appendChild(element);
          }

          else{

            if(data.tr!=undefined && data.tr.length > 0) {
              let br = document.createElement('br');
              document.getElementById('result').appendChild(br);
    
              data.tr.map((trdata) => {
                if(trdata.mean != undefined) {
                  console.log("POS-MEAN DATA  ",trdata.pos, trdata.mean);
                  if(trdata.pos != undefined && trdata.mean != undefined && trdata.mean[0]!= undefined) {
                    let element = document.createTextNode(' Pos :  ' + trdata.pos + '    Synonym    ' + trdata.mean[0].text  );
          
                    document.getElementById('result').appendChild(element);
                  }
                }               
              })
            }
          }
        })
      }).catch(err => console.error(err));
    }
  }
  logFileText(url)
}

fetchURL(url)