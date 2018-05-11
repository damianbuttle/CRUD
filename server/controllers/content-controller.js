'use strict';

var User = require('../models/user');

//Show Content

exports.getContent = function(req, res, next){
  var form = {},
  error = null,
  formFlash = req.flash('form'),
  errorFlash = req.flash('error');

  if (formFlash.length) {
    form.email = formFlash[0].email;
  }
  if (errorFlash.length) {
    error = errorFlash[0];
  }
  res.render(req.render, {user: req.user, form: form, error: error});
};

//Post Content

exports.postContent = function(req, res, next){
  
    User.findById(req.user.id, function(err, user) {
      if (err) return next(err);
        
      user.test.testinput = req.body.testinput || '';


      user.save(function(err) {
        if (err) return next(err);
          req.flash('success', { msg: 'Profile information updated.' });
          res.redirect(req.redirect.success);
        });
      });
    };
