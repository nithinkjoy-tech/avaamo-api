// // const tabletojson = require('tabletojson').Tabletojson;

// // tabletojson.convertUrl(
// //     'https://en.wikipedia.org/wiki/India_national_cricket_team',
// //     function(tablesAsJson) {
// //         for(i=10;i<15;i++)
// //         console.log(tablesAsJson[i]);
// //     }
// // );

// const csvFilePath = "Geeks.csv";
// const csv = require("csvtojson");

// async function convert() {
//   // const jsonArray=await csv().fromFile(csvFilePath);
//   // for(i=0;i<jsonArray.length;i++){
//   //     console.log(jsonArray[i])
//   // }
//   let csvToJson = require("convert-csv-to-json");

//   let fileInputName = "geeks.csv";
//   let fileOutputName = "abc.json";

//   csvToJson.generateJsonFileFromCsv(fileInputName, fileOutputName);
// }

// convert();
const joi=require("joi")
console.log(typeof joi)