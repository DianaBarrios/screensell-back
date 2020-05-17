var express = require('express');
var router = express.Router();
const uuid = require('uuid');
const { Orders } = require('../models/orderModel');
const { Users } = require('../models/userModel');
const { Products } = require('../models/productModel');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.get('/', function (req, res, next) {
  console.log('Getting all orders');
  Orders.getAllOrders()
    .then((orders) => {
      return res.status(200).json(orders);
    })
    .catch((err) => {
      res.statusMessage =
        'Something is wrong with the Database. Try again later.' + err.message;
      return res.status(500).end();
    });
});

router.get('/:id', (req, res) => {
  let id = req.params.id;

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
        'Something is wrong with the Database. Try again later.' + err.message;
      return res.status(500).end();
    });
});

router.get('/byUser/:user', (req, res) => {
  let id = req.params.user;

  Orders.getOrdersbyUser(id)
    .then((order) => {
      if (order.length == 0) {
        res.statusMessage = 'This user has no orders';
        return res.status(404).end();
      }
      return res.status(200).json(order);
    })
    .catch((err) => {
      res.statusMessage =
        'Something is wrong with the Database. Try again later.' + err.message;
      return res.status(500).end();
    });
});

router.post('/new', jsonParser, async function (req, res, next) {
  let id = uuid.v4();
  let status = 'new';
  let userid = req.body.user;
  let products = req.body.products;
  let pids = [];
  let finalPrice = 0;

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
        'Something is wrong with the Database. Try again later.' + err.message;
      return res.status(500).end();
    });
});

router.patch('/:id', jsonParser, (req, res) => {
  let id = req.params.id;
  let status = req.body.status;
  let id2 = req.body.id;

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
        'Something is wrong with the Database. Try again later.' + err.message;
      return res.status(500).end();
    });
});

module.exports = router;
