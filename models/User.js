var mongoose = require('mongoose');
var mongoDB = 'mongodb://lkuffo2:sandbox1@ds153699.mlab.com:53699/daw_sandbox';
var bcrypt = require('bcrypt');
var saltRounds = 10;

mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Schema = mongoose.Schema;

//Crea el esquema usuarios
var schema = new Schema({
    correo: String,
    password: String
},
{
    collection: 'Users'
});

// generating a hash
schema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds), null);
};

// checking if password is valid
schema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model("User", schema);
module.exports = User;
