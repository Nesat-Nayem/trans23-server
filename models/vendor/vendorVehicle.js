const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicle_name: { type: String, required: true },
  userId: { type: String, required: true },
  vehicle_no: { type: String, required: true },
  vehicle_type: { type: String, required: true },
  height: { type: Number, required: true },
  width: { type: Number, required: true },
  length: { type: Number, required: true },
  weight: { type: Number, required: true },
  vehicle_condition: { type: String, required: true },
  vehicle_document: { type: String, required: true },
  vehicle_image: { type: String, required: true }
});

const VendorVehicle = mongoose.model('VendorVehicle', vehicleSchema);

module.exports = VendorVehicle;
