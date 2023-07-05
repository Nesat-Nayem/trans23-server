
const CompanyDetails = require("../../models/vendor/companyDetailsModel");

// appliance create and get 

const vendorCompanyDetailsHandalar = async (req, res) => {
  try {
    if (req.method === "POST") {

      let vendordata = {
        "_id": req.body.userId,
        "name": "Sky Fly",
        "contract": "3453434545",
        "alt_contract": "546456546565",
        "address": "new len",
        "city": "dubai",
        "state": "no state",
        "pincode": "345454",
        "adhar_no": "34534545353434",
        "company_document": "file url",
        "gstin_no": "back url",
        "pan_no": "93485748957",
        "bank": {
          "bank_name": "state bank",
          "ac_holder_name": "david",
          "ac_no": "jkflsje34",
          "ifsc_code": "lskdjfk34"
        }
      }

      const applience = new CompanyDetails(vendordata);
      const result = await applience.save();
      res.status(200).json({
        success: true,
        message: "company details added",
      });



    } else if (req.method === "GET") {
      const userId = req.query.userId;
      const applience = await CompanyDetails.findOne({ userId });


      if (applience) {
        // id found, data send
        res.status(200).json({
          success: true,
          message: "vendor service retrieved",
          data: applience,
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

      const applience = await CompanyDetails.findByIdAndUpdate(query, req.body, { new: true });
      res.status(200).json({
        success: true,
        message: "updated success",
        data: applience,
      });
    } else if (req.method === "DELETE") {
      // const { _id } = req.body;
      const objectId = req.query.objectId || "";
      // const query = userId ? { userId } : {};
      const applience = await CompanyDetails.findByIdAndDelete(objectId);
      res.status(200).json({
        success: true,
        message: " delete success",
        data: applience,
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