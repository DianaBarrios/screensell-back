const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
});

productSchema.index({name: 'text', type: 'text', model: 'text', description: 'text'});

const productsCollection = mongoose.model('products', productSchema);

const Products = {
  createProduct: function (newProduct) {
    return productsCollection
      .create(newProduct)
      .then((createdProduct) => {
        return createdProduct;
      })
      .catch((err) => {
        throw new Error(err);
      });
  },
  getAllProducts: function () {
    return productsCollection
      .find()
      .then((allProducts) => {
        return allProducts;
      })
      .catch((err) => {
        return err;
      });
  },
  getProductbyName: function (name) {
    return productsCollection
      .find({ name: `${name}` })
      .then((nameMatch) => {
        return nameMatch;
      })
      .catch((err) => {
        throw new Error(err);
      });
  },
  getProductsBySearchTerm: function (term) {
    return productsCollection
      .find({ $text: {$search: `"\"${term}\""`}})
      .then((nameMatch) => {
        return nameMatch;
      })
      .catch((err) => {
        throw new Error(err);
      });
  },
  getProductbyid: function (id) {
    return productsCollection
      .findOne({ id: `${id}` })
      .then((nameMatch) => {
        return nameMatch;
      })
      .catch((err) => {
        throw new Error(err);
      });
  },
  deleteProduct: function (id) {
    return productsCollection
      .deleteOne({ id: id })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        return err;
      });
  },
  updateProduct: function (id, params) {
    return productsCollection
      .findOneAndUpdate({ id: id }, { $set: params }, { new: true })
      .then((product) => {
        return product;
      })
      .catch((err) => {
        return err;
      });
  },
};

module.exports = { Products };
