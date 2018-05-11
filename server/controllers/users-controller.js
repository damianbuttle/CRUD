'use strict';

var User = require('../models/user');



// show user page

exports.getProfile = function(req, res, next){
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

// Updates generic profile information

exports.postProfile = function(req, res, next){
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('name', 'Name is required').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect(req.redirect.failure);
  }

  if(req.body.email != req.user.email){
    User.findOne({ email: req.body.email }, function(err, existingUser) {
      if (existingUser) {
        req.flash('errors', { msg: 'An account with that email address already exists.' });
        return res.redirect(req.redirect.failure);
      } else {
        User.findById(req.user.id, function(err, user) {
          if (err) return next(err);
          user.email = req.body.email || '';
          user.profile.name = req.body.name || '';
          user.profile.location = req.body.location || '';


          user.save(function(err) {
            if (err) return next(err);
            user.updateStripeEmail(function(err){
              if (err) return next(err);
              req.flash('success', { msg: 'Profile information updated.' });
              res.redirect(req.redirect.success);
            });
          });
        });
      }
    });
  } else {
    User.findById(req.user.id, function(err, user) {
      if (err) return next(err);

      user.profile.name = req.body.name || '';
      user.profile.location = req.body.location || '';

      user.save(function(err) {
        if (err) return next(err);
        user.updateStripeEmail(function(err){
          if (err) return next(err);
          req.flash('success', { msg: 'Profile information updated.' });
          res.redirect(req.redirect.success);
        });
      });
    });
  }
};

// Removes account

exports.deleteAccount = function(req, res, next){
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);

    user.remove(function (err, user) {
      if (err) return next(err);
      user.cancelStripe(function(err){
        if (err) return next(err);

        req.logout();
        req.flash('info', { msg: 'Your account has been deleted.' });
        res.redirect(req.redirect.success);
      });
    });
  });
};

// Adds or updates a users card.

exports.postBilling = function(req, res, next){
  var stripeToken = req.body.stripeToken;

  if(!stripeToken){
    req.flash('errors', { msg: 'Please provide a valid card.' });
    return res.redirect(req.redirect.failure);
  }

  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);

    user.setCard(stripeToken, function (err) {
      if (err) {
        if(err.code && err.code == 'card_declined'){
          req.flash('errors', { msg: 'Your card was declined. Please provide a valid card.' });
          return res.redirect(req.redirect.failure);
        }
        req.flash('errors', { msg: 'An unexpected error occurred.' });
        return res.redirect(req.redirect.failure);
      }
      req.flash('success', { msg: 'Billing has been updated.' });
      res.redirect(req.redirect.success);
    });
  });
};

exports.postPlan = function(req, res, next){
  var plan = req.body.plan;
  var stripeToken = null;

  if(plan){
    plan = plan.toLowerCase();
  }

  if(req.user.stripe.plan == plan){
    req.flash('info', {msg: 'The selected plan is the same as the current plan.'});
    return res.redirect(req.redirect.success);
  }

  if(req.body.stripeToken){
    stripeToken = req.body.stripeToken;
  }

  if(!req.user.stripe.last4 && !req.body.stripeToken){
    req.flash('errors', {msg: 'Please add a card to your account before choosing a plan.'});
    return res.redirect(req.redirect.failure);
  }

  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);

    user.setPlan(plan, stripeToken, function (err) {
      var msg;

      if (err) {
        if(err.code && err.code == 'card_declined'){
          msg = 'Your card was declined. Please provide a valid card.';
        } else if(err && err.message) {
          msg = err.message;
        } else {
          msg = 'An unexpected error occurred.';
        }

        req.flash('errors', { msg:  msg});
        return res.redirect(req.redirect.failure);
      }
      req.flash('success', { msg: 'Plan has been updated.' });
      res.redirect(req.redirect.success);
    });
  });
};

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

user.project = user.project.concat([ { testinput: req.body.testinput } ])

      user.save(function(err) {
        if (err) return next(err);
          req.flash('success', { msg: 'Project Updated.' });
          res.redirect(req.redirect.success);
        });
      });
    };

exports.getSample = function(req, res, next){
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

            console.log(req.params.id)

            };

  exports.getSampleDetails = function(req, res, next){
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

                console.log(req.params.id)

                };



exports.getSampleEdit = function(req, res, next){


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

  console.log(req.params.id)

  };




exports.postsample = function(req, res, next){

          User.findById(req.user.id, function(err, user) {
              if (err) return next(err);

          user.sample = user.sample.concat([ { name: req.body.name, description: req.body.description, purchase: req.body.purchase, material: req.body.material, brand: req.body.brand, notes: req.body.notes, qty: req.body.qty, imgpath: req.body.imgpath } ])

              user.save(function(err) {
                if (err) return next(err);
                req.flash('success', { msg: 'Fabric Updated.' });
                res.redirect(req.redirect.success);
                });
              });
            };
