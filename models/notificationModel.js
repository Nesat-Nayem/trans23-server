const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  deviceToken: { type: String, required: true },
  phone: { type: Number, required: true },
  sentAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
