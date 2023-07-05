// const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { FranciesAccount } = require("../models/franciesregistrationModel");
// const { generateToken } = require("../utils/generateToken");
// const {generateToken} = require("../utils/generateToken")

// get all franciesresdata

// const getallFrancies = async (req, res) => {
//   try {
//     const franciesresdata = await FranciesAccount.find({});
//     res.json(franciesresdata);
//   } catch (err) {
//     res.status(400).json({ erorr: err.message });
//   }
// };

const getallFrancies = async (req, res) => {
  try {
    if (req.query.username || req.query.city || req.query.state) {
      console.log("query true");

      const gFrancies = await FranciesAccount.find({
        $and: [
          {
            $or: [
              {
                username: req.query.username,
              },
              {
                city: req.query.city,
              },
              {
                state: req.query.state,
              },
            ],
          },
        ],
      });

      res.json(gFrancies);
    } else {
      console.log("false query");

      const eFrancies = await FranciesAccount.find({});
      res.json(eFrancies);
    }
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "couldn't get francies",
      error: error.message,
    });
  }
};

// get franciesresdata by email

// const getmyid = async(req,res) =>{
//     const id = req.params.id;
//     const query = {_id: mongoose.Types.ObjectId(id)};
//     const result = await Provider.find(query)
//     res.json(result)

// }

// const getFranciesbymail = async(req,res) =>{
//     const email = req.params.email;
//     const query = {email : email};
//     const result = await FranciesAccount.find(query)
//     res.json(result)
// }

// create new franciesresdata

const franciesSingUp = async (req, res) => {
  try {
    // const {username, email, password, role, access} = req.body;

    const { email } = req.body;
    const userExists = await FranciesAccount.findOne({ email });
    if (userExists) {
      res.status(500).json("FranciesAccount Already Exists");
    } else {
      const franciesresdata = new FranciesAccount(req.body);

      const result = await franciesresdata.save();
      // res.json(result);
      res.status(200).json({
        status: "Success",
        message: "sing UP successfully",
        data: result._id,
      });

      // }else{
      //         res.status(400).json("FranciesAccount Already Exists");
      // }
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// singin franciesresdata

const franciesSingIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const franciesresdata = await FranciesAccount.findOne({ email });
    if (franciesresdata && (await franciesresdata.matchPassword(password))) {
      res.json({
        _id: franciesresdata._id,
        userName: franciesresdata.username,
        email: franciesresdata.email,
        phone: franciesresdata.phone,
        status: franciesresdata.status,
        service: franciesresdata.service,
        // photoURL:franciesresdata.photoURL,
        // access:franciesresdata.access,
        // token:generateToken(franciesresdata._id),
      });
    } else {
      res.status(500).send("Authentication Failed");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//  update franciesresdata access

const updateFranciesAccess = async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: mongoose.Types.ObjectId(id) };
    const updateDoc = { $set: req.body };
    const options = { upsert: true };
    const result = await FranciesAccount.findOneAndUpdate(
      filter,
      updateDoc,
      options
    );
    // res.json(result);
    res.status(200).json({
      status: "Success",
      message: "access updated",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  franciesSingUp,
  franciesSingIn,
  getallFrancies,

  // getFranciesbymail,
  updateFranciesAccess,
};
