const mongoose = require("mongoose")
const {Schema} = mongoose;

const videoSchema = new Schema({
    videoUrl:{
        type:String,
        required:true
    },
    id:{
        type:Number,
        required:true
    }
})

const Video = mongoose.model('Video',videoSchema )

module.exports = Video;