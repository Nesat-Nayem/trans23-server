const otpGenerator = require("otp-generator");
const crypto = require("node:crypto");
const key = "verysecretkey";
const Vendor = require("../models/vendorRegisterModel");
const jwt = require("jsonwebtoken");

var http = require("https");
var urlencode = require("urlencode");
const { textmail } = require("../controllers/mailControllers");




// async function createNewOTP(params, callback) {
//     if (params.phone.length < 10) {
//         return callback(
//             new Error("Phone number should have at least 10 characters.")
//         );
//     }

//     try {
//         // Check if user with the given phone number already exists in the database
//         const existingUser = await Vendor.findOne({ phone: params.phone });
//         if (existingUser) {
//             console.log('Vendor already exists with this phone number');
//             // You can return a success message to the client here if you want

//         }
//         if (!existingUser) {

//             console.log('created new user');

//             // Create a new user
//             const newUser = await Vendor.create(params);

//         }


//         const otp = otpGenerator.generate(4, {
//             alphabets: false,
//             upperCase: false,
//             specialChars: false,
//         });
//         const ttl = 5 * 60 * 1000;
//         const expires = Date.now() + ttl;
//         const mdata = `${params.phone}.${otp}.${expires}`;
//         const hash = crypto.createHmac("sha256", key).update(mdata).digest("hex");
//         const fullHash = `${hash}.${expires}`

//         var msg = urlencode(
//             `Hello Vendor,%n %nUse OTP ${otp} to log in to your trans23 account. Do not share your OTP with anyone to keep your account safe.%n %nRegards,%nTrans23 Transportation`
//         );

//         var number = `+91${params.phone}`;
//         var apikey = "NmI3NTRkNTU3ODM3NWE2ZjRiN2E0YjU0NzIzMDM0NmI=";

//         var sender = "TRNSTN";
//         var data =
//             "apikey=" +
//             apikey +
//             "&sender=" +
//             sender +
//             "&numbers=" +
//             number +
//             "&message=" +
//             msg;
//         var options = {
//             host: "api.textlocal.in",
//             path: "/send?" + data,
//         };
//         apicall = function (response) {
//             var str = [];
//             response.on("data", function (chunk) {
//                 str += chunk;
//             });
//             response.on("end", function () {
//                 const parsedata = JSON.parse(str).status;
//                 console.log("opt status", parsedata);

//                 const towres = fullHash;

//                 return callback(null, towres);
//             });
//         };
//         http.request(options, apicall).end();

//         console.log(`vendor phone otp is ${otp}. it will expire in 5 minutes`);

//         const testopt = otp;

//     } catch (error) {
//         console.log(error);
//         return callback(
//             new Error("Error creating user.")
//         );
//     }
// }




// here gose to resend otp










// new create otp for both email and phone 

// async function createNewOTP(params, callback) {
//     if (params.phone.length < 10) {
//         return callback(
//             new Error("Phone number should have at least 10 characters.")
//         );
//     }

//     try {
//         const existingUser = await Vendor.findOne({ phone: params.phone });
//         if (existingUser) {
//             console.log('Vendor already exists with this phone number');
//         }
//         if (!existingUser) {

//             console.log('created new user');
//             const newUser = await Vendor.create(params);

//         }
//         const doc = new Vendor(params);
//         await doc.save().catch(error => callback(error));
//         const phoneOtp = otpGenerator.generate(4, {
//             alphabets: false,
//             upperCase: false,
//             specialChars: false,
//         });
//         const ttl = 5 * 60 * 1000;
//         const expires = Date.now() + ttl;
//         const mdata = `${params.phone}.${phoneOtp}.${expires}`;
//         const phoneHash = crypto.createHmac("sha256", key).update(mdata).digest("hex");
//         const fullPhoneHash = `${phoneHash}.${expires}`

//         var msg = urlencode(
//             `Hello Vendor,%n %nUse OTP ${phoneOtp} to log in to your trans23 account. Do not share your OTP with anyone to keep your account safe.%n %nRegards,%nTrans23 Transportation`
//         );

