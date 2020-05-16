var express = require('express');
var router = express.Router();
const uuid = require('uuid');
const { Users, userSchema } = require('../models/userModel');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const bcrypt = require('bcrypt');

router.get('/', function (req, res, next) {
  console.log('Getting all users');
  Users.getAllUsers()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      res.statusMessage =
        'Something is wrong with the Database. Try again later.';
      return res.status(500).end();
    });
});

router.get('/:id', function (req, res, next) {
  let id = req.params.id;

  Users.getUserbyid(id)
    .then((result) => {
      if (result.length == 0) {
        res.statusMessage = 'Product not found';
        return res.status(404).end();
      }
      return res.status(200).json(result);
    })
    .catch((err) => {
      res.statusMessage =
        'Something is wrong with the Database. Try again later.' + err.message;
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
  let address = req.body.address;
  let cellphone = req.body.cellphone;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !passsword2 ||
    !address ||
    !cellphone
  ) {
    res.statusMessage =
      'One of these params is missing: First Name, Last Name, email, password, address or cellphone';
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
  if (typeof address !== 'string') {
    res.statusMessage = 'Address must be a number';
    return res.status(409).end();
  }
  if (typeof cellphone != 'string') {
    res.statusMessage = 'Cellphone must be a number';
    return res.status(409).end();
  }
  if (password !== passsword2) {
    res.statusMessage = 'Passwords do not match';
    return res.status(406).end();
  }

  let newUser = {
    id: id,
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    address: address,
    cellphone: cellphone,
  };
  console.log(newUser);

  Users.createUser(newUser)
    .then((user) => {
      return res.status(201).json(user);
    })
    .catch((err) => {
      res.statusMessage =
        'Something is wrong with the Database - Try again later! ' +
        err.message;
      return res.status(500).end();
    });
});

router.patch('/:id', jsonParser, (req, res) => {
  let id = req.body.id;
  let idParam = req.params.id;

  if (!id) {
    res.statusMessage = 'No body was sent';
    return res.status(406).end();
  }

  if (id != idParam) {
    res.statusMessage = 'Ids do not match';
    return res.status(409).end();
  }
  let params = {};

  if (req.body.firstName) {
    params['firstName'] = req.body.firstName;
  }

  if (req.body.lastName) {
    params['lastName'] = req.body.lastName;
  }

  if (req.body.email) {
    params['email'] = req.body.email;
  }

  if (req.body.password) {
    params['password'] = req.body.password;
  }

  if (req.body.address) {
    params['address'] = req.body.address;
  }

  if (req.body.cellphone) {
    params['cellphone'] = req.body.cellphone;
  }

  Users.updateUser(id, params)
    .then((result) => {
      if (!result) {
        res.statusMessage = 'That id was not found in the users list';
        return res.status(404).end();
      }
      return res.status(202).json(result);
    })
    .catch((err) => {
      res.statusMessage = err.message;
      return res.status(500).end();
    });
});
module.exports = router;

// http://localhost:9000/users/new - create
// http://localhost:9000/users/ - get all users
