const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const findUser = require("../utils/findUser");
const {Scrapeddata} = require("../models/scrapeddata");
const validateSession = require("../middleware/validateSession");
const uploadFile = require("../utils/uploadFiles");
const createFolder = require("../utils/createFolder");
const {spawn} = require("child_process");
const removeDirectory = require("../utils/deleteFolder");
const moment = require("moment");

router.get("/", [auth, validateSession], async (req, res) => {
  const user = await findUser(req.user["username"]);
  const scrapeddata = await Scrapeddata.findById(user.scrapeddata);
  res.send(scrapeddata["data"].length.toString());
});

router.get("/:id", [auth, validateSession], async (req, res) => {
  const user = await findUser(req.user["username"]);
  const scrapeddata = await Scrapeddata.findById(user.scrapeddata);
  delete scrapeddata["data"][req.params.id - 1]["data"];
  res.send(scrapeddata["data"][req.params.id - 1]);
});

router.post("/", [auth, validateSession], async (req, res) => {
  const user = await findUser(req.user["username"]);
  let {id}=req.body
  let url = "";
  let path = "";
  let uploadedFileDetails = "";
  let createdFolderDetails = "";
  let scrapedDate = moment().format("MM/DD/YYYY");
  let finalData = {};

  function deleteFolder() {
    if (!url)
      removeDirectory(createdFolderDetails.path, function (error) {
        console.log(error);
      });
  }

  async function saveToDatabase(data,headerSynonyms) {
    let formattedData = JSON.parse(JSON.stringify(data.replace(/\\n/g, "")));
    formattedData=formattedData.replace(/\uFFFD/g, "-")
    const scrapeddata = await Scrapeddata.findById(user.scrapeddata);

    if (url) finalData["URL Link"] = url;
    else
      finalData["filename"] = uploadedFileDetails["name"].substring(
        14,
        uploadedFileDetails["name"].length
      );
    finalData["Scraped On"] = scrapedDate;
    finalData["user"] = user.username;
    finalData["data"] = [formattedData,{headerSynonyms}];
    if(id){
      await Scrapeddata.updateOne({_id:user.scrapeddata},{ $set: {[`data.${id-1}`]:finalData }})
      delete finalData["data"];
      return res.send(finalData)
    }

    scrapeddata.data.push(finalData);
    await scrapeddata.save();

    deleteFolder();

    res.send(scrapeddata["data"].length.toString());
  }

  function scrape(url, path) {
    const process = spawn("python", [
      "./python/scrape.py",
      `${url}`,
      `${path}`,
    ]);

    process.stdout.on("data", data => {
      let output=data.toString().toLowerCase()
      data=eval(output)[0]
      console.log(data)
      headerSynonyms=eval(output)[1]
      if (data.indexOf("null") === 0) {
        deleteFolder();
        return res.status(400).send(data.substring(5, data.length));
      }
      saveToDatabase(JSON.stringify(data),JSON.stringify(headerSynonyms));
    });
  }

  if (req.body.link) {
    url = req.body.link;
    scrape(url, path);
  } else {
    createdFolderDetails = await createFolder(user.username);
    uploadFile(req, res, createdFolderDetails.foldername, function (data) {
      uploadedFileDetails = data;
      if (uploadedFileDetails["err"])
        return res.status(500).send("Error occured at our end. Try again!");
      path = createdFolderDetails.path + `\\` + uploadedFileDetails.name;
      scrape(url, path);
    });
  }
});

router.post("/:id", [auth, validateSession], async(req, res) => {
  const {question} = req.body;
  const user = await findUser(req.user["username"]);
  const scrapeddata = await Scrapeddata.findById(user.scrapeddata);
  let headerSynonyms=scrapeddata["data"][req.params.id-1]["data"][1].headerSynonyms
  let data=eval(JSON.stringify(scrapeddata["data"][req.params.id-1]["data"][0]))
  const process = spawn("python", [
    "./python/query.py",
    `${question}`,
    `${headerSynonyms}`,
    `${data}`,
  ]);

  process.stdout.on("data", data => {
    console.log(data.toString())
  });  

  if (!question)
    return res
      .status(400)
      .send({property: "question", msg: "Question should not be empty"});

  res.send(question + "this is the answer");
});

module.exports = router;