//         var number = `+91${params.phone}`;
//         var apikey = "NmI3NTRkNTU3ODM3NWE2ZjRiN2E0YjU0NzIzMDM0NmI=";

//         var sender = "TRNSTN";
//         var data =
//             "apikey=" +
//             apikey +
//             "&sender=" +
//             sender +
//             "&numbers=" +
//             number +
//             "&message=" +
//             msg;
//         var options = {
//             host: "api.textlocal.in",
//             path: "/send?" + data,
//         };
//         apicall = function (response) {
//             var str = [];
//             response.on("data", function (chunk) {
//                 str += chunk;
//             });
//             response.on("end", function () {
//                 const parsedata = JSON.parse(str).status;
//                 console.log("opt status", parsedata);
//                 const mailOtp = otpGenerator.generate(4, {
//                     alphabets: false,
//                     upperCase: false,
//                     specialChars: false,
//                 });
//                 const mdata2 = `${params.email}.${mailOtp}.${expires}`;
//                 const mailHash = crypto.createHmac("sha256", key).update(mdata2).digest("hex");
//                 const fullMailHash = `${mailHash}.${expires}`

//                 textmail({
//                     body: {
//                         userMail: params.email,
//                         name: params.name,
//                         text: `Hello ${params.name}, You have requested to log in to your Trans23 account. Use OTP ${mailOtp} to verify your identity and access your account. This OTP will expire in 5 minutes. Do not share your OTP with anyone to keep your account safe. Regards,Trans23 Transportation`,

//                     }
//                 }, function (err, data) {
//                     if (err) {
//                         console.log("error sending mail", err);
//                     } else {
//                         console.log("mail sent successfully");
//                     }
//                 });

//                 const towres = { phoneHash: fullPhoneHash, mailHash: fullMailHash };

//                 return callback(null, towres);
//             });
//         };
//         http.request(options, apicall).end();

//         console.log(`vendor phone otp is ${phoneOtp}. it will expire in 5 minutes`);

//     } catch (error) {
//         console.log(error);
//         return callback(
//             new Error("Error creating user.")
//         );
//     }
// }

// new create otp for both email and phone 




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
        `Hello Vendor,%n %nUse OTP ${otp} to log in to your trans23 account. Do not share your OTP with anyone to keep your account safe.%n %nRegards,%nTrans23 Transportation`
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


// new version 


async function createNewOTP(params, callback) {
    if (params.phone.length < 10) {
        return callback(
            new Error("Phone number should have at least 10 characters.")
        );
    }

    try {
        // const existingUser = await Vendor.findOne({ phone: params.phone });
        // if (existingUser) {
        //     console.log('Vendor already exists with this phone number');
        // }
        // if (!existingUser) {

        //     console.log('created new user');
        //     const newUser = await Vendor.create(params);

        // }
        const doc = new Vendor(params);
        // await doc.save().catch(error => console.error(error)); // Don't call callback here

        try {
            await doc.save(); // Try to save the document
        } catch (error) {
            // console.error(error); // Or any other error handling logic
            return callback(error); // Return from the function with the error
        }


        // await doc.save().catch(error => {
        //     console.error(error); // Or any other error handling logic
        //     return callback(error); // Return from the function with the error
        //   });

        // await doc.save().catch(error => callback(error));
        const phoneOtp = otpGenerator.generate(4, {
            alphabets: false,
            upperCase: false,
            specialChars: false,
        });
        const ttl = 5 * 60 * 1000;
        const expires = Date.now() + ttl;
        const mdata = `${params.phone}.${phoneOtp}.${expires}`;
        const phoneHash = crypto.createHmac("sha256", key).update(mdata).digest("hex");
        const fullPhoneHash = `${phoneHash}.${expires}`

        var msg = urlencode(
            `Hello Vendor,%n %nUse OTP ${phoneOtp} to log in to your trans23 account. Do not share your OTP with anyone to keep your account safe.%n %nRegards,%nTrans23 Transportation`
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
                const mailOtp = otpGenerator.generate(4, {
                    alphabets: false,
                    upperCase: false,
                    specialChars: false,
                });
                const mdata2 = `${params.email}.${mailOtp}.${expires}`;
                const mailHash = crypto.createHmac("sha256", key).update(mdata2).digest("hex");
                const fullMailHash = `${mailHash}.${expires}`

                // textmail({
                //     body: {
                //         userMail: params.email,
                //         name: params.name,
                //         text: `Hello ${params.name}, You have requested to log in to your Trans23 account. Use OTP ${mailOtp} to verify your identity and access your account. This OTP will expire in 5 minutes. Do not share your OTP with anyone to keep your account safe. Regards,Trans23 Transportation`,

                //     }
                // }, function (err, data) {
                //     if (err) {
                //         console.log("error sending mail", err);
                //     } else {
                //         console.log("mail sent successfully");
                //     }
                // });

                const towres = { phoneHash: fullPhoneHash, devPhoneOtp: phoneOtp, mailHash: fullMailHash, devMailOtp: mailOtp };

                return callback(null, towres);
            });
        };
        http.request(options, apicall).end();

        console.log(`vendor phone otp is ${phoneOtp}. it will expire in 5 minutes`);

    } catch (error) {
        console.log(error);
        return callback(
            new Error("Error creating user.")
        ); // Call callback here
    }
}

