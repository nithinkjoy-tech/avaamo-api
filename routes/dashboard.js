const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const findUser = require("../utils/findUser");
const {Scrapeddata} = require("../models/scrapeddata");
const validateSession = require("../middleware/validateSession");
const uploadFile = require("../utils/uploadFiles");
const createFolder = require("../utils/createFolder");
const {spawn} = require("child_process");

router.get("/", [auth, validateSession], async (req, res) => {
  const user = await findUser(req.user["username"]);
  const scrapeddata = await Scrapeddata.findById(user.scrapeddata);
  console.log(user);
  res.send(user); //scrapeddata["data"].length);
});

router.post("/", [auth, validateSession], async (req, res) => {
  let url = "";
  let path = "";
  let uploadres=""

  function disp(data){
    console.log(data)
  }

  function scrape(url,path) {
    const process = spawn("python", ["./python/scrape.py", `${url}`,`${path}`]);
    process.stdout.on("data", data => {
      disp(data.toString())
    });
  }

  if (req.body.link) {
    console.log("this is a link", req.body.link);
    url=req.body.link
    scrape(url,path)
    return res.send("link");
  }

  const user = await findUser(req.user["username"]);
  const result = await createFolder(user.username);
  uploadFile(req, res,result.foldername,function(data){
    uploadres=data
    if (uploadres["err"]) return res.status(500).send("Error occured at our end. Try again!");
    path=result.path+`\\`+uploadres.name
    scrape(url,path)
    res.send("done");
  });
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
