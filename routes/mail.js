const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
var express = require('express');
var router = express.Router();
dotenv.config();

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

router.post('/', (req, res) => {
  let to = req.body.to;
  let subject = req.body.subject;
  let text = req.body.text;

  let mailOptions = {
    from: `"Diana Barrios from screensell" ${process.env.EMAIL}`,
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      res.statusMessage = 'Algo pasó: ' + err.message;
      return res.status(400).end();
    } else {
      console.log(data);
    }
  });
  return res.status(201).json({ response: 'si funcionó wu' });
});

module.exports = router;
