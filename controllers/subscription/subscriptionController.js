const fetch = require("node-fetch");
const crypto = require("crypto");




const subscriptionManage = async (req, res) => {
  const test = req.body.test;

  const data = {
    merchantId: test ? "MERCHANTUAT" : process.env.MARCENT_ID,
    merchantTransactionId: req.body.transection_id,
    merchantUserId: "jlkjkoeirue",
    amount: req.body.amount * 100,
    redirectUrl: test
    //   ? `https://server.trans23.com/api/payment/response?test=${req.body.test}&transactionId=${req.body.transection_id}`
    //   : `https://server.trans23.com/api/payment/response?test=${req.body.test}&transactionId=${req.body.transection_id}`,
      ? `https://server.trans23.com/api/subscription/response?test=${req.body.test}&transactionId=${req.body.transection_id}`
      : `https://server.trans23.com/api/subscription/response?test=${req.body.test}&transactionId=${req.body.transection_id}`,
    redirectMode: "POST",
    callbackUrl: test
    //   ? "https://server.trans23.com/payment/response"
    //   : "https://server.trans23.com/api/payment/response",
      ? "https://server.trans23.com/api/subscription/response"
      : "https://server.trans23.com/api/subscription/response",
    mobileNumber: test ? "9021557095" : req.body.phone,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const encoded_data = Buffer.from(JSON.stringify(data)).toString("base64");
  const salt_key = test
    ? "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"
    : process.env.MARCENT_KEY;
  const salt_index = 1;
  const string_encoded = encoded_data + "/pg/v1/pay" + salt_key;
  const encoded_string = crypto
    .createHash("sha256")
    .update(string_encoded)
    .digest("hex");
  const final_xheader = encoded_string + "###" + salt_index;

  try {
    const response = await fetch(
      test
        ? "https://api-preprod.phonepe.com/apis/merchant-simulator/pg/v1/pay"
        : "https://api.phonepe.com/apis/hermes/pg/v1/pay",
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
};



const subscriptionresponse = async (req, res) => {
    console.log("payment", req.query);
  
    res.redirect(
      `http://localhost:3000/subscription?test=${req.query.test}&transactionId=${req.query.transactionId}`
    );
  };


// const subscriptionresponse = async (req, res) => {
//     console.log("it hit it");
  
//     res.redirect(
//       `http://localhost:3000/subscription`
//     );
//   };
  
  
  
  const subscriptioncheckStatus = async (req, res) => {
    console.log("checkStatus", req.query);
  
    const test = req.query.test == 'true';
  
    const transactionId = req.query.transactionId;
    console.log("check", test, transactionId);
  
    const merchantId = test ? "MERCHANTUAT" : process.env.MARCENT_ID;
  
    const apiUrl = test
      ? `https://api-preprod.phonepe.com/apis/merchant-simulator/pg/v1/status/${merchantId}/${transactionId}`
      : `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${transactionId}`;
  
    const salt_key = test
      ? "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"
      : process.env.MARCENT_KEY;
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
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": final_xheader,
          "X-MERCHANT-ID": merchantId,
        },
      });
  
      const responseData = await response.json();
  
      res.send(responseData);
    } catch (error) {
      console.error("An error occurred:", error.message);
      res.status(500).json({
        success: false,
        code: "PAYMENT_ERROR",
        message: `"Payment Failed", ${error.message} `,
      });
    }
  };
  

module.exports = {
    subscriptionManage,
    subscriptioncheckStatus,
    subscriptionresponse
}