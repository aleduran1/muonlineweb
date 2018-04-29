'use strict';

import db from '../db';
import helpers from '../helpers';
import warehouse from '../models/warehouse';
import moment from 'moment';

const controller = {

	/** Pasa el LOCAL con los personajes de la cuenta logueada */
	async getCharacters(req, res, next) {
		try {
			const characters = await db('Character').where('AccountID', req.user.memb___id);
			res.locals.characters = characters;
			next();
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/');
			helpers.submitError('accountController.getCharacters', error);
		}
	},

	/** Pasa el LOCAL con la información de la cuenta */
	async getStats(req, res, next) {
		try {
			const stats = await db('MEMB_STAT').where('memb___id', req.user.memb___id).first();
			res.locals.stats = stats;
			next();
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/');
			helpers.submitError('accountController.getStats', error);
		}
	},

	/** Pasa la información VIP del usuario si es que es vip */
	getVIP(req, res, next) {
		if (parseInt(req.user.AccountLevel) !== 0) {
			res.locals.vip = {
				active: '1',
				last: req.user.AccountExpireDate,
				level: req.user.AccountLevel,
				name: res.locals.config.vip.accountLevel[req.user.AccountLevel].name,
				paquetes: res.locals.config.vip.accountLevel[req.user.AccountLevel].paquetes
			};
			next();
		} else {
			next();
		}
	},

	/** Devuelve la lista de VIP */
	getVIPList(req, res, next) {
		res.locals.vipList = res.locals.config.vip;
		next();
	},

	/** Validación de Express-Validator para el formulario de Cambio de contraseña*/
	validateChangePassword(req, res, next) {
		req.assert('actualPassword', 'La contraseña debe contener de 6 a 12 caracteres').len(6, 12);
		req.assert('actualPassword', 'La contraseña solo puede contener números o letras').isValidField();
		req.assert('password', 'La contraseña debe contener de 6 a 12 caracteres').len(6, 12);
		req.assert('password', 'La contraseña solo puede contener números o letras').isValidField();
		req.assert('password', 'Las contraseñas deben ser iguales').matchPasswords(req.body.passwordConfirm);

		if (req.validationErrors()) {
			req.flash('validation-error', req.validationErrors());
			res.redirect('/account/changepassword');
		} else {
			if (req.user.memb__pwd !== req.body.actualPassword) {
				req.flash('error', 'La contraseña actual ingresada es incorrecta.');
				res.redirect('/account/changepassword');
			} else {
				next();
			}
		}
	},

	/** Cambio de contraseña */
	async handleChangePassword(req, res, next) {
		try {
			await db('MEMB_INFO').where('memb___id', req.user.memb___id).update({
				memb__pwd: req.body.password
			});
			req.flash('success', 'La contraseña se ha cambiado correctamente.');
			res.redirect('/account');
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/account/changepassword');
			helpers.submitError('accountController.handleChangePassword', error);
		}
	},

	/** Validación de Express-Validator para el formulario de Cambio de correo*/
	async validateChangeMail(req, res, next) {
		req.assert('mailActual', 'El mail actual debe ser valido').isEmail();
		req.assert('mail', 'El mail debe ser valido').isEmail();
		req.assert('mail', 'Los correos deben ser iguales').matchPasswords(req.body.mailConfirm);

		if (req.validationErrors()) {
			req.flash('validation-error', req.validationErrors());
			res.redirect('/account/changemail');
		} else {
			if (req.user.mail_addr !== req.body.mailActual) {
				req.flash('error', 'El correo actual ingresado es incorrecto.');
				res.redirect('/account/changemail');
			} else {
				try {
					const mail = await db('MEMB_INFO').where('mail_addr', req.body.mail).first();
					if (!mail) {
						next();
					} else {
						req.flash('error', 'El correo actual ingresado ya se encuentra utilizado.');
						res.redirect('/account/changemail');
					}
				} catch (error) {
					req.flash('error', 'Hubo un error, contacta a un administrador.');
					res.redirect('/account/changemail');
					helpers.submitError('accountController.validateChangeMail', error);
				}
			}
		}
	},

	/** Cambio de mail */
	async handleChangeMail(req, res, next) {
		try {
			await db('MEMB_INFO').where('memb___id', req.user.memb___id).update({
				mail_addr: req.body.mail
			});
			req.flash('success', 'El correo electrónico se ha cambiado satisfactoriamente.');
			res.redirect('/account');
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/account/changemail');
			helpers.submitError('POST /account/changemail', error);
		}
	},

	/** Hace las validaciones necesarias para comprobar si el personaje puede resetear */
	async validateReset(req, res, next) {
		try {
			const [character, status] = await Promise.all([helpers.belongsToAccount(req.body.cid, req.user.memb___id), helpers.isOffline(req.user.memb___id)]);
			if (character) { // Chequeamos si existe el personaje con esa cuenta
				res.locals.character = character;
				if (status) {
					if (helpers.canReset(character.cLevel, character.Money, character.ResetCount, req.user.AccountLevel)) {
						next();
					} else {
						req.flash('error', `${res.locals.character.Name} no cumple los requisitos para poder resetear`);
						res.redirect('/account/characters');
					}
				} else {
					req.flash('error', 'Debes desconectarte de la cuenta para utilizar los servicios online.');
					res.redirect('/account/characters');
				}
			} else {
				req.flash('error', 'Hubo un error, contacta a un administrador.');
				res.redirect('/account/characters');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/account/characters');
			helpers.submitError('accountController.validateReset', error);
		}
	},

	/** Hace el handle del reset*/
	async handleReset(req, res, next) {
		try {
			const defaults = await helpers.getClassDefaults(res.locals.character.Class);
			const accLevel = req.user.AccountLevel;
			const cost = res.locals.config.reset.accountLevel[accLevel].zen + res.locals.config.reset.costxreset * (res.locals.character.ResetCount + 1);
			await db('Character').where('Name', res.locals.character.Name).update({
				cLevel: 1,
				ResetCount: res.locals.character.ResetCount + 1,
				LevelUpPoint: res.locals.config.reset.statsPerReset * (res.locals.character.ResetCount + 1),
				Money: res.locals.character.Money - (cost <= 2000000000 ? cost : 2000000000),
				MapNumber: defaults.MapNumber,
				MapPosX: defaults.MapPosX,
				MapPosY: defaults.MapPosY,
				EffectList: defaults.EffectList
			});
			/* Si está configurado para resetear stats */
			if (res.locals.config.reset.resetStats) {
				await db('Character').where('Name', res.locals.character.Name).update({
					Strength: defaults.Strength,
					Dexterity: defaults.Dexterity,
					Vitality: defaults.Vitality,
					Energy: defaults.Energy,
					Leadership: defaults.Leadership,
				});
			}
			/* Si está configurado para resetear skills */
			if (res.locals.config.reset.resetSkills) {
				await db('Character').where('Name', res.locals.character.Name).update({
					MagicList: defaults.MagicList
				});
			}
			/* Si está configurado para resetear inventario */
			if (res.locals.config.reset.resetInventory) {
				await db('Character').where('Name', res.locals.character.Name).update({
					Inventory: defaults.Inventory
				});
			}
			req.flash('success', `¡${res.locals.character.Name} ha reseteado con exito!`);
			res.redirect('/account/characters');
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/');
			helpers.submitError('accountController.handleReset', error);
		}
	},

	/** Hace las validaciones necesarias para saber si se puede limpiar el PK */
	async validateClearPK(req, res, next) {
		try {
			const [character, status] = await Promise.all([helpers.belongsToAccount(req.body.cid, req.user.memb___id), helpers.isOffline(req.user.memb___id)]);
			if (character) {
				if (status) {
					if (helpers.canClearPK(character.PkLevel, character.Money, req.user.AccountLevel)) {
						next();
					} else {
						req.flash('error', `${character.Name} no cumple los requisitos para quitarse el PK`);
						res.redirect('/account/characters');
					}
				} else {
					req.flash('error', 'Debes desconectarte de la cuenta para utilizar los servicios online.');
					res.redirect('/account/characters');
				}
			} else {
				req.flash('error', 'Hubo un error, contacta a un administrador.');
				res.redirect('/account/characters');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/account/characters');
			helpers.submitError('accountController.validateClearPK', error);
		}
	},

	/** Hace el Handle de Clear PK */
	async handleClearPK(req, res, next) {
		try {
			const character = res.locals.character;
			const acclvl = req.user.AccountLevel;
			await db('Character').where('Name', character.Name).update({
				PkLevel: '3',
				PkTime: '0',
				Money: parseInt(character.Money) - parseInt(res.locals.config.pkClear.accountLevel[acclvl].zen)
			});
			req.flash('success', `¡${character.Name} ha vuelto a ser inocente!`);
			res.redirect('/account/characters');
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/account/characters');
			helpers.submitError('accountController.handleClearPK', error);
		}
	},

	/** Hace las validaciones para chequear que puede destrabar el personaje */
	async validateUnstuck(req, res, next) {
		try {
			const [character, status] = await Promise.all([helpers.belongsToAccount(req.body.cid, req.user.memb___id), helpers.isOffline(req.user.memb___id)]);
			if (character) {
				res.locals.character = character;
				if (status) {
					next();
				} else {
					req.flash('error', 'Debes desconectarte de la cuenta para utilizar los servicios online.');
					res.redirect('/account/characters');
				}
			} else {
				req.flash('error', 'Hubo un error, contacta a un administrador.');
				res.redirect('/account/characters');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/account/characters');
			helpers.submitError('accountController.validateUnstuck', error);
		}
	},

	/** Hace la query para destrabajar un personaje y lo manda al mapa de unstuck */
	async handleUnstuck(req, res, next) {
		try {
			let character = res.locals.character;
			await db('Character').where('Name', character.Name).update({
				MapNumber: res.locals.config.unstuck.mapNumber,
				MapPosX: res.locals.config.unstuck.posX,
				MapPosY: res.locals.config.unstuck.posY
			});
			req.flash('success', `¡${character.Name} ha sido desbloqueado!`);
			res.redirect('/account/characters');
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/');
			helpers.submitError('accountController.handleUnstuck', error);
		}
	},

	/** Validación para agregar stats */
	async validateAddStats(req, res, next) {
		if (!req.body.strength || !req.body.strength.trim().length)
			req.body.strength = 0;
		if (!req.body.dexterity || !req.body.dexterity.trim().length)
			req.body.dexterity = 0;
		if (!req.body.vitality || !req.body.vitality.trim().length)
			req.body.vitality = 0;
		if (!req.body.energy || !req.body.energy.trim().length)
			req.body.energy = 0;
		if (!req.body.leadership || !req.body.leadership.trim().length)
			req.body.leadership = 0;
		let limit = res.locals.config.addStats.limit;
		req.assert('strength', 'Solo se admiten números en el rango [0-' + limit + ']').isInt().validStat(limit);
		req.assert('dexterity', 'Solo se admiten números en el rango [0-' + limit + ']').isInt().validStat(limit);
		req.assert('vitality', 'Solo se admiten números en el rango [0-' + limit + ']').isInt().validStat(limit);
		req.assert('energy', 'Solo se admiten números en el rango [0-' + limit + ']').isInt().validStat(limit);
		req.assert('leadership', 'Solo se admiten números en el rango [0-' + limit + ']').isInt().validStat(limit);

		if (req.validationErrors()) {
			req.flash('validation-error', req.validationErrors());
			res.redirect('/account/characters');
		} else {
			try {
				const [character, status] = await Promise.all([helpers.belongsToAccount(req.body.cid, req.user.memb___id), helpers.isOffline(req.user.memb___id)]);
				if (character) {
					res.locals.character = character;
					if (status) {
						let statsToAdd = parseInt(req.body.strength) + parseInt(req.body.dexterity) + parseInt(req.body.vitality) + parseInt(req.body.energy) + parseInt(req.body.leadership);
						res.locals.points = statsToAdd;
						if (statsToAdd <= character.LevelUpPoint) {
							if (parseInt(req.body.leadership) > 0 && helpers.getClass(character.Class) !== 'DL') {
								req.flash('error', 'Hubo un error, contacta a un administrador.');
								res.redirect('/account/characters');
							}
							let limit = res.locals.config.addStats.limit;
							if (character.Strength + parseInt(req.body.strength) > limit || character.Dexterity + parseInt(req.body.dexterity) > limit || character.Vitality + parseInt(req.body.vitality) > limit || character.Energy + parseInt(req.body.energy) > limit || character.Leadership + parseInt(req.body.leadership) > limit) {
								req.flash('error', 'No se puede sobrepasar el límite de stats.');
								res.redirect('/account/characters');
							} else {
								next();
							}
						} else {
							req.flash('error', 'No puedes agregar más puntos de los que tienes.');
							res.redirect('/account/characters');
						}
					} else {
						req.flash('error', 'Debes desconectarte de la cuenta para utilizar los servicios online.');
						res.redirect('/account/characters');
					}
				} else {
					req.flash('error', 'Hubo un error, contacta a un administrador.');
					res.redirect('/account/characters');
				}
			} catch (error) {
				req.flash('error', 'Hubo un error, contacta a un administrador.');
				res.redirect('/account/characters');
				helpers.submitError('accountController.validateAddStats', error);
			}
		}
	},

	/** Realiza el add stats */
	async handleAddStats(req, res, next) {
		try {
			let character = res.locals.character;
			await db('Character').where('Name', character.Name).update({
				Strength: character.Strength + parseInt(req.body.strength),
				Dexterity: character.Dexterity + parseInt(req.body.dexterity),
				Vitality: character.Vitality + parseInt(req.body.vitality),
				Energy: character.Energy + parseInt(req.body.energy),
				Leadership: character.Leadership + parseInt(req.body.leadership),
				LevelUpPoint: character.LevelUpPoint - parseInt(res.locals.points)
			});
			req.flash('success', `¡Se han repartido los puntos de ${character.Name} correctamente!`);
			res.redirect('/account/characters');
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/account/characters');
			helpers.submitError('accountController.handleAddStats', error);
		}
	},

	validateVIPTrial(req, res, next) {
		if (res.locals.config.vip.trial.active && !req.user.AccountLevel && !req.user.premiumdone) {
			next();
		} else {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/account/vip');
		}
	},

	async handleVIPTrial(req, res, next) {
		try {
			await db('MEMB_INFO').where('memb___id', req.user.memb___id).update({
				AccountLevel: res.locals.config.vip.trial.accountLevel,
				AccountExpireDate: moment().add(res.locals.config.vip.trial.days, 'days').format('YYYY-MM-DD HH:mm:ss'),
				premiumdone: 1
			});
			req.flash('success', '¡Has activado la membresia vip de prueba satisfactoriamente!');
			res.redirect('/account/vip');
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/account/vip');
			helpers.submitError('accountController.handleVIPTrial', error);
		}
	},

	validateVIPExtend(req, res, next) {
		let packageNumber = req.body._pn;
		let user = req.user;
		let paquete = res.locals.config.vip.accountLevel[req.user.AccountLevel].paquetes[packageNumber];

		if (paquete) {
			res.locals.days = paquete.dias;
			res.locals.coins = paquete.coins;
		} else {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/account/vip');
		}

		if (user.AccountLevel) {
			if (user.mucoins >= res.locals.coins) {
				next();
			} else {
				req.flash('error', 'No tienes los Mu Coins necesarios para realizar la transacción.');
				res.redirect('/account/vip');
			}
		} else {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/account/vip');
		}
	},

	async handleVIPExtend(req, res, next) {
		try {
			const user = req.user;
			const days = res.locals.days;
			const coins = res.locals.coins;
			const vipName = res.locals.config.vip.accountLevel[user.AccountLevel].name;
			await db('MEMB_INFO').where('memb___id', user.memb___id).update({
				AccountExpireDate: moment(user.AccountExpireDate).add(days, 'days').utcOffset(0).format('YYYY-MM-DD HH:mm:ss'),
				mucoins: parseInt(user.mucoins) - parseInt(coins)
			});
			req.flash('success', `¡Has extendido tu membresia ${vipName} por ${days} dias!`);
			res.redirect('/account/vip');
			helpers.submitPurchase(user.memb___id, -parseInt(coins), `Extendió vip ${vipName} por ${days}`);
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/account/vip');
			helpers.submitError('accountController.handleVIPExtend', error);
		}
	},

	validateVIPBuy(req, res, next) {
		res.locals.level = req.body._vn;
		let packageNumber = req.body._pn;
		let user = req.user;
		let paquete = res.locals.config.vip.accountLevel[res.locals.level].paquetes[packageNumber];

		if (paquete) {
			res.locals.days = paquete.dias;
			res.locals.coins = paquete.coins;
		} else {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/account/vip');
		}

		if (!user.AccountLevel) {
			if (user.mucoins >= res.locals.coins) {
				next();
			} else {
				req.flash('error', 'No tienes los Mu Coins necesarios para realizar la transacción.');
				res.redirect('/account/vip');
			}
		} else {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/account/vip');
		}
	},

	async handleVIPBuy(req, res, next) {
		try {
			const level = res.locals.level;
			const coins = res.locals.coins;
			const days = res.locals.days;
			const vipName = res.locals.config.vip.accountLevel[level].name;
			await db('MEMB_INFO').where('memb___id', req.user.memb___id).update({
				AccountLevel: level,
				AccountExpireDate: moment().add(days, 'days').format('YYYY-MM-DD HH:mm:ss'),
				mucoins: parseInt(req.user.mucoins) - parseInt(coins)
			});
			req.flash('success', `¡Has adquirido la membresia ${vipName} por ${days} dias!`);
			res.redirect('/account/vip');
			helpers.submitPurchase(req.user.memb___id, -parseInt(coins), `Contrató el vip ${vipName} por ${days} dias`);
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/account/vip');
			helpers.submitError('accountController.handleVIPBuy', error);
		}
	},

};

export default controller;