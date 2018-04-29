'use strict';

import express from 'express';
import helpers from '../helpers';
import itemList from '../../items.json';
import controller from '../controllers/adminController';
const router = express.Router();

router.get('/', helpers.requiredAccessLevel(3), (req, res) => {
	res.locals.moduleTitle = "Home";
	res.locals.module = () => "adminCPHome";
	res.locals.active = {
		home: true
	};
	res.render('admin_modules/index');
});

/***************************************************************
 *	GENERAL SETTINGS ROUTES
 ***************************************************************/

router.route('/general')
	.get(helpers.requiredAccessLevel(3), (req, res) => {
		res.locals.moduleTitle = "General";
		res.locals.module = () => "generalSettings";
		res.locals.appconfig = res.locals.config.app;
		res.locals.active = {
			general: true
		};
		res.render('admin_modules/index');
	})

	.post(helpers.requiredAccessLevel(3), controller.validateGeneralConfig, controller.handleGeneralConfig);

/***************************************************************
 *	NEWS ROUTES
 ***************************************************************/

router.get('/news', helpers.requiredAccessLevel(3), controller.getNews, (req, res) => {
	res.locals.moduleTitle = 'News';
	res.locals.module = () => 'newsList';
	res.locals.active = {
		news: true,
		newsList: true
	};
	res.render('admin_modules/index');
});

router.post('/news/toggle', helpers.requiredAccessLevel(3), controller.handleNewsToggle);

router.post('/news/remove', helpers.requiredAccessLevel(3), controller.handleNewsRemove);

router.get('/news/edit/:newsid', helpers.requiredAccessLevel(3), controller.getNewsToEdit, (req, res) => {
	res.locals.moduleTitle = 'Edit a New';
	res.locals.module = () => 'editNews';
	res.locals.active = {
		news: true
	};
	res.render('admin_modules/index');
});

router.post('/news/edit/:newsid', helpers.requiredAccessLevel(3), controller.validateNews, controller.handleNewsEdit);

router.get('/news/add', helpers.requiredAccessLevel(3), function (req, res) {
	res.locals.moduleTitle = 'Add new';
	res.locals.module = () => "addNew";
	res.locals.active = {
		news: true,
		addNew: true
	};
	res.render('admin_modules/index');
});

router.post('/news/add', helpers.requiredAccessLevel(3), controller.validateNews, controller.handleNewsAdd);

/***************************************************************
 *	MODULES ACTIVE ROUTES
 ***************************************************************/

router.route('/modules')

	.get(controller.getActiveModules, (req, res) => {
		res.locals.moduleTitle = 'Active modules';
		res.locals.module = () => 'modulesActive';
		res.locals.active = {
			userSettings: true,
			modules: true
		};
		res.render('admin_modules/index');
	})

	.post(controller.handleModulesConfig);


/***************************************************************
 *	RESET SETTINGS ROUTES
 ***************************************************************/

router.route('/reset')

	.get(helpers.requiredAccessLevel(3), (req, res) => {
		res.locals.moduleTitle = 'Reset Settings';
		res.locals.module = () => 'resetSettings';
		res.locals.reset = res.locals.config.reset;
		res.locals.active = {
			userSettings: true,
			reset: true
		};
		res.render('admin_modules/index');
	})

	.post(helpers.requiredAccessLevel(3), controller.validateResetConfig, controller.handleResetConfig);

/***************************************************************
 *	PKCLEAR SETTINGS ROUTES
 ***************************************************************/

router.route('/pkclear')

	.get(helpers.requiredAccessLevel(3), (req, res) => {
		res.locals.moduleTitle = 'PKCLEAR Settings';
		res.locals.module = () => 'pkclearSettings';
		res.locals.pkclear = res.locals.config.pkClear;
		res.locals.active = {
			userSettings: true,
			pkclear: true
		};
		res.render('admin_modules/index');
	})

	.post(helpers.requiredAccessLevel(3), controller.validatePKClearConfig, controller.handlePKClearConfig);

/***************************************************************
 *	UNSTUCK SETTINGS ROUTES
 ***************************************************************/

router.route('/unstuck')

	.get(helpers.requiredAccessLevel(3), (req, res) => {
		res.locals.moduleTitle = 'UNSTUCK Settings';
		res.locals.module = () => 'unstuckSettings';
		res.locals.unstuck = res.locals.config.unstuck;
		res.locals.active = {
			userSettings: true,
			unstuck: true
		};
		res.render('admin_modules/index');
	})

	.post(helpers.requiredAccessLevel(3), controller.validateUnstuckConfig, controller.handleUnstuckConfig);

/***************************************************************
 *	ADDSTATS SETTINGS ROUTES
 ***************************************************************/

router.route('/addstats')

	.get(helpers.requiredAccessLevel(3), (req, res) => {
		res.locals.moduleTitle = 'ADDSTATS Settings';
		res.locals.module = () => 'addStatsSettings';
		res.locals.addStats = res.locals.config.addStats;
		res.locals.active = {
			userSettings: true,
			addstats: true
		};
		res.render('admin_modules/index');
	})

	.post(helpers.requiredAccessLevel(3), controller.validateAddStatsConfig, controller.handleAddStatsConfig);

/***************************************************************
 *	VIP SETTINGS ROUTES
 ***************************************************************/

