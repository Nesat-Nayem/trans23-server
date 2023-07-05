
const mongoose = require('mongoose');

const franciesSchema = new mongoose.Schema({

    name : {
        type: String,
        required: true,
        trim:true
    },
    contact : {
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
    },
    state : {
        type: String,
        required:true
    },
    service : {
        type: String,
        required:true
    }

}, { timestamps: true });

const Francies = mongoose.model('Francies', franciesSchema);
module.exports = Francies
