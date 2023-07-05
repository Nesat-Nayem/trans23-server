const mongoose = require("mongoose")
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const { nearestfranciesforvendor } = require("../controllers/ordersController");

const vendorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
        

    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return v.length >= 10;
            },
            message: props => `${props.value} is not a valid phone number! It should have at least 10 characters.`
        },
        unique:true
    },

    password: {
        type: String,
        required: true
    },

    pincode : {
      type : String,
      required:true,
  },

  franciesId: {
    type: String
  },


}, { timestamps: true })



// fire a function before doc saved to db


// vendorSchema.pre('save', async function(next) {
//     const salt = await bcrypt.genSalt();
//     this.password = await bcrypt.hash(this.password, salt);






//    const { pincode } = this;
//     try { const nearestFrancies = await nearestfranciesforvendor(pincode);
//      if (nearestFrancies && nearestFrancies.length > 0) {  this.franciesId = nearestFrancies[0].id }} catch (error) {console.error(error)}

    
//     next();
//   });
  

vendorSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  const { pincode } = this;
  try { 
    const nearestFrancies = await nearestfranciesforvendor(pincode);
    if (nearestFrancies && nearestFrancies.length > 0) {  
      // console.log("check here id under",nearestFrancies )
      this.franciesId = nearestFrancies[0]._id; // Use _id instead of id
    }
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
  }

  next();
});


  
vendorSchema.statics.login = async function (email, password) {
    try {
      const user = await this.findOne({ email });
      if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
          return user;
        }
        throw Error('incorrect password');
      }
      throw Error('incorrect email');
    } catch (err) {
      // Catch the error and rethrow it
      throw err;
    }
  };


// francies id set


  
  // Export vendor model
  module.exports = mongoose.model('Vendor', vendorSchema);