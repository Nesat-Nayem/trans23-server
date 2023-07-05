const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
  bank_name: { type: String, required: true },
  ac_holder_name: { type: String, required: true },
  ac_no: { type: String, required: true },
  ifsc_code: { type: String, required: true }
});

const companyDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  contract: { type: String, required: true },
  alt_contract: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  pan_url: { type: String, required: true },
  company_document: { type: String, required: true },
  gstin_no: { type: String, required: true },
  pan_no: { type: String, required: true },
  bank: { type: bankSchema, required: true }
});

const CompanyDetails = mongoose.model('CompanyDetails', companyDetailsSchema);

module.exports = CompanyDetails;
