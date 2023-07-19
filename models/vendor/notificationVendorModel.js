const mongoose = require('mongoose');

const {Schema} = mongoose;


const notificationSchema = Schema({

    title:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
},{
    timestamps:true
})


const NotificationVendor = mongoose.model("NotificationVendor", notificationSchema)
module.exports = NotificationVendor