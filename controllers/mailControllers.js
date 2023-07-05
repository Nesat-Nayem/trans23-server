var dotenv = require("dotenv");

dotenv.config();

const nodemailer = require("nodemailer");
let pdf = require("html-pdf");
let path = require("path");
let ejs = require("ejs");

const user = {
  name: "nesat",
  message: "hello",
};

const mailSend = (req, res) => {
  try {
    ejs.renderFile(
      path.join(__dirname, "../views", "invoice.ejs"),
      {
        users: user,
      },
      (err, data) => {
        if (err) {
          res.send(err);
        } else {
          let options = {
            height: "11.25in",
            width: "8.5in",
            header: {
              height: "8mm",
            },
            footer: {
              height: "0mm",
            },
          };

          pdf
            .create(data, options)
            .toFile("invoince.pdf", function (err, data) {
              if (err) {
                res.send(err);
              } else {
                res.send("file create successfully");

                const nodemailer = require("nodemailer");

                let transporter = nodemailer.createTransport({
                  service: "gmail",
                  host: "smtp.gmail.com",
                  secure: false,
                  auth: {
                    user: process.env.SENDER_MAIL,
                    pass: process.env.SENDER_PASS,
                  },
                });

                let maildetails = {
                  // from:process.env.SENDER_MAIL,
                  from: "Trans23transportation@gmail.com",
                  to: req.body.userMail,
                  subject: "Hello Mr. " + req.body.name,
                  text: "Thanks Being Connect With Us   Regards Trans23",
                  // html:'<b>Thanks From Trans23</b>',
                  attachments: [
                    {
                      path: data.filename,
                    },
                  ],
                };

                transporter.sendMail(maildetails, function (err, data) {
                  if (err) {
                    console.log("error occerd", err);
                  } else {
                    console.log("send success");
                  }
                });

                // res.send('success')
                // console.log(info.messageId)
                // console.log('successfully send')
              }
            });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};


// const only text mail 

const textmail = (req, res) => {
  try {
    // create a transporter object with your gmail credentials
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      secure: false,
      auth: {
        user: process.env.SENDER_MAIL,
        pass: process.env.SENDER_PASS,
      },
    });

    // create a maildetails object with the text you want to send
    let maildetails = {
      from: "Trans23transportation@gmail.com",
      to: req.body.userMail,
      subject: `Your Trans23 OTP is here!`,
      text: req.body.text,
    };

    // send the mail using the transporter and the maildetails
    transporter.sendMail(maildetails, function (err, data) {
      if (err) {
        console.log("error occurred", err);
        res.send(err);
      } else {
        console.log("send success");
        res.send("mail sent successfully");
      }
    });
  } catch (error) {
    console.log(error);
  }
};



module.exports = {
  mailSend,
  textmail
};
