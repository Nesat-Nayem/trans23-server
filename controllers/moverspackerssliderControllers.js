const MoversSlider = require("../models/moverspackerssliderModels")

const getMoversSlider = async (req,res) =>{
    try {

      const slider = await MoversSlider.find({}, '-_id ') 

      res.status(200).json({
         success: true,
        message: "movers slider images",
        data: slider,
        
      });
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: "couldn't get slider",
        error: error.message,
      });
    }
  }


  module.exports = getMoversSlider