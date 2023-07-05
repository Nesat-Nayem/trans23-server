const Amount = require("../models/AmountModel");

const getAmount = async (req,res) =>{
    try {
      const amount = await Amount.find({}) 
      // res.json(image)
      res.status(200).json({
         success: true,
        message: "Notification Data",
        data: amount,
      });
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: "couldn't get data",
        error: error.message,
      });
    }
  }

const postAmount = async (req,res) =>{
    try {


    const result = await Amount.create(req.body)

    res.status(200).json({
       success: true,
      message: "data insert successfully",
      data: result,
    });
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: "couldn't insert data",
        error: error.message,
      });
    }
  }

  module.exports = {getAmount, postAmount}