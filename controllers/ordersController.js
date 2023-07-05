const Orders = require("../models/ordersModel");
const { socketIO } = require("../app");
const mongoose = require("mongoose");
const fetch = require('node-fetch');
const { distance } = require("../util/distancefinder");
const { getCoordinatesFromPincode } = require("../util/geocode");


// Dummy data
// const locations = [
//   {
//     name: 'Vashi Virar',
//     lat: 19.410150134588743,
//     lng: 72.83502755749166,
//   },
//   {
//     name: 'Palgahar',
//     lat: 19.715566530751584,
//     lng: 72.74360706490583,
//   },
//   {
//     name: 'Manor',
//     lat: 19.744902924391717,
//     lng: 72.94306995782036,
//   },
//   {
//     name: 'Wada',
//     lat: 19.66274745955763,
//     lng: 73.13422189686342,
//   },
//   {
//     name: 'LagutPure',
//     lat: 19.715566530751584,
//     lng: 73.56223602124247,
//   },
// ];

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


// const nearestfranciesforvendor = async (pincode) => {
//   try {
//     const { lat, lng } = await getCoordinatesFromPincode(pincode)

//     const franciesAccount = await mongoose.model('FranciesAccount').find({}, 'id username long lat');

//     console.log("francies test", franciesAccount)

//     // Find nearest locations
//     const nearestLocations = franciesAccount
//       .map(async (location) => {
//         const { lat: locLat, long: locLong, id, username } = location;
//         const dist = await distance(lat, lng, locLat, locLong);
//         return { id, username, lat: locLat, long: locLong, distance: dist };
//       });

//     // Since map is now returning an array of promises, we need to await all of them
//     const resolvedLocations = await Promise.all(nearestLocations);

//     const sortedLocations = resolvedLocations
//       .sort((a, b) => a.distance - b.distance)
//       .slice(0, 5);

//     // return the sorted locations array
//     return sortedLocations;
//     Copy
//   } catch (error) { console.error("Server error:", error) }
// }

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


// const postOrders = async (req, res) => {

//   const { movers_packers, storage, courier, vehicle_transport } = req.body;
//   let pincode;

//   if (movers_packers) {
//     pincode = movers_packers.from.pincode;
//   } else if (storage) {
//     pincode = storage.address.pincode;
//   } else if (courier) {
//     pincode = courier.from.pincode;
//   }
//   else if (vehicle_transport) {
//     pincode = vehicle_transport.from.pincode;
//   }

//   // console.log(pincode);


//   try {
//     const { lat, lng } = await getCoordinatesFromPincode(pincode);
//     const franciesAccount = await mongoose.model('FranciesAccount').find({}, 'id username long lat');

//     const nearestLocations = franciesAccount
//       .map((location) => {
//         const { lat: locLat, long: locLong, id, username } = location;
//         const dist = distance(lat, lng, locLat, locLong);
//         return { id, username, lat: locLat, long: locLong, distance: dist };
//       })
//       .sort((a, b) => a.distance - b.distance)
//       .slice(0, 5);


//     async function sendNotificationToFranchise(index, orderId, orderDetails) {
//       return new Promise(async (resolve) => {
//         if (index >= nearestLocations.length) {
//           resolve(null);
//           return;
//         }

//         // Check if the order's francies_id has been set
//         const updatedOrder = await Orders.findById(orderId);
//         if (updatedOrder.francies_id) {
//           resolve(null);
//           return;
//         }

//         const franchise = nearestLocations[index];
//         socketIO.emit("hello", {
//           id: orderId,
//           heading: "Placed a Service Order",
//           message: `${orderDetails.user.name} Take An ${orderDetails.type} Service. ${orderDetails.user.name} Contract Number ${orderDetails.user.phone_no}`,
//           createat: orderDetails.createdAt,
//           service: `${orderDetails.type}`,
//           franchiseId: franchise.id,
//         });

//         socketIO.on("connection", (socket) => {
//           socket.on(`response-${franchise.id}`, async (data) => {
//             if (data.accepted) {
//               resolve(franchise.id);
//             } else {
//               resolve(await sendNotificationToFranchise(index + 1, orderId, orderDetails));
//             }
//           });
//         });

