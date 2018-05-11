var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var stripeCustomer = require('./plugins/stripe-customer');
var secrets = require('../config/secrets');
var timestamps = require('mongoose-timestamp');

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,

  profile: {
    name: { type: String, default: '' },
    location: { type: String, default: '' }
  },
  image: {
    path: { type: String, default: '' },
  },
  sample:
        [{
          name: String,
          description: String,
          purchase: String,
          brand: String,
          material: String,
          notes: String,
          qty: String,
          imgpath: String,
        }],
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

var stripeOptions = secrets.stripeOptions;

userSchema.plugin(timestamps);
userSchema.plugin(stripeCustomer, stripeOptions);

/**
 * Hash the password for security.
 * "Pre" is a Mongoose middleware that executes before each user.save() call.
 */

userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/**
 * Validate user's password.
 * Used by Passport-Local Strategy for password validation.
 */

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);
