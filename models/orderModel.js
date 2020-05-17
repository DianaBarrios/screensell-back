const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'products',
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

const ordersCollection = mongoose.model('orders', orderSchema);

const Orders = {
  createOrder: function (newOrder) {
    return ordersCollection
      .create(newOrder)
      .then((order) => {
        return order;
      })
      .catch((err) => {
        throw new Error(err);
      });
  },
  getAllOrders: function () {
    return ordersCollection
      .find()
      .populate('user', ['firstName', 'lastName'])
      .then((allOrders) => {
        return allOrders;
      })
      .catch((err) => {
        return err;
      });
  },
  updateOrder: function (id, params) {
    return ordersCollection
      .findOneAndUpdate({ id: id }, { $set: params }, { new: true })
      .populate('user', ['firstName', 'lastName', 'id'])
      .then((order) => {
        return order;
      })
      .catch((err) => {
        return err;
      });
  },
  getOrdersbyUser: function (userid) {
    return ordersCollection
      .find({ user: userid })
      .populate('user', ['firstName', 'lastName', 'id'])
      .then((order) => {
        return order;
      })
      .catch((err) => {
        throw new Error(err);
      });
  },
  getOrdersbyID: function (id) {
    return ordersCollection
      .find({ id: id })
      .populate('user', ['firstName', 'lastName', 'id'])
      .then((order) => {
        return order;
      })
      .catch((err) => {
        throw new Error(err);
      });
  },
};

module.exports = { Orders };
