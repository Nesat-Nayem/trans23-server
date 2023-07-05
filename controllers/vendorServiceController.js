// Import vendor service model
const {VendorService} = require('../models/vendorServiceModel');

// appliance create and get 

const vendorServiceHandalar = async (req, res) => {
  try {
    if (req.method === "POST") {
      const applience = new VendorService(req.body);
      const result = await applience.save();
      res.status(200).json({
        success: true,
        message: "verndor service added",
      });
    } else if (req.method === "GET") {
      const category = req.query.category || "";
      const query = category ? { category } : {};
      const applience = await VendorService.find(query);
      res.status(200).json({
        success: true,
        message: "vendor service get success",
        data: applience,
      });
    } 
    
   else if (req.method === "PATCH") {
    // const { _id } = req.body;
    const query = req.query.objectId || "";
    // const query = _id ? { _id } : {};

    const vendordetails = await VendorService.findByIdAndUpdate(query, req.body, { new: true });
    res.status(200).json({
      success: true,
      message: "updated success",
      data: vendordetails,
    });
  } else if (req.method === "DELETE") {
    // const { _id } = req.body;
    const objectId = req.query.objectId || "";
    // const query = userId ? { userId } : {};
    const vendordetails = await VendorService.findByIdAndDelete(objectId);
    res.status(200).json({
      success: true,
      message: "delete success",
      // data: vendordetails,
    });
  }
  
    
    
    
    
    else {
      res.status(405).json({ 
        
        // error: "Method Not Allowed"

        success: false,
        message: "Method Not Allowed",
        data: {}
      
      });
    }
  } catch (error) {
    res.status(500).json({ 
      // error: error.message 

      success: false,
      message: error.message,
      data: {}
    
    });
  }
};


module.exports = {vendorServiceHandalar}