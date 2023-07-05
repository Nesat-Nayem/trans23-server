const userServices = require("../services/user.services");
const User = require("../models/user.model");
const mongoose = require("mongoose")
// exports.otpLogin = (req, res, next) => {
//   userServices.createNewOTP(req.body, (error, results) => {
//     if (error) {
//       // return next(error);
//         res.status(500).json({ error: error.message });
//     }

//     return res.status(200).send({
//       message: "Success",
//       otpStatus: results,
//     });
//   });
// };

exports.otpLogin = (req, res, next) => {
  userServices.createNewOTP(req.body, (error, results) => {
    if (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        // handle validation error
        res.status(400).json({ error: error.message });
      } else {
        // handle other errors
        res.status(500).json({ error: error.message });
      }
    } else {
      // handle success
      res.status(200).json({
        message: "Success",
        otpStatus: results,
      });
    }
  });
};



exports.resendOtp = (req, res, next) => {
  userServices.resendOtp(req.body, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "success",
      otpStatus: results,
    });
  });
};

exports.verifyOTP = (req, res, next) => {
  userServices.verifyOTP(req.body, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.find({});

    res.json(user);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "not send",
      error: err.message,
    });
  }
};

exports.getspacificUser = async (req, res) => {
  try {
    const number = req.params.phone;

    // console.log('Number:', number);

    const userr = await User.findOne({ phone: number });

    // console.log('User:', userr);

    if (!userr) {
      return res.status(400).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.json(userr);
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Error retrieving user",
      error: err.message,
    });
  }
};

exports.getReffrellCode = async (req, res) => {
  const phone = req.params.phone;
  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ referralCode: user.ownReffrell });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { number } = req.params;

    const result = await User.updateOne(
      { phone: number },
      { $set: req.body },
      { runValidators: true }
    );

    res.status(200).json({
      status: "Success",
      message: "update successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "couldn't update user data",
      error: error.message,
    });
  }
};

exports.checkReffrellCode = async (req, res) => {
  // if match then save

  // const referralCode = req.params.code;
  // const user = await User.findOne({ ownReffrell: referralCode });
  // if (!user) {
  //   return res.json({ success: false, message: 'Referral code is not valid' });
  // }
  // user.winReffrell = { ...user.winReffrell, [new Date().toISOString()]: referralCode };
  // await user.save();
  // return res.json({ success: true, message: 'Referral code is valid' });

  // under spacific number save reffrell code

  const number = req.params.number;
  const referralCode = req.body.referralCode;

  const user = await User.findOne({ ownReffrell: referralCode });
  if (!user) {
    return res.status(400).json({ message: "Invalid referral code" });
  }

  const targetUser = await User.findOne({ phone: number });
  if (!targetUser) {
    return res
      .status(400)
      .json({ message: "User with provided phone number not found" });
  }

  targetUser.winReffrell = referralCode;
  await targetUser.save();

  return res
    .status(200)
    .json({ message: "Valid Referral code & added winReffrell" });
};
