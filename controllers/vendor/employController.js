
const VendorEmployee = require("../../models/vendor/employModel");

// appliance create and get 

const vendorEmployHandalar = async (req, res) => {
  try {
    if (req.method === "POST") {
      const vendoremp = new VendorEmployee(req.body);
      const result = await vendoremp.save();
      res.status(200).json({
        success: true,
        message: "employee added",
      });
    } else if (req.method === "GET") {
      const userId = req.query.userId || "";
      const query = userId ? { userId } : {};
      const vendoremp = await VendorEmployee.find(query);
      res.status(200).json({
        success: true,
        message: "employee data get success",
        data: vendoremp,
      });
    }
    
    
    

    else if (req.method === "PATCH") {
      const query = req.query.objectId || "";

      const vendoremp = await VendorEmployee.findByIdAndUpdate(query, req.body, { new: true });
      res.status(200).json({
        success: true,
        message: "updated success",
        // data: vendoremp,
      });
    } else if (req.method === "DELETE") {
      const objectId = req.query.objectId || "";
      const vendoremp = await VendorEmployee.findByIdAndDelete(objectId);
      res.status(200).json({
        success: true,
        message: " delete success",
        // data: vendoremp,
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


module.exports = {vendorEmployHandalar}