var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

	req.flash('info','this is the req.flash')

  res.render('index', { message: req.flash('info')});
});

module.exports = router;