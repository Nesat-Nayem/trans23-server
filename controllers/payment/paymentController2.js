const Payment = require("../../models/payment/paymentModel");
// const axios = require('axios');
const fetch = require("node-fetch");
const crypto = require("crypto");

const paymentmanage = async (req, res) => {
  if (res.body.test) {
    const data = {
      merchantId: "MERCHANTUAT",
      merchantTransactionId: req.body.transection_id, // Replace with your own function to generate unique IDs
      merchantUserId: "MUID123",
      amount: req.body.amount * 100,
      redirectUrl: `http://transserver-env.eba-ieqecsf3.ap-south-1.elasticbeanstalk.com//api/payment/response?status=success&transactionId=${req.body.transection_id}`,
      redirectMode: "POST",
      callbackUrl:
        "http://transserver-env.eba-ieqecsf3.ap-south-1.elasticbeanstalk.com//api/payment/response",
      mobileNumber: "9021557095",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const encoded_data = Buffer.from(JSON.stringify(data)).toString("base64");
    const salt_key = process.env.MARCENT_KEY;
    const salt_index = 1;
    const string_encoded = encoded_data + "/pg/v1/pay" + salt_key;
    const encoded_string = crypto
      .createHash("sha256")
      .update(string_encoded)
      .digest("hex");
    const final_xheader = encoded_string + "###" + salt_index;
    try {
      const response = await fetch(
        "https://api-preprod.phonepe.com/apis/merchant-simulator/pg/v1/pay",
        {
          method: "POST",
          body: JSON.stringify({ request: encoded_data }),
          headers: {
            "X-VERIFY": final_xheader,
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = await response.json();
      const payment_url = responseData.data.instrumentResponse.redirectInfo.url;

      console.log(payment_url);

      // res.redirect(payment_url);

      res.json({
        success: true,
        redirect_url: payment_url,
      });
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).json({
        message: "Payment failed",
        success: false,
      });
    }
  } else {
    const data = {
      merchantId: process.env.MARCENT_ID,
      merchantTransactionId: req.body.transection_id, // Replace with your own function to generate unique IDs
      merchantUserId: "MUID123",
      amount: req.body.amount * 100,
      redirectUrl: `http://transserver-env.eba-ieqecsf3.ap-south-1.elasticbeanstalk.com//api/payment/response?status=success&transactionId=${req.body.transection_id}`,
      redirectMode: "POST",
      callbackUrl:
        "http://transserver-env.eba-ieqecsf3.ap-south-1.elasticbeanstalk.com//api/payment/response",
      mobileNumber: "9021557095",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const encoded_data = Buffer.from(JSON.stringify(data)).toString("base64");
    const salt_key = process.env.MARCENT_KEY;
    const salt_index = 1;
    const string_encoded = encoded_data + "/pg/v1/pay" + salt_key;
    const encoded_string = crypto
      .createHash("sha256")
      .update(string_encoded)
      .digest("hex");
    const final_xheader = encoded_string + "###" + salt_index;
    try {
      // const response = await axios.post('https://api.phonepe.com/apis/hermes/pg/v1/pay', { // Replace with actual production API URL
      //     request: encoded_data
      // }, {
      //     headers: {
      //         'X-VERIFY': final_xheader,
      //         'Content-Type': 'application/json'
      //     }
      // });

      // const payment_url = response.data.data.instrumentResponse.redirectInfo.url;

      const response = await fetch(
        "https://api.phonepe.com/apis/hermes/pg/v1/pay",
        {
          method: "POST",
          body: JSON.stringify({ request: encoded_data }),
          headers: {
            "X-VERIFY": final_xheader,
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = await response.json();
      const payment_url = responseData.data.instrumentResponse.redirectInfo.url;

      console.log(payment_url);

      // res.redirect(payment_url);

      res.json({
        success: true,
        redirect_url: payment_url,
      });
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).json({
        message: "Payment failed",
        success: false,
      });
    }
  }
};

const paymentresponse = async (req, res) => {
  const status = req.query.status;
  const transactionId = req.query.transactionId;
  console.log("check", status, transactionId);
  const merchantId = process.env.MARCENT_ID;
  const apiUrl = `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${transactionId}`;
  const salt_key = process.env.MARCENT_KEY;
  const salt_index = 1;
  const string_to_encode =
    `/pg/v1/status/${merchantId}/${transactionId}` + salt_key;
  const encoded_string = crypto
    .createHash("sha256")
    .update(string_to_encode)
    .digest("hex");
  const final_xheader = encoded_string + "###" + salt_index;
  console.log(final_xheader);

  try {
    // const response = await axios.get(apiUrl, {
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'X-VERIFY': final_xheader,
    //         'X-MERCHANT-ID': 'MERCHANTUAT'

    //     }
    // });

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": final_xheader,
        "X-MERCHANT-ID": "MERCHANTUAT",
      },
    });

    //   const responseData = await response.json();

    console.log(response.data);
    res.send(response.data);
  } catch (error) {
    console.error("An error occurred:", error.message);
    res.status(500).send("Payment failed on response");
  }
};

module.exports = {
  paymentmanage,
  paymentresponse,
};
