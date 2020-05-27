var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var { Users } = require('../models/userModel');
var { Products } = require('../models/productModel');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var bcrypt = require('bcrypt');
var jsonwebtoken = require('jsonwebtoken');

router.get('/', function (req, res, next) {
  console.log('Getting all users');
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
      Users.getAllUsers()
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

router.post('/login', jsonParser, function (req, res, next) {
  let { email, password } = req.body;
  if (!email || !password) {
    res.statusMessage = 'One of these params is missing: email or password';
    res.status(406).end();
  }

  Users.getUserByemail(email)
    .then((user) => {
      if (user) {
        bcrypt
          .compare(password, user.password)
          .then((result) => {
            if (result) {
              let userData = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                type: 'user',
                id: user.id,
                address: user.address,
                cellphone: user.cellphone,
              };
              jsonwebtoken.sign(
                userData,
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
        throw new Error("User doesn't exists!");
      }
    })
    .catch((err) => {
      res.statusMessage = err.message;
      return res.status(400).end();
    });
});
router.get('/validate', function (req, res, next) {
  const { sessiontoken } = req.headers;
  jsonwebtoken.verify(
    sessiontoken,
    process.env.SECRET_TOKEN,
    (err, decoded) => {
      if (err) {
        res.statusMessage = 'Session expired!' + err.message;
        return res.status(400).end();
      }

      return res.status(200).json(decoded);
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
      Users.getUserbyid(id)
        .then((result) => {
          if (result.length == 0) {
            res.statusMessage = 'User not found';
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

router.post('/new', jsonParser, function (req, res, next) {
  let id = uuid.v4();
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let password = req.body.password;
  let passsword2 = req.body.password2;
  let address = req.body.address;
  let cellphone = req.body.cellphone;
  let owns = [];

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

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      let newUser = {
        id: id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        address: address,
        cellphone: cellphone,
        owns: []
      };
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
    })
    .catch((err) => {
      res.statusMessage = err.message;
      return res.status(400).end();
    });
});

router.patch('/:id/owns', async (req, res) => {
  let id = req.params.id;
  let userid = req.body.id;
  let ownsP = [];
  let aux = req.body.owns;

  if (id != userid) {
    res.statusMessage = 'Ids do not match';
    return res.status(409).end();
  }

  let params = {};

  if (aux.length) {
    params['owns'] = aux;
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

router.patch('/:id', jsonParser, async (req, res) => {
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
    async (err, decoded) => {
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
        await bcrypt
          .hash(req.body.password, 10)
          .then((hashedPassword) => {
            params['password'] = hashedPassword;
          })
          .catch((err) => {
            res.statusMessage = err.message;
            return res.status(400).end();
          });
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
    }
  );
});
module.exports = router;

// http://localhost:9000/users/new - create
// http://localhost:9000/users/ - get all users
