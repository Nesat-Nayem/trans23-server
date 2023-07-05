const mongoose = require('mongoose');

const addOnSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});


const Addonsmodel = mongoose.model('Addonsmodel', addOnSchema);

module.exports = Addonsmodel;
