const mongoose = require("mongoose");


const vendorPaymentSchema = new mongoose.Schema({
    vendor_id:{
        type:String
    },
    week_amount:{
        type:Number
    },
    status:{
        type:String
    }
  
},{timestamps:true})

const VendorPayment = mongoose.model("VendorPayment",vendorPaymentSchema )

module.exports = VendorPayment