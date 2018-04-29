import passport from 'passport';
import lstrategy from 'passport-local';
import db from './db';
import helpers, { readConfigFile } from './helpers';

const LocalStrategy = lstrategy.Strategy;

passport.serializeUser((user, done) => {
	done(null, user.memb___id);
});

passport.deserializeUser((id, done) => {
	return db('MEMB_INFO').where('memb___id', id).first().then(user => {
		done(null, user);
	}).catch(error => {
		done(error, null);
	});
});

passport.use('signup', new LocalStrategy({
	passReqToCallback: true
}, (req, username, password, done) => {

	return db('MEMB_INFO').where('memb___id', username).first().then(user => {
		if (!user) {
			return db('MEMB_INFO').where('mail_addr', req.body.mail).first().then(mail => {
				if (!mail) {
					return readConfigFile().then((config) => {
						return db('MEMB_INFO').insert({
							memb___id: username,
							memb__pwd: password,
							mail_addr: req.body.mail,
							memb_name: config.app.name,
							sno__numb: '111111111111',
							bloc_code: '0',
							ctl1_code: '0',
							AccountLevel: '0',
							AccountExpireDate: db.fn.now(),
							premiumdone: '0',
							accesslevel: '0',
							mucoins: '0'
						}).returning('*').then(createdUser => {
							helpers.emptyAttempts(req.session);
							return done(null, createdUser[0]);
						}).catch(error => {
							console.log(error);
						});
					});
				} else {
					helpers.registerAttempt(req.session);
					return done(null, false, req.flash('error', 'El correo electronico ingresado se ha utilizado en otra cuenta.'));
				}
			});
		} else {
			helpers.registerAttempt(req.session);
			return done(null, false, req.flash('error', 'El usuario ingresado está en uso.'));
		}
	});
}));

passport.use('login', new LocalStrategy({
	passReqToCallback: true
}, (req, username, password, done) => {

	return db('MEMB_INFO').where('memb___id', username).first().then(user => {
		if (user) {
			if (password === user.memb__pwd) {
				helpers.emptyAttempts(req.session);
				return done(null, user);
			} else {
				helpers.registerAttempt(req.session);
				return done(null, false, req.flash('error', 'Credenciales ingresadas incorrectas.')); // Acá falla la contraseña
			}
		} else {
			helpers.registerAttempt(req.session);
			return done(null, false, req.flash('error', 'Credenciales ingresadas incorrectas.')); // Acá falla el usuario
		}
	}).catch(error => {
		return done(error);
	});
}));

export default passport;