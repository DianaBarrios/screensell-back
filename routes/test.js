const bcrypt = require('bcrypt');
bcrypt.compare(
  'pinkkk',
  '$2b$10$2mbBwUVkVRtlQX/5mg8VlO/.koD020qBTxG6uwSyPcYa4vHqYf6ZK',
  function (err, isMatch) {
    if (err) {
      throw err;
    } else if (!isMatch) {
      console.log("Password doesn't match!");
    } else {
      console.log('Password matches!');
    }
  }
);
