const mongoose = require("mongoose")
const {Schema} = mongoose;

const bannerImageSchema = new Schema({
    imageUrl:{
        type:String,
        required:true
    },
    id:{
        type:Number,
        required:true
    }
})

const BannerImage = mongoose.model('BannerImage',bannerImageSchema )

module.exports = BannerImage;