'use strict';

import helpers from '../helpers';
import db from '../db';
import moment from 'moment';
import item from '../models/item';
import warehouse from '../models/warehouse';

const controller = {

	/**
	Si se realizó la request con un parametro search, devuelve el listado con la keyword buscada, sino devuelve el listado con los 50 primeros artículos 
	*/
	async getListings(req, res, next) {
		if (req.query.search) {
			try {
				const listings = await db('marketplace').whereRaw('name LIKE ?', '%' + req.query.search + '%')
					.whereNot({
						publisher: req.user.memb___id
					})
					.orderBy('cost', 'asc')
					.orderBy('created_at', 'desc');
				addData(listings);
				res.locals.listings = listings;
				next();
			} catch (error) {
				req.flash('error', 'Hubo un error, contacta a un administrador.');
				res.redirect('/');
				helpers.submitError('marketplaceController.getListings', error);
			}
		} else {
			try {
				const listings = await db('marketplace').whereNot({
					publisher: req.user.memb___id
				}).limit(50)
					.orderBy('created_at', 'desc');
				addData(listings);
				res.locals.listings = listings;
				next();
			} catch (e) {
				req.flash('error', 'Hubo un error, contacta a un administrador.');
				res.redirect('/');
				helpers.submitError('marketplaceController.getListings', error);
			}
		}
	},

	/**
	Devuelve el listado personal del usuario
	*/
	async getMyListings(req, res, next) {
		try {
			const mylist = await db('marketplace').where({
				publisher: req.user.memb___id
			});
			addData(mylist);
			res.locals.mylistings = mylist;
			next();
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/');
			helpers.submitError('marketplaceController.getMyListings', error);
		}
	},

	async canAdd(req, res, next) {
		try {
			let maxListings = res.locals.config.marketplace.accountLevel[req.user.AccountLevel].listings;
			const [listings, status] = await Promise.all([db('Marketplace').where({
				publisher: req.user.memb___id
			}).count('id as count').first(), helpers.isOffline(req.user.memb___id)]);
			if (parseInt(listings['count']) < maxListings) {
				if (status) {
					next();
				} else {
					req.flash('error', 'Debes desconectarte de la cuenta para utilizar los servicios online.');
					res.redirect('/marketplace/mylistings');
				}
			} else {
				req.flash('error', 'Has alcanzado el límite de listados que puedes crear');
				res.redirect('/marketplace/mylistings');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/marketplace/mylistings');
			helpers.submitError('marketplaceController.canAdd', error);
		}
	},

	validateAdd(req, res, next) {
		req.assert('cost', 'El costo no puede estar vacio, debe ser numérico y positivo').notEmpty().isInt().isPositive();
		req.assert('row', 'Error en el formulario').notEmpty().isInt().validRow();
		req.assert('column', 'Error en el formulario').notEmpty().isInt().validColumn();
		req.assert('description', 'La descripción tiene como máximo 255 caracteres').len(0, 255);

		if (req.validationErrors()) {
			req.flash('validation-error', req.validationErrors());
			res.redirect('/marketplace/mylistings');
		} else {
			next();
		}
	},

	async handleAdd(req, res, next) {
		try {
			const w = await db('warehouse').where({
				AccountID: req.user.memb___id
			}).first();
			const buffer = Buffer.from(w.Items);
			const row = req.body.row;
			const column = req.body.column;
			const cost = parseInt(req.body.cost);
			const description = req.body.description ? req.body.description : '';
			const ware = new warehouse(buffer.toString('hex', 0, 3840));
			const hex = ware.getHex(row, column);
			if (hex) {
				ware.removeItemHex(row, column);
				buffer.write(ware.hex, 0, 'hex');
				const removedItem = new item(hex);
				await Promise.all([
					db('marketplace').insert({
						name: removedItem.name,
						description: description,
						hex: hex,
						cost: cost,
						publisher: req.user.memb___id,
						created_at: moment().format('YYYY-MM-DD HH:mm:ss')
					}),
					db('warehouse').where({
						AccountID: req.user.memb___id
					}).update({
						Items: buffer
					})
				]);
				req.flash('success', 'Se ha agregado el item al listado correctamente');
				res.redirect('/marketplace/mylistings');
			} else {
				req.flash('error', 'Hubo un error, contacta a un administrador.');
				res.redirect('/marketplace/mylistings');
			}
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/marketplace/mylistings');
			helpers.submitError('marketplaceController.handleAdd', error);
		}
	},

	async validateRemove(req, res, next) {
		req.assert('id', 'Hubo un error, contacta a un administrador.').notEmpty().isInt().isPositive();

		if (req.validationErrors()) {
			req.flash('validation-error', req.validationErrors());
			res.redirect('/marketplace/mylistings');
		} else {
			try {
				const offline = await helpers.isOffline(req.user.memb___id);
				if (offline) {
					const [listing, w] = await Promise.all([
						db('Marketplace').where({
							id: req.body.id,
							publisher: req.user.memb___id
						}).first(),
						db('warehouse').where({
							AccountID: req.user.memb___id
						}).first()
					]);
					if (listing) {
						const buffer = Buffer.from(w.Items);
						const ware = new warehouse(buffer.toString('hex', 0, 3840));
						if (ware.addItem(listing.hex)) {
							next();
						} else {
							req.flash('error', 'No tienes suficiente espacio en el baúl.');
							res.redirect('/marketplace/mylistings');
						}
					} else {
						req.flash('error', 'Hubo un error, contacta a un administrador.');
						res.redirect('/marketplace/mylistings');
					}
				} else {
					req.flash('error', 'Debes desconectarte de la cuenta para utilizar los servicios online.');
					res.redirect('/marketplace/mylistings');
				}
			} catch (error) {
				req.flash('error', 'Hubo un error, contacta a un administrador.');
				res.redirect('/marketplace/mylistings');
				helpers.submitError('marketplaceController.validateRemove', error);
			}
		}
	},

	async handleRemove(req, res, next) {
		try {
			const [w, listing] = await Promise.all([
				db('warehouse').where({
					AccountID: req.user.memb___id
				}).first(),
				db('Marketplace').where({
					id: req.body.id
				}).first()
			]);
			const buffer = Buffer.from(w.Items);
			const ware = new warehouse(buffer.toString('hex', 0, 3840));
			ware.addItem(listing.hex);
			buffer.write(ware.hex, 0, 'hex');
			await Promise.all([
				db('warehouse').where({
					AccountID: req.user.memb___id
				}).update({
					Items: buffer
				}),
				db('Marketplace').where({
					id: req.body.id
				}).del()
			]);
			req.flash('success', 'El item se ha borrado del listado correctamente');
			res.redirect('/marketplace/mylistings');
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/marketplace/mylistings');
			helpers.submitError('marketplaceController.handleRemove', error);
		}
	},

	async validateBuy(req, res, next) {
		req.assert('id', 'Hubo un error, contacta a un administrador.').notEmpty().isInt().isPositive();

		if (req.validationErrors()) {
			req.flash('validation-error', req.validationErrors());
			res.redirect('/marketplace/mylistings');
		} else {
			try {
				const listing = await db('Marketplace').where({
					id: req.params.id
				}).first();
				if (listing.publisher !== req.user.memb___id) {
					res.locals.listing = listing;
					const status = await helpers.isOffline(req.user.memb___id);
					if (status) {
						if (req.user.mucoins >= res.locals.listing.cost) {
							const w = await db('warehouse').where({
								AccountID: req.user.memb___id
							}).first();
							const buffer = Buffer.from(w.Items);
							const ware = new warehouse(buffer.toString('hex', 0, 3840));
							if (ware.addItem(res.locals.listing.hex)) {
								next();
							} else {
								req.flash('error', 'No tienes suficiente espacio en el baúl.');
								res.redirect('/marketplace/mylistings');
							}
						} else {
							req.flash('error', 'No tienes los Wazaa Coins necesarios para realizar la transacción.');
							res.redirect('/marketplace');
						}
					} else {
						req.flash('error', 'Debes desconectarte de la cuenta para utilizar los servicios online.');
						res.redirect('/marketplace');
					}
				} else {
					req.flash('error', 'Hubo un error, contacta a un administrador.');
					res.redirect('/marketplace');
				}
			} catch (error) {
				req.flash('error', 'Hubo un error, contacta a un administrador.');
				res.redirect('/marketplace');
				helpers.submitError('marketplaceController.validateBuy', error);
			}
		}
	},

	async handleBuy(req, res, next) {
		try {
			const seller = await db('MEMB_INFO').where({
				memb___id: res.locals.listing.publisher
			}).first();
			await db('MEMB_INFO').where({
				memb___id: seller.memb___id
			}).update({
				mucoins: parseInt(seller.mucoins) + parseInt(res.locals.listing.cost)
			});
			helpers.submitPurchase(seller.memb___id, res.locals.listing.cost, `Cobró la venta del item ${res.locals.listing.name}`);
			await db('MEMB_INFO').where({
				memb___id: req.user.memb___id
			}).update({
				mucoins: parseInt(req.user.mucoins) - parseInt(res.locals.listing.cost)
			});
			helpers.submitPurchase(req.user.memb___id, -res.locals.listing.cost, `Compró el item ${res.locals.listing.name}`);
			const w = await db('warehouse').where({
				AccountID: req.user.memb___id
			}).first();
			const buffer = Buffer.from(w.Items);
			const ware = new warehouse(buffer.toString('hex', 0, 3840));
			ware.addItem(res.locals.listing.hex);
			buffer.write(ware.hex, 0, 'hex');
			await db('warehouse').where({
				AccountID: req.user.memb___id
			}).update({
				Items: buffer
			});
			await db('Marketplace').where({
				id: res.locals.listing.id
			}).del();
			req.flash('success', 'Has comprado el item ' + res.locals.listing.name + ' satisfactoriamente');
			res.redirect('/marketplace');
		} catch (error) {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			res.redirect('/marketplace');
			helpers.submitError('marketplaceController.handleBuy', error);
		}
	},

};

function addData(arg) {
	for (let i = 0; i < arg.length; i++) {
		arg[i].data = new item(arg[i].hex);
	}
}

export default controller;