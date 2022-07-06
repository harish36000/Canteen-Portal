const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "canteenportalmanagement@gmail.com",
        pass: "lftlecnjzjiglfic"
        // user: process.env.EMAIL || 'abc@gmail.com', 
        // pass: process.env.PASSWORD || '1234'
    }
});

// checking connection
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Mail server is running...");
  }
});

module.exports = transporter;