// Import vendor service model
const { VendorDetails } = require('../models/vendorDetailsModel');

const VendorDetailsHandalar = async (req, res) => {
  try {
    if (req.method === "POST") {
      const vendordetails = new VendorDetails(req.body);
      const result = await vendordetails.save();
      res.status(200).json({
        success: true,
        message: "vendor details added",
      });
    } else if (req.method === "GET") {

      const userId = req.query.userId;
      const vendordetails = await VendorDetails.findOne({ userId });
      if (vendordetails) {
        // id found, data send
        res.status(200).json({
          success: true,
          message: "vendor details get success",
          data: vendordetails,
        });
      } else {
        // id not found, error message send
        res.status(404).json({
          success: false,
          message: "vendor details not found",
          data: null,
        });
      }

    } else if (req.method === "PATCH") {
      // const { _id } = req.body;
      const query = req.query.objectId || "";
      // const query = _id ? { _id } : {};

      const vendordetails = await VendorDetails.findByIdAndUpdate(query, req.body, { new: true });
      res.status(200).json({
        success: true,
        message: "vendor details updated",
        data: vendordetails,
      });
    } else if (req.method === "DELETE") {
      // const { _id } = req.body;
      const objectId = req.query.objectId || "";
      // const query = userId ? { userId } : {};
      const vendordetails = await VendorDetails.findByIdAndDelete(objectId);
      res.status(200).json({
        success: true,
        message: "vendor details deleted",
        data: vendordetails,
      });
    }
    
    
    else {
      res.status(405).json({
        success: false,
        message: "Method not allowed",
        data: {}
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};



module.exports = { VendorDetailsHandalar }