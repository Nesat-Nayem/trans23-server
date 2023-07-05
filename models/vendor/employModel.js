const mongoose = require('mongoose');

const VendorEmployeeSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  userId: { type: String, required: true },
  contact_no: { type: String, required: true },
  emp_type: { type: String, required: true },
  id_card: { type: String, required: true },
  profile_photo: { type: String, required: true }
});

const VendorEmployee = mongoose.model('VendorEmployee', VendorEmployeeSchema);

module.exports = VendorEmployee;
