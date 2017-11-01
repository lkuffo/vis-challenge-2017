const  express = require('express');
const  passport = require('passport');
const  Publicidad = require('../models/Publicidad');
var path = require('path');
var fs = require('fs');
var uid = require('uid2');
var mime = require('mime');
var TARGET_PATH = path.resolve(__dirname, '../uploads/');
var IMAGE_TYPES = ['image/jpeg', 'image/png'];
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    Publicidad.find( function(err, data){
        res.json(data);
    });
});

router.get('/:id', function(req, res, next) {
    Publicidad.findOne({id: req.params.id}, function(err, data){
        res.status(200).json(data);
    });
});


router.delete('/:id', function(req, res, next) {
    Publicidad.findOne({id: req.params.id}).remove().exec();
    res.status(200).json("Deleted Successfully")
});



module.exports = router;
