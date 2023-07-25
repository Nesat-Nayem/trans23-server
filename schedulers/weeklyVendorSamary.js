// const cron = require("node-cron");
// const mongoose = require("mongoose");
// const Order = require("../models/order");
// const Vendor = require("../models/vendor");
// const Payment = require("../models/payment");

// cron.schedule("0 0 * * 0", async function () {
//   try {
//     const weekAgo = new Date();
//     weekAgo.setDate(weekAgo.getDate() - 7);
//     const vendors = await Vendor.find({});

//     for (const vendor of vendors) {
//       const orders = await Order.find({
//         vendorId: mongoose.Types.ObjectId(vendor._id),
//         createdAt: { $gte: weekAgo },
//       });

//       let totalPrice = 0;
//       orders.forEach((order) => (totalPrice += order.price));

//       const newPayment = new Payment({
//         vendorId: vendor._id,
//         totalPrice,
//         date: new Date(),
//       });
//       await newPayment.save();
//     }
//   } catch (error) {
//     console.error(error);
//   }
// });


// second portion 

// const cron = require('node-cron');
// const mongoose = require('mongoose');
// const Order = require('../models/ordersModel');
// const {VendorDetails} = require('../models/vendorDetailsModel');
// const Payment = require('../models/vendor/vendorPaymentModel');

// cron.schedule('30 */2 * * * *', async function () { 
//   try {
//     // Get current date and subtract 2 minutes.
//     console.log("check it is run in 2 minute")
//     const twoMinutesAgo = new Date();
//     twoMinutesAgo.setMinutes(twoMinutesAgo.getMinutes() - 2);
    
//     const vendors = await VendorDetails.find({});

//     // console.log('is vendor', vendors)

//     for (const vendor of vendors) {


//       // const orders = await Order.aggregate([{
//       //   $match: {
//       //     vendor_id: mongoose.Types.ObjectId(vendor.userId),
//       //     createdAt: { $gte: twoMinutesAgo }
//       //   }
//       // },
//       // {
//       //   $group: {
//       //     _id: null,
//       //     totalPrice: { $sum: '$payment_details.total_amount' }
//       //   }
//       // }]);


//       // const orders = await Order.aggregate([{
//       //   $match: {
//       //     vendor_id: mongoose.Types.ObjectId(vendor.userId),
//       //     $expr: { // use $expr to compare expressions
//       //       $gte: [ // compare if the first expression is greater than or equal to the second expression
//       //         { $toDate: "$createdAt" }, // convert createdAt to a date type
//       //         twoMinutesAgo // use the variable defined earlier
//       //       ]
//       //     }
//       //   }
//       // },
//       // {
//       //   $group: {
//       //     _id: null,
//       //     totalPrice: { $sum: '$payment_details.total_amount' }
//       //   }
//       // }]);

//       const orders = await Order.aggregate([{
//         $match: {
//           createdAt: { $gte: twoMinutesAgo }
//         }
//       },
//       {
//         $group: {
//           _id: "$vendor_id", // group by vendor id
//           totalPrice: { $sum: '$payment_details.total_amount' }
//         }
//       }]);
      
//       console.log("order check", orders)
      



//       // console.log("order check", orders)

//       // Check if orders exist, otherwise total price is set to zero
//       const totalPrice = orders.length > 0 ? orders[0].totalPrice : 0;
//       // console.log("total price check", totalPrice)

//       if(totalPrice > 0){
//         console.log("came for post")
//         const newPayment = new Payment({
//           vendorId: vendor._id,
//           week_amount: totalPrice,
//           status:"pending",
//           // date: new Date()
//         });

//         await newPayment.save();
//       }
//     }

//   }catch (error) {
//     console.error("error message",error.message);
//   } 
// });

// step by step test 
// step by step test 
const cron = require('node-cron');
const mongoose = require('mongoose');
const Order = require('../models/ordersModel');
const Payment = require('../models/vendor/vendorPaymentModel');

cron.schedule('30 * * * * *', async function () { // changed from '30 */2 * * * *'
  try {
    // Get current date and subtract 1 minute.
    console.log("check it is run in 1 minute") // changed from "check it is run in 2 minute"
    const oneMinuteAgo = new Date(); // changed from twoMinutesAgo
    oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1); // changed from - 2
    
    // Aggregate orders by vendor id and sum up vendor prices
    const orders = await Order.aggregate([{
      $match: {
        createdAt: { $gte: oneMinuteAgo } // changed from twoMinutesAgo
      }
    },
    {
      $group: {
        _id: "$vendor_id", // group by vendor id
        totalPrice: { $sum: '$payment_details.vendor_price' } // sum up vendor prices
      }
    }]);
    
    console.log('order', orders)

    // Loop through the aggregated results and create a new payment document for each vendor id and total price
    for (const order of orders) {
      const newPayment = new Payment({
        vendor_id: order._id, // use the vendor id from the order
        week_amount: order.totalPrice, // use the total price from the order
        status:"pending",
      
      });

      await newPayment.save();
    }

  }catch (error) {
    console.error("error message",error.message);
    res.status(500).json({
      success:false,
      message:error.message
    })
  } 
});



// second portion 

// ...

// const cron = require('node-cron');
// const Vendor = require('./models/vendor'); // assuming you have a Vendor model

// cron.schedule('0 0 * * 0', async function () { // this is set to run every Sunday at 12:00 AM
//   try {
//     const weekAgo = new Date();
//     weekAgo.setDate(weekAgo.getDate() - 7);

//     // Assuming you have a Vendor model and want to run this for all vendors:
//     const vendors = await Vendor.find({});

//     for (const vendor of vendors) {
//       // Fetch vendor's orders from last 7 days
//       const orders = await Order.find({
//         vendorId: vendor._id,
//         createdAt: { $gte: weekAgo }
//       });

//       // Sum orders' price
//       let totalPrice = 0;
//       orders.forEach(order => totalPrice += order.price);

//       // Create a payment
//       const newPayment = new Payment({
//         vendorId: vendor._id,
//         totalPrice,
//         date: new Date()
//       });

//       // Save the payment
//       await newPayment.save();
//     }
//   } catch (error) {
//     console.error(error);
//   }
// });

// ...

// thard;

// const mongoose = require("mongoose");
// const express = require("express");
// const Order = require("./models/order");
// const Payment = require("./models/payment");
// const router = express.Router();

// router.post("/weeklyPayment/:vendorId", async (req, res) => {
//   const { vendorId } = req.params;
//   const weekAgo = new Date();
//   weekAgo.setDate(weekAgo.getDate() - 7);

//   // Fetch vendor's orders from last 7 days
//   const orders = await Order.find({
//     vendorId: mongoose.Types.ObjectId(vendorId), // assuming vendorId is an ObjectId
//     createdAt: { $gte: weekAgo },
//   });

//   // Sum orders' price
//   let totalPrice = 0;
//   orders.forEach((order) => (totalPrice += order.price));

//   // Create a payment
//   const newPayment = new Payment({
//     vendorId,
//     totalPrice,
//     date: new Date(),
//   });

//   // Save the payment
//   newPayment
//     .save()
//     .then(() =>
//       res.status(201).json({ message: "Payment created successfully" })
//     )
//     .catch((error) => res.status(400).json({ error }));
// });

// module.exports = router;