router.route('/vip')

	.get(helpers.requiredAccessLevel(3), (req, res) => {
		res.locals.moduleTitle = 'VIP Settings';
		res.locals.module = () => 'vipSettings';
		res.locals.vip = res.locals.config.vip;
		if (res.locals.config.vip.accountLevel[3].active) {
			res.locals.required3 = true;
		} else if (res.locals.config.vip.accountLevel[2].active) {
			res.locals.required2 = true;
		} else {
			res.locals.required1 = true;
		}
		res.locals.active = {
			userSettings: true,
			vip: true
		};
		res.render('admin_modules/index');
	})

	.post(helpers.requiredAccessLevel(3), controller.validateVIPConfig, controller.handleVIPConfig);

/***************************************************************
 *	WEBSHOP ROUTES
 ***************************************************************/

router.get('/webshop', helpers.requiredAccessLevel(3), controller.getCategories, controller.getItems, (req, res) => {
	res.locals.moduleTitle = 'Webshop Listings';
	res.locals.module = () => 'webshopList';
	res.locals.active = {
		webshop: true,
		webshopList: true
	};
	res.render('admin_modules/index');
});

/***************************************************************
 *	WEBSHOP SETTINGS ROUTES
 ***************************************************************/

router.route('/webshop/settings')

	.get(helpers.requiredAccessLevel(3), (req, res) => {
		res.locals.moduleTitle = "Webshop Settings";
		res.locals.module = () => "webshopSettings";
		res.locals.config = res.locals.config.webshop;
		res.locals.active = {
			webshop: true,
			webshopSettings: true
		};
		res.render('admin_modules/index');
	})

	.post(helpers.requiredAccessLevel(3), controller.verifyWebshopConfig, controller.handleWebshopConfig);

/***************************************************************
 *	WEBSHOP CATEGORIES ROUTES
 ***************************************************************/
router.route('/webshop/category/add')

	.get(helpers.requiredAccessLevel(3), (req, res) => {
		res.locals.moduleTitle = 'Add Category';
		res.locals.module = () => "addWebshopCategory";
		res.locals.active = {
			webshop: true,
			addCategory: true
		};
		res.render('admin_modules/index');
	})

	.post(helpers.requiredAccessLevel(3), controller.validateWebshopCategory, controller.handleWebshopCategoryAdd);

router.post('/webshop/category/toggle', helpers.requiredAccessLevel(3), controller.handleWebshopCategoryToggle);

router.post('/webshop/category/remove', helpers.requiredAccessLevel(3), controller.handleWebshopCategoryRemove);

router.route('/webshop/category/edit/:categoryid')

	.get(helpers.requiredAccessLevel(3), controller.getCategoryToEdit, (req, res) => {
		res.locals.moduleTitle = 'Edit a Category';
		res.locals.module = () => 'editWebshopCategory';
		res.locals.active = {
			webshop: true
		};
		res.render('admin_modules/index');
	})

	.post(helpers.requiredAccessLevel(3), controller.validateWebshopCategory, controller.handleWebshopCategoryEdit);

/***************************************************************
 *	WEBSHOP ITEM ROUTES
 ***************************************************************/
router.route('/webshop/item/add')

	.get(helpers.requiredAccessLevel(3), controller.getCategories, (req, res) => {
		if (!res.locals.webshopCategories[0]) {
			req.flash('error', 'Primero se debe crear una categoria');
			res.redirect('/admincp/webshop');
		}
		res.locals.items = itemList;
		res.locals.moduleTitle = 'Add Item';
		res.locals.module = () => "addWebshopItem";
		res.locals.active = {
			webshop: true,
			addItem: true
		};
		res.render('admin_modules/index');
	})

	.post(helpers.requiredAccessLevel(3), controller.validateItem, controller.handleWebshopItemAdd);

router.post('/webshop/item/toggle', helpers.requiredAccessLevel(3), controller.handleWebshopItemToggle);

router.post('/webshop/item/remove', helpers.requiredAccessLevel(3), controller.handleWebshopItemRemove);

router.route('/webshop/item/edit/:itemid')

	.get(helpers.requiredAccessLevel(3), controller.getCategories, controller.getItemToEdit, (req, res) => {
		res.locals.moduleTitle = 'Edit an Item';
		res.locals.module = () => 'editWebshopItem';
		res.locals.active = {
			webshop: true
		};
		res.render('admin_modules/index');
	})

	.post(helpers.requiredAccessLevel(3), controller.validateItemEdit, controller.handleWebshopItemEdit);

/***************************************************************
 *	MARKETPLACE SETTINGS ROUTES
 ***************************************************************/

router.route('/marketplace')

	.get(helpers.requiredAccessLevel(3), (req, res) => {
		res.locals.moduleTitle = 'Marketplace Settings';
		res.locals.module = () => 'marketplaceSettings';
		res.locals.marketplace = res.locals.config.marketplace;
		res.locals.active = {
			marketplaceSettings: true
		};
		res.render('admin_modules/index');
	})

	.post(helpers.requiredAccessLevel(3), controller.validateMarketplace, controller.handleMarketplaceConfig);

/***************************************************************
 *	LOGS ROUTES
 ***************************************************************/

router.get('/logs/error', helpers.requiredAccessLevel(3), controller.getErrors, (req, res) => {
	res.locals.moduleTitle = "Error Logs";
	res.locals.module = () => "errorList";
	res.locals.active = {
		logs: true,
		error: true
	};
	res.render('admin_modules/index');
});

router.get('/logs/purchases', helpers.requiredAccessLevel(3), controller.getPurchases, (req, res) => {
	res.locals.moduleTitle = "Purchases List";
	res.locals.module = () => "purchasesList";
	res.locals.active = {
		logs: true,
		purchase: true
	};
	res.render('admin_modules/index');
});

/***************************************************************
 *	ADD MUCOINS ROUTES
 ***************************************************************/

router.post('/mucoins/add', helpers.requiredAccessLevel(3), controller.handleAddMuCoins);

export default router;