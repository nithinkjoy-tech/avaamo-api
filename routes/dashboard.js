const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const findUser = require("../utils/findUser");
const {Scrapeddata} = require("../models/scrapeddata");
const validateSession = require("../middleware/validateSession");
const uploadFile = require("../utils/uploadFiles");
const createFolder = require("../utils/createFolder");
const {spawn} = require("child_process");
const deleteFolder=require("../utils/deleteFolder");

router.get("/", [auth, validateSession], async (req, res) => {
  const user = await findUser(req.user["username"]);
  const scrapeddata = await Scrapeddata.findById(user.scrapeddata);
  console.log(scrapeddata);
  res.send(scrapeddata["data"].length.toString());
});

router.post("/", [auth, validateSession], async (req, res) => {
  const user = await findUser(req.user["username"]);
  let url = "";
  let path = "";
  let uploadres = "";
  let result=""

  async function saveToDatabase(data) {
    let dat=data.replace(/\\n/g,"")
    data=JSON.parse(JSON.stringify(dat))
    const scrapeddata = await Scrapeddata.findById(user.scrapeddata);
    scrapeddata.data.push(data);
    await scrapeddata.save();

    if(!url){
      deleteFolder(result.path,function(error){
        console.log(error)
      })
    }

    res.send(scrapeddata["data"].length.toString());
  }

  function scrape(url, path) {
    const process = spawn("python", [
      "./python/scrape.py",
      `${url}`,
      `${path}`,
    ]);
    process.stdout.on("data", data => {
      saveToDatabase(data.toString());
    });
  }

  if (req.body.link) {
    url = req.body.link;
    scrape(url, path);
  } else {
    result = await createFolder(user.username);
    uploadFile(req, res, result.foldername, function (data) {
      uploadres = data;
      if (uploadres["err"])
        return res.status(500).send("Error occured at our end. Try again!");
      path = result.path + `\\` + uploadres.name;
      scrape(url, path);
    });
  }
});

router.post("/:id", [auth, validateSession], (req, res) => {
  const {question} = req.body;
  if (!question)
    return res
      .status(400)
      .send({property: "question", msg: "Question should not be empty"});

  
  res.send(question + "this is the answer");
});

module.exports = router;
