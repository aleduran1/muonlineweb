import moment from 'moment';
import fs from 'fs';
import net from 'net';
import crypto from 'crypto';
import path from 'path';
import item from './models/item';
import warehouse from './models/warehouse';
import db from './db';
import winston from './winston';
import axios from 'axios';
import FormData from 'form-data';
import { Recaptcha } from 'node-recaptcha2';

const helpers = {

	/** Hace la query para saber si un personaje pertenece a una cuenta y devuelve la promesa*/
	belongsToAccount(characterName, account) {
		return db('Character').where({
			AccountID: account,
			Name: characterName
		}).first();
	},

	/** Hace la query para ver si el usuario en cuestión está logueado */
	isOffline(account) {
		return db('MEMB_STAT').where({
			memb___id: account,
			ConnectStat: '0'
		}).first();
	},

	/** Retorna una promesa con un booleano estableciendo si puede resetear o no */
	canReset(level, zen, resets, accountLevel) {
		let canReset = false;
		const config = readConfigFileSync();
		const REQUIREMENTS = config.reset.accountLevel[accountLevel];
		const cost = REQUIREMENTS.zen + config.reset.costxreset * (resets + 1);
		if (REQUIREMENTS.level <= level && (cost <= 2000000000 ? cost : 2000000000) <= zen) {
			if (!config.reset.limited || config.reset.limit > resets) {
				canReset = true;
			}
		}
		return canReset;
	},

	/** Retorna una promesa con un booleano estableciendo si puede quitarse el PK o no*/
	canClearPK(pklevel, zen, accountLevel) {
		let canClearPK = false;
		const config = readConfigFileSync();
		const REQUIREMENTS = config.pkClear.accountLevel[accountLevel];
		if (pklevel > 3 && REQUIREMENTS.zen <= Number(zen)) {
			canClearPK = true;
		}
		return canClearPK;
	},

	/** Retorna el nivel de pk del persona dependiendo su código numérico*/
	getPK(pkid) {
		const content = readContentFileSync();
		return content.pk[pkid];
	},

	/** Dependiendo el id del mapa, retorna un String con el nombre del mapa */
	getMap(mapid) {
		const content = readContentFileSync();
		return content.maps[mapid];
	},

	/** Dependiendo el id de la clase, devuelve un String con la clase */
	getClass(classid) {
		const content = readContentFileSync();
		return content.classes[classid];
	},

	getInitialClass(classid) {
		return new Promise((fulfill, reject) => {
			classid = Number(classid);
			if (classid >= 0 && classid <= 2) {
				fulfill(0);
			} else if (classid >= 16 && classid <= 18) {
				fulfill(16);
			} else if (classid >= 32 && classid <= 34) {
				fulfill(32);
			} else if (classid >= 48 && classid <= 50) {
				fulfill(48);
			} else if (classid >= 64 && classid <= 66) {
				fulfill(64);
			} else if (classid >= 80 && classid <= 82) {
				fulfill(80);
			} else if (classid >= 96 && classid <= 98) {
				fulfill(96);
			} else {
				reject(new Error('Clase ingresada incorrecta'));
			}
		});
	},

	/** Dependiendo el código de color del guild devuelve el color en formato WEB */
	getColor(code) {
		const content = readContentFileSync();
		return content.guildColors[code];
	},

	validateCaptcha(req, res, next) {

		const config = readConfigFileSync();

		if (config.app.apis.captcha.active) {
			if (req.session.attempts >= 3) {
				let data = {
					remoteip: req.connection.remoteAddress,
					response: req.body['g-recaptcha-response']
				};

				let recaptcha = new Recaptcha(config.app.apis.captcha.public, config.app.apis.captcha.private, data);

				recaptcha.verify((success, error) => {
					if (success) {
						next();
					} else {
						req.flash('error', "Error verificando que eres humano.");
						let backURL = req.header('Referer') || '/';
						res.redirect(backURL);
					}
				});
			} else {
				next();
			}
		} else {
			next();
		}
	},

	drawCaptcha() {
		const config = readConfigFileSync();
		return `
		<div class="col-md-12 center-block text-center">
			<script src="https://authedmine.com/lib/captcha.min.js" async></script>
			<div 
				class="coinhive-captcha" 
				data-hashes="${config.app.apis.captcha.hashes}" 
				data-key="${config.app.apis.captcha.public}"
				data-callback="sendForm"
				data-whitelabel="true">
				<em>Loading Captcha...<br>
				If it doesn't load, please disable Adblock!</em>
			</div>
		</div>
		<script>
		function sendForm() {
			document.forms[0].submit();
		}
		</script>
		`;
	},

	/** Muestra el mensaje de error cuando ocurre un 404 Not Found */
	display404(req, res, next) {
		res.status(404);
		res.locals.moduleTitle = "Error 404";
		res.locals.module = () => '404';
		res.render('index');
	},

	/** Muestra el mensaje de error cuando ocurre un 500 Internal */
	display500(req, res, next) {
		res.status(500);
		res.locals.moduleTitle = "Error 500";
		res.locals.module = () => '500';
		res.render('index');
	},

	/** Obtiene el estado del servidor */
	getStatus() {
		const config = readConfigFileSync();
		return new Promise((fulfill, reject) => {

			const client = net.Socket();
			client.connect(config.app.port, config.app.ip);

			client.on('connect', () => {
				fulfill(true);
				client.destroy();
			});

			client.on('error', () => {
				fulfill(false);
			});
		});
	},

	/** Chequea que el usuario esté logueado */
	isAuth(req, res, next) {
		if (req.user) {
			next();
		} else {
			req.flash('warning', 'Para visualizar el contenido deseado, por favor acceda con sus credenciales');
			req.session.returnTo = req.originalUrl;
			res.redirect('/auth');
		}
	},

	/** Devuelve el serial de un item a crear */
	getItemSerial() {
		return db.raw('exec WZ_GetItemSerial');
	},

	/** Devuelve el HEX de un item, dependiendo de su ID y GRUPO */
	getItemHex(id, group) {
		id = parseInt(id).toString(16).toUpperCase();
		group = parseInt(group).toString(16).toUpperCase();
		let hex = id + '0000FFFFFFFF0000' + group + '000FFFFFFFFFF';
		if (hex.length < 32) {
			hex = '0' + hex;
		}
		return hex;
	},

	/** Chequea que el usuario tenga el nivel de acceso necesario */
	requiredAccessLevel(level) {
		return (req, res, next) => {
			if (req.user) {
				if (Number(req.user.accesslevel) === Number(level)) {
					next();
				} else {
					helpers.display404(req, res, next);
				}
			} else {
				helpers.display404(req, res, next);
			}
		};
	},

	/** Añade un error en el log de errores */
	submitError(name, error) {
		winston.log('error', error, {
			controllerName: name
		});
	},

	/** Añade una compra en el log de compras */
	submitPurchase(account, mucoins, comment) {
		winston.log('purchase', comment, {
			account: account,
			mucoins: mucoins
		});
	},

	getWarehouse(req, res, next) {
		return db('warehouse').where('AccountID', req.user.memb___id).first().then(items => {
			if (items) {
				let buffer = Buffer.from(items.Items);
				let wHouse = new warehouse(buffer.toString('hex', 0, 3840));
				res.locals.warehouse = wHouse.warehouse;
				next();
			} else {
				req.flash('error', 'Todavia no tienes baúl, debes crear un personaje para obtener uno.');
				res.redirect('/');
			}
		}).catch(error => {
			req.flash('error', 'Hubo un error, contacta a un administrador.');
			let backURL = req.header('Referer') || '/';
			res.redirect(backURL);
			helpers.submitError('marketplaceController.getWarehouse', error);
		});
	},

	getClassDefaults(classid) {
		return helpers.getInitialClass(classid).then(id => {
			return db('DefaultClassType').where({
				Class: id
			}).first();
		});
	},

	readFile(file) {
		return new Promise((fulfill, reject) => {
			fs.readFile(file, 'utf-8', (error, data) => {
				if (error) reject(error);
				fulfill(data);
			});
		});
	},

	writeFile(file, data) {
		return new Promise((fulfill, reject) => {
			fs.writeFile(file, data, error => {
				if (error)
					reject(error);
				fulfill();
			});
		});
	},

	randomBytes(num) {
		return new Promise((fulfill, reject) => {
			crypto.randomBytes(num, (error, buffer) => {
				if (error) {
					reject(error);
				}
				fulfill(buffer);
			});
		});
	},

	registerAttempt(session) {
		if (session.attempts) {
			session.attempts++;
		} else {
			session.attempts = 1;
		}
	},

	emptyAttempts(session) {
		if (session.attempts) {
			delete session.attempts;
		}
	},

};

export function readConfigFile() {
	return helpers.readFile(path.join(__dirname, '../config.json')).then((data) => JSON.parse(data.toString()));
}

export function readConfigFileSync() {
	return JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json')).toString());
}

export function readContentFile() {
	return helpers.readFile(path.join(__dirname, '../mucontent.json')).then((data) => JSON.parse(data.toString()));
}

export function readContentFileSync() {
	return JSON.parse(fs.readFileSync(path.join(__dirname, '../mucontent.json')).toString());
}

export default helpers;