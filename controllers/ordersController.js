const Orders = require("../models/ordersModel");
const { socketIO } = require("../app");
const mongoose = require("mongoose");
const fetch = require('node-fetch');
const { distance } = require("../util/distancefinder");
const { getCoordinatesFromPincode } = require("../util/geocode");
const VendorPayment = require("../models/vendor/vendorPaymentModel");
// const multiNotificationSend = require("./notificationMultipleController");
const { multiNotificationSend } = require("./notificationController");

const findFrancies = async (req, res) => {

  const { pincode } = req.body;

  console.log("pincode check", pincode)

  // location finder 

  const { lat, lng } = await getCoordinatesFromPincode(pincode)



  // Find nearest locations


  const franciesAccount = await mongoose.model('FranciesAccount').find({}, 'id username long lat');

  // francies account match nearest wise 

  const nearestLocations = franciesAccount
    .map((location) => {
      const { lat: locLat, long: locLong, id, username } = location;
      const dist = distance(lat, lng, locLat, locLong);
      return { id, username, lat: locLat, long: locLong, distance: dist };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);

  res.send(nearestLocations);

}

const nearestPincode = async (req, res) => {
  const { pincode } = req.params;

  console.log("came nearest pincode and and get pincode", pincode)
  try {
    const { lat, lng } = await getCoordinatesFromPincode(pincode)

    const franciesAccount = await mongoose.model('FranciesAccount').find({}, 'id username long lat');

    console.log("francies test", franciesAccount)

    // Find nearest locations
    const nearestLocations = franciesAccount
      .map(async (location) => {
        const { lat: locLat, long: locLong, id, username } = location;
        const dist = await distance(lat, lng, locLat, locLong);
        return { id, username, lat: locLat, long: locLong, distance: dist };
      });

    // Since map is now returning an array of promises, we need to await all of them
    const resolvedLocations = await Promise.all(nearestLocations);

    const sortedLocations = resolvedLocations
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);

    res.send(sortedLocations);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
}


const nearestfranciesforvendor = async (pincode) => {
  try {
    const { lat, lng } = await getCoordinatesFromPincode(pincode)

    const franciesAccount = await mongoose.model('FranciesAccount').find({}, '_id username long lat');

    // Find nearest locations
    const nearestLocations = franciesAccount
      .map(async (location) => {
        const { lat: locLat, long: locLong, _id, username } = location;
        const dist = await distance(lat, lng, locLat, locLong);
        return { _id, username, lat: locLat, long: locLong, distance: dist };
      });

    // Since map is now returning an array of promises, we need to await all of them
    const resolvedLocations = await Promise.all(nearestLocations);

    const sortedLocations = resolvedLocations
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);

    // return the sorted locations array
    return sortedLocations;
  } catch (error) {
    console.error("Server error:", error);
    throw error; // It's important to throw the error so that it can be caught in the pre save hook
  }
}


const updateOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const result = await Orders.findByIdAndUpdate(id, updateData);
    res.status(200).json({
      success: true,
      message: "Update Successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating document" });
  }
};


const statusAndOutstandingAmt = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const service = updateData.service;
    const status = updateData.status;
    // const message = updateData.message;

    if (service === "movers_packers" && status === "completed") {
      const result = await Orders.findById(id); // retrieve existing document from database
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Document not found",
        });
      }
      const paymentDetailsCopy = { ...result.payment_details }; // create a copy of the existing payment_details object
      paymentDetailsCopy.outstanding_amount = 0; // update only the outstanding_amount field
      result.payment_details = paymentDetailsCopy; // set the updated payment_details object in the result
      result.status = "completed";
      result.message = updateData.message;

      const updatedResult = await result.save(); // save the updated document
      res.status(200).json({
        success: true,
        message: "update status",
      });
    } else {
      const result = await Orders.findById(id); // retrieve existing document from database
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Document not found",
        });
      }
      result.payment_details = { ...result.payment_details, ...req.body }; // create a copy of the existing payment_details object and merge it with the req.body
      result.status = updateData.status;
      result.message = updateData.message;

      const updatedResult = await result.save(); // save the updated document
      res.status(200).json({
        success: true,
        message: "update status",
      });
    }
  } catch (error) {
    res.status(500).send("Error updating document");
  }
};




