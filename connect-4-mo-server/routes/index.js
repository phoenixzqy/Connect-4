var express = require('express');
var router = express.Router();
var path = require('path');
const publicPath = path.join(__dirname, '../public');

/* GET text page. */
router.get('/test', function(req, res, next) {
  res.sendFile(path.join(publicPath,'/index.html'));
});

module.exports = router;
