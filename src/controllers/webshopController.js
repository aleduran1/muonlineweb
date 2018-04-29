'use strict';

import db from '../db';
import helpers from '../helpers';
import item from '../models/item';
import warehouse from '../models/warehouse';

const controller = {

	async getCategories(req, res, next) {
		try {
			const categories = await db('Webshop_categories');
			res.locals.webshopCategories = categories;
			next();
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/');
			helpers.submitError('webshopController.getCategories', error);
		}
	},

	async getItems(req, res, next) {
		try {
			const items = await db('Webshop_items').orderBy('id', 'ASC');
			addData(items);
			res.locals.webshopItems = items;
			next();
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/');
			helpers.submitError('webshopController.getItems', error);
		}
	},

	async getCategoryItems(req, res, next) {
		if (isNaN(req.params.categoryid)) {
			res.redirect('/webshop');
		}
		try {
			const category = await db('Webshop_categories').where({
				id: req.params.categoryid
			}).first();
			if (category.active) {
				res.locals.category = category;
				const items = await db('Webshop_items').where({
					categoryid: category.id
				}).orderBy('id', 'ASC');
				if (items.length) {
					addData(items);
					res.locals.webshopItems = items;
					next();
				} else {
					res.redirect('/webshop');
				}
			} else {
				res.redirect('/webshop');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/');
			helpers.submitError('webshopController.getCategoryItems', error);
		}
	},

	async getDeals(req, res, next) {
		try {
			const deals = await db('Webshop_items').where('active', 1).andWhere('discount', '>', 0);
			if (deals) {
				addData(deals);
				res.locals.webshopItems = deals;
				next();
			}
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/');
			helpers.submitError('webshopController.getDeals', error);
		}
	},

	async getBuy(req, res, next) {
		if (isNaN(req.params.itemid)) {
			res.redirect('/webshop');
		}
		try {
			const itemfound = await db('Webshop_items').where({
				active: 1,
				id: req.params.itemid
			}).first();
			if (itemfound) {
				res.locals.item = itemfound;
				const categoryfound = await db('Webshop_categories').where({
					id: itemfound.categoryid
				}).first();
				res.locals.item.data = new item(res.locals.item.hex);
				res.locals.discount = (res.locals.item.discount > categoryfound.discount ? res.locals.item.discount : categoryfound.discount);
				res.locals.config = res.locals.config.webshop;
				next();
			} else {
				res.redirect('/webshop');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/');
			helpers.submitError('webshopController.getBuy', error);
		}
	},

	async validateBuy(req, res, next) {

		if (isNaN(req.params.itemid)) {
			res.redirect('/webshop');
		}

		try {
			const [items, status] = await Promise.all([db('Webshop_items').where({
				id: req.params.itemid
			}).first(), helpers.isOffline(req.user.memb___id)]);
			if (status) {
				if (items.active) {

					req.body.luck = req.body.luck ? 1 : 0;
					req.body.skill = req.body.skill ? 1 : 0;
					req.body.excellentOption1 = req.body.excellentOption1 ? 1 : 0;
					req.body.excellentOption2 = req.body.excellentOption2 ? 1 : 0;
					req.body.excellentOption3 = req.body.excellentOption3 ? 1 : 0;
					req.body.excellentOption4 = req.body.excellentOption4 ? 1 : 0;
					req.body.excellentOption5 = req.body.excellentOption5 ? 1 : 0;
					req.body.excellentOption6 = req.body.excellentOption6 ? 1 : 0;

					if (items.maxLevel && !req.body.level) {
						req.flash('error', 'Hubo un error, contacta a un administrador.');
						res.redirect('/webshop');
					}

					if (items.maxOption && !req.body.option) {
						req.flash('error', 'Hubo un error, contacta a un administrador.');
						res.redirect('/webshop');
					}

					if (req.body.luck && !items.canLuck) {
						req.flash('error', 'Hubo un error, contacta a un administrador.');
						res.redirect('/webshop');
					}

					if (req.body.skill && !items.canSkill) {
						req.flash('error', 'Hubo un error, contacta a un administrador.');
						res.redirect('/webshop');
					}

					if (req.body.excellentOption1 && !items.excellentOption1) {
						req.flash('error', 'Hubo un error, contacta a un administrador.');
						res.redirect('/webshop');
					}

					if (req.body.excellentOption2 && !items.excellentOption2) {
						req.flash('error', 'Hubo un error, contacta a un administrador.');
						res.redirect('/webshop');
					}

					if (req.body.excellentOption3 && !items.excellentOption3) {
						req.flash('error', 'Hubo un error, contacta a un administrador.');
						res.redirect('/webshop');
					}

					if (req.body.excellentOption4 && !items.excellentOption4) {
						req.flash('error', 'Hubo un error, contacta a un administrador.');
						res.redirect('/webshop');
					}

					if (req.body.excellentOption5 && !items.excellentOption5) {
						req.flash('error', 'Hubo un error, contacta a un administrador.');
						res.redirect('/webshop');
					}

					if (req.body.excellentOption6 && !items.excellentOption6) {
						req.flash('error', 'Hubo un error, contacta a un administrador.');
						res.redirect('/webshop');
					}

					if (req.body.level > items.maxLevel) {
						req.flash('error', 'Hubo un error, contacta a un administrador.');
						res.redirect('/webshop');
					}

					if (req.body.option > items.maxOption) {
						req.flash('error', 'Hubo un error, contacta a un administrador.');
						res.redirect('/webshop');
					}

					const maxExcellent = req.body.excellentOption1 + req.body.excellentOption2 + req.body.excellentOption3 +
						req.body.excellentOption4 + req.body.excellentOption5 + req.body.excellentOption6;

					if (maxExcellent > items.maxExcellent) {
						req.flash('error', 'Hubo un error, contacta a un administrador.');
						res.redirect('/webshop');
					}
					res.locals.itemToBuy = items;

					const category = await db('Webshop_categories').where({
						id: res.locals.itemToBuy.categoryid
					}).first();
					if (category.active) {
						res.locals.discount = category.discount > res.locals.itemToBuy.discount ? category.discount : res.locals.itemToBuy.discount;
						let step = [];
						step[0] = req.body.level ? parseInt(res.locals.config.webshop.coinsPerItemLevel * req.body.level) : 0;
						step[1] = req.body.option ? parseInt(res.locals.config.webshop.coinsPerOptionLevel * req.body.option) : 0;
						step[2] = req.body.luck ? parseInt(res.locals.config.webshop.coinsForLuck * req.body.luck) : 0;
						step[3] = req.body.skill ? parseInt(res.locals.config.webshop.coinsForSkill * req.body.skill) : 0;
						step[4] = req.body.excellentOption1 ? parseInt(res.locals.config.webshop.coinsForExcellentOption1 * req.body.excellentOption1) : 0;
						step[5] = req.body.excellentOption1 ? parseInt(res.locals.config.webshop.coinsForExcellentOption1 * req.body.excellentOption1) : 0;
						step[6] = req.body.excellentOption1 ? parseInt(res.locals.config.webshop.coinsForExcellentOption1 * req.body.excellentOption1) : 0;
						step[7] = req.body.excellentOption1 ? parseInt(res.locals.config.webshop.coinsForExcellentOption1 * req.body.excellentOption1) : 0;
						step[8] = req.body.excellentOption1 ? parseInt(res.locals.config.webshop.coinsForExcellentOption1 * req.body.excellentOption1) : 0;
						step[9] = req.body.excellentOption1 ? parseInt(res.locals.config.webshop.coinsForExcellentOption1 * req.body.excellentOption1) : 0;
						step[10] = parseInt(res.locals.itemToBuy.cost);
						res.locals.cost = 0;
						for (let i = 0; i < step.length; i++) {
							res.locals.cost += step[i];
						}
						res.locals.cost = parseInt(res.locals.cost * (100 - res.locals.discount) / 100);

						if (res.locals.cost > req.user.mucoins) {
							req.flash('error', 'No tienes los Wazaa Coins necesarios para realizar la transacción.');
							res.redirect('/webshop/buy/' + req.params.itemid);
						} else {
							next();
						}
					} else {
						req.flash('error', 'Hubo un error, contacta a un administrador.');
						res.redirect('/webshop');
					}
				} else {
					req.flash('error', 'No existe el item');
					res.redirect('/webshop');
				}
			} else {
				req.flash('error', 'Debes desconectarte de la cuenta para utilizar los servicios online.');
				res.redirect('/webshop');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/');
			helpers.submitError('webshopController.validateBuy', error);
		}
	},

	async handleBuy(req, res, next) {
		try {
			const [items, serial] = await Promise.all([
				db('warehouse').where({
					AccountID: req.user.memb___id
				}).first(),
				helpers.getItemSerial()
			]);
			const buffer = Buffer.from(items.Items);
			const i = new item(res.locals.itemToBuy.hex);
			i.setItemLevel(req.body.level ? parseInt(req.body.level) : 0);
			i.setItemOption(req.body.option ? parseInt(req.body.option) : 0);
			if (req.body.luck) {
				i.setLuck();
			}
			if (req.body.skill) {
				i.setSkill();
			}
			i.setMaxDurability();
			i.setExcellentOptions(req.body.excellentOption1, req.body.excellentOption2, req.body.excellentOption3,
				req.body.excellentOption4, req.body.excellentOption5, req.body.excellentOption6);
			i.setSerial(serial[0]['']);
			const w = new warehouse(buffer.toString('hex', 0, 3840));
			if (w.addItem(i)) {
				buffer.write(w.hex, 0, 'hex');
				await Promise.all([
					db('warehouse').where({
						AccountID: req.user.memb___id
					}).update({
						Items: buffer
					}),
					db('MEMB_INFO').where({
						memb___id: req.user.memb___id
					}).update({
						mucoins: parseInt(req.user.mucoins) - parseInt(res.locals.cost)
					})
				]);
				req.flash('success', `Has comprado el item ${res.locals.itemToBuy.name} correctamente. Puedes revisarlo en el panel de usuario`);
				res.redirect('/webshop');
				helpers.submitPurchase(req.user.memb___id, -parseInt(res.locals.cost), `Compró el item ${res.locals.itemToBuy.name}`);
			} else {
				req.flash('error', 'No tienes suficiente espacio en el baúl.');
				res.redirect('/webshop/buy/' + req.params.itemid);
			}
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/webshop');
			helpers.submitError('webshopController.handleBuy', error);
		}
	},
};

function addData(arr) {
	for (let i = 0; i < arr.length; i++) {
		arr[i].data = new item(arr[i].hex);
	}
}

export default controller;