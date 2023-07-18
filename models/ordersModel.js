const mongoose = require("mongoose");
const { simpleApplienceSchema } = require("./reUsedModel/singleApplianceModel");

const moversPackersSchema = new mongoose.Schema({
  city: String,
  address: String,
  pincode: String,
  floor_no: String,
  contact_no: String,
  has_service_lift: Boolean,
});

const userSchema = new mongoose.Schema({
  name: String,
  phone_no: String,
  email: String,
});

const transactionSchema = new mongoose.Schema({
  id: String,
  name: String,
  amount: Number,
  code: String,
  state:String,
  payment_gateway:String,
  payment_gateway_id: String,
  date: String,
});

const addOnSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const orderSchema = new mongoose.Schema(
  {
    service: String,
    type: String,
    status: String,
    message: String,
    vendor_id: String,

    movers_packers: {
      with_in_city: Boolean,

      from: moversPackersSchema,
      to: moversPackersSchema,

      pickup_date: String,
      pickup_time: String,
      inspection_date: String,
      inspection_time: String,
    },
    storage: {
      address: moversPackersSchema,
      from_date: String,
      to_date: String,
      pickup_date: String,
      pickup_time: String,
      inspection_date: String,
      inspection_time: String,
      transport_service: Boolean,
      packing_service: Boolean,
    },
    courier: {},
    vehicle_transport: {},
    extra_data: {},

    appliance: simpleApplienceSchema,

    user: userSchema,
    seen: {
      type: Boolean,
      default: false,
    },

    payment_details: {
      type: {
        type: String,
       
      },
      total_amount: Number,
      outstanding_amount: Number,
      next_subsription_title: String,
      next_subsription_amount: Number,
      next_subscription_payment: String,
    },

    transaction: [transactionSchema],
    add_on: [addOnSchema],
  },
  {
    timestamps: true,
  }
);

orderSchema.set("toObject", { getters: true, virtuals: true });
orderSchema.set("toJSON", { getters: true, virtuals: true });
orderSchema.index({ location: "2dsphere" });
orderSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});

orderSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

orderSchema.statics.search = function (searchCriteria) {
  let searchResult = this.find(searchCriteria);
  return searchResult;
};

orderSchema.statics.pagination = function (paginationCriteria, searchCriteria) {
  let paginationResult = this.find(searchCriteria)
    .sort({ createdAt: -1 })
    .skip(paginationCriteria.pageNo * paginationCriteria.size)
    .limit(paginationCriteria.size);
  return paginationResult;
};

const Orders = mongoose.model("Orders", orderSchema);

module.exports = Orders;
