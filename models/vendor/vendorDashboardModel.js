const mongoose = require("mongoose")

const vendorDashboardSchema = new mongoose.Schema({
    sliderNo:{
        type: Number,
        require:true
    },
    sliderImage:{
        type: String,
        require:true
    }
})


const VendorDashboard = mongoose.model('VendorDashboard', vendorDashboardSchema)

module.exports = VendorDashboard