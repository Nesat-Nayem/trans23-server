const mongoose = require("mongoose")
const { Schema } = mongoose;

const userSchema = new Schema({
  phone:{
    type:String,
    required:true,
    validate: {
      validator: function(v) {
        return v.length >= 10;
      },
      message: props => `${props.value} is not a valid phone number! It should have at least 10 characters.`
    }
  },
  name:{
    type:String
  },
  email:{
    type:String,
  
  },
  address:{
    type:String
  },
  city:{
    type:String
  },
  zip:{
    type:Number
  },
  deviceToken:{
    type:String
  },
  balance:{
    type:Number
  },
  ownReffrell:{
    type:String,
    unique: true
  },
  winReffrell:{
    type:Object
  }



},{ timestamps: true})




userSchema.pre('save', async function(next) {
  if (this.isNew) {
    const generatedCodes = new Set();
    function generateReferralCode() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let referralCode = '';
      for (let i = 0; i < 6; i++) {
        referralCode += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      if (generatedCodes.has(referralCode)) {
        return generateReferralCode();
      } else {
        generatedCodes.add(referralCode);
        return referralCode;
      }
    }
    this.ownReffrell = generateReferralCode();
    this.balance = 0;
  }
  next();
},{timestamps:true});


const User = mongoose.model("User",userSchema)
module.exports = User
