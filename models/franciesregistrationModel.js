const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const franciesSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },

    phone: {
      type: Number,
      require: true,
    },

    password: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    state: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    service: {
      type: String,
    },

    // pincode:{
    //   type:Number,
    //   require:true
    // },

    pincode: {
      type: Number,
      required: true,
      validate: {
        validator: async function (value) {
          // validate the pincode format
          const regex = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/;
          return regex.test(value.toString());
        },
        message: 'Invalid pincode format'
      }
    },

    // location: {
    //   type: {
    //     type: String,
    //     default: "Point",
    //     enum: ["Point"]
    //   },
    //   coordinates: {
    //     type: [Number],
    //     index: "2dsphere" // create a 2dsphere index for geo queries
    //   }
    // },


    long: {
      type: Number
    },
    lat: {
      type: Number
    },

    status: {
      type: String,
      require: true

    }


  },
  {
    timestamps: true,
  }
);

franciesSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // this.status = 'InActive'
});

franciesSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// set long lat 

// pre-save hook to set the location field
franciesSchema.pre("save", async function (next) {
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


const FranciesAccount = mongoose.model("FranciesAccount", franciesSchema);

module.exports = { FranciesAccount };