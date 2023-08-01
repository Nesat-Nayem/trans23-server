// respones 


// const express = require('express');
// const app = express();

// app.use(express.json()); // for parsing application/json

// app.post('/api/user-response', (req, res) => {
//   const userResponse = req.body; // your data will be in req.body
//   console.log(userResponse);
  
//   // assuming 'order' contains orderID and decision(accepted/rejected)
//   // you would then store this data in your database (or wherever you need it saved) 

//   //Send a response back to the client
//   res.status(200).send({ status: 'Success', message: 'Response received' });
// });

// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Server listening on port ${port}`));




// notification send 


// const admin = require('firebase-admin');
// const express = require('express');
// const app = express();

// // Load the service account key JSON file
// let serviceAccount = require('path/to/serviceAccountKey.json');

// // Initialize the Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// // Get the Messaging service
// let fcm = admin.messaging();

// app.post('/send-notification', (req, res) => {
//   let registrationToken = req.body.token;  // Retrieve this from your database
//   let messageTitle = req.body.title;
//   let messageBody = req.body.body;

//   var message = {
//     notification: {
//       title: messageTitle,
//       body: messageBody,
//     },
//     token: registrationToken
//   };

//   // Send a message
//   fcm.send(message)
//     .then((response) => {
//       res.send('Successfully sent message: ', response);
//     })
//     .catch((error) => {
//       console.log('Error sending message:', error);
//     });
// });

// app.listen(3000, () => {
//   console.log('Server is listening on port 3000');
// });



// multiple message send 


const admin = require('firebase-admin');
const express = require('express');
const app = express();

// Load the service account key JSON file
let serviceAccount = require('path/to/serviceAccountKey.json');

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get the Messaging service
let fcm = admin.messaging();

app.post('/send-notification', (req, res) => {
  let registrationTokens = req.body.tokens;  // Retrieve this from your database
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
  fcm.sendMulticast(message)
    .then((response) => {
      res.send('Successfully sent message: ', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });

});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
