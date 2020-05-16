var express = require('express');
var router = express.Router();
const uuid = require('uuid');
const { Admins, adminSchema } = require('../models/adminModel');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.get('/', function (req, res, next) {
  console.log('Getting all admins');
  Admins.getAllAdmins()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      res.statusMessage =
        'Something is wrong with the Database. Try again later.';
      return res.status(500).end();
    });
});

router.post('/new', jsonParser, function (req, res, next) {
  let id = uuid.v4();
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let password = req.body.password;
  let passsword2 = req.body.password2;

  if (!firstName || !lastName || !email || !password || !passsword2) {
    res.statusMessage =
      'One of these params is missing: First Name, Last Name, email, or password';
    return res.status(406).end();
  }

  if (typeof firstName !== 'string') {
    res.statusMessage = 'First Name must be a string';
    return res.status(409).end();
  }
  if (typeof lastName !== 'string') {
    res.statusMessage = 'Last Name must be a string';
    return res.status(409).end();
  }
  if (typeof email !== 'string') {
    res.statusMessage = 'Email must be a string';
    return res.status(409).end();
  }
  if (typeof password !== 'string') {
    res.statusMessage = 'Password must be a number';
    return res.status(409).end();
  }
  if (password !== passsword2) {
    res.statusMessage = 'Passwords do not match';
    return res.status(406).end();
  }

  let newAdmin = {
    id: id,
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
  };

  Admins.createAdmin(newAdmin)
    .then((admin) => {
      return res.status(201).json(admin);
    })
    .catch((err) => {
      res.statusMessage =
        'Something is wrong with the Database - Try again later! ' +
        err.message;
      return res.status(500).end();
    });
});

module.exports = router;

// http://localhost:9000/admins/new - create
// http://localhost:9000/admins/ - get all admins
