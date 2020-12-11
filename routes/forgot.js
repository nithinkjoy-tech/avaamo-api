const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt=require("bcrypt")
const findUser = require("../utils/findUser");
const validate = require("../middleware/validate");
const {validatePassword} = require("../models/user");
const mailService = require("../services/mailService");
const {encrypt, decrypt} = require("../utils/encryption");

router.post("/", async (req, res) => {
  let {userId} = req.body;
  let user = await findUser(userId);
  if (!user)
    return res.status(400).send({property:"userId",msg:"There is no user with given email id or username"});

  let resetToken = user.generateResetToken();
  let encryptedResetToken = encrypt(resetToken);
  user.resettoken = encryptedResetToken;
  await user.save();
  mailService(user["email"], resetToken);
  res.send("Link Sent Successfully");
});

router.put("/:token",validate(validatePassword), async (req, res) => {
  let token = req.params.token;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_CHANGEPASSWORD_PRIVATE_KEY);
  } catch (ex) {
    return res.status(400).send("This link is invalid.");
  }

  let user = await findUser(decoded.email);
  if (!user)
    return res.status(400).send("Something went wrong. Try again");

  if (!user.resettoken)
    return res.status(400).send("This link is invalid");

  let decryptedResetToken = decrypt(user.resettoken);
  if (token !== decryptedResetToken)
    return res.status(400).send("Something went wrong. Try again");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user.password = hashedPassword;
  user.resettoken = null;
  await user.save();
  res.send("Password changed successfully");
});

module.exports = router;
