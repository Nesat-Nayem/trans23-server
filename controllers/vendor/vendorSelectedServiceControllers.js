// Import vendor service model
const {VendorSelectedService} = require("../../models/vendor/vendorSelectedServiceModel")

// appliance create and get 

const vendorSelectedServiceHandalar = async (req, res) => {
  try {
    if (req.method === "POST") {


    const data = req.body; // assuming req.body is an array of objects
const result = await VendorSelectedService.insertMany(data);
res.status(200).json({
  success: true,
  message: "vendor service added",
});


    } else if (req.method === "GET") {
      const userId = req.query.userId ;
      // const query = userId ? { userId } : {};
      const VselectedSer = await VendorSelectedService.findOne({userId});
      // res.status(200).json({
      //   success: true,
      //   message: "vendor service selected get success",
      //   data: VselectedSer,
      // });

      if (VselectedSer) {
        // id found, data send
        res.status(200).json({
          success: true,
          message: "vendor selected service get success",
          data: VselectedSer,
        });
      } else {
        // id not found, error message send
        res.status(404).json({
          success: false,
          message: "vendor selected service not found",
          // data: null,
        });
      }


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


module.exports = {vendorSelectedServiceHandalar}