const otpGenerator = require("otp-generator");
const crypto = require("node:crypto");
const key = "verysecretkey";
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

var http = require("https");
var urlencode = require("urlencode");




async function createNewOTP(params, callback) {
  if (params.phone.length < 10) {
    return callback(
      new Error("Phone number should have at least 10 characters.")
    );
  }

  try {
    // Check if user with the given phone number already exists in the database
    const existingUser = await User.findOne({ phone: params.phone });
    if (existingUser) {
      console.log('User already exists with this phone number');
      // You can return a success message to the client here if you want
      
    }
    if (!existingUser) {

      console.log('created new user');

    // Create a new user
    const newUser = await User.create(params);

    }


    const otp = otpGenerator.generate(4, {
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    const ttl = 5 * 60 * 1000;
    const expires = Date.now() + ttl;
    const mdata = `${params.phone}.${otp}.${expires}`;
    const hash = crypto.createHmac("sha256", key).update(mdata).digest("hex");
    const fullHash = { mdata: `${hash}.${expires}`, devpass: otp };

    var msg = urlencode(
      `Hello User,%n %nUse OTP ${otp} to log in to your trans23 account. Do not share your OTP with anyone to keep your account safe.%n %nRegards,%nTrans23 Transportation`
    );

    var number = `+91${params.phone}`;
    var apikey = "NmI3NTRkNTU3ODM3NWE2ZjRiN2E0YjU0NzIzMDM0NmI=";

    var sender = "TRNSTN";
    var data =
      "apikey=" +
      apikey +
      "&sender=" +
      sender +
      "&numbers=" +
      number +
      "&message=" +
      msg;
    var options = {
      host: "api.textlocal.in",
      path: "/send?" + data,
    };
    apicall = function (response) {
      var str = [];
      response.on("data", function (chunk) {
        str += chunk;
      });
      response.on("end", function () {
        const parsedata = JSON.parse(str).status;
        console.log("opt status", parsedata);

        const towres = fullHash;

        return callback(null, towres);
      });
    };
    http.request(options, apicall).end();

    console.log(`Your OTP is ${otp}. it will expire in 5 minutes`);

    const testopt = otp;

  } catch (error) {
    console.log(error);
    return callback(
      new Error("Error creating user.")
    );
  }
}



// async function createNewOTP(params, callback) {
//   if (params.phone.length < 10) {
//     return callback(
//       new Error("Phone number should have at least 10 characters.")
//     );
//   }

//   const storeUser = User.create(params);

//   const otp = otpGenerator.generate(4, {
//     alphabets: false,
//     upperCase: false,
//     specialChars: false,
//   });
//   const ttl = 5 * 60 * 1000;
//   const expires = Date.now() + ttl;
//   const mdata = `${params.phone}.${otp}.${expires}`;
//   const hash = crypto.createHmac("sha256", key).update(mdata).digest("hex");
//   const fullHash = { mdata: `${hash}.${expires}`, devpass: otp };

//   var msg = urlencode(
//     `Hello User,%n %nUse OTP ${otp} to log in to your trans23 account. Do not share your OTP with anyone to keep your account safe.%n %nRegards,%nTrans23 Transportation`
//   );

//   var number = `+91${params.phone}`;
//   var apikey = "NmI3NTRkNTU3ODM3NWE2ZjRiN2E0YjU0NzIzMDM0NmI=";

//   var sender = "TRNSTN";
//   var data =
//     "apikey=" +
//     apikey +
//     "&sender=" +
//     sender +
//     "&numbers=" +
//     number +
//     "&message=" +
//     msg;
//   var options = {
//     host: "api.textlocal.in",
//     path: "/send?" + data,
//   };
//   apicall = function (response) {
//     var str = [];
//     response.on("data", function (chunk) {
//       str += chunk;
//     });
//     response.on("end", function () {
//       const parsedata = JSON.parse(str).status;
//       console.log("response is like", parsedata);

//       const towres = fullHash;

//       return callback(null, towres);
//     });
//   };
//   http.request(options, apicall).end();

//   console.log(`Your OTP is ${otp}. it will expire in 5 minutes`);

//   const testopt = otp;
// }



// here gose to resend otp

async function resendOtp(params, callback) {
  const otp = otpGenerator.generate(4, {
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
  const ttl = 5 * 60 * 1000;
  const expires = Date.now() + ttl;
  const mdata = `${params.phone}.${otp}.${expires}`;
  const hash = crypto.createHmac("sha256", key).update(mdata).digest("hex");
  const fullHash = { mdata: `${hash}.${expires}`, devpass: otp };
  var msg = urlencode(
    `Hello User,%n %nUse OTP ${otp} to log in to your trans23 account. Do not share your OTP with anyone to keep your account safe.%n %nRegards,%nTrans23 Transportation`
  );

  var number = `+91${params.phone}`;
  var apikey = "NmI3NTRkNTU3ODM3NWE2ZjRiN2E0YjU0NzIzMDM0NmI=";

  var sender = "TRNSTN";
  var data =
    "apikey=" +
    apikey +
    "&sender=" +
    sender +
    "&numbers=" +
    number +
    "&message=" +
    msg;
  var options = {
    host: "api.textlocal.in",
    path: "/send?" + data,
  };
  apicall = function (response) {
    var str = [];
    response.on("data", function (chunk) {
      str += chunk;
    });
    response.on("end", function () {
      const parsedata = JSON.parse(str).status;
      console.log("response is like", parsedata);
      // const towres = [{otpStatus:parsedata}, fullHash]
      const towres = fullHash;
      return callback(null, towres);
    });
  };
  http.request(options, apicall).end();

  console.log(`Your OTP is ${otp}. it will expire in 5 minutes`);
  const testopt = otp;
}

async function verifyOTP(params, callback) {
  let [hashValue, expires] = params.hash.split(".");
  let now = Date.now();
  if (now > parseInt(expires)) return callback("OTP Expired");
  let mdata = `${params.phone}.${params.otp}.${expires}`;
  let newCalculatedHash = crypto
    .createHmac("sha256", key)
    .update(mdata)
    .digest("hex");
  // if (newCalculatedHash === hashValue) {
  //   return callback(null, "Success");
  // }
  if (newCalculatedHash === hashValue) {
    // OTP verification successful - generate JWT token
    const token = jwt.sign({ userId: hashValue }, process.env.JWT_SECRET);
    // console.log("user check", params.hash)
    return callback(null, {
      message: "Success",
      access_token: token,
      userId: hashValue,
    });
  }
  return callback("Invalid OTP");
}

// const getUser = async() =>{
//   const user = await User.find({})
//   return user
// }

module.exports = {
  createNewOTP,
  verifyOTP,
  resendOtp,
  // getUser
};
