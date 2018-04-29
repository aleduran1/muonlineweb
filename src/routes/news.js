'use strict';

import express from 'express';
import helpers from '../helpers';
import controller from '../controllers/newsController';

const router = express.Router();

router.get('/', (req, res) => {
  res.locals.moduleTitle = "Noticias";
  res.locals.module = () => "news";
  res.locals.moduleScript = 'news';
  res.locals.active = {
    news: true
  };
  res.render('index');
});

router.get('/:newsid', (req, res) => {
  res.locals.moduleTitle = "Noticias";
  res.locals.module = () => "news";
  res.locals.moduleScript = 'news';
  res.locals.moduleCustomScript = `const nid = ${req.params.newsid}`;
  res.locals.active = {
    news: true
  };
  res.render('index');
});

export default router;