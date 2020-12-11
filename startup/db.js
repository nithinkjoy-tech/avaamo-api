const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost/avaamo", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => console.log("connected to database"))
    .catch(err => console.log(err));
};
