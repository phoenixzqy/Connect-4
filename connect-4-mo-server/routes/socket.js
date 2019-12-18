var express = require('express');
var router = express.Router();
var path = require('path');
const publicPath = path.join(__dirname, '../public');

/* GET text page. */
router.get('/room', function(req, res, next) {
	res.send("this should be a chat room");
});

module.exports = router;
