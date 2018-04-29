'use strict';

import db from '../db';
import helpers from '../helpers';

const controller = {

	/** Muestra el estado del servidor */
	async getServerStatus(req, res, next) {
		try {
			res.locals.serverStatus = await helpers.getStatus();
			next();
		} catch (error) {
			helpers.submitError('helper.getServerStatus', error);
			res.locals.serverStatus = false;
			next();
		}
	},

	/** Añade el local con la información de los jugadores en línea */
	async getPlayersOnline(req, res, next) {
		try {
			const onlinePlayers = await db('MEMB_STAT').count('ConnectStat').where({
				ConnectStat: 1
			});
			res.locals.onlinePlayers = onlinePlayers[0][''];
			next();
		} catch (error) {
			helpers.submitError('helper.getPlayersOnline', error);
		}
	},

	async getBannedAccounts(req, res, next) {
		try {
			const bannedList = await db('Character').count('Name').where('ctlcode', 17).orWhere('ctlcode', 1);
			res.locals.bannedList = bannedList[0][''];
			next();
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/');
			helpers.submitError('serverinfoController.getStadistics', error);
		}
	},

	async getCreatedAccounts(req, res, next) {
		try {
			const createdAccounts = await db('MEMB_INFO').count('memb_guid');
			res.locals.createdAccounts = createdAccounts[0][''];
			next();
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/');
			helpers.submitError('serverinfoController.getCreatedAccounts', error);
		}
	},

	async getCreatedCharacters(req, res, next) {
		try {
			const createdCharacters = await db('Character').count('Name');
			res.locals.createdCharacters = createdCharacters[0][''];
			next();
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/');
			helpers.submitError('serverinfoController.getStadistics', error);
		}
	},

	async getCreatedGuilds(req, res, next) {
		try {
			const createdGuilds = await db('Guild').count('G_Name');
			res.locals.createdGuilds = createdGuilds[0][''];
			next();
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/');
			helpers.submitError('serverinfoController.getStadistics', error);
		}
	},

	async getAdmins(req, res, next) {
		try {
			const admins = await db('Character').select('Name', 'AccountID').where('ctlcode', 24)
				.orWhere('ctlcode', 8)
				.orWhere('ctlcode', 32);
			res.locals.adminListCount = admins.length;
			res.locals.adminsOnline = 0;
			for (let admin in admins) {
				let accountID = admins[admin]['AccountID'];
				const adminsOnline = await db('MEMB_STAT').where({
					memb___id: accountID,
					ConnectStat: 1
				});
				if (adminsOnline.length) {
					res.locals.adminsOnline++;
				}
			}
			next();
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/');
			helpers.submitError('serverinfoController.getAdmins', error);
		}
	},

};

export default controller;