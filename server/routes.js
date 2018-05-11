'use strict';

// middleware
var StripeWebhook = require('stripe-webhook-middleware'),
isAuthenticated = require('./middleware/auth').isAuthenticated,
isUnauthenticated = require('./middleware/auth').isUnauthenticated,
setRender = require('middleware-responder').setRender,
setRedirect = require('middleware-responder').setRedirect,
stripeEvents = require('./middleware/stripe-events'),
secrets = require('./config/secrets');
// controllers
var users = require('./controllers/users-controller'),
main = require('./controllers/main-controller'),
dashboard = require('./controllers/dashboard-controller'),
passwords = require('./controllers/passwords-controller'),
registrations = require('./controllers/registrations-controller'),
sessions = require('./controllers/sessions-controller');

var stripeWebhook = new StripeWebhook({
  stripeApiKey: secrets.stripeOptions.apiKey,
  respond: true
});

module.exports = function (app, passport) {

  // homepage and dashboard

  app.get('/',
    setRedirect({auth: '/dashboard'}),
    isUnauthenticated,
    setRender('index.hbs'),
    main.getHome);


    // sessions
  app.post('/login',
    setRedirect({auth: '/dashboard', success: '/dashboard', failure: '/signup'}),
    isUnauthenticated,
    sessions.postLogin);
  app.get('/logout',
    setRedirect({auth: '/', success: '/'}),
    isAuthenticated,
    sessions.logout);

  // registrations
  app.get('/signup',
    setRedirect({auth: '/billing'}),
    isUnauthenticated,
    setRender('signup'),
    registrations.getSignup);
  app.post('/signup',
    setRedirect({auth: '/billing', success: '/billing', failure: '/signup'}),
    isUnauthenticated,
    registrations.postSignup);

  // forgot password
  app.get('/forgot',
    setRedirect({auth: '/dashboard'}),
    isUnauthenticated,
    setRender('forgot'),
    passwords.getForgotPassword);
  app.post('/forgot',
    setRedirect({auth: '/dashboard', success: '/forgot', failure: '/forgot'}),
    isUnauthenticated,
    passwords.postForgotPassword);

  // reset tokens
  app.get('/reset/:token',
    setRedirect({auth: '/dashboard', failure: '/forgot'}),
    isUnauthenticated,
    setRender('reset'),
    passwords.getToken);
  app.post('/reset/:token',
    setRedirect({auth: '/dashboard', success: '/dashboard', failure: 'back'}),
    isUnauthenticated,
    passwords.postToken);

// dashboard routes
  app.get('/dashboard',
    setRender('dashboard/index.html'),
    setRedirect({auth: '/'}),
    isAuthenticated,
    dashboard.getDefault);

  app.get('/billing',
    setRender('dashboard/billing'),
    setRedirect({auth: '/'}),
    isAuthenticated,
    dashboard.getBilling);

  app.get('/selectplan',
    setRender('dashboard/selectplan'),
    setRedirect({auth: '/'}),
    isAuthenticated,
    dashboard.getBilling);
  app.get('/profile',
    setRender('dashboard/profile'),
    setRedirect({auth: '/'}),
    isAuthenticated,
    dashboard.getProfile);
  app.get('/password',
    setRender('dashboard/password'),
    setRedirect({auth: '/'}),
    isAuthenticated,
    dashboard.getProfile);
  app.get('/delete',
    setRender('dashboard/delete'),
    setRedirect({auth: '/'}),
    isAuthenticated,
    dashboard.getProfile);
  app.get('/content',
    setRender('dashboard/content'),
    setRedirect({auth: '/'}),
    isAuthenticated,
    users.getContent);

  app.get('/sample',
    setRender('dashboard/sample.hbs'),
    setRedirect({auth: '/'}),
    isAuthenticated,
    users.getSample);

    app.get('/sample-image',
      setRender('dashboard/sample-image.hbs'),
      setRedirect({auth: '/'}),
      isAuthenticated,
      users.getContent);

    app.get('/sample-details',
      setRender('dashboard/sample-details.hbs'),
      setRedirect({auth: '/'}),
      isAuthenticated,
      users.getSampleDetails);

      app.get('/sample-edit/:_id',
        setRender('dashboard/sample-edit.hbs'),
        setRedirect({auth: '/'}),
        isAuthenticated,
        users.getSampleEdit);


  // user api stuff
  app.post('/user',
    setRedirect({auth: '/', success: '/profile', failure: '/profile'}),
    isAuthenticated,
    users.postProfile);
  app.post('/user/billing',
    setRedirect({auth: '/', success: '/billing', failure: '/billing'}),
    isAuthenticated,
    users.postBilling);
  app.post('/user/plan',
    setRedirect({auth: '/', success: '/dashboard', failure: '/billing'}),
    isAuthenticated,
    users.postPlan);
  app.post('/user/password',
    setRedirect({auth: '/', success: '/password', failure: '/password'}),
    isAuthenticated,
    passwords.postNewPassword);
  app.post('/user/delete',
    setRedirect({auth: '/', success: '/'}),
    isAuthenticated,
    users.deleteAccount);
  app.post('/user/content',
    setRedirect({auth: '/content', success: '/projects'}),
    isAuthenticated,
    users.postContent);

    app.post('/user/content',
      setRedirect({auth: '/content', success: '/content'}),
      isAuthenticated,
      users.postContent);

  app.post('/user/sample',
      setRedirect({auth: '/sample', success: '/sample'}),
      isAuthenticated,
      users.postsample);


  // use this url to receive stripe webhook events
  app.post('/stripe/events',
    stripeWebhook.middleware,
    stripeEvents
  );


};
