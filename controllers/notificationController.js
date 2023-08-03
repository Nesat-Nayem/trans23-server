var admin = require("firebase-admin")
// var fcm = require("fcm-notification")


const Notification = require("../models/notificationModel")
var serviceAccount = require("../config/trans-notification-key.json")

// const cerpath = admin.credential.cert(serviceAccount);
// var FCM = new fcm(cerpath)

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

var FCM = admin.messaging()


const sendPushNotifications = async (req, res, next) => {
    try {
        let message = {
            notification: {
                title: req.body.title,
                body: req.body.message
            },
            // data:{
            //     title: req.body.title,
            //     body: req.body.message
            // },
            token: req.body.deviceToken
        };

        // Save the notification to the database
        // const notification = new Notification({
        //     title: req.body.title,
        //     message: req.body.message,
        //     deviceToken: req.body.deviceToken,
        //     phone:req.body.phone
        // });
        // await notification.save();




        // Send the notification
        // FCM.send(message, true, function (err, resp) {
        //     if (err) {
        //         return res.status(500).send({
        //             message: err.message
        //         });
        //     } else {
        //         return res.status(200).send({
        //             message: "Done! Notification Send"
        //         })
        //     }
        // })

          // Send a message
  FCM.send(message)
  .then((response) => {
    res.send('Successfully sent message: ', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
    res.status(500).json({
        success:false,
        message:error.message
    })
  });



    } catch (err) {
        // throw err

        res.status(500).json({
            success:false,
            message:err.message
        })
    }
}


// exports.sendPushNotifications = async (req, res, next) => {
//     try {
//         let message = {
//             notification: {
//                 title: req.body.title,
//                 body: req.body.message
//             },
//             // data:{
//             //     title: req.body.title,
//             //     body: req.body.message
//             // },
//             token: req.body.deviceToken
//         };

//         // Save the notification to the database
//         // const notification = new Notification({
//         //     title: req.body.title,
//         //     message: req.body.message,
//         //     deviceToken: req.body.deviceToken,
//         //     phone:req.body.phone
//         // });
//         // await notification.save();




//         // Send the notification
//         FCM.send(message, true, function (err, resp) {
//             if (err) {
//                 return res.status(500).send({
//                     message: err.message
//                 });
//             } else {
//                 return res.status(200).send({
//                     message: "Done! Notification Send"
//                 })
//             }
//         })

//           // Send a message
// //   FCM.send(message)
// //   .then((response) => {
// //     res.send('Successfully sent message: ', response);
// //   })
// //   .catch((error) => {
// //     console.log('Error sending message:', error);
// //   });



//     } catch (err) {
//         // throw err

//         res.status(500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }

const multiNotificationSend = async(req,res) =>{
    let registrationTokens = req.body.tokens;  
  let messageTitle = req.body.title;
  let messageBody = req.body.body;

  var message = {
    notification: {
      title: messageTitle,
      body: messageBody,
    },
    tokens: registrationTokens
  };

  // Send a message
  FCM.sendMulticast(message)
    .then((response) => {
    //   res.send('Successfully sent message: ', response);
    console.log('success', response)
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    // res.status(500).json({
    //     success:false,
    //     message:error.message
    // })
    });

}

const getNotifications = async (req, res, next) => {
    try {
        const phone = req.params.phone;
        const page = parseInt(req.query.page) || 1; // Default to page 1 if query param not provided
        const limit = parseInt(req.query.limit) || 10; // Default to 10 documents per page if query param not provided
        const skip = (page - 1) * limit;
        const count = await Notification.countDocuments({ phone: phone });
        const notifications = await Notification.find({ phone: phone })
                                                .select('-deviceToken')
                                                .sort('-sentAt')
                                                .skip(skip)
                                                .limit(limit); // Filter by phone number, sort by descending order of sentAt, and apply pagination
        const totalPages = Math.ceil(count / limit);

        return res.status(200).send({
            notifications,
            page,
            limit,
            totalCount: count,
            totalPages
        });
    } catch (err) {
        throw err
    }
}


module.exports = {multiNotificationSend, sendPushNotifications, getNotifications}