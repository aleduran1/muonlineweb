'use strict';

import db from '../db';
import helpers from '../helpers';
import moment from 'moment';
import item from '../models/item';

const controller = {

	/** Valida los campos del form de General Config */
	validateGeneralConfig(req, res, next) {
		req.assert('name', 'No se pueden dejar campos en blanco').notEmpty();
		req.assert('domain', 'No se pueden dejar campos en blanco').notEmpty();
		req.assert('facebookPage', 'No se pueden dejar camplos en blanco').notEmpty();
		req.assert('facebookApiKey', 'No se pueden dejar camplos en blanco').notEmpty();
		req.assert('ip', 'No se pueden dejar campos en blanco').notEmpty();
		req.assert('port', 'No se pueden dejar campos en blanco').notEmpty();
		req.assert('secret', 'No se pueden dejar campos en blanco').notEmpty();
		req.assert('dbhostname', 'No se pueden dejar campos en blanco').notEmpty();
		req.assert('dbusername', 'No se pueden dejar campos en blanco').notEmpty();
		req.assert('dbpassword', 'No se pueden dejar campos en blanco').notEmpty();
		req.assert('dbname', 'No se pueden dejar campos en blanco').notEmpty();
		req.assert('publickey', 'No se pueden dejar campos en blanco').notEmpty();
		req.assert('privatekey', 'No se pueden dejar campos en blanco').notEmpty();
		req.assert('smtphost', 'No se pueden dejar campos en blanco').notEmpty();
		req.assert('smtpport', 'No se pueden dejar campos en blanco').notEmpty();
		req.assert('smtpuser', 'No se pueden dejar campos en blanco').notEmpty();
		req.assert('smtppass', 'No se pueden dejar campos en blanco').notEmpty();

		if (req.validationErrors()) {
			req.flash('validation-error', req.validationErrors());
			res.redirect('/admincp/general');
		} else {
			next();
		}
	},

	/** Guarda la configuración general en el archivo de configuración*/
	async handleGeneralConfig(req, res) {
		const body = req.body;
		res.locals.config.app.name = body.name;
		res.locals.config.app.domain = body.domain;
		res.locals.config.app.apis.facebook.pageName = body.facebookPage;
		res.locals.config.app.apis.facebook.apikey = body.facebookApiKey;
		res.locals.config.app.domain = body.domain;
		res.locals.config.app.ip = body.ip;
		res.locals.config.app.port = parseInt(body.port);
		res.locals.config.app.secret = body.secret;
		res.locals.config.app.db.host = body.dbhostname;
		res.locals.config.app.db.username = body.dbusername;
		res.locals.config.app.db.password = body.dbpassword;
		res.locals.config.app.db.database = body.dbname;
		res.locals.config.app.apis.recaptcha.active = body.recatpcha_active ? 1 : 0;
		res.locals.config.app.apis.recaptcha.public = body.publickey;
		res.locals.config.app.apis.recaptcha.private = body.privatekey;
		res.locals.config.app.smtp.host = body.smtphost;
		res.locals.config.app.smtp.port = parseInt(body.smtpport);
		res.locals.config.app.smtp.secure = body.smtp_secure ? true : false;
		res.locals.config.app.smtp.auth.user = body.smtpuser;
		res.locals.config.app.smtp.auth.pass = body.smtppass;
		try {
			await helpers.writeFile('./config.json', JSON.stringify(config, null, 2));
			req.flash('success', 'Los cambios se han realizado con exito.');
			res.redirect('/admincp/general');
		} catch (error) {
			req.flash('error', 'Hubo un error inesperado.');
			res.redirect('/admincp/general');
			helpers.submitError('adminController.handleGeneralConfig', error);
		}
	},

	getActiveModules(req, res, next) {
		res.locals.activeModules = res.locals.config.modules;
		next();
	},

	async handleModulesConfig(req, res) {
		try {
			let modules = res.locals.config.modules;
			for (let module in modules) {
				res.locals.config.modules[module] = req.body[module] ? 1 : 0;
			}
			await helpers.writeFile('./config.json', JSON.stringify(config, null, 2));
			req.flash('success', 'Los cambios se han realizado con exito.');
			res.redirect('/admincp/modules');
		} catch (error) {
			req.flash('error', 'Hubo un error inesperado.');
			res.redirect('/admincp/modules');
			helpers.submitError('adminController.handleModulesConfig', error);
		}
	},

	/** Valida la configuración de Reset */
	validateResetConfig(req, res, next) {
		req.assert('limit', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('stats', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('levelrequired0', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('zenrequired0', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('levelrequired1', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('zenrequired1', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('levelrequired2', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('zenrequired2', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('levelrequired3', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('zenrequired3', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('costxreset', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();

		if (req.validationErrors()) {
			req.flash('validation-error', req.validationErrors());
			res.redirect('/admincp/reset');
		} else {
			next();
		}
	},

	/** Guarda la configuración del módulo de Resets */
	async handleResetConfig(req, res) {
		const resets = res.locals.config.reset;
		resets.costxreset = parseInt(req.body.costxreset);
		resets.limit = parseInt(req.body.limit);
		resets.limited = (req.body.resetLimited ? true : false);
		resets.resetStats = (req.body.resetStats ? 1 : 0);
		resets.resetSkills = (req.body.resetSkills ? 1 : 0);
		resets.resetInventory = (req.body.resetInventory ? 1 : 0);
		resets.statsPerReset = parseInt(req.body.stats);
		resets.accountLevel[0].level = parseInt(req.body.levelrequired0);
		resets.accountLevel[0].zen = parseInt(req.body.zenrequired0);
		resets.accountLevel[1].level = parseInt(req.body.levelrequired1);
		resets.accountLevel[1].zen = parseInt(req.body.zenrequired1);
		resets.accountLevel[2].level = parseInt(req.body.levelrequired2);
		resets.accountLevel[2].zen = parseInt(req.body.zenrequired2);
		resets.accountLevel[3].level = parseInt(req.body.levelrequired3);
		resets.accountLevel[3].zen = parseInt(req.body.zenrequired3);
		try {
			await helpers.writeFile('./config.json', JSON.stringify(config, null, 2));
			req.flash('success', 'Los cambios se han realizado con exito.');
			res.redirect('/admincp/reset');
		} catch (error) {
			req.flash('error', 'Hubo un error inesperado.');
			res.redirect('/admincp/reset');
			helpers.submitError('adminController.handleResetConfig', error);
		}
	},

	/** Valida los campos del módulo de PKClear */
	validatePKClearConfig(req, res, next) {
		req.assert('zenrequired0', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('zenrequired1', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('zenrequired2', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('zenrequired3', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();

		if (req.validationErrors()) {
			req.flash('validation-error', req.validationErrors());
			res.redirect('/admincp/pkclear');
		} else {
			next();
		}
	},

	/** Guarda la configuración del módulo de PKClear */
	async handlePKClearConfig(req, res) {
		const pkclear = res.locals.config.pkClear;
		pkclear.accountLevel[0].zen = parseInt(req.body.zenrequired0);
		pkclear.accountLevel[1].zen = parseInt(req.body.zenrequired1);
		pkclear.accountLevel[2].zen = parseInt(req.body.zenrequired2);
		pkclear.accountLevel[3].zen = parseInt(req.body.zenrequired3);
		try {
			await helpers.writeFile('./config.json', JSON.stringify(config, null, 2));
			req.flash('success', 'Los cambios se han realizado con exito.');
			res.redirect('/admincp/pkclear');
		} catch (error) {
			req.flash('error', 'Hubo un error inesperado.');
			res.redirect('/admincp/pkclear');
			helpers.submitError('adminController.handlePKClearConfig', error);
		}
	},

	/** Valida los campos del módulo de Unstuck */
	validateUnstuckConfig(req, res, next) {
		req.assert('mapNumber', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('posX', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('posY', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		if (req.validationErrors()) {
			req.flash('validation-error', req.validationErrors());
			res.redirect('/admincp/unstuck');
		} else {
			next();
		}
	},

	/** Guarda la configuración del módulo de Unstuck */
	async handleUnstuckConfig(req, res) {
		const unstuck = res.locals.config.unstuck;
		unstuck.mapNumber = parseInt(req.body.mapNumber);
		unstuck.posX = parseInt(req.body.posX);
		unstuck.posY = parseInt(req.body.posY);
		try {
			await helpers.writeFile("./config.json", JSON.stringify(config, null, 2));
			req.flash('success', 'Los cambios se han realizado con exito.');
			res.redirect('/admincp/unstuck');
		} catch (error) {
			req.flash('error', 'Hubo un error inesperado.');
			res.redirect('/admincp/unstuck');
			helpers.submitError('adminController.handleUnstuckConfig', error);
		}
	},

	/** Valida los campos del módulo de Unstuck */
	validateAddStatsConfig(req, res, next) {
		req.assert('limit', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		if (req.validationErrors()) {
			req.flash('validation-error', req.validationErrors());
			res.redirect('/admincp/addstats');
		} else {
			next();
		}
	},

	/** Guarda la configuración del módulo de Unstuck */
	async handleAddStatsConfig(req, res) {
		const addstats = res.locals.config.addStats;
		addstats.limit = parseInt(req.body.limit);
		try {
			await helpers.writeFile("./config.json", JSON.stringify(config, null, 2));
			req.flash('success', 'Los cambios se han realizado con exito.');
			res.redirect('/admincp/addstats');
		} catch (error) {
			req.flash('error', 'Hubo un error inesperado.');
			res.redirect('/admincp/addstats');
			helpers.submitError('adminController.handleAddStatsConfig', error);
		}
	},

	/** Valida los campos del módulo de Marketplace */
	validateMarketplace(req, res, next) {
		req.assert('listings0', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('listings1', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('listings2', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('listings3', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		if (req.validationErrors()) {
			req.flash('validation-error', req.validationErrors());
			res.redirect('/admincp/marketplace');
		} else {
			next();
		}
	},

	/** Guarda la configuración del módulo de Marketplace */
	async handleMarketplaceConfig(req, res) {
		const marketplace = res.locals.config.marketplace;
		marketplace.accountLevel[0].listings = parseInt(req.body.listings0);
		marketplace.accountLevel[1].listings = parseInt(req.body.listings1);
		marketplace.accountLevel[2].listings = parseInt(req.body.listings2);
		marketplace.accountLevel[3].listings = parseInt(req.body.listings3);
		try {
			await helpers.writeFile("./config.json", JSON.stringify(config, null, 2));
			req.flash('success', 'Los cambios se han realizado con exito.');
			res.redirect('/admincp/marketplace');
		} catch (error) {
			req.flash('error', 'Hubo un error inesperado.');
			res.redirect('/admincp/marketplace');
			helpers.submitError('adminController.handleMarketplaceConfig', error);
		}
	},

	/** Valida los campos del módulo de VIP */
	validateVIPConfig(req, res, next) {
		req.assert('levelsActive', 'El campo de nivel de cuenta contiene errores').notEmpty().isInt();
		req.assert('trialAccountLevel', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('trialDays', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('namevip1', 'El campo no puede estar vacio').notEmpty();
		req.assert('daysvip1package0', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('daysvip1package1', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('daysvip1package2', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('coinsvip1package0', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('coinsvip1package1', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('coinsvip1package2', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('namevip2', 'El campo no puede estar vacio').notEmpty();
		req.assert('daysvip2package0', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('daysvip2package1', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('daysvip2package2', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('coinsvip2package0', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('coinsvip2package1', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('coinsvip2package2', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('namevip3', 'El campo no puede estar vacio').notEmpty();
		req.assert('daysvip3package0', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('daysvip3package1', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('daysvip3package2', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('coinsvip3package0', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('coinsvip3package1', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('coinsvip3package2', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();

		if (req.validationErrors()) {
			req.flash('validation-error', req.validationErrors());
			res.redirect('/admincp/vip');
		} else {
			next();
		}
	},

	/** Guarda la configuración del módulo de VIP */
	async handleVIPConfig(req, res) {
		const vip = res.locals.config.vip;
		vip.trial.active = req.body.trial_active ? 1 : 0;
		vip.trial.accountLevel = parseInt(req.body.trialAccountLevel);
		vip.trial.days = parseInt(req.body.trialDays);
		vip.accountLevel[1].name = req.body.namevip1;
		vip.accountLevel[1].paquetes[0].dias = parseInt(req.body.daysvip1package0);
		vip.accountLevel[1].paquetes[1].dias = parseInt(req.body.daysvip1package1);
		vip.accountLevel[1].paquetes[2].dias = parseInt(req.body.daysvip1package2);
		vip.accountLevel[1].paquetes[0].coins = parseInt(req.body.coinsvip1package0);
		vip.accountLevel[1].paquetes[1].coins = parseInt(req.body.coinsvip1package1);
		vip.accountLevel[1].paquetes[2].coins = parseInt(req.body.coinsvip1package2);
		vip.accountLevel[2].name = req.body.namevip2;
		vip.accountLevel[2].paquetes[0].dias = parseInt(req.body.daysvip2package0);
		vip.accountLevel[2].paquetes[1].dias = parseInt(req.body.daysvip2package1);
		vip.accountLevel[2].paquetes[2].dias = parseInt(req.body.daysvip2package2);
		vip.accountLevel[2].paquetes[0].coins = parseInt(req.body.coinsvip2package0);
		vip.accountLevel[2].paquetes[1].coins = parseInt(req.body.coinsvip2package1);
		vip.accountLevel[2].paquetes[2].coins = parseInt(req.body.coinsvip2package2);
		vip.accountLevel[3].name = req.body.namevip3;
		vip.accountLevel[3].paquetes[0].dias = parseInt(req.body.daysvip3package0);
		vip.accountLevel[3].paquetes[1].dias = parseInt(req.body.daysvip3package1);
		vip.accountLevel[3].paquetes[2].dias = parseInt(req.body.daysvip3package2);
		vip.accountLevel[3].paquetes[0].coins = parseInt(req.body.coinsvip3package0);
		vip.accountLevel[3].paquetes[1].coins = parseInt(req.body.coinsvip3package1);
		vip.accountLevel[3].paquetes[2].coins = parseInt(req.body.coinsvip3package2);
		vip.accountLevel[1].active = parseInt(req.body.levelsActive) >= 1 ? 1 : 0;
		vip.accountLevel[2].active = parseInt(req.body.levelsActive) >= 2 ? 1 : 0;
		vip.accountLevel[3].active = parseInt(req.body.levelsActive) === 3 ? 1 : 0;
		try {
			await helpers.writeFile("./config.json", JSON.stringify(config, null, 2));
			req.flash('success', 'Los cambios se han realizado con exito.');
			res.redirect('/admincp/vip');
		} catch (error) {
			req.flash('error', 'Hubo un error inesperado.');
			res.redirect('/admincp/vip');
		}
	},

	/** Devuelve las noticias */
	async getNews(req, res, next) {
		try {
			res.locals.newsList = await db('News').orderBy('id', 'desc');
			next();
		} catch (error) {
			req.flash('error', 'Hubo un error conectando con la base de datos.');
			res.redirect('/admincp');
			helpers.submitError('adminController.getNews', error);
		}
	},

	/** Valida los campos para publicar/editar una noticia */
	validateNews(req, res, next) {
		req.assert('title', 'El título no puede estar vacio').notEmpty();
		req.assert('author', 'La noticia debe tener autor').notEmpty();
		req.assert('content', 'La noticia debe tenér contenido').notEmpty();

		if (req.validationErrors()) {
			req.flash('validation-error', req.validationErrors());
			res.redirect('/admincp/news/edit/' + req.params.newsid);
		} else {
			next();
		}
	},

	/** Cambia el estado de una noticia entre activa/inactiva */
	async handleNewsToggle(req, res) {
		try {
			const news = await db('News').where({
				id: req.body.id
			}).first();
			if (news) {
				let active = (news.active ? 0 : 1);
				await db('News').where({
					id: news.id
				}).update({
					active: active
				});
				req.flash('success', 'Se ha actualizado el estado de la noticia corrrectamente');
				res.redirect('/admincp/news');
			} else {
				req.flash('error', 'La noticia no existe');
				res.redirect('/admincp/news');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/admincp/news');
			helpers.submitError('adminController.handleNewsToggle', error);
		}
	},

	/** Elimina la noticia pasada por parámetro */
	async handleNewsRemove(req, res) {
		try {
			const news = await db('News').where({
				id: req.body.id
			}).first();
			if (news) {
				await db('News').where({
					id: news.id
				}).del();
				req.flash('success', 'Se ha borrado la noticia corrrectamente');
				res.redirect('/admincp/news');
			} else {
				req.flash('error', 'La noticia no existe');
				res.redirect('/admincp/news');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error conectando con la base de datos.');
			res.redirect('/admincp/news');
			helpers.submitError('adminController.handleNewsRemove', error);
		}
	},

	/** Devuelve la noticia a editar */
	async getNewsToEdit(req, res, next) {

		if (isNaN(req.params.newsid)) {
			req.flash('error', 'La noticia no existe');
			res.redirect('/admincp/news');
		}
		try {
			res.locals.news = await db('News').where({
				id: req.params.newsid
			}).first();
			if (res.locals.news) {
				next();
			} else {
				req.flash('error', 'La noticia no existe');
				res.redirect('/admincp/news');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error conectando con la base de datos.');
			res.redirect('/admincp/news');
			helpers.submitError('adminController.getNewsToEdit', error);
		}
	},

	/** Realiza la edición de la noticia pasada por parámetro */
	async handleNewsEdit(req, res) {
		if (isNaN(req.params.newsid)) {
			req.flash('error', 'La noticia no existe');
			res.redirect('/admincp/news');
		}
		try {
			const news = await db('News').where({
				id: req.params.newsid
			}).first();
			if (news) {
				let active = (req.body.active ? 1 : 0);
				await db('News').where({
					id: news.id
				}).update({
					title: req.body.title,
					author: req.body.author,
					active: active,
					content: req.body.content
				});
				req.flash('success', 'La noticia ha sido editada exitosamente.');
				res.redirect('/admincp/news');
			} else {
				req.flash('error', 'La noticia no existe');
				res.redirect('/admincp/news');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error conectando con la base de datos.');
			res.redirect('/admincp/news');
			helpers.submitError('adminController.handleEditNews', error);
		}
	},

	/** Añade una nueva noticia */
	async handleNewsAdd(req, res) {
		let active = (req.body.active ? 1 : 0);
		try {
			await db('News').insert({
				title: req.body.title,
				author: req.body.author,
				active: active,
				content: req.body.content,
				created_at: moment().format('YYYY-MM-DD HH:mm:ss')
			});
			req.flash('success', 'La noticia ha sido creada correctamente');
			res.redirect('/admincp/news');
		} catch (error) {
			req.flash('error', 'Hubo un error conectando con la base de datos.');
			res.redirect('/admincp/news');
			helpers.submitError('adminController.handleNewsAdd', error);
		}
	},

	/** Valida los campos del módulo de Webshop */
	verifyWebshopConfig(req, res, next) {
		req.assert('coinsPerItemLevel', 'El campo de nivel de cuenta contiene errores').notEmpty().isInt();
		req.assert('coinsPerOptionLevel', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('coinsForLuck', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('coinsForSkill', 'El campo no puede estar vacio').notEmpty().isInt();
		req.assert('coinsForExcellentOption1', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('coinsForExcellentOption2', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('coinsForExcellentOption3', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('coinsForExcellentOption4', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('coinsForExcellentOption5', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();
		req.assert('coinsForExcellentOption6', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();

		if (req.validationErrors()) {
			req.flash('validation-error', req.validationErrors());
			res.redirect('/admincp/webshop/settings');
		} else {
			next();
		}
	},

	/** Guarda la configuración del módulo de Webshop */
	async handleWebshopConfig(req, res) {
		res.locals.config.webshop.coinsPerItemLevel = parseInt(req.body.coinsPerItemLevel);
		res.locals.config.webshop.coinsPerOptionLevel = parseInt(req.body.coinsPerOptionLevel);
		res.locals.config.webshop.coinsForLuck = parseInt(req.body.coinsForLuck);
		res.locals.config.webshop.coinsForSkill = parseInt(req.body.coinsForSkill);
		res.locals.config.webshop.coinsForExcellentOption1 = parseInt(req.body.coinsForExcellentOption1);
		res.locals.config.webshop.coinsForExcellentOption2 = parseInt(req.body.coinsForExcellentOption2);
		res.locals.config.webshop.coinsForExcellentOption3 = parseInt(req.body.coinsForExcellentOption3);
		res.locals.config.webshop.coinsForExcellentOption4 = parseInt(req.body.coinsForExcellentOption4);
		res.locals.config.webshop.coinsForExcellentOption5 = parseInt(req.body.coinsForExcellentOption5);
		res.locals.config.webshop.coinsForExcellentOption6 = parseInt(req.body.coinsForExcellentOption6);
		try {
			await helpers.writeFile("./config.json", JSON.stringify(config, null, 2));
			req.flash('success', 'Los cambios se han realizado con exito.');
			res.redirect('/admincp/webshop/settings');
		} catch (error) {
			req.flash('error', 'Hubo un error inesperado.');
			res.redirect('/admincp/webshop/settings');
		}
	},

	/** Valida los campos del módulo de Webshop al añadir una categoria */
	validateWebshopCategory(req, res, next) {
		req.assert('name', 'El campo no puede estar vacio').notEmpty();
		req.assert('discount', 'El campo no puede estar vacio y debe ser numérico').notEmpty().len(1, 3).isInt();

		if (req.validationErrors()) {
			req.flash('validation-error', req.validationErrors());
			res.redirect('/admincp/webshop/category/add');
		} else {
			next();
		}
	},

	/** Añade la categoria al webshop */
	async handleWebshopCategoryAdd(req, res) {
		try {
			const category = await db('Webshop_categories').where({
				name: req.body.name
			}).first();
			if (!category) {
				let active = (req.body.active ? 1 : 0);
				await db('Webshop_categories').insert({
					name: req.body.name,
					discount: req.body.discount,
					active: active
				});
				req.flash('success', 'La categoria ha sido creada correctamente');
				res.redirect('/admincp/webshop');
			} else {
				req.flash('error', 'La categoria ya existe');
				res.redirect('/admincp/webshop/category/add');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error conectando con la base de datos.');
			res.redirect('/admincp/webshop/category/add');
			helpers.submitError('adminController.handleWebshopCategoryAdd', error);
		}
	},

	/** Cambia el estado de una categoria entre activa/inactiva */
	async handleWebshopCategoryToggle(req, res) {
		try {
			const category = await db('Webshop_categories').where({
				id: req.body.id
			}).first();
			if (category) {
				let active = (category.active ? 0 : 1);
				await db('Webshop_categories').where({
					id: category.id
				}).update({
					active: active
				});
				req.flash('success', 'Se ha actualizado el estado de la categoria corrrectamente');
				res.redirect('/admincp/webshop');
			} else {
				req.flash('error', 'La categoria no existe');
				res.redirect('/admincp/webshop');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error conectando con la base de datos.');
			res.redirect('/admincp/webshop');
			helpers.submitError('adminController.handleWebshopCategoryToggle', error);
		}
	},

	/** Borra una categoria del webshop */
	async handleWebshopCategoryRemove(req, res) {
		try {
			const category = await db('Webshop_categories').where({
				id: req.body.id
			}).first();
			res.locals.category = category;
			if (category) {
				const items = await db('Webshop_items').where({
					categoryid: res.locals.category.id
				}).first();
				if (!items) {
					await db('Webshop_categories').where({
						id: res.locals.category.id
					}).del();
					req.flash('success', 'Se ha borrado la categoria corrrectamente');
					res.redirect('/admincp/webshop');
				} else {
					req.flash('error', 'No se puede borrar una categoria con items en ella');
					res.redirect('/admincp/webshop');
				}
			} else {
				req.flash('error', 'La categoria no existe');
				res.redirect('/admincp/webshop');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error conectando con la base de datos.');
			res.redirect('/admincp/webshop');
			helpers.submitError('adminController.handleWebshopCategoryRemove', error);
		}
	},

	/** Devuelve la categoria a editar */
	async getCategoryToEdit(req, res, next) {
		if (isNaN(req.params.categoryid)) {
			req.flash('error', 'La categoria no existe');
			res.redirect('/admincp/webshop');
		}
		try {
			const category = await db('Webshop_categories').where({
				id: req.params.categoryid
			}).first();
			if (category) {
				res.locals.category = category;
				next();
			} else {
				req.flash('error', 'La categoria no existe');
				res.redirect('/admincp/webshop');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error conectando con la base de datos.');
			res.redirect('/admincp/webshop');
			helpers.submitError('adminController.getCategoryToEdit', error);
		}
	},

	/** Realiza la edición de la categoria */
	async handleWebshopCategoryEdit(req, res) {
		if (isNaN(req.params.categoryid)) {
			req.flash('error', 'La noticia no existe');
			res.redirect('/admincp/webshop');
		}

		try {
			const category = await db('Webshop_categories').where({
				id: req.params.categoryid
			}).first();
			if (category) {
				let active = (req.body.active ? 1 : 0);
				await db('Webshop_categories').where({
					id: category.id
				}).update({
					name: req.body.name,
					discount: req.body.discount,
					active: active,
				});
				req.flash('success', 'La noticia ha sido editada exitosamente.');
				res.redirect('/admincp/webshop');
			} else {
				req.flash('error', 'La categoria no existe');
				res.redirect('/admincp/webshop');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error conectando con la base de datos.');
			res.redirect('/admincp/webshop');
			helpers.submitError('adminController.handleWebshopCategoryEdit', error);
		}
	},

	/** Valida el item a editar */
	async validateItem(req, res, next) {
		try {
			const category = await db('Webshop_categories').where({
				id: req.body.categoryid
			}).first();
			if (category) {
				req.body.active = (req.body.active ? 1 : 0);
				req.body.canLuck = (req.body.canLuck ? 1 : 0);
				req.body.canSkill = (req.body.canSkill ? 1 : 0);
				req.body.excellentOption1 = (req.body.excellentOption1 ? 1 : 0);
				req.body.excellentOption2 = (req.body.excellentOption2 ? 1 : 0);
				req.body.excellentOption3 = (req.body.excellentOption3 ? 1 : 0);
				req.body.excellentOption4 = (req.body.excellentOption4 ? 1 : 0);
				req.body.excellentOption5 = (req.body.excellentOption5 ? 1 : 0);
				req.body.excellentOption6 = (req.body.excellentOption6 ? 1 : 0);

				req.assert('name', 'El campo no puede estar vacio').notEmpty();
				req.assert('discount', 'El campo no puede estar vacio y debe ser numérico').notEmpty().len(1, 3).isInt();
				req.assert('hex', 'El campo debe ser de 32 caracteres').notEmpty().len(32, 32);
				req.assert('cost', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();

				if (req.validationErrors()) {
					req.flash('validation-error', req.validationErrors());
					res.redirect('/admincp/webshop/item/add');
				} else {
					next();
				}
			} else {
				req.flash('error', 'La categoria no existe');
				res.redirect('/admincp/webshop');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error conectando con la base de datos.');
			res.redirect('/admincp');
			helpers.submitError('adminController.validateItem', error);
		}
	},

	/** Añade un item al webshop */
	async handleWebshopItemAdd(req, res) {
		try {
			await db('Webshop_items').insert({
				name: req.body.name,
				hex: req.body.hex,
				discount: req.body.discount,
				cost: req.body.cost,
				active: req.body.active,
				categoryid: req.body.categoryid,
				maxLevel: req.body.maxLevel,
				maxOption: req.body.maxOption,
				canLuck: req.body.canLuck,
				canSkill: req.body.canSkill,
				excellentOption1: req.body.excellentOption1,
				excellentOption2: req.body.excellentOption2,
				excellentOption3: req.body.excellentOption3,
				excellentOption4: req.body.excellentOption4,
				excellentOption5: req.body.excellentOption5,
				excellentOption6: req.body.excellentOption6,
				maxExcellent: req.body.maxExcellent
			});
			req.flash('success', 'El item se ha agregado correctamente.');
			res.redirect('/admincp/webshop');
		} catch (error) {
			req.flash('error', 'Hubo un error conectando con la base de datos.');
			res.redirect('/admincp/webshop');
			helpers.submitError('adminController.handleWebshopItemAdd', error);
		}
	},

	/** Cambia el estado de un item del webshop entre Activo/Inactivo */
	async handleWebshopItemToggle(req, res) {
		try {
			const item = await db('Webshop_items').where({
				id: req.body.id
			}).first();
			if (item) {
				let active = (item.active ? 0 : 1);
				await db('Webshop_items').where({
					id: item.id
				}).update({
					active: active
				});
				req.flash('success', 'Se ha actualizado el estado del item corrrectamente');
				res.redirect('/admincp/webshop');
			} else {
				req.flash('error', 'El item no existe');
				res.redirect('/admincp/webshop');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error conectando con la base de datos.');
			res.redirect('/admincp/webshop');
			helpers.submitError('adminController.handleWebshopItemToggle', error);
		}
	},

	/** Borra un item del webshop */
	async handleWebshopItemRemove(req, res) {
		try {
			const item = await db('Webshop_items').where({
				id: req.body.id
			}).first();
			if (item) {
				await db('Webshop_items').where({
					id: item.id
				}).del();
				req.flash('success', 'Se ha borrado el item corrrectamente');
				res.redirect('/admincp/webshop');
			} else {
				req.flash('error', 'El item no existe');
				res.redirect('/admincp/webshop');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error conectando con la base de datos.');
			res.redirect('/admincp/webshop');
			helpers.submitError('adminController.handleWebshopItemRemove', error);
		}
	},

	/** Devuelve el item para editar del webshop */
	async getItemToEdit(req, res, next) {
		if (isNaN(req.params.itemid)) {
			req.flash('error', 'El item no existe');
			res.redirect('/admincp/webshop');
		}
		try {
			const items = await db('Webshop_items').where({
				id: req.params.itemid
			}).first();
			if (items) {
				res.locals.item = items;
				res.locals.itemDetails = new item(items.hex);
				next();
			} else {
				req.flash('error', 'El item no existe');
				res.redirect('/admincp/webshop');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error conectando con la base de datos.');
			res.redirect('/admincp/webshop');
			helpers.submitError('adminController.getItemToEdit', error);
		}
	},

	/** Valida los campos del item a editar */
	async validateItemEdit(req, res, next) {
		try {
			const category = await db('Webshop_categories').where({
				id: req.body.categoryid
			}).first();
			if (category) {
				req.body.active = (req.body.active ? 1 : 0);
				req.body.canLuck = (req.body.canLuck ? 1 : 0);
				req.body.canSkill = (req.body.canSkill ? 1 : 0);
				req.body.excellentOption1 = (req.body.excellentOption1 ? 1 : 0);
				req.body.excellentOption2 = (req.body.excellentOption2 ? 1 : 0);
				req.body.excellentOption3 = (req.body.excellentOption3 ? 1 : 0);
				req.body.excellentOption4 = (req.body.excellentOption4 ? 1 : 0);
				req.body.excellentOption5 = (req.body.excellentOption5 ? 1 : 0);
				req.body.excellentOption6 = (req.body.excellentOption6 ? 1 : 0);

				req.assert('discount', 'El campo no puede estar vacio y debe ser numérico').notEmpty().len(1, 3).isInt();
				req.assert('cost', 'El campo no puede estar vacio y debe ser numérico').notEmpty().isInt();

				if (req.validationErrors()) {
					req.flash('validation-error', req.validationErrors());
					res.redirect('/admincp/webshop/item/edit' + req.params.itemid);
				} else {
					next();
				}
			} else {
				req.flash('error', 'La categoria no existe');
				res.redirect('/admincp/webshop');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error conectando con la base de datos.');
			res.redirect('/admincp');
			helpers.submitError('adminController.validateItemEdit', error);
		}
	},

	/** Realiza la edición del item del webshop */
	async handleWebshopItemEdit(req, res) {

		if (isNaN(req.params.itemid)) {
			req.flash('error', 'El item no existe');
			res.redirect('/admincp/webshop');
		}
		try {
			const items = await db('Webshop_items').where({
				id: req.params.itemid
			}).first();
			if (items) {
				let active = (req.body.active ? 1 : 0);
				await db('Webshop_items').where({
					id: items.id
				}).update({
					discount: req.body.discount,
					cost: req.body.cost,
					active: active,
					categoryid: req.body.categoryid,
					maxLevel: req.body.maxLevel,
					maxOption: req.body.maxOption,
					canLuck: req.body.canLuck,
					canSkill: req.body.canSkill,
					excellentOption1: req.body.excellentOption1,
					excellentOption2: req.body.excellentOption2,
					excellentOption3: req.body.excellentOption3,
					excellentOption4: req.body.excellentOption4,
					excellentOption5: req.body.excellentOption5,
					excellentOption6: req.body.excellentOption6,
					maxExcellent: req.body.maxExcellent
				});
				req.flash('success', 'El item ha sido editado exitosamente.');
				res.redirect('/admincp/webshop');
			} else {
				req.flash('error', 'La noticia no existe');
				res.redirect('/admincp/webshop');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error conectando con la base de datos.');
			res.redirect('/admincp/webshop/item/edit/' + items.id);
			helpers.submitError('adminController.handleWebshopItemEdit', error);
		}
	},


	/** Obtiene las categorias del webshop */
	async getCategories(req, res, next) {
		try {
			const categories = await db('Webshop_categories');
			res.locals.webshopCategories = categories;
			next();
		} catch (error) {
			req.flash('error', 'Hubo un error conectando con la base de datos.');
			res.redirect('/admincp');
			helpers.submitError('adminController.getCategories', error);
		}
	},

	/** Obtiene los items del webshop */
	async getItems(req, res, next) {
		try {
			const items = await db('Webshop_items');
			res.locals.webshopItems = items;
			next();
		} catch (error) {
			req.flash('error', 'Hubo un error conectando con la base de datos.');
			res.redirect('/admincp');
			helpers.submitError('adminController.handlegetItems', error);
		}
	},

	/** Añade MuCoins a una cuenta */
	async handleAddMuCoins(req, res) {
		try {
			const account = await db('MEMB_INFO').where({
				memb___id: req.body.account
			}).first();
			if (account) {
				await db('MEMB_INFO').where({
					memb___id: account.memb___id
				}).update({
					mucoins: parseInt(account.mucoins) + parseInt(req.body.amount)
				});
				helpers.submitPurchase(account.memb___id, req.body.amount, `${req.user.memb___id} le acreditó ${req.body.amount} mu coins`);
				req.flash('success', `Se han acreditado ${req.body.amount} mu coins a la cuenta ${account.memb___id}`);
				res.redirect('/admincp');
			} else {
				req.flash('error', 'La cuenta no existe');
				res.redirect('/admincp');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error conectando con la base de datos.');
			res.redirect('/admincp');
			helpers.submitError('adminController.handleAddMuCoins', error);
		}
	},

	async getErrors(req, res, next) {
		try {
			const eLOG = await helpers.readFile('logs/error.log.json');
			res.locals.eLOG = await JSONify(eLOG);
			next();
		} catch (error) {
			req.flash('error', 'Hubo un error conectando con la base de datos.');
			res.redirect('/admincp');
			helpers.submitError('adminController.getErrors', error);
		}
	},

	async getPurchases(req, res, next) {
		try {
			const pLOG = await helpers.readFile('logs/purchases.log.json');
			res.locals.pLOG = await JSONify(pLOG);
			next();
		} catch (error) {
			req.flash('error', 'Hubo un error conectando con la base de datos.');
			res.redirect('/admincp');
			helpers.submitError('adminController.getPurchases', error);
		}
	}

};

function JSONify(string) {
	return new Promise((fulfill, reject) => {
		string = string.split(/\r?\n/); // We split up in lines
		string = string.filter((data) => { // Filter out the empty lines
			return data !== '';
		});
		let json = `[`; // Start the JSON array with [
		for (let i = 0; i < string.length - 1; i++) { // For every line we put a colon
			json += `${string[i]},`;
		}
		json += `${string[string.length - 1]}]`; // Finnally we add the final ]
		fulfill(JSON.parse(json));
	});
}

export default controller;