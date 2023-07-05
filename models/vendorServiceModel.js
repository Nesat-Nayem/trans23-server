const mongoose = require('mongoose');


var vendorServiceSchema = new mongoose.Schema({


  name : {
      type : String,
      required:true,
    
  },

  type : {
      type : String,
      required:true,
    
  },


}, { timestamps: true });

const VendorService = mongoose.model("VendorService", vendorServiceSchema);
module.exports = { VendorService };
