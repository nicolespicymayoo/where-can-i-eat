var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/api', function (req, res, next) {
  const key = process.env.KEY
  
  res.send('fetch api success')
});

module.exports = router;
