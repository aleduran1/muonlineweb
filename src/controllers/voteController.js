'use strict';

import db from '../db';
import moment from 'moment';
import helpers, { readConfigFileSync } from '../helpers';

const voteConfig = readConfigFileSync().vote;

const controller = {

	initialize(req, res, next) {
		res.locals.ultratop100coins = voteConfig.ultratop100;
		next();
	},

	async canVoteUT100(req, res, next) {
		try {
			res.locals.canVote = {};
			const account = await db('MEMB_INFO').where('memb___id', req.user.memb___id).first();
			if (!account.ultratop100_voted) {
				res.locals.canVote.ultratop100 = 1;
				next();
			} else {
				account.ultratop100_voted = moment(account.ultratop100_voted).add(12, 'hours').format('YYYY-MM-DD HH:mm:ss');
				if (moment().isSameOrAfter(account.ultratop100_voted)) {
					res.locals.canVote.ultratop100 = 1;
					next();
				} else {
					res.locals.canVote.ultratop100 = 0;
					next();
				}
			}
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/');
			helpers.submitError('voteController.canVote', error);
		}
	},

	async verifyRewardUT100(req, res, next) {
		try {
			res.locals.canVote = {};
			if (req.query.custom) {
				const account = await db('MEMB_INFO').where('memb___id', req.query.custom).first();
				if (!account.ultratop100_voted) {
					res.locals.canVote.ultratop100 = 1;
					next();
				} else {
					account.ultratop100_voted = moment(account.ultratop100_voted).add(12, 'hours').format('YYYY-MM-DD HH:mm:ss');
					if (moment().isSameOrAfter(account.ultratop100_voted)) {
						res.locals.canVote.ultratop100 = 1;
						next();
					} else {
						res.locals.canVote.ultratop100 = 0;
						next();
					}
				}
			} else {
				req.flash('error', 'Hubo un error, contacta a un administrador.');
				res.redirect('/');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/');
			helpers.submitError('voteController.canVote', error);
		}
	},

	async handleRewardUT100(req, res) {
		try {
			if (res.locals.canVote.ultratop100) {
				const account = await db('MEMB_INFO').where('memb___id', req.query.custom).first();
				await db('MEMB_INFO').where('memb___id', req.query.custom).update({
					ultratop100_voted: moment().format('YYYY-MM-DD HH:mm:ss'),
					mucoins: parseInt(account.mucoins) + parseInt(res.locals.ultratop100coins)
				});
				req.flash('success', `¡Has votado correctamente en UltraTop100 y has ganado ${res.locals.ultratop100coins} mu coins, muchas gracias por tu contribución!`);
				res.redirect('/vote');
			} else {
				req.flash('error', 'Ya has votado en UltraTop100, vuelve a intentar en 12 horas.');
				res.redirect('/vote');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/vote');
			helpers.submitError('voteController.handleRewardUltraTop100', error);
		}
	},

};

export default controller;