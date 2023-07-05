
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({

    name : {
        type: String,
        required: true,
        trim:true
    },
    phone : {
        type: Number,
        required: true,
        trim:true
    },
    email : {
        type: String,
        required: true,
        trim:true
    },
    address : {
        type : String,
        required:true,
    },
    city : {
        type: String,
        required:true
    }

}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);
module.exports = {Customer}
