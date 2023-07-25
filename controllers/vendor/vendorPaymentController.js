const VendorPayment = require("../../models/vendor/vendorPaymentModel");

const vendorPaymentHandalar = async (req, res) => {
  try {
    if (req.method === "POST") {
      const vendorpayment = new VendorPayment(req.body);
      const result = await vendorpayment.save();
      res.status(200).json({
        success: true,
        message: "insert success",
      });
    } else if (req.method === "GET") {
      const vendor_id = req.query.vendor_id || "";
      const query = vendor_id ? { vendor_id } : {};
      const vendorpayment = await VendorPayment.find(query);
      res.status(200).json({
        success: true,
        message: "found success",
        data: vendorpayment,
      });
    } else if (req.method === "PATCH") {
      const query = req.query.objectId || "";

      const vendorpayment = await VendorPayment.findByIdAndUpdate(
        query,
        req.body,
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "updated success",
        // data: vendorpayment,
      });
    } else if (req.method === "DELETE") {
      const objectId = req.query.objectId || "";
      const vendorpayment = await VendorPayment.findByIdAndDelete(objectId);
      res.status(200).json({
        success: true,
        message: " delete success",
        // data: vendorpayment,
      });
    } else {
      res.status(405).json({
        // error: "Method Not Allowed"

        success: false,
        message: "Method Not Allowed",
        data: {},
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = vendorPaymentHandalar;
