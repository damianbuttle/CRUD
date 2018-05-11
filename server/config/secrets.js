module.exports = {

  //db: process.env.MONGODB || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://heroku_mjb8fz45:bri18qkd26bqot9d6e9l6p3h9m@ds113785.mlab.com:13785/heroku_mjb8fz45',
  db: process.env.MONGODB || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/sewing-app',

  sessionSecret: process.env.SESSION_SECRET || 'change this to this',

  mailgun: {
    apiKey: process.env.MAILGUN_API_KEY || 'key-28e77e366e8606d22968718514d39480',
    domain: process.env.MAILGUN_DOMAIN || ''
  },

  stripeOptions: {
    apiKey: process.env.STRIPE_KEY || 'sk_test_GlGMs2wVbN8hEipIOI98KS9K',
    stripePubKey: process.env.STRIPE_PUB_KEY || 'pk_test_5RB4yYYDfoYcvmUdfsQ1V2s1',
    defaultPlan: 'free',
    plans: ['free','silver', 'gold', 'platinum'],
    planData: {
        'free': {
        name: 'free',
        price: 0
      },
      'silver': {
        name: 'Silver',
        price: 9
      },
      'gold': {
        name: 'Gold',
        price: 19
      },
      'platinum': {
        name: 'Platinum',
        price: 29
      }
    }
  },

  googleAnalytics: process.env.GOOGLE_ANALYTICS || ''
};