// new version 


// mail and phone varification 

async function verifyOTP(params, callback) {
    // Split the phone hash into hashValue and expires
    const user = await Vendor.findOne({ phone: params.phone }).select("-password");
    // console.log("user on verify", user)
    let [phoneHashValue, phoneExpires] = params.hash.split(".");
    // Split the email hash into hashValue and expires
    let [emailHashValue, emailExpires] = params.emailhash.split(".");
    let now = Date.now();
    // Check if both the phone and email hashes are not expired
    if (now > parseInt(phoneExpires) || now > parseInt(emailExpires)) return callback("OTP Expired");
    // Create a new mdata string for phone with the phone, otp and expires
    let phoneMdata = `${params.phone}.${params.otp}.${phoneExpires}`;
    // Create a new calculated hash for phone with the phoneMdata and the key
    let newCalculatedPhoneHash = crypto
        .createHmac("sha256", key)
        .update(phoneMdata)
        .digest("hex");
    // Create a new mdata string for email with the email, emailotp and expires
    let emailMdata = `${params.email}.${params.emailotp}.${emailExpires}`;
    // Create a new calculated hash for email with the emailMdata and the key
    let newCalculatedEmailHash = crypto
        .createHmac("sha256", key)
        .update(emailMdata)
        .digest("hex");

    // make user format 



    // Compare both the phone and email hashes with their respective hashValues
    if (newCalculatedPhoneHash === phoneHashValue && newCalculatedEmailHash === emailHashValue) {
        // OTP verification successful - generate JWT token
        const token = jwt.sign({ userId: phoneHashValue }, process.env.JWT_SECRET);
        // console.log("user check", params.hash)
        // return callback(null, token, user);

        return callback(null, { token, user });
    }
    return callback("Invalid OTP");
}






// async function verifyOTP(params, callback) {
//     let [hashValue, expires] = params.hash.split(".");
//     let now = Date.now();
//     if (now > parseInt(expires)) return callback("OTP Expired");
//     let mdata = `${params.phone}.${params.otp}.${expires}`;
//     let newCalculatedHash = crypto
//         .createHmac("sha256", key)
//         .update(mdata)
//         .digest("hex");

//     if (newCalculatedHash === hashValue) {
//         // OTP verification successful - generate JWT token
//         const token = jwt.sign({ userId: hashValue }, process.env.JWT_SECRET);
//         // console.log("user check", params.hash)
//         return callback(null, token

//         //     {
//         //     message: "Success",
//         //     access_token: token,
//         //     userId: hashValue,
//         // }

//         );
//     }
//     return callback("Invalid OTP");
// }


module.exports = {
    createNewOTP,
    verifyOTP,
    resendOtp,
    // getUser
};
