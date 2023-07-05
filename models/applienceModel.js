const mongoose = require('mongoose');
const { simpleApplienceSchema } = require('./reUsedModel/singleApplianceModel');

// var appliancesinfo = new mongoose.Schema({
//     name:{
//         type:String,
//         required:true
//     },
//     type:{
//         type:String
//     },
//     quantity:{
//         type:Number,
//         required:true
//     },

// })

// var cargoInfo = new mongoose.Schema({
//     image:{
//         type:String,
//         required:true
//     },
//     title:{
//         type:String,
//         required:true
//     },
//     subtitle:{
//         type:String,
//         required:true
//     },
//     message:{
//         type:String,
//         required:true
//     }
// })

// var simpleApplienceSchema = new mongoose.Schema({
//     title : {
//         type: String,
//         required: true,
//         trim:true
//     },


//     details : [appliancesinfo],
//     cargo:cargoInfo,

//     price : {
//         type: Number,
//         required:true
//     }
// })


var applienceSchema = new mongoose.Schema({


    size : {
        type : String,
        required:true,
      
    },
    category : {
        type : String,
        required:true,
      
    },

    type : {
        type : String,
        required:true,
      
    },

    applience:simpleApplienceSchema

}, { timestamps: true });

// module.exports = mongoose.model('Applience', applienceSchema);

const Applience = mongoose.model("Applience", applienceSchema);
module.exports = { Applience };
