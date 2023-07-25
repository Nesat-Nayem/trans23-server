const cron = require("node-cron");
const mongoose = require("mongoose");
const Order = require("../models/ordersModel");
const Payment = require("../models/vendor/vendorPaymentModel");

cron.schedule("30 * * * * *", async function () {
  // changed from '30 */2 * * * *'
  try {
    // Get current date and subtract 1 minute.
    console.log("check it is run in 1 minute"); // changed from "check it is run in 2 minute"
    const oneMinuteAgo = new Date(); // changed from twoMinutesAgo
    oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1); // changed from - 2

    // Aggregate orders by vendor id and sum up vendor prices
    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: oneMinuteAgo }, // changed from twoMinutesAgo
        },
      },
      {
        $group: {
          _id: "$vendor_id", // group by vendor id
          totalPrice: { $sum: "$payment_details.vendor_price" }, // sum up vendor prices
        },
      },
    ]);

    console.log("order", orders);

    // Loop through the aggregated results and create a new payment document for each vendor id and total price
    for (const order of orders) {
      const newPayment = new Payment({
        vendor_id: order._id, // use the vendor id from the order
        week_amount: order.totalPrice, // use the total price from the order
        status: "pending",
      });

      await newPayment.save();
    }
  } catch (error) {
    console.error("error message", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
