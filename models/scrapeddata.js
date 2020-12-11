const mongoose = require("mongoose");

const scrapeddataSchema = new mongoose.Schema({
  data: {
    type: Array,
    default: [],
  },
});

const Scrapeddata = mongoose.model("scrapeddata", scrapeddataSchema);

exports.Scrapeddata = Scrapeddata;
