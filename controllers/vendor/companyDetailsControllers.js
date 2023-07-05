
const CompanyDetails = require("../../models/vendor/companyDetailsModel");

// appliance create and get 

const vendorCompanyDetailsHandalar = async (req, res) => {
  try {
    if (req.method === "POST") {

    

      const companydetails = new CompanyDetails(req.body);
      const result = await companydetails.save();
      res.status(200).json({
        success: true,
        message: "company details added",
      });



    } else if (req.method === "GET") {
      const userId = req.query.userId;
      const companydetails = await CompanyDetails.findOne({ userId });


      if (companydetails) {
        // id found, data send
        res.status(200).json({
          success: true,
          message: "vendor service retrieved",
          data: companydetails,
        });
      } else {
        // id not found, error message send
        res.status(404).json({
          success: false,
          message: "vendor service not found",
          data: null,
        });
      }

    }
    else if (req.method === "PATCH") {
      // const { _id } = req.body;
      const query = req.query.objectId || "";
      // const query = _id ? { _id } : {};

      const companydetails = await CompanyDetails.findByIdAndUpdate(query, req.body, { new: true });
      res.status(200).json({
        success: true,
        message: "updated success",
        data: companydetails,
      });
    } else if (req.method === "DELETE") {
      // const { _id } = req.body;
      const objectId = req.query.objectId || "";
      // const query = userId ? { userId } : {};
      const companydetails = await CompanyDetails.findByIdAndDelete(objectId);
      res.status(200).json({
        success: true,
        message: " delete success",
        data: companydetails,
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


module.exports = { vendorCompanyDetailsHandalar }