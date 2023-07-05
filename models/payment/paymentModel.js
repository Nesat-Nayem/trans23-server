const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    amount:{
        type:Number,
        required:true
    },
    
    transection_id:{
        type:String,
        required:true
    },

}, {timestamps:true})

const Payment = mongoose.model("Payment", paymentSchema)

module.exports = {Payment}