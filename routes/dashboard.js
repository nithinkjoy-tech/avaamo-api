const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const findUser = require("../utils/findUser");
const {Scrapeddata} = require("../models/scrapeddata");
const validateSession = require("../middleware/validateSession");
const uploadFile=require("../utils/uploadFiles")

router.get("/", [auth, validateSession], async (req, res) => {
  const user = await findUser(req.user["username"]);
  const scrapeddata = await Scrapeddata.findById(user.scrapeddata);

  res.send("done"); //scrapeddata["data"].length);
});

router.post("/", [auth, validateSession], async(req, res) => {
  if(req.body.link){
    console.log('this is a link',req.body.link)
    return res.send("link")
  }

  const error=uploadFile(req,res)
  if(error) res.status(500).send("Error occured at our end. Try again!")
  function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  const ans=await wait(3000)
  res.send(ans); 
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
