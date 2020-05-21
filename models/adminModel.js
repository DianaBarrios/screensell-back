const mongoose = require('mongoose');

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
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

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
  getAdminByemail: function (email) {
    return adminCollection
      .findOne({ email: email })
      .then((admin) => {
        return admin;
      })
      .catch((err) => {
        return err;
      });
  },
  getAdminById: function (id) {
    return adminCollection
      .findOne({ id: id })
      .then((admin) => {
        return admin;
      })
      .catch((err) => {
        return err;
      });
  },
};

module.exports = { Admins, adminSchema };
