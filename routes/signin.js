const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const findUser = require("../utils/findUser");

router.post("/", async (req, res) => {
  let {userId} = req.body;
  let user = await findUser(userId);

  if (!user) return res.status(400).send({property:"userId",msg:"UserId and Password doesn't Match"});

  let validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send({property:"userId",msg:"UserId and Password doesn't Match"});
 
  if (Date.now() > user.passwordexpirytime) {
    const token = user.generateAuthToken(true);
    return res.send(token);
  }

  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
