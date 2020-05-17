var express = require('express');
var router = express.Router();
const uuid = require('uuid');
const { Reviews } = require('../models/reviewModel');
const { Orders } = require('../models/orderModel');
const { Users } = require('../models/userModel');
const { Products } = require('../models/productModel');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.get('/', function (req, res, next) {
  console.log('Getting all products');
  Reviews.getAllReviews()
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
  let comment = req.body.comment;
  let productid = req.body.product;
  let userid = req.body.user;

  if (!comment) {
    res.statusMessage = 'One of these params is missing: comment';
    return res.status(406).end();
  }
  //http://localhost:9000/product/getid/16cb41da-5356-4a6b-9e90-74f839273e60
  Products.getProductbyid(productid)
    .then((product) => {
      if (product.length == 0) {
        res.statusMessage = 'Product not found';
        return res.status(404).end();
      }
      //http://localhost:9000/user/06d9f521-5480-4bbe-8e78-1c2fc230c0c2
      Users.getUserbyid(userid).then((user) => {
        if (user.length == 0) {
          res.statusMessage = 'User not found';
          return res.status(404).end();
        }
        console.log(product);
        console.log(user);

        const newReview = {
          id: id,
          comment: comment,
          user: user._id,
          product: product._id,
        };
        console.log(newReview);

        Reviews.createReview(newReview)
          .then((review) => {
            return res.status(201).json(review);
          })
          .catch((err) => {
            res.statusMessage =
              'Something is wrong with the Database - Try again later! ' +
              err.message;
            return res.status(500).end();
          });
      });
    })
    .catch((err) => {
      res.statusMessage =
        'Something is wrong with the Database. Try again later.' + err.message;
      return res.status(500).end();
    });
});

router.delete('/:id', function (req, res, next) {
  let id = req.params.id;

  Reviews.deleteReview(id)
    .then((result) => {
      if (result.deletedCount == 0) {
        res.statusMessage = 'The id was not found in the bookmarks list';
        return res.status(404).end();
      } else {
        return res.status(200).end();
      }
    })
    .catch((err) => {
      res.statusMessage = 'Something wrong with the Database';
      return res.status(500).end();
    });
});

module.exports = router;
