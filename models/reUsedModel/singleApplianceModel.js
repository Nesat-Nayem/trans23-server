const mongoose = require("mongoose");

var appliance_item = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
    },
  });
  
  
  var subtotal = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
  });
  
  var cargoInfo = new mongoose.Schema({
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  });
  
  var simpleApplienceSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message:String,
    details: [appliance_item],
    cargo: cargoInfo,
    price: {
      type: Number,
      required: true,
    },
    subtotal : [subtotal]
  });

module.exports = { simpleApplienceSchema };
