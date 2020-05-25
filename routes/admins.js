var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var { Admins, adminSchema } = require('../models/adminModel');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var bcrypt = require('bcrypt');
var jsonwebtoken = require('jsonwebtoken');

router.get('/', function (req, res, next) {
  const { sessiontoken } = req.headers;
  if (!sessiontoken) {
    res.statusMessage = 'Session token is missing';
    return res.status(400).end();
  }
  jsonwebtoken.verify(
    sessiontoken,
    process.env.SECRET_TOKEN,
    (err, decoded) => {
      if (err) {
        res.statusMessage = 'Session expired!';
        return res.status(400).end();
      }

      Admins.getAllAdmins()
        .then((result) => {
          return res.status(200).json(result);
        })
        .catch((err) => {
          res.statusMessage =
            'Something is wrong with the Database. Try again later.';
          return res.status(500).end();
        });
    }
  );
});

router.get('/:id', function (req, res, next) {
  let id = req.params.id;
  const { sessiontoken } = req.headers;
  if (!sessiontoken) {
    res.statusMessage = 'Session token is missing';
    return res.status(400).end();
  }
  jsonwebtoken.verify(
    sessiontoken,
    process.env.SECRET_TOKEN,
    (err, decoded) => {
      if (err) {
        res.statusMessage = 'Session expired!';
        return res.status(400).end();
      }

      Admins.getAdminById(id)
        .then((result) => {
          if (!result) {
            res.statusMessage = 'Admin not found';
            return res.status(404).end();
          }
          return res.status(200).json(result);
        })
        .catch((err) => {
          res.statusMessage =
            'Something is wrong with the Database. Try again later.' +
            err.message;
          return res.status(500).end();
        });
    }
  );
});

router.post('/login', jsonParser, function (req, res, next) {
  let { email, password } = req.body;
  if (!email || !password) {
    res.statusMessage = 'One of these params is missing: email or password';
    res.status(406).end();
  }

  Admins.getAdminByemail(email)
    .then((admin) => {
      if (admin) {
        bcrypt
          .compare(password, admin.password)
          .then((result) => {
            if (result) {
              let adminData = {
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                type: 'admin',
                id: admin.id,
              };
              jsonwebtoken.sign(
                adminData,
                process.env.SECRET_TOKEN,
                { expiresIn: '15m' },
                (err, token) => {
                  if (err) {
                    res.statusMessage =
                      'Something went wrong with generating the token.';
                    return res.status(400).end();
                  }
                  return res.status(200).json({ token });
                }
              );
            } else {
              throw new Error('Invalid credentials');
            }
          })
          .catch((err) => {
            res.statusMessage = err.message;
            return res.status(400).end();
          });
      } else {
        throw new Error("Admin doesn't exists!");
      }
    })
    .catch((err) => {
      res.statusMessage = err.message;
      return res.status(400).end();
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
    !cellphone ||
    !address
  ) {
    res.statusMessage =
      'One of these params is missing: First Name, Last Name, cellphone, address, email, or password';
    return res.status(406).end();
  }
  const { sessiontoken } = req.headers;
  if (!sessiontoken) {
    res.statusMessage = 'Session token is missing';
    return res.status(400).end();
  }
  jsonwebtoken.verify(
    sessiontoken,
    process.env.SECRET_TOKEN,
    (err, decoded) => {
      if (err) {
        res.statusMessage = 'Session expired!';
        return res.status(400).end();
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
      if (typeof cellphone !== 'string') {
        res.statusMessage = 'Cellphone must be a number';
        return res.status(409).end();
      }
      if (password !== passsword2) {
        res.statusMessage = 'Passwords do not match';
        return res.status(406).end();
      }

      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          let newAdmin = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
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
        })
        .catch((err) => {
          res.statusMessage = 'Something went wrong: ' + err.message;
          return res.status(400).end();
        });
    }
  );
});

router.patch('/:id', jsonParser, (req, res) => {
  let id = req.body.id;
  let idParam = req.params.id;
  const { sessiontoken } = req.headers;
  if (!sessiontoken) {
    res.statusMessage = 'Session token is missing';
    return res.status(400).end();
  }
  jsonwebtoken.verify(
    sessiontoken,
    process.env.SECRET_TOKEN,
    (err, decoded) => {
      if (err) {
        res.statusMessage = 'Session expired!';
        return res.status(400).end();
      }
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

      if (req.body.cellphone) {
        params['cellphone'] = req.body.cellphone;
      }

      if (req.body.address) {
        params['address'] = req.body.address;
      }

      Admins.updateAdmin(id, params)
        .then((result) => {
          if (!result) {
            res.statusMessage = 'That id was not found in the admins list';
            return res.status(404).end();
          }
          return res.status(202).json(result);
        })
        .catch((err) => {
          res.statusMessage = err.message;
          return res.status(500).end();
        });
    }
  );
});
module.exports = router;

// http://localhost:9000/admins/new - create
// http://localhost:9000/admins/ - get all admins
