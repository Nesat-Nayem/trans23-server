// transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  id: String,
  name: String,
  amount: Number,
  code: String,
  state:String,
  payment_gateway:String,
  payment_gateway_id: String,
  date: String,
  order_id: { // this field links the transaction to the order
    type: mongoose.Schema.Types.ObjectId,
    ref: "Orders"
  }
});

const Transactions = mongoose.model("Transactions", transactionSchema);

module.exports = Transactions;