const postOrders = async (req, res) => {
  const { movers_packers, storage, courier, vehicle_transport } = req.body;
  let pincode;

  if (movers_packers) {
    pincode = movers_packers.from.pincode;
  } else if (storage) {
    pincode = storage.address.pincode;
  } else if (courier) {
    pincode = courier.from.pincode;
  } else if (vehicle_transport) {
    pincode = vehicle_transport.from.pincode;
  }

  // console.log(pincode);

  try {
    const { lat, lng } = await getCoordinatesFromPincode(pincode);
    // const franciesAccount = await mongoose.model('FranciesAccount').find({}, 'id username long lat');

    const vendorDetails = await mongoose.model('VendorDetails').find({}, 'long lat name userId device_token')



    const nearestLocations = await Promise.all(vendorDetails
      .map(async (location) => {
        const { lat: locLat, long: locLong, userId, name, device_token } = location;
        const dist = await distance(lat, lng, locLat, locLong);
        return { userId, name, device_token, lat: locLat, long: locLong, distance: dist };
      }))
      .then((locations) => locations.sort((a, b) => a.distance - b.distance))
      .then((sortedLocations) => sortedLocations.slice(0, 5));

    // const device_token = nearestLocations

    // console.log("vendor nearest object check", nearestLocations)

    const deviceTokenArray = nearestLocations.map(device => device.device_token);
    // console.log(deviceTokenArray);

    // notification send

    // Now call multiNotificationSend function with specific data
    const mockReq = {
      body: {
        tokens: deviceTokenArray,
        // tokens: ['token1', 'token2', 'token3'],
        title: 'New Order',
        body: 'Please Check Details And Accept Soon!',
      },
    };

    // const mockRes = {
    //   send: (message, data) => console.log("chck notification response",message, data),
    // };

    const notificationsend = await multiNotificationSend(mockReq);


    const order = new Orders({
      ...req.body,
      // vendor_id: nearestLocations[0].userId,
      vendor_id: null,
      francies_id: null,
    });

    const result = await order.save();

    // Send the response immediately after saving the order
    res.status(200).json({
      success: true,
      message: "Received order successfully",
    });



  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const accept_order = async (req, res) => {
  const { orderId, vendorId, franciesId } = req.body;

  try {

    const order = await Orders.findOneAndUpdate(
      { _id: orderId, vendor_id: { $eq: null } }, 
      { $set: { vendor_id: vendorId, status: "processing", francies_id:franciesId } },
      { new: true } // return updated document
    );

    if (!order) {
      return res.status(400).json({
        success: false,
        message: 'Already accepted plz check another one',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Accepted please proced this order form your order details page',
      // order,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// thard async order 

const reportOrders = async (req, res) => {
  try {
    const { startDate, endDate, service } = req.query;
    // console.log("check date", startDate, endDate);
    const query = {};

    if (startDate && endDate) { 
      query.createdAt = {
         $gte: new Date(startDate + "T00:00:00"),
          $lte: new Date(endDate + "T23:59:59"), 
        }; }
        
if (service) {
  query.service = service;
}

    const order = await Orders.find(query);
    res.json(order.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const cleanOrders = async (req, res) => {
  try {
    await Orders.deleteMany({});
    res.status(200).json({
      success: true,
      message: "Done Clean!",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    let query = {};
    const service = req.query.service;
    const type = req.query.type;
    const vendor_id = req.query.vendor_id;
    const status = req.query.status
    const pincode = req.query.pincode

    if (service) {
      query.service = service;
    }

    if (type) {
      query.type = type;
    }
    if (vendor_id) {
      query.vendor_id = vendor_id;
    }
    else if (pincode) {
      query["movers_packers.from.pincode"] = pincode
      query["vendor_id"] = { $eq: null };
    }
    if (status) {
      query.status = status
    }

    const services = await Orders.find(query);
    res.json(services.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// const getOrders = async (req, res) => {
//   try {
//     let query = {};
//     const service = req.query.service;
//     const type = req.query.type;
//     const vendor_id = req.query.vendor_id;
//     const status = req.query.status;
//     const pincode = req.query.pincode;

//     if (service) {
//       query.service = service;
//     }

//     if (type) {
//       query.type = type;
//     }
//     if (vendor_id) {
//       query.vendor_id = vendor_id;
//     }
//     else if (pincode) {
//       // filter by pincode and vendor_id null
//       query["movers_packers.from.pincode"] = pincode;
//       query["vendor_id"] = { $eq: null };
//     }
//     if(status){
//       query.status = status
//     }

//     const services = await Orders.find(query);
//     res.json(services.reverse());
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const getSingleOrder = async (req, res) => {
  try {
    const id = req.params._id
    const order = await Orders.findOne({ _id: id });
    if (!order) {
      return res.status(400).json({
        success: false,
        message: "order not folund"
      })
    }

    res.status(200).json({
      success: true,
      data: order
    })



  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


const getvendorbalance = async (req, res) => {
  try {
    let query = {};
    const vendor_id = req.query.vendor_id;
    const currentMonth = new Date().getMonth();

    if (vendor_id) {
      query.vendor_id = vendor_id;
    }


    // Fetch all orders for the vendor
    const orders = await Orders.find(query);
    // console.log("query test", query)
    const vendorpayment = await VendorPayment.find(query);
    // console.log('test vendor', vendorpayment)

    // console.log(orders)

    let transactions = [];
    let totalEarning = 0;
    let pendingEarning = 0;
    let monthlyEarning = 0;

    orders.forEach(order => {
      if (order.payment_details.type != null) {

        console.log("order data ")
        // Add total amount to totalEarning, amount to pendingEarning and if month is current month, add to monthlyEarning
        totalEarning += order.payment_details.total_amount;
        pendingEarning += order.payment_details.outstanding_amount;

        const orderMonth = new Date(order.createdAt).getMonth();
        if (orderMonth === currentMonth) {
          monthlyEarning += order.payment_details.total_amount;
        }
      }

      if (order?.transaction) {
        // Copy only transaction details of each order
        // transactions.push(order.transaction);

        transactions.push(...order.transaction);
      }
    })


    res.json({
      success: true,
      message: "Vendor earnings retrieved successfully",
      transactions: transactions,
      total_earning: totalEarning,
      pending_earning: pendingEarning,
      monthly_earning: monthlyEarning,
      // settlement:vendorpayment?.data
      settlement: vendorpayment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const userOrder = async (req, res) => {
  try {
    const phone_no = req.params.phone_no;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const service = req.query.service;
    const start = startDate
      ? new Date(startDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$1-$2"))
      : null;
    const end = endDate
      ? new Date(endDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$1-$2"))
      : null;

    const page = parseInt(req.query.page) || 1; // default page is 1
    const limit = parseInt(req.query.limit) || 10; // default limit is 10
    const startIndex = (page - 1) * limit;

    const query = { "user.phone_no": phone_no };
    if (start && end) {
      query.createdAt = { $gte: start, $lte: end };
    }
    if (service) {
      query.service = service;
    }

    const orders = await Orders.find(query).skip(startIndex).limit(limit);

    res.status(200).json({
      success: true,
      data: orders.reverse(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  nearestPincode,
  findFrancies,
  postOrders,
  nearestfranciesforvendor,
  getOrders,
  cleanOrders,
  userOrder,
  statusAndOutstandingAmt,
  updateOrder,
  getvendorbalance,
  reportOrders,
  getSingleOrder,
  accept_order
};
