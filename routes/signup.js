const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const {validateUser, User} = require("../models/user");
const validate = require("../middleware/validate");
const {Scrapeddata} = require("../models/scrapeddata");

router.post("/", [validate(validateUser)], async (req, res) => {
  let email = await User.findOne({email: req.body.email.toLowerCase()});
  if (email) return res.status(400).send({property:"email",msg:"Email Already Registered"});

  let username = await User.findOne({username: req.body.username.toLowerCase()});
  if (username) return res.status(400).send({property:"username",msg:"Username Already Taken"});

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  req.body.password = hashedPassword;
  req.body.email = req.body.email.toLowerCase();
  req.body.username = req.body.username.toLowerCase();

  const scrapeddata = new Scrapeddata({});
  await scrapeddata.save();

  let userData = _.pick(req.body, ["name", "email", "username", "password"]);
  userData.scrapeddata = scrapeddata._id;

  const user = new User(userData);
  await user.save();

  res.send("Signup Successful");
});

module.exports = router;
