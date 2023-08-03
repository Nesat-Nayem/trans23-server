const mongoose = require("mongoose")

const CourierPriceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  info: {
    type: String,
    required: true
  },

  min_qty: {
    type: Number,
    required: true
  },
  max_qty: {
    type: Number,
    required: true
  },
  range: {
    type: Object,
    required: true
  }
});


module.exports = mongoose.model("CourierPrice", CourierPriceSchema )