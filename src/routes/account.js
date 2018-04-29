import express from 'express';
import helpers, { readConfigFileSync } from '../helpers';
import controller from '../controllers/accountController';
const router = express.Router();
const active = readConfigFileSync().modules;

/***************************************************************
 *	ACCOUNT ROUTE
 ***************************************************************/

router.get('/', helpers.isAuth, controller.getStats, controller.getVIP, (req, res) => {

	res.locals.moduleTitle = 'Mi Cuenta';
	res.locals.module = () => 'account';
	res.locals.active = {
		account: true
	};
	res.render('index');
});

/***************************************************************
 *	CHANGE PASSWORD ROUTES
 ***************************************************************/

router.route('/changepassword')

	.get(helpers.isAuth, (req, res) => {
		res.locals.moduleTitle = 'Cambiar Contraseña';
		res.locals.module = () => 'changepassword';
		res.locals.active = {
			auth: true
		};
		res.render('index');
	})

	.post(helpers.isAuth, helpers.validateCaptcha, controller.validateChangePassword, controller.handleChangePassword);

/***************************************************************
 *	CHANGE MAIL ROUTES
 ***************************************************************/

router.route('/changemail')

	.get(helpers.isAuth, (req, res) => {
		res.locals.moduleTitle = 'Cambiar Correo';
		res.locals.module = () => 'changemail';
		res.locals.active = {
			auth: true
		};
		res.render('index');
	})

	.post(helpers.isAuth, helpers.validateCaptcha, controller.validateChangeMail, controller.handleChangeMail);

/***************************************************************
 *	CHARACTERS ROUTES
 ***************************************************************/

router.get('/characters', helpers.isAuth, controller.getStats, controller.getCharacters, (req, res) => {
	res.locals.moduleTitle = 'Mis Personajes';
	res.locals.module = () => 'characters';
	res.locals.active = {
		characters: true
	};
	res.render('index');
});

/***************************************************************
 *	RESET ROUTES
 ***************************************************************/

router.post('/characters/reset', helpers.isAuth, controller.validateReset, controller.handleReset);

/***************************************************************
 *	PKCLEAR ROUTES
 ***************************************************************/

router.post('/characters/clearpk', helpers.isAuth, controller.validateClearPK, controller.handleClearPK);

/***************************************************************
 *	UNSTUCK ROUTES
 ***************************************************************/

router.post('/characters/unstuck', helpers.isAuth, controller.validateUnstuck, controller.handleUnstuck);

/***************************************************************
 *	ADD STATS ROUTES
 ***************************************************************/

router.post('/characters/addstats', helpers.isAuth, controller.validateAddStats, controller.handleAddStats);

/***************************************************************
 *	VIP ROUTES
 ***************************************************************/
if (active.Vip) {
	router.get('/vip', helpers.isAuth, controller.getVIP, controller.getVIPList, (req, res) => {
		res.locals.moduleTitle = 'VIP';
		res.locals.module = () => 'vip';
		res.locals.active = {
			vip: true
		};
		res.render('index');
	});

	/***************************************************************
	 *	VIP TRIAL ROUTES
	 ***************************************************************/

	router.post('/vip/trial', helpers.isAuth, controller.validateVIPTrial, controller.handleVIPTrial);

	/***************************************************************
	 *	VIP EXTEND ROUTES
	 ***************************************************************/

	router.post('/vip/extend', helpers.isAuth, controller.validateVIPExtend, controller.handleVIPExtend);

	/***************************************************************
	 *	VIP BUY ROUTES
	 ***************************************************************/

	router.post('/vip/buy', helpers.isAuth, controller.validateVIPBuy, controller.handleVIPBuy);
}


/***************************************************************
 *	WAREHOUSE ROUTE
 ***************************************************************/

router.get('/warehouse', helpers.isAuth, helpers.getWarehouse, (req, res) => {
	res.locals.moduleTitle = "Baúl";
	res.locals.module = () => "warehouse";
	res.locals.active = {
		warehouse: true
	};
	res.render('index');
});

export default router;