//         setTimeout(async () => {
//           resolve(await sendNotificationToFranchise(index + 1, orderId, orderDetails));
//         }, 10000);
//       });
//     }


//     const order = new Orders({
//       ...req.body,
//       francies_id: null,
//     });

//     const result = await order.save();

//     // Send the response immediately after saving the order
//     res.status(200).json({
//       success: true,
//       message: "Received successfully",
//     });

//     const selectedFranchiseId = await sendNotificationToFranchise(0, result._id, result);

//     result.francies_id = selectedFranchiseId || '645b80b977d8de19e8da1cb1';
//     await result.save();
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// testing post order 





// async order 


// // Create a queue with a concurrency of 1
// const orderQueue = async.queue(async (task, callback) => {
//   const { orderId, orderDetails } = task;
//   const selectedFranchiseId = await sendNotificationToFranchise(0, orderId, orderDetails);
//   const updatedOrder = await Orders.findById(orderId);
//   updatedOrder.francies_id = selectedFranchiseId || '645b80b977d8de19e8da1cb1';
//   await updatedOrder.save();
//   callback();
// }, 1);

// // Define a callback function for console.log
// function logOutput(error, output) {
//   if (error) {
//     console.error(error.message);
//   } else {
//     console.log(output);
//   }
// }


// const postOrders = async (req, res) => {
//   const { movers_packers, storage, courier, vehicle_transport } = req.body;
//   let pincode;

//   if (movers_packers) {
//     pincode = movers_packers.from.pincode;
//   } else if (storage) {
//     pincode = storage.address.pincode;
//   } else if (courier) {
//     pincode = courier.from.pincode;
//   } else if (vehicle_transport) {
//     pincode = vehicle_transport.from.pincode;
//   }

//   console.log(pincode);

//   try {
//     const { lat, lng } = await getCoordinatesFromPincode(pincode);
//     const franciesAccount = await mongoose.model('FranciesAccount').find({}, 'id username long lat');

//     const nearestLocations = franciesAccount
//       .map((location) => {
//         const { lat: locLat, long: locLong, id, username } = location;
//         const dist = distance(lat, lng, locLat, locLong);
//         return { id, username, lat: locLat, long: locLong, distance: dist };
//       })
//       .sort((a, b) => a.distance - b.distance)
//       .slice(0, 5);

//     async function sendNotificationToFranchise(index, orderId, orderDetails) {

//       console.log("is it call", logOutput);
//       return new Promise(async (resolve) => {
//         if (index >= nearestLocations.length) {
//           resolve(null);
//           return;
//         }

//         // Check if the order's francies_id has been set
//         const updatedOrder = await Orders.findById(orderId);
//         if (updatedOrder.francies_id) {
//           resolve(null);
//           return;
//         }

//         const franchise = nearestLocations[index];
//         socketIO.emit("hello", {
//           id: orderId,
//           heading: "Placed a Service Order",
//           message: `${orderDetails.user.name} Take An ${orderDetails.type} Service. ${orderDetails.user.name} Contract Number ${orderDetails.user.phone_no}`,
//           createat: orderDetails.createdAt,
//           service: `${orderDetails.type}`,
//           franchiseId: franchise.id,
//         });

//         socketIO.on("connection", (socket) => {
//           socket.on(`response-${franchise.id}`, async (data) => {
//             if (data.accepted) {
//               resolve(franchise.id);
//             } else {
//               resolve(await sendNotificationToFranchise(index + 1, orderId, orderDetails));
//             }
//           });
//         });

//         setTimeout(async () => {
//           resolve(await sendNotificationToFranchise(index + 1, orderId, orderDetails));
//         }, 10000);
//       });
//     }

//     const order = new Orders({
//       ...req.body,
//       francies_id: null,
//     });

//     const result = await order.save();

//     // Send the response immediately after saving the order
//     res.status(200).json({
//       success: true,
//       message: "Received successfully",
//     });

//     // Add the order to the queue for processing
//     orderQueue.push({ orderId: result._id, orderDetails: result });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// async order 

