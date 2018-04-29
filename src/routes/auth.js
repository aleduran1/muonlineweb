'use strict';

import express from 'express';
import passport from '../passport';
import controller from '../controllers/authController';
import helpers, { readConfigFileSync } from '../helpers';
const router = express.Router();
const modules = readConfigFileSync().modules;

/***************************************************************
 *	LOGIN ROUTES
 ***************************************************************/
if (modules.Login) {
	router.get('/', controller.isLoggedIn, (req, res) => {
		console.log(req.session.attempts);
		res.locals.active = {
			auth: true
		};
		res.locals.moduleTitle = "Ingresar";
		res.locals.module = () => "login";
		res.render('index');
	});

	router.post('/', controller.isLoggedIn, helpers.validateCaptcha, controller.validateLogin, passport.authenticate('login', {
		successReturnToOrRedirect: '/',
		failureRedirect: '/auth', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));
}

/***************************************************************
 *	REGISTER ROUTES
 ***************************************************************/
if (modules.Register) {
	router.get('/register', controller.isLoggedIn, (req, res) => {
		res.locals.active = {
			auth: true
		};
		res.locals.moduleTitle = "Registro";
		res.locals.module = () => "register";
		res.render('index');
	});

	router.post('/register', controller.isLoggedIn, helpers.validateCaptcha, controller.validateRegister, passport.authenticate('signup', {
		successRedirect: '/', // redirect to the secure profile section
		failureRedirect: '/auth/register', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));
}
/***************************************************************
 *	LOGOUT ROUTE
 ***************************************************************/

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

/***************************************************************
 *	FORGOT ROUTE
 ***************************************************************/

router.get('/forgot', controller.isLoggedIn, (req, res) => {
	res.locals.active = {
		auth: true
	};
	res.locals.moduleTitle = "Recuperar contraseña";
	res.locals.module = () => "forgot";
	res.render('index');
});

router.post('/forgot', helpers.validateCaptcha, controller.validateForgot, controller.handleForgot);

/***************************************************************
 *	RESETPASSWORD ROUTE
 ***************************************************************/

router.get('/resetpassword/:token', controller.isLoggedIn, controller.validateResetPassword, controller.handleResetPassword, (req, res) => {
	res.locals.active = {
		auth: true
	};
	res.locals.moduleTitle = "Restablecer Contraseña";
	res.locals.module = () => "resetPassword";
	res.render('index');
});

export default router;