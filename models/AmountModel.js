
const mongoose = require('mongoose');

const amountSchema = new mongoose.Schema({

    title : {
        type: String,
        required: true,
    },
    amount : {
        type: Number,
        required: true,
    },
    phone : {
        type: Number,
        required: true,
    },
    date : {
        type: String,
        required: true,
    },
    message : {
        type: String,
        required: true,
    },



}, { timestamps: true });

const Amount = mongoose.model("Amount", amountSchema)

module.exports = Amount;


// const Applience = mongoose.model("Applience", applienceSchema);
// module.exports = { Applience };