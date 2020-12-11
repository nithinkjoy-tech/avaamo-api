const express = require("express");
const router = express.Router();
const {validatePassword} = require("../models/user");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const findUser = require("../utils/findUser");

router.post("/", [auth, validate(validatePassword)], async (req, res) => {
  const user = await findUser(req.user["username"]);
  let validPassword = await bcrypt.compare(req.body.oldpassword, user.password);
  if (!validPassword) return res.status(400).send({property:"oldpassword",msg:"Old password is wrong"});

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user.password = hashedPassword;
  user.passwordexpirytime=Date.now()+604800000
  await user.save()
  const token = user.generateAuthToken();
  res.send({token,msg:"Password changed successfully"});
});

module.exports = router;
