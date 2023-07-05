const Video = require("../models/videoModels");

const getVideo = async (req,res) =>{
    try {
      const video = await Video.find({}) 
      // res.json(image)
      res.status(200).json({
         success: true,
        message: "video URL",
        data: video,
      });
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: "couldn't get image",
        error: error.message,
      });
    }
  }

const postVideo = async (req,res) =>{
    try {
      // const result = await Video(req.body);

    // crate method

    const result = await Video.create(req.body)

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

  module.exports = {getVideo, postVideo}