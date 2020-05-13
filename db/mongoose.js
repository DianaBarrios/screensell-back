var mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

var mongoDB = process.env.MONGODB;
mongoose
  .connect(mongoDB, { useNewUrlParser: true })
  .then((r) => {
    console.log('Connected to db');
  })
  .catch((err) => {
    console.log('Error occured while connecting to db\n');
    console.log(err);
  });

mongoose.Promise = global.Promise;

module.exports = {
  mongoose,
};
