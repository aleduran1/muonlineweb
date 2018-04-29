'use strict';

import express from 'express';
import helpers from '../helpers';
import controller from '../controllers/marketplaceController';
const router = express.Router();

router.get('/', helpers.isAuth, controller.getListings, (req, res) => {
	res.locals.moduleTitle = "Mercado";
	res.locals.module = () => "marketplace";
	res.locals.moduleScript = "marketplace";
	res.locals.active = {
		marketplace: true
	};
	res.render('index');
});

router.get('/mylistings', helpers.isAuth, controller.getMyListings, (req, res) => {
	res.locals.moduleTitle = "Mi Mercado";
	res.locals.module = () => "marketMyListings";
	res.locals.moduleScript = "marketplace";
	res.locals.active = {
		mymarket: true
	};
	res.render('index');
});

router.get('/add', helpers.isAuth, controller.canAdd, helpers.getWarehouse, (req, res) => {
	res.locals.moduleTitle = "Mercado - Agregar Item";
	res.locals.module = () => "marketplaceAdd";
	res.locals.moduleScript = "marketplace";
	res.locals.active = {
		marketplace: true
	};
	res.render('index');
});

router.post('/add', helpers.isAuth, controller.canAdd, controller.validateAdd, controller.handleAdd);

router.post('/remove', helpers.isAuth, controller.validateRemove, controller.handleRemove);

router.post('/buy/:id', helpers.isAuth, controller.validateBuy, controller.handleBuy);

export default router;