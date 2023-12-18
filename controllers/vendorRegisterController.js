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

// exports.vendorCreate = (req, res, next) => {

// };


exports.vendorCreate = async (req, res, next) => {
    try {
        // Destructure the body data
        const { name, email, phone, password, franciesId } = req.body;

        // Create a new vendor with the requested data
        const newVendor = new Vendor({
            name,
            email,
            phone,
            password,
            franciesId
        });

        // Save the vendor asynchronously and wait for the promise to resolve
        const savedVendor = await newVendor.save();

        // Send back the details of the new vendor with a 201 status code
        res.status(201).json({
          success:true,
          message:"own vendor create success",
          data:savedVendor});
    } catch (err) {
        // Log the error and send an appropriate message or error code
        console.error(err);
        
        // You could add additional checks for different types of errors and customize the responses here
        if(err.code === 11000){
            // Handle duplicate key errors separately
            res.status(409).json({
                message: 'A vendor with the given email or phone already exists.',
                error: err.keyValue
            });
        } else {
            // For other errors, send a generic 500 Internal Server Error
            res.status(500).json({
                message: 'Failed to create a new vendor.',
                error: err.message
            });
        }
    }
};



exports.vendorVerifyOTP = (req, res, next) => {
  vendorService.verifyOTP(req.body, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      success: true,
      message: "Register Success",
      token: results.token,
      user: results.user
    });
  });
};

// exports.getVendor = async (req, res) => {
//   const _id = req.query.userId;
//   const vendordetails = await Vendor.find({ _id });
//   if (vendordetails) {
//     // id found, data send
//     res.status(200).json({
//       success: true,
//       message: "data get success",
//       data: vendordetails,
//     });
//   } else {
//     // id not found, error message send
//     res.status(404).json({
//       success: false,
//       message: "Not Found",

//     });
//   }

// }



// exports.getVendor = async (req, res) => {
//   try {
//     const _id = req.query.userId;
//     let vendordetails;
  
//     if (_id) {
//       vendordetails = await Vendor.findOne({ _id }); // Use findOne instead of find
//     } else {
//       vendordetails = await Vendor.find();
//     }
  
//     if (vendordetails) { // Check if vendordetails is not null or undefined
//       res.status(200).json({
//         success: true,
//         message: "Data retrieved successfully",
//         data: vendordetails,
//       });
//     } else {
//       res.status(404).json({
//         success: false,
//         message: "Not Found",
//       });
//     }
  
//   } catch (error) {
//     res.status(500).json({
//       message: error.message
//     });
//   }
// }


exports.getVendor = async (req, res) => {
  try {
    const franciesId = req.query.franciesId;
    const filterQuery = {};

    if (franciesId) filterQuery.franciesId = franciesId;
    if (Object.keys(req.query).length > 0) {
      // Add conditions for other filters using the same pattern
      const keyValuePairs = req.query;
      for (const [key, value] of Object.entries(keyValuePairs)) {
        if (key === "name" || key === "phone") {
          filterQuery[key] = { $regex: value, $options: "i" };
        } else {
          filterQuery[key] = value;
        }
      }
    }

    const vendordetails = await Vendor.find(filterQuery);

    if (vendordetails.length > 0) {
      res.status(200).json({
        success: true,
        message: "Data retrieved successfully",
        data: vendordetails,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No vendors found with the requested filters.",
      });
    }

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


exports.patchVendor = async (req, res) => {
  const _id = req.query.userId;
  const update = req.body;

  try {
    const updatedVendor = await Vendor.findOneAndUpdate({ _id }, update, { new: true });

    if (updatedVendor) {
      res.status(200).json({
        success: true,
        message: "Vendor updated successfully",
        data: updatedVendor,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the vendor",
    });
  }
}

exports.deleteVendor = async (req, res) => {
  const _id = req.query.userId;

  try {
    const deletedVendor = await Vendor.findOneAndDelete({ _id });

    if (deletedVendor) {
      res.status(200).json({
        success: true,
        message: "Vendor deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the vendor",
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
      success: true,
      message: 'LogIn Success',
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