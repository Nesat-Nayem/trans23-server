
const VendorVehicle = require("../../models/vendor/vendorVehicle");

// appliance create and get 

const vendorVehicleHandalar = async (req, res) => {
  try {
    if (req.method === "POST") {
      const Vvehicle = new VendorVehicle(req.body);
      const result = await Vvehicle.save();
      res.status(200).json({
        success: true,
        message: "vendor vehicle added",
      });
    } else if (req.method === "GET") {
      const userId = req.query.userId || "";
      const query = userId ? { userId } : {};
      const Vvehicle = await VendorVehicle.find(query);
      res.status(200).json({
        success: true,
        message: "vendor vehicle data get success",
        data: Vvehicle,
      });
    } 
    

    else if (req.method === "PATCH") {
      const query = req.query.objectId || "";

      const Vvehicle = await VendorVehicle.findByIdAndUpdate(query, req.body, { new: true });
      res.status(200).json({
        success: true,
        message: "vendor vehicle data updated success",
        // data: Vvehicle,
      });
    } else if (req.method === "DELETE") {
      const objectId = req.query.objectId || "";
      const Vvehicle = await VendorVehicle.findByIdAndDelete(objectId);
      res.status(200).json({
        success: true,
        message: " delete success",
        // data: Vvehicle,
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


module.exports = {vendorVehicleHandalar}