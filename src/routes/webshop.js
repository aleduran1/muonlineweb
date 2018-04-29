'use strict';

import express from 'express';
import helpers from '../helpers';
import controller from '../controllers/webshopController.js';

const router = express.Router();

router.get('/', helpers.isAuth, controller.getCategories, controller.getItems, (req, res) => {
	res.locals.moduleTitle = 'Webshop';
	res.locals.module = () => 'webshop';
	res.locals.moduleScript = 'webshop';
	res.locals.active = {
		webshop: true
	};
	res.render('index');
});

router.get('/deals', helpers.isAuth, controller.getCategories, controller.getDeals, (req, res) => {
	res.locals.moduleTitle = 'Webshop - Ofertas';
	res.locals.module = () => 'webshop';
	res.locals.moduleScript = 'webshop';
	res.locals.active = {
		webshop: true
	};
	res.render('index');
});

router.get('/category/:categoryid', helpers.isAuth, controller.getCategories, controller.getCategoryItems, (req, res) => {
	res.locals.moduleTitle = 'Webshop - ' + res.locals.category.name;
	res.locals.module = () => 'webshop';
	res.locals.moduleScript = 'webshop';
	res.locals.active = {
		webshop: true
	};
	res.render('index');
});

router.post('/buy/:itemid', helpers.isAuth, controller.validateBuy, controller.handleBuy);

export default router;