// thard async order 
// Import multiprocessing module
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

  console.log(pincode);

  try {
    const { lat, lng } = await getCoordinatesFromPincode(pincode);
    // const franciesAccount = await mongoose.model('FranciesAccount').find({}, 'id username long lat');

    const vendorDetails = await mongoose.model('VendorDetails').find({}, 'long lat name userId')

   

    const nearestLocations = await Promise.all(vendorDetails
      .map(async (location) => {
        const { lat: locLat, long: locLong, userId, name } = location;
        const dist = await distance(lat, lng, locLat, locLong);
        return { userId, name, lat: locLat, long: locLong, distance: dist };
      }))
      .then((locations) => locations.sort((a, b) => a.distance - b.distance))
      .then((sortedLocations) => sortedLocations.slice(0, 5));

    console.log("vendor nearest", nearestLocations)

    // Add an object to store the status
    // const orderStatus = {};

    // async function sendNotificationToFranchise(index, orderId, orderDetails) {
    //   return new Promise(async (resolve) => {
    //     if (index >= nearestLocations.length) {
    //       resolve(null);
    //       return;
    //     }

    //     // Check if the order's francies_id has been set
    //     if (orderStatus[orderId]) {
    //       resolve(null);
    //       return;
    //     }

    //     const franchise = nearestLocations[index];
    //     socketIO.emit("hello", {
    //       id: orderId,
    //       heading: "Placed a Service Order",
    //       message: `${orderDetails.user.name} Take An ${orderDetails.type} Service. ${orderDetails.user.name} Contract Number ${orderDetails.user.phone_no}`,
    //       createat: orderDetails.createdAt,
    //       service: `${orderDetails.type}`,
    //       franchiseId: franchise.id,
    //     });

    //     socketIO.on("connection", (socket) => {
    //       socket.on(`response-${franchise.id}`, async (data) => {
    //         if (data.accepted) {
    //           // Update the order status
    //           orderStatus[orderId] = true;
    //           resolve(franchise.id);
    //         } else {
    //           resolve(await sendNotificationToFranchise(index + 1, orderId, orderDetails));
    //         }
    //       });
    //     });

    //     setTimeout(async () => {
    //       resolve(await sendNotificationToFranchise(index + 1, orderId, orderDetails));
    //     }, 10000);
    //   });
    // }

    const order = new Orders({
      ...req.body,
      vendor_id: nearestLocations[0].userId,
      // francies_id: '645b80b977d8de19e8da1cb1',
    });

    const result = await order.save();

    // Send the response immediately after saving the order
    res.status(200).json({
      success: true,
      message: "Received order successfully",
    });

    // Initialize the order status for the new order
    // orderStatus[result._id] = false;

    // const selectedFranchiseId = await sendNotificationToFranchise(0, result._id, result);
    // console.log("outer consition ", selectedFranchiseId)

    // Update the order with the selected franchise ID
    // if (orderStatus[result._id]) {
    //   result.francies_id = selectedFranchiseId || '645b80b977d8de19e8da1cb1';
    //   await result.save();
    // }
    // if (orderStatus[result._id]) {
    //   console.log("enner consition ", selectedFranchiseId)
    //   result.francies_id = selectedFranchiseId !== null ? selectedFranchiseId : '645b80b977d8de19e8da1cb1';
    //   await result.save();
    // }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// thard async order 

const reportOrders = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    console.log("check date", startDate, endDate);
    const query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
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

    if (service) {
      query.service = service;
    }

    if (type) {
      query.type = type;
    }
    if (vendor_id) {
      query.vendor_id = vendor_id;
    }

    const services = await Orders.find(query);
    res.json(services.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getvendorbalance = async (req, res) => {
  try {
    let query = {};
    const type = req.query.type;
    const vendor_id = req.query.vendor_id;

   

    if (type) {
      query.type = type;
    }
    if (vendor_id) {
      query.vendor_id = vendor_id;
    }

    // const services = await Orders.find(query);
    res.json({
      "Amount":0,
      "Pending Amount":0
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
  reportOrders
};
