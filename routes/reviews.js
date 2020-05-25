var express = require('express');
var uuid = require('uuid');
var bodyParser = require('body-parser');
var jsonwebtoken = require('jsonwebtoken');
var jsonParser = bodyParser.json();
var router = express.Router();
var { Reviews } = require('../models/reviewModel');
var { Orders } = require('../models/orderModel');
var { Users } = require('../models/userModel');
var { Products } = require('../models/productModel');

router.get('/', function (req, res, next) {
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

router.get('/byProduct/:product', function (req, res, next) {
  let productid = req.params.product;

  Products.getProductbyid(productid)
    .then((product) => {
      if (product.length == 0) {
        res.statusMessage = 'Product not found';
        return res.status(404).end();
      }
      Reviews.getReviewbyProduct(product)
        .then((result) => {
          return res.status(200).json(result);
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
        'Something is wrong with the Database. Try again later.' + err.message;
      return res.status(500).end();
    });
});

router.post('/new', jsonParser, function (req, res, next) {
  let id = uuid.v4();
  let comment = req.body.comment;
  let productid = req.body.product;
  let userid = req.body.user;
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

            const newReview = {
              id: id,
              comment: comment,
              user: user._id,
              product: product._id,
            };

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
            'Something is wrong with the Database. Try again later.' +
            err.message;
          return res.status(500).end();
        });
    }
  );
});

router.delete('/:id', function (req, res, next) {
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
    }
  );
});

module.exports = router;
