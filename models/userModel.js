const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
SALT_WORK_FACTOR = 10;

const userSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  cellphone: {
    type: String,
    required: true,
  },
});
//save no funciona en update (?)
userSchema.pre('save', function (next) {
  var user = this;

  if (!user.isModified('password')) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const userCollection = mongoose.model('users', userSchema);

const Users = {
  createUser: function (newUser) {
    return userCollection
      .create(newUser)
      .then((user) => {
        return user;
      })
      .catch((err) => {
        throw new Error(err);
      });
  },
  getAllUsers: function () {
    return userCollection
      .find()
      .then((allUsers) => {
        return allUsers;
      })
      .catch((err) => {
        return err;
      });
  },
  getUserbyid: function (id) {
    return userCollection
      .findOne({ id: id })
      .then((nameMatch) => {
        return nameMatch;
      })
      .catch((err) => {
        throw new Error(err);
      });
  },
  updateUser: function (id, params) {
    return userCollection
      .findOneAndUpdate({ id: id }, { $set: params }, { new: true })
      .then((user) => {
        return user;
      })
      .catch((err) => {
        throw new Error(err);
      });
  },
};

module.exports = { Users, userSchema };
