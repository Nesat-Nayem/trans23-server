// var admin = require("firebase-admin")
// // var fcm = require("fcm-notification")


// const Notification = require("../models/notificationModel")
// var serviceAccount = require("../config/trans-notification-key.json")

// // const cerpath = admin.credential.cert(serviceAccount);
// // var FCM = new fcm(cerpath)

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
//   });

// var FCM = admin.messaging()



// const multiNotificationSend = async(req,res) =>{
//     let registrationTokens = req.body.tokens;  
//   let messageTitle = req.body.title;
//   let messageBody = req.body.body;

//   var message = {
//     notification: {
//       title: messageTitle,
//       body: messageBody,
//     },
//     tokens: registrationTokens
//   };

//   // Send a message
//   FCM.sendMulticast(message)
//     .then((response) => {
//       res.send('Successfully sent message: ', response);
//     })
//     .catch((error) => {
//     //   console.log('Error sending message:', error);
//     res.status(500).json({
//         success:false,
//         message:error.message
//     })
//     });

// }



// module.exports = multiNotificationSend;