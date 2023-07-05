const VendorDashboard = require('../../models/vendor/vendorDashboardModel')

const VendorVehicle = require("../../models/vendor/vendorVehicle");

const VendorEmployee = require("../../models/vendor/employModel");

const vendorDashboardHandalar = async(req,res) =>{

    try {

        if (req.method === "POST") {
            const vendordashboard = new VendorDashboard(req.body);
            const result = await vendordashboard.save();
            res.status(200).json({
              success: true,
              message: "vendor dashboard slider added",
            });
          } else if (req.method === "GET") {

            const userId = req.query.userId || "";
            const query = userId ? { userId } : {};

            // console.log("query user id", query)

            const totalVehicle = await VendorVehicle.find(query);
            const totalEmployee = await VendorEmployee.find(query)

            // console.log("total vehicle", totalEmployee.length)

            const vendordashboarddata = await VendorDashboard.find({});
            res.status(200).json({
              success: true,
              message: "vendor dashboard data get success",
              data: {
                "sliders":vendordashboarddata,
                "vehicle_count" : totalVehicle.length,
                "employee_count" : totalEmployee.length,
                "monthly_order": 0,
              } 
            });
          }


          else if (req.method === "PATCH") {
            // const { _id } = req.body;
            const query = req.query.objectId || "";
            // const query = _id ? { _id } : {};
      
            const Vdashboard = await VendorDashboard.findByIdAndUpdate(query, req.body, { new: true });
            res.status(200).json({
              success: true,
              message: "slider updated success",
              data: Vdashboard,
            });
          } else if (req.method === "DELETE") {
            // const { _id } = req.body;
            const objectId = req.query.objectId || "";
            // const query = userId ? { userId } : {};
            const Vdashboard = await VendorDashboard.findByIdAndDelete(objectId);
            res.status(200).json({
              success: true,
              message: " delete success",
              // data: Vdashboard,
            });
          } 
          
          

          else {
            res.status(405).json({ 
              
              success: false,
              message: "Method Not Allowed",
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

}


module.exports = vendorDashboardHandalar;