
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({

    name : {
        type: String,
        required: true,
        trim:true
    },
    parentName : {
        type: String,
        // required: true,
        trim:true
    },
    // categoryName : {
    //     type: String,
    //     required: true,
    //     trim:true
    // },
    img : {
        type: String,
        required: true,
        trim:true
    },
    slug : {
        type : String,
        required:true,
        unique:true
    },
    parentId : {
        type: String,
        // required:true
    }

}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);