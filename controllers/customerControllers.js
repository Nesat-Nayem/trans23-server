const mongoose = require("mongoose");
const { Customer } = require("../models/customerModel")
// post Home relocate

const postCustomer = async (req, res) => {
  try {
    const pcustomer = new Customer(req.body);
    const result = await pcustomer.save();
    res.status(200).json({
      status: "Success",
      message: "cusomer Data Insert successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCustomer = async (req,res) =>{
  try {
    const gcustomer = await Customer.find({}) 
    res.json(gcustomer)
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "couldn't get customer data",
      error: error.message,
    });
  }
}


module.exports = { 
  postCustomer , 
  getCustomer
};
