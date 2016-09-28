var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var locationSchema = require('./schemas/location');

var UserSchema = new mongoose.Schema({
  username:{type: String, lowercase:true, unique: true},
  email:{type: String, lowercase:true, unique: true},
  hash: String,
  salt: String,
  location : {type: locationSchema }
});

UserSchema.methods.setPassword = function(password){
  this.salt=crypto.randomBytes(16).toString('hex');
  var pass = crypto.pbkdf2Sync(password, this.salt, 1000, 64);
  this.hash = new Buffer(pass).toString('base64');
};

UserSchema.methods.validPassword = function (password) {
  var pass = crypto.pbkdf2Sync(password, this.salt, 1000, 64);
  var hash = new Buffer(pass).toString('base64');
  return this.hash === hash;
};

UserSchema.methods.setEmail = function(email){
  this.email = email;
};

UserSchema.methods.generateJWT = function () {
  // definir l'intervale de vivre
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 7);//7 jours valide

  return jwt.sign({
    _id: this._id,
    username : this.username,
    exp: parseInt(exp.getTime()/1000)
  }, 'SECRET');
};

mongoose.model('User',UserSchema);
