const express=require("express")
const signin=require("../routes/signin")
const signup=require("../routes/signup")
const forgot=require("../routes/forgot")
const dashboard=require("../routes/dashboard")
const changePassword=require("../routes/changePassword")

module.exports = function (app) {
  app.use(express.json())
  app.use("/api/signin", signin);
  app.use("/api/signup", signup);
  app.use("/api/forgot", forgot);
  app.use("/api/dashboard", dashboard);
  app.use("/api/changePassword", changePassword);
};
 