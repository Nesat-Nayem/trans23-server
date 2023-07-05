
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: String,
  type: String,
});

var vendorSelectedServiceSchema = new mongoose.Schema({

  // userId : {
  //   type : String,
  //   required: true
  // },

  // name : {
  //   type : String,
  //   required: true
  // },

  // type : {
  //   type : String,
  //   required: true
  // }

  userId:{
    type:String,
    required:true
  },
  selected_services: [serviceSchema],

}, { timestamps: true });

const VendorSelectedService = mongoose.model("VendorSelectedService", vendorSelectedServiceSchema);
module.exports = { VendorSelectedService };
