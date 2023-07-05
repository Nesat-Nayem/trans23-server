// const voiceResponse = require("twilio").twiml.VoiceResponse;
require("dotenv").config();

const sendtext = async (req, res) => {
  try {
    const number = req.body.number;
    const message = req.body.message;
    sendSms(number, message);

    // const r = new voiceResponse();
    // r.say("SMS SEND SUCCESS");
    // console.log(r);
    // res.send(r.toString());
    res.send({status:"sms send success"});

    function sendSms(number, message) {

    //   const accountSid = "AC17da2b8693b370e66aasdfasdff2ce1ff92617806";
    //   const authToken = "58c9152816f90cd68196aasdfasdf38c92d6e6c7";

      // const accountSid = process.env.SID;
      // const authToken = process.env.AUTH_TOKEN;
      // const client = require("twilio")(accountSid, authToken);

      return client.messages
        .create({
          body: message,
          from: "+17174838792",
          to: number,
        })
        .then()
        .catch(function (error) {
          if (error.code === 21614) {
            console.log(
              "Uh oh, looks like this caller can't receive SMS messages."
            );
          }
        })
        .done();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = sendtext;
