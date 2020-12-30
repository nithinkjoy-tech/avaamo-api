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
  console.log("here", req.params.id);
  const user = await findUser(req.user["username"]);
  const scrapeddata = await Scrapeddata.findById(user.scrapeddata);
  delete scrapeddata["data"][req.params.id - 1]["data"];
  // console.log()
  console.log(scrapeddata["data"][req.params.id - 1]);
  res.send(scrapeddata["data"][req.params.id - 1]);
});

router.post("/", [auth, validateSession], async (req, res) => {
  const user = await findUser(req.user["username"]);
  let url = "";
  let path = "";
  let uploadres = "";
  let result = "";
  let date = moment().format("MM/DD/YYYY");
  let finalData = {};

  function deleteFolder() {
    if (!url)
      removeDirectory(result.path, function (error) {
        console.log(error);
      });
  }

  async function saveToDatabase(data) {
    let dat = data.replace(/\\n/g, "");
    data = JSON.parse(JSON.stringify(dat));
    const scrapeddata = await Scrapeddata.findById(user.scrapeddata);

    if (url) finalData["URL Link"] = url;
    else
      finalData["filename"] = uploadres["name"].substring(
        14,
        uploadres["name"].length
      );
    finalData["Scraped On"] = date;
    finalData["user"] = user.username;
    finalData["data"] = data;

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
      data = data.toString();
      if (data.indexOf("null") === 0) {
        deleteFolder();
        return res.status(400).send(data.substring(5, data.length));
      }
      saveToDatabase(data);
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
  console.log("a", req.params.id);
  const {question} = req.body;
  if (!question)
    return res
      .status(400)
      .send({property: "question", msg: "Question should not be empty"});

  res.send(question + "this is the answer");
});

module.exports = router;
