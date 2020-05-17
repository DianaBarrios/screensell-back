const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  comment: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: true,
  },
});

const reviewsCollection = mongoose.model('reviews', reviewSchema);

const Reviews = {
  createReview: function (newReview) {
    return reviewsCollection
      .create(newReview)
      .then((review) => {
        console.log('si entra');
        return review;
      })
      .catch((err) => {
        throw new Error(err);
      });
  },
  getAllReviews: function () {
    return reviewsCollection
      .find()
      .populate('user', ['firstName', 'lastName', 'id'])
      .populate('product', ['name', 'price'])
      .then((allReviews) => {
        return allReviews;
      })
      .catch((err) => {
        return err;
      });
  },
  getReviewbyProduct: function (productID) {
    return reviewsCollection
      .find({ product: productID })
      .populate('user', ['firstName', 'lastName', 'id'])
      .populate('product', ['name', 'price'])
      .then((reviewMatch) => {
        return reviewMatch;
      })
      .catch((err) => {
        throw new Error(err);
      });
  },
  getReviewbyUser: function (user) {
    return reviewsCollection
      .find({ user: user })
      .populate('user', ['firstName', 'lastName', 'id'])
      .populate('product', ['name', 'price'])
      .then((reviewMatch) => {
        return reviewMatch;
      })
      .catch((err) => {
        throw new Error(err);
      });
  },
  deleteReview: function (id) {
    return reviewsCollection
      .deleteOne({ id: id })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        return err;
      });
  },
  updateReview: function (id, params) {
    return reviewsCollection
      .findOneAndUpdate({ id: id }, { $set: params }, { new: true })
      .populate('user', ['firstName', 'lastName', 'id'])
      .populate('product', ['name', 'price'])
      .then((review) => {
        return review;
      })
      .catch((err) => {
        return err;
      });
  },
};

module.exports = { Reviews };
