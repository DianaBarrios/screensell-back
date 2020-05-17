var express = require('express');
var router = express.Router();
const AWS = require('aws-sdk');
const bluebird = require('bluebird');
const multer = require('multer');

// configure the keys for accessing AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// configure AWS to work with promises
AWS.config.setPromisesDependency(bluebird);

// create S3 instance
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), function (req, res) {
  const file = req.file;

  const s3bucket = new AWS.S3();

  var params = {
    Bucket: process.env.S3_BUCKET,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  s3bucket.upload(params, function (err, data) {
    if (err) {
      res.status(500).json({ error: true, Message: err });
    } else {
      res.status(201).json({ data });
    }
  });
});

module.exports = router;
