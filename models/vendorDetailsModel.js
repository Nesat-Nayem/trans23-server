
const mongoose = require('mongoose');

var vendorDetailsSchema = new mongoose.Schema({

  // remove the required option for generatedId
  generatedId : {
      type : Number,
  },

  name : {
      type : String,
      required:true,
  },
  userId : {
      type : String,
      required:true,
  },
  contract : {
      type : String,
      required:true,
  },
  alt_contract : {
      type : String,
      required:true,
  },
  address : {
      type : String,
      required:true,
  },
  city : {
      type : String,
      required:true,
  },
  state : {
      type : String,
      required:true,
  },
  pincode : {
      type : String,
      required:true,
  },
  adhar_no : {
      type : String,
      required:true,
  },
  adhar_front : {
      type : String,
      required:true,
  },
  adhar_back : {
      type : String,
      required:true,
  },
  pan_no : {
      type : String,
      required:true,
  },
  pan_img : {
      type : String,
      required:true,
  },
  profile_img : {
      type : String,
      required:true,
  },
  verification_status:{
    type:String,
    default:"in_verification"
  },

  long: {
    type: Number
  },
  lat: {
    type: Number
  },

}, { timestamps: true });

// define a function to generate a random number between min and max
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// define a pre-save hook on the schema
vendorDetailsSchema.pre('save', async function(next) {
    // check if the document is new
    if (this.isNew) {
        // generate a random number between 100000 and 999999
        let randomNumber = getRandomNumber(100000, 999999);
        // check if the number already exists in the database
        let existingVendor = await VendorDetails.findOne({generatedId: randomNumber});
        // while the number exists, generate a new one and check again
        while (existingVendor) {
            randomNumber = getRandomNumber(100000, 999999);
            existingVendor = await VendorDetails.findOne({generatedId: randomNumber});
        }
        // assign the unique number to the generatedId field
        this.generatedId = randomNumber;
    }
    // call the next middleware
    next();
});



// set long lat 

// pre-save hook to set the location field
vendorDetailsSchema.pre("save", async function (next) {
    if (this.isModified("pincode")) {
      const pincode = this.pincode.toString();
      // console.log("pincode", pincode)
      const opencageApiKey = process.env.OPENCHAGE;
      // const opencageApiKey = "4ab544535d6149cdbde0507d5a92ea2e";
      const opencageUrl = `https://api.opencagedata.com/geocode/v1/json?q=${pincode}&countrycode=in&limit=1&key=${opencageApiKey}`;
      const opencageResponse = await fetch(opencageUrl);
      const opencageData = await opencageResponse.json();
  
      // console.log("check data", opencageData)
  
      if (opencageData.status.code !== 200) {
        console.error('OpenCageData error:', opencageData.status.message);
        return next(new Error('Error fetching pincode data'));
      }
  
      const mainData = opencageData.results[0].geometry;
  
      // set the location field based on the fetched latitude and longitude
      // this.location.coordinates = [mainData.lng, mainData.lat];
      this.long = mainData.lng;
      this.lat = mainData.lat;
    }
  
    next();
  });
  


const VendorDetails = mongoose.model("VendorDetails", vendorDetailsSchema);
module.exports = { VendorDetails };
