const mongoose = require('mongoose');

const applianceSchema = new mongoose.Schema({
  id: String,
  name: String,
  quantity: Number,
  type:String,
});

const toFromSchema = new mongoose.Schema({
  city: String,
  address: String,
  pincode: String,
  floor_no: String,
  contact_no: String,
  has_service_lift: Boolean,
});

const userSchema = new mongoose.Schema({
  name: String,
  phone_no: String,
  email: String,
});

const transactionSchema = new mongoose.Schema({
  total_amount:Number,
  transaction_img: String,
  payment_gateway_id: String,
});



const serviceRequestStorageSchema = new mongoose.Schema({
  service: String,
  type: String,
  with_in_city: Boolean,
  status: String,
  to: toFromSchema,
  from: toFromSchema,
  location: {
    lat: String,
    long: String,
  },
  pickup_date: String,
  pickup_time: String,
  inspection_date: String,
  inspection_time: String,
  seen: {
    type: Boolean,
    default: false
  },
  appliance: {
    id: String,
    title: String,
    price: Number,
    details: [applianceSchema],
  },
  user: userSchema,
  transaction: [transactionSchema],
},{
  timestamps: true
});

const Storage = mongoose.model('Storage', serviceRequestStorageSchema);

module.exports = {Storage};
