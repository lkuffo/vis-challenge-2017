const  express = require('express');
const  passport = require('passport');
const  router = express.Router();

router.get('/:id', function(req, res, next){
    var img = req.params.id;
    res.render('imagen', { img: img });
  });

module.exports = router;
