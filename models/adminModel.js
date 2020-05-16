const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
SALT_WORK_FACTOR = 10;

const adminSchema = mongoose.Schema({
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
});

adminSchema.pre('save', function (next) {
  var admin = this;

  // only hash the password if it has been modified (or is new)
  if (!admin.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(admin.password, salt, function (err, hash) {
      if (err) return next(err);

      admin.password = hash;
      next();
    });
  });
});

adminSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const adminCollection = mongoose.model('admins', adminSchema);

const Admins = {
  createAdmin: function (newAdmin) {
    return adminCollection
      .create(newAdmin)
      .then((adminRes) => {
        return adminRes;
      })
      .catch((err) => {
        throw new Error(err);
      });
  },
  getAllAdmins: function () {
    return adminCollection
      .find()
      .then((allAdmins) => {
        return allAdmins;
      })
      .catch((err) => {
        return err;
      });
  },
  updateAdmin: function (id, params) {
    return adminCollection
      .findOneAndUpdate({ id: id }, { $set: params }, { new: true })
      .then((admin) => {
        return admin;
      })
      .catch((err) => {
        return err;
      });
  },
};

module.exports = { Admins, adminSchema };
