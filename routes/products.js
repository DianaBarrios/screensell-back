var express = require('express');
var router = express.Router();
const uuid = require('uuid');
const { Products } = require('../models/productModel');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.get('/', function (req, res, next) {
  console.log('Getting all products');
  Products.getAllProducts()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      res.statusMessage =
        'Something is wrong with the Database. Try again later.';
      return res.status(500).end();
    });
});

router.get('/:name', (req, res) => {
  let name = req.params.name;

  Products.getProductbyName(name)
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
router.get('/getid/:id', (req, res) => {
  let id = req.params.id;
  Products.getProductbyid(id)
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
/* GET users listing. */
router.post('/new', jsonParser, function (req, res, next) {
  let id = uuid.v4();
  let name = req.body.name;
  let stock = req.body.stock;
  let type = req.body.type;
  let model = req.body.model;
  let description = req.body.description;
  let price = req.body.price;

  if (!name || !stock || !type || !model || !description || !price) {
    res.statusMessage =
      'One of these params is missing: name, stock, type, description, model or price';
    return res.status(406).end();
  }

  if (typeof name !== 'string') {
    res.statusMessage = 'Name must be a string';
    return res.status(409).end();
  }
  if (typeof stock !== 'number') {
    res.statusMessage = 'Stock must be a number';
    return res.status(409).end();
  }
  if (typeof type !== 'string') {
    res.statusMessage = 'Type must be a string';
    return res.status(409).end();
  }
  if (typeof model !== 'string') {
    res.statusMessage = 'Model must be a number';
    return res.status(409).end();
  }
  if (typeof description !== 'string') {
    res.statusMessage = 'Description must be a number';
    return res.status(409).end();
  }
  if (typeof price !== 'number') {
    res.statusMessage = 'Price must be a number';
    return res.status(409).end();
  }

  let newProduct = {
    id: id,
    name: name,
    stock: stock,
    type: type,
    model: model,
    description: description,
    price: price,
  };

  Products.createProduct(newProduct)
    .then((createdProduct) => {
      console.log(createdProduct);
      return res.status(201).json(createdProduct);
    })
    .catch((err) => {
      res.statusMessage =
        'Something is wrong with the Database - Try again later! ' +
        err.message;
      return res.status(500).end();
    });
});

router.delete('/:id', (req, res) => {
  let id = req.params.id;

  Products.deleteProduct(id)
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

  if (req.body.name) {
    params['name'] = req.body.name;
  }

  if (req.body.stock) {
    params['stock'] = req.body.stock;
  }

  if (req.body.type) {
    params['type'] = req.body.type;
  }

  if (req.body.model) {
    params['model'] = req.body.model;
  }

  if (req.body.description) {
    params['description'] = req.body.description;
  }

  if (req.body.price) {
    params['price'] = req.body.price;
  }

  Products.updateProduct(id, params)
    .then((result) => {
      if (!result) {
        res.statusMessage = 'That id was not found in the products list';
        return res.status(404).end();
      }
      return res.status(202).json(result);
    })
    .catch((err) => {
      res.statusMessage = 'Something wrong with the Database';
      return res.status(500).end();
    });
});
module.exports = router;