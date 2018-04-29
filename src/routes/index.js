'use strict';

import express from 'express';
import newsController from '../controllers/newsController';
import db from '../db';
import news from './news';
import serverinfo from './serverinfo';
import account from './account';
import auth from './auth';
import webshop from './webshop';
import marketplace from './marketplace';
import vote from './vote';
import rewards from './rewards';
import helpers, { readConfigFileSync } from '../helpers';

const router = express.Router();
const modules = readConfigFileSync().modules;

router.get('/', newsController.getNewsIndex, (req, res) => {
	res.locals.moduleTitle = "Noticias";
	res.locals.module = () => "news";
	res.locals.moduleScript = 'news';
	res.locals.active = {
		news: true
	};
	res.render('index');
});

if (modules.Contact)
	router.get('/contact', (req, res) => {
		res.locals.moduleTitle = "Contacto";
		res.locals.module = () => "contact";
		res.locals.active = {
			contact: true
		};
		res.render('index');
	});

if (modules.Donate)
	router.get('/donate', (req, res) => {
		res.locals.moduleTitle = "Donar";
		res.locals.module = () => 'donate';
		res.locals.active = {
			donate: true
		};
		res.locals.moduleScript = 'donate';
		res.render('index');
	});

if (modules.Ranking)
	router.get('/ranking', (req, res) => {
		res.locals.moduleTitle = 'Ranking';
		res.locals.module = () => 'ranking';
		res.locals.moduleScript = 'ranking';
		res.locals.active = {
			ranking: true
		};
		res.render('index');
	});

if (modules.Downloads)
	router.get('/downloads', (req, res) => {
		res.locals.moduleTitle = 'Descargas';
		res.locals.module = () => 'downloads';
		res.locals.active = {
			downloads: true
		};
		res.render('index');
	});

router.get('/events', (req, res) => {
	res.locals.moduleTitle = "Horarios de Eventos";
	res.locals.module = () => "events";
	res.locals.active = {
		events: true
	};
	res.render('index');
});

router.get('/help', (req, res) => {
	res.locals.moduleTitle = "Ayuda";
	res.locals.module = () => "help";
	res.locals.active = {
		help: true
	};
	res.render('index');

});

router.get('/tos', (req, res) => {
	res.locals.moduleTitle = "Condiciones de Servicio";
	res.locals.module = () => "tos";
	res.locals.active = {
		tos: true
	};
	res.render('index');
});

router.use('/news', news);
router.use('/auth', auth);
router.use('/serverinfo', serverinfo);
if (modules.Account) router.use('/account', account);
if (modules.Webshop) router.use('/webshop', webshop);
if (modules.Marketplace) router.use('/marketplace', marketplace);
if (modules.Vote) router.use('/vote', vote);
if (modules.Rewards) router.use('/rewards', rewards);

export default router;