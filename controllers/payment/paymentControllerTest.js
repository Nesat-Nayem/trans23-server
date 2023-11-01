const fetch = require("node-fetch");
const crypto = require("crypto");


// const paymenttestfun = async(req,res)=>{
//   const test = req.body.test;

//   const merchantId = test ? "TEST_MERCHANT_ID" : "YOUR_PROD_MERCHANT_ID";
//   const merchantKey = test ? "TEST_MERCHANT_KEY" : "YOUR_PROD_MERCHANT_KEY";

//   const data = {
//       merchantId: merchantId,
//       merchantTransactionId: req.body.transection_id,
//       merchantUserId: "testuser123",
//       amount: req.body.amount * 100,
//       redirectUrl: test
//           ? `http://localhost:3000/api/payment/response?test=${req.body.test}&transactionId=${req.body.transection_id}`
//           : `http://localhost:3000/api/payment/response?test=${req.body.test}&transactionId=${req.body.transection_id}`,
//       redirectMode: "POST",
//       callbackUrl: test
//           ? "http://localhost:3000/payment/response"
//           : "http://localhost:3000/api/payment/response",
//       mobileNumber: test ? "9090557095" : req.body.phone,
//       paymentInstrument: {
//           type: "PAY_PAGE",
//       },
//   };

//   const encoded_data = Buffer.from(JSON.stringify(data)).toString("base64");
//   const salt_key = merchantKey;
//   const salt_index = 1;
//   const string_encoded = encoded_data + "/pg/v1/pay" + salt_key;
//   const encoded_string = crypto
//       .createHash("sha256")
//       .update(string_encoded)
//       .digest("hex");
//   const final_xheader = encoded_string + "###" + salt_index;

//   try {
//       const response = await fetch(test 
//           ? "https://api-preprod.phonepe.com/apis/merchant-simulator/pg/v1/pay" 
//           : "https://api.phonepe.com/apis/hermes/pg/v1/pay", 
//           {
//               method: "POST",
//               body: JSON.stringify({ request: encoded_data }),
//               headers: {
//                   "X-VERIFY": final_xheader,
//                   "Content-Type": "application/json",
//               },
//           }
//       );

//       const responseData = await response.json();

//       if(responseData.data && responseData.data.instrumentResponse) {
//           const payment_url = responseData.data.instrumentResponse.redirectInfo.url;
//           res.json({
//               success: true,
//               redirect_url: payment_url,
//           });
//       } else {
//           throw new Error("Unexpected API response format");
//       }
//   } catch (error) {
//       console.error("An error occurred:", error.message);
//       res.status(500).json({
//           success: false,
//           message: "Payment initiation failed",
//           error: error.message
//       });
//   }


// }

const paymentmanagetest = async (req, res) => {
  const jayParsedAry = {
    merchantId: "MERCHANTUAT",
    merchantTransactionId: Math.floor(Math.random() * (999999 - 111111) + 111111),
    merchantUserId: "MUID" + Date.now(),
    amount: 1 * 100,
    redirectUrl: "prothomalo.com",
    redirectMode: "POST",
    mobileNumber: "9173847900",
    paymentInstrument: {
      type: "PAY_PAGE"
    }
  };

  const encode = JSON.stringify(jayParsedAry);
  const encoded = Buffer.from(encode).toString("base64");
  const key = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
  const key_index = 1;
  const string = encoded + "/pg/v1/pay" + key;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const final_x_header = sha256 + "###" + key_index;

  const url = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
  const headers = {
    "Content-Type": "application/json",
    accept: "application/json",
    "X-VERIFY": final_x_header
  };

  const data = JSON.stringify({ request: encoded });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: data
    });

    const responseData = await response.json();
    console.log(responseData)

    res.json({
      success: true,
      redirect_url: responseData,
    });
    
    // res.redirect(responseData.data.instrumentResponse.redirectInfo.url);
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).send("Error occurred.");
  }
};

module.exports = {
  paymentmanagetest
};
