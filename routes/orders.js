var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var { Orders } = require('../models/orderModel');
var { Users } = require('../models/userModel');
var { Products } = require('../models/productModel');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
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
      Orders.getAllOrders()
        .then((orders) => {
          return res.status(200).json(orders);
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

router.get('/:id', (req, res) => {
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
      Orders.getOrdersbyID(id)
        .then((order) => {
          if (order.length == 0) {
            res.statusMessage = 'Order not found';
            return res.status(404).end();
          }
          return res.status(200).json(order);
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

router.get('/byUser/:user', async (req, res) => {
  let id = req.params.user;
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
        .then(async (user) => {
          console.log(user);
          Orders.getOrdersbyUser(user._id)
            .then((order) => {
              if (order.length == 0) {
                res.statusMessage = 'This user has no orders';
                return res.status(404).end();
              }
              return res.status(200).json(order);
            })
            .catch((err) => {
              res.statusMessage =
                'Something is wrong with the Database. Try again later.' +
                err.message;
              return res.status(500).end();
            });
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

router.post('/new', jsonParser, async function (req, res, next) {
  let { sessiontoken } = req.headers;
  let userid = req.body.user;
  let products = req.body.products;
  let id = uuid.v4();
  let status = 'new';
  let pids = [];
  let finalPrice = 0;

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
      if (products.length == 0) {
        res.statusMessage = 'Products are missing';
        return res.status(406).end();
      }
      Users.getUserbyid(userid)
        .then(async (user) => {
          if (user.length == 0) {
            res.statusMessage = 'User not found';
            return res.status(404).end();
          }

          for (let i = 0; i < products.length; i++) {
            await Products.getProductbyid(products[i])
              .then((p) => {
                pids.push(p._id);
                finalPrice += p.price;
                return p;
              })
              .catch((err) => {
                res.statusMessage =
                  'Something is wrong with the Database. Try again later.' +
                  err.message;
                return res.status(500).end();
              });
          }

          let newOrder = {
            id: id,
            status: status,
            user: user._id,
            products: pids,
            totalPrice: finalPrice,
          };
          Orders.createOrder(newOrder)
            .then((order) => {
              return res.status(201).json(order);
            })
            .catch((err) => {
              res.statusMessage =
                'Something is wrong with the Database - Try again later! ' +
                err.message;
              return res.status(500).end();
            });
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

router.patch('/:id', jsonParser, (req, res) => {
  let id = req.params.id;
  let status = req.body.status;
  let id2 = req.body.id;
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

      if (id !== id2) {
        res.statusMessage = 'Ids do not match';
        return res.status(406).end();
      }

      let params = {};

      if (status) {
        params['status'] = status;
      }

      Orders.updateOrder(id, params)
        .then((order) => {
          if (!order) {
            res.statusMessage = 'Order not found';
            return res.status(404).end();
          }
          return res.status(200).json(order);
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

module.exports = router;
