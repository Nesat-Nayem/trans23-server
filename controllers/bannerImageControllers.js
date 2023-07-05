const BannerImage = require("../models/BannerImageModel");

const getBannerImage = async (req,res) =>{
    try {
      const image = await BannerImage.find({}) 
      // res.json(image)
      res.status(200).json({
         success: true,
        message: "banner images",
        data: image,
      });
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: "couldn't get image",
        error: error.message,
      });
    }
  }

const postBannerImage = async (req,res) =>{
    try {
      // const result = await BannerImage(req.body);

    // crate method

    const result = await BannerImage.create(req.body)

    res.status(200).json({
       success: true,
      message: "data insert successfully",
      data: result,
    });
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: "couldn't get image",
        error: error.message,
      });
    }
  }

  module.exports = {getBannerImage, postBannerImage}