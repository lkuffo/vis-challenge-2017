const  express = require('express');
const  passport = require('passport');
const  User = require('../models/User');
var path = require('path');
var fs = require('fs');
var uid = require('uid2');
var mime = require('mime');
var router = express.Router();


router.get('/', function(req, res, next) {
    User.find( function(err, data){
        res.json(data);
    });
});

router.get('/:correo', function(req, res, next) {
    User.findOne({correo: req.params.correo}, function(err, data){
        res.status(200).json(data);
    });
});


router.delete('/:correo', function(req, res, next) {
    console.log(req.params.correo);
    User.findOne({correo: req.params.correo}).remove().exec();
    res.status(200).json("Deleted Successfully")
});



module.exports = router;