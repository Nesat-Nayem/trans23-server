const Payment = require("../../models/payment/paymentModel")
const fetch = require('node-fetch');
const crypto = require('crypto');

const paymentmanage = async (req, res) => {
    const test = req.body.test;
    const data = {
        // merchantId: process.env.MARCENT_ID,
        merchantId: test ? 'MERCHANTUAT' : process.env.MARCENT_ID,
        merchantTransactionId: req.body.transection_id, // Replace with your own function to generate unique IDs
        merchantUserId: 'jlkjkoeirue',
        amount: req.body.amount * 100,
        redirectUrl: test ? `http://transserver-env.eba-ieqecsf3.ap-south-1.elasticbeanstalk.com/api/payment/response?test=${req.body.test}&transactionId=${req.body.transection_id}` : `http://transserver-env.eba-ieqecsf3.ap-south-1.elasticbeanstalk.com/api/payment/response?test=${req.body.test}&transactionId=${req.body.transection_id}`,
        redirectMode: 'GET',
        callbackUrl: test ? 'http://transserver-env.eba-ieqecsf3.ap-south-1.elasticbeanstalk.com/payment/response'
            : 'http://transserver-env.eba-ieqecsf3.ap-south-1.elasticbeanstalk.com/api/payment/response',
        mobileNumber: '9021557095',
        paymentInstrument: {
            type: 'PAY_PAGE'
        }
    };

    const encoded_data = Buffer.from(JSON.stringify(data)).toString('base64');
    // const salt_key = process.env.MARCENT_KEY;
    const salt_key = test ? '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399' : process.env.MARCENT_KEY;
    const salt_index = 1;
    const string_encoded = encoded_data + '/pg/v1/pay' + salt_key;
    const encoded_string = crypto.createHash('sha256').update(string_encoded).digest('hex');
    const final_xheader = encoded_string + '###' + salt_index;
    try {



        // const response = await fetch('https://api.phonepe.com/apis/hermes/pg/v1/pay', {
        const response = await fetch(test ? 'https://api-preprod.phonepe.com/apis/merchant-simulator/pg/v1/pay' : 'https://api.phonepe.com/apis/hermes/pg/v1/pay', {
            method: 'POST',
            body: JSON.stringify({ request: encoded_data }),
            headers: {
                'X-VERIFY': final_xheader,
                'Content-Type': 'application/json'
            }
        });

        const responseData = await response.json();
        const payment_url = responseData.data.instrumentResponse.redirectInfo.url;

        console.log(payment_url)


        res.json({
            success: true,
            redirect_url: payment_url
        })

            // Refresh the page after the redirect
    // res.setHeader('Refresh', '0');

    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({
            message: 'Payment failed',
            success: false
        });
    }


}



const paymentresponse = async (req, res) => {
    console.log("payment",req.query);

    res.redirect(`http://transserver-env.eba-ieqecsf3.ap-south-1.elasticbeanstalk.com/api/payment/check-status?test=${req.query.test}&transactionId=${req.query.transactionId}`)
}


const checkStatus = async (req, res) => {
    console.log("checkStatus",req.query);


    const test = req.query.test;

    const transactionId = req.query.transactionId;
    console.log("check", test, transactionId)

    const merchantId = test ? 'MERCHANTUAT' : process.env.MARCENT_ID;
    // const merchantId = process.env.MARCENT_ID;
    // const apiUrl = `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${transactionId}`;
    const apiUrl = test ? `https://api-preprod.phonepe.com/apis/merchant-simulator/pg/v1/status/${merchantId}/${transactionId}` : `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${transactionId}`;
    // const salt_key = process.env.MARCENT_KEY;
    const salt_key = test ? '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399' : process.env.MARCENT_KEY;
    const salt_index = 1;
    const string_to_encode = `/pg/v1/status/${merchantId}/${transactionId}` + salt_key;
    const encoded_string = crypto.createHash('sha256').update(string_to_encode).digest('hex');
    const final_xheader = encoded_string + '###' + salt_index;
    console.log(final_xheader);

    try {

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': final_xheader,
                'X-MERCHANT-ID': 'MERCHANTUAT'
            }
        });


        // console.log(response.data);
        // res.send(response.data);

        const responseData = await response.json(); // Get the JSON data from the response

        // console.log(responseData); // Log the JSON data
        res.send(responseData);
    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).send('Payment failed on response');
    }
}


module.exports = {
    paymentmanage,
    paymentresponse,
    checkStatus
}