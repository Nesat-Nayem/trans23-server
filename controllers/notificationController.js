// var admin = require("firebase-admin")
// var fcm = require("fcm-notification")

// const Notification = require("../models/notificationModel")
// var serviceAccount = require("../config/trans-notification-key.json")

// const cerpath = admin.credential.cert(serviceAccount);
// var FCM = new fcm(cerpath)



// exports.sendPushNotifications = async (req, res, next) => {
//     try {
//         let message = {
//             notification: {
//                 title: req.body.title,
//                 body: req.body.message
//             },
//             data:{
//                 title: req.body.title,
//                 body: req.body.message
//             },
//             token: req.body.deviceToken
//         };

//         // Save the notification to the database
//         const notification = new Notification({
//             title: req.body.title,
//             message: req.body.message,
//             deviceToken: req.body.deviceToken,
//             phone:req.body.phone
//         });
//         await notification.save();

//         // Send the notification
//         FCM.send(message, function (err, resp) {
//             if (err) {
//                 return res.status(500).send({
//                     message: err
//                 });
//             } else {
//                 return res.status(200).send({
//                     message: "Done! Notification Send"
//                 })
//             }
//         })
//     } catch (err) {
//         throw err
//     }
// }


// exports.getNotifications = async (req, res, next) => {
//     try {
//         const phone = req.params.phone;
//         const page = parseInt(req.query.page) || 1; // Default to page 1 if query param not provided
//         const limit = parseInt(req.query.limit) || 10; // Default to 10 documents per page if query param not provided
//         const skip = (page - 1) * limit;
//         const count = await Notification.countDocuments({ phone: phone });
//         const notifications = await Notification.find({ phone: phone })
//                                                 .sort('-sentAt')
//                                                 .skip(skip)
//                                                 .limit(limit); // Filter by phone number, sort by descending order of sentAt, and apply pagination
//         const totalPages = Math.ceil(count / limit);

//         return res.status(200).send({
//             notifications,
//             page,
//             limit,
//             totalCount: count,
//             totalPages
//         });
//     } catch (err) {
//         throw err
//     }
// }

