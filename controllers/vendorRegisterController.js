const vendorService = require("../services/vendorService");
const Vendor = require("../models/vendorRegisterModel");
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken');
const { handleErrors } = require("../middlewares/errorHandler");




// exports.vendorRegister = (req, res, next) => {
//     vendorService.createNewOTP(req.body, (error, results) => {
//       if (error) {
//         if (error instanceof mongoose.Error.ValidationError) {
//           // handle validation error
//           res.status(400).json({ 
            
//             // error: error.message

//             success: false,
//             message: error.message,
//             data: {}
          
//           });
//         } else {
//           // handle other errors
//           res.status(500).json({ 
            
//             // error: error.message

//             success: false,
//             message: error.message,
//             data: {}
          
//           });
//         }
//       } else {
//         // handle success
//         res.status(200).json({
//           message: "Success",
//           hash: results,
//         });
//       }
//     });
//   };

exports.vendorRegister = (req, res, next) => {
  vendorService.createNewOTP(req.body, (error, results) => {
    if (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        // handle validation error
        res.status(400).json({ 
          
          // error: error.message

          success: false,
          message: error.message,
          data: {}
        
        });
      } else {
        // handle other errors
        res.status(500).json({ 
          
          // error: error.message

          success: false,
          message: error.message,
          data: {}
        
        });
      }
    } else {
      // handle success
      res.status(200).json({
        message: "Success",
        hash: results,
      });
    }
  });
};


  exports.vendorVerifyOTP = (req, res, next) => {
    vendorService.verifyOTP(req.body, (error, results) => {
      if (error) {
        return next(error);
      }
      return res.status(200).send({
        success:true,
        message: "Register Success",
        token: results.token,
        user:results.user
      });
    });
  };
  
  exports.getVendor = async(req,res)=>{
    const userId = req.query.userId;
    const vendordetails = await Vendor.find({ userId });
    if (vendordetails) {
      // id found, data send
      res.status(200).json({
        success: true,
        message: "data get success",
        data: vendordetails,
      });
    } else {
      // id not found, error message send
      res.status(404).json({
        success: false,
        message: "Not Found",
    
      });
    }

  }


exports.vendorLogin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Use try/catch to handle errors from login method
      const user = await Vendor.login(email, password);

      const userinfo = await Vendor.findOne({ email: email }).select("-password");

      // const userinfo = await Vendor.findOne({ email: email }).select("-password -_id");

      // console.log("email to user info", userinfo)
      // Sign token and send it back to client
      const token = await jwt.sign({ email: user.email }, process.env.JWT_SECRET);
          res.status(200).json({
        success:true,
        message:'LogIn Success',
         token: token,
         user: userinfo
        });
    } catch (err) {
      // Handle errors from login method or jwt sign
      // const errors = handleErrors(err);
      res.status(400).json({
        success: false,
        message: err.message,
        data: {}
      });
    }
  };