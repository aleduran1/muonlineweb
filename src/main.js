import express from 'express';
import flash from 'express-flash';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import validator from 'express-validator';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import favicon from 'serve-favicon';
import sitemap from 'express-sitemap';
import bodyParser from 'body-parser';
import path from 'path';
import hbs from './views';
import passport from './passport';
import helpers, { readConfigFile } from './helpers';
import index from './routes/index';
import admin from './routes/admin';
import api from './routes/api';
const RedisStore = connectRedis(session);
const app = express();
const client = redis.createClient();

readConfigFile().then((config) => {

  app.use(favicon(path.join(__dirname, '../assets/favicon.ico')));
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'hbs');

  if (process.env.NODE_ENV === 'development') app.use(logger('dev'));

  app.use(cookieParser());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(validator({
    customValidators: {
      isValidField: value => /^[a-zA-Z0-9]+$/.test(value),
      matchPasswords: (value, confirm) => value == confirm,
      validColumn: value => value >= 1 && value <= 8,
      validRow: value => value >= 1 && value <= 15,
      isPositive: value => value > 0,
      validStat: (value, limit) => parseInt(value) >= 0 && parseInt(value) <= parseInt(limit)
    }
  }));
  app.use(session({
    store: new RedisStore({
      host: 'localhost',
      port: 6379,
      client: client
    }),
    secret: config.app.secret,
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  app.use(express.static(path.join(__dirname, '../assets')));
  app.use(csrf());

  app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    helpers.display500(req, res, next);
  });

  app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    if (config.app.apis.captcha.active) {
      if (req.session.attempts >= 3) {
        res.locals.captchaKey = config.app.apis.captcha.public;
        res.locals.captcha = helpers.drawCaptcha();
      }
    }
    res.locals.pageName = config.app.name;
    res.locals.moduleIsActive = config.modules;
    res.locals.facebookPage = config.app.apis.facebook.pageName;
    if (req.user) {
      res.locals.auth = req.user;
    }
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.validationError = req.flash('validation-error');
    res.locals.warning = req.flash('warning');
    readConfigFile().then((freshConfig) => {
      res.locals.config = freshConfig;
      next();
    });
  });

  app.use('/', index);

  // Sitemap
  let map = sitemap({
    http: 'https',
    url: config.app.domain,
    sitemap: path.join(__dirname, '../assets/sitemap.xml'),
    robots: path.join(__dirname, '../assets/robots.txt'),
    sitemapSubmission: '/sitemap.xml'
  });

  map.generate4(app, ['/', '/news', '/auth', '/serverinfo', '/ranking', '/downloads', '/account', '/webshop', '/marketplace', '/vote']);
  map.toFile();

  app.use('/api', api);
  app.use('/admincp', admin);


  app.use((req, res, next) => {
    helpers.display404(req, res, next);
  });

  let port = process.env.PORT || 3000;

  let server = app.listen(port, () => {
    console.log('The ' + config.app.name + ' web is live on the port: ' + server.address().port);
  });
});