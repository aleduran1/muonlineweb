'use strict';

import db from '../db';
import mailer from '../mailer';
import moment from 'moment';
import helpers from '../helpers';

const controller = {

  /** Validación de Express-Validator para el formulario de Ingreso*/
  validateLogin(req, res, next) {
    req.assert('username', 'El usuario debe contener de 4 a 10 caracteres').len(4, 10);
    req.assert('username', 'El usuario solo puede contener números o letras').isValidField();
    req.assert('password', 'La contraseña debe contener de 6 a 10 caracteres').len(6, 10);
    req.assert('password', 'La contraseña solo puede contener números o letras').isValidField();

    if (req.validationErrors()) {
      helpers.registerAttempt(req.session);
      req.flash('validation-error', req.validationErrors());
      res.redirect('/auth');
    } else {
      next();
    }
  },

  /** Validación de Express-Validator para el formulario de Registro */
  validateRegister(req, res, next) {
    req.assert('username', 'El usuario debe contener de 4 a 10 caracteres').len(4, 10);
    req.assert('username', 'El usuario solo puede contener números o letras').isValidField();
    req.assert('mail', 'El mail debe ser valido').isEmail();
    req.assert('password', 'La contraseña debe contener de 6 a 10 caracteres').len(6, 10);
    req.assert('password', 'La contraseña solo puede contener números o letras').isValidField();
    req.assert('password', 'Las contraseñas deben ser iguales').matchPasswords(req.body.passwordConfirm);

    if (req.validationErrors()) {
      helpers.registerAttempt(req.session);
      req.flash('validation-error', req.validationErrors());
      res.redirect('/auth/register');
    } else {
      let tos = req.body.tos ? 1 : 0;
      if (!tos) {
        helpers.registerAttempt(req.session);
        req.flash('error', 'Para poder registrarte debes aceptar las condiciones de servicio');
        res.redirect('/auth/register');
      } else {
        next();
      }
    }
  },

  /** Chequea si el usuario está logueado, si lo está lo redirecciona a la página principal */
  isLoggedIn(req, res, next) {
    if (req.user) {
      res.redirect('/');
    }
    next();
  },

  /** Valida el body del formulario para Recuperar contraseña */
  async validateForgot(req, res, next) {
    req.assert('mail', 'El mail debe ser valido').isEmail();
    if (req.validationErrors()) {
      req.flash('validation-error', req.validationErrors());
      res.redirect('/auth/forgot');
    } else {
      try {
        const account = await db('MEMB_INFO').where('mail_addr', req.body.mail).first();
        if (account) {
          res.locals.account = account;
          next();
        } else {
          req.flash('error', 'No existe una cuenta con ese mail');
          res.redirect('/auth/forgot');
        }
      } catch (error) {
        req.flash('error', 'Hubo un error, contacta a un administrador.');
        res.redirect('/auth/forgot');
        helpers.submitError('authController.validateForgot', error);
      }
    }
  },

  /** Crea el token de recuperación de cuenta y envia un mail con este al usuario */
  async handleForgot(req, res, next) {
    try {
      const buffer = await helpers.randomBytes(20);
      const user = res.locals.account;
      const token = buffer.toString('hex');
      await Promise.all([
        db('MEMB_INFO').where('memb___id', user.memb___id).update({
          'resetPasswordToken': token,
          'resetPasswordExpires': moment().utcOffset(0).add(1, 'hours').format('YYYY-MM-DD HH:mm:ss')
        }),
        sendMailForgot(res, user, token)
      ]);
      req.flash('success', 'Se ha enviado un mail a tu correo con la información necesaria para restablecer tu contraseña, si no lo encuentras prueba revisando la bandeja de Spam o Correo no deseado.');
      res.redirect('/auth/forgot');
    } catch (error) {
      req.flash('error', 'Hubo un error, contacta a un administrador.');
      res.redirect('/auth/forgot');
      helpers.submitError('authController.handleForgot', error);
    }
  },

  /** Valida los campos para reiniciar la contraseña */
  async validateResetPassword(req, res, next) {
    try {
      const account = await db('MEMB_INFO').where('resetPasswordToken', req.params.token).first();
      if (account) {
        if (moment().isSameOrBefore(account.resetPasswordExpires)) {
          res.locals.account = account;
          next();
        } else {
          await db('MEMB_INFO').where('memb___id', account.memb___id).update({
            resetPasswordToken: db.raw('NULL'),
            resetPasswordExpires: db.raw('NULL')
          });
          req.flash('error', 'El token no existe o ha expirado');
          res.redirect('/');
        }
      } else {
        req.flash('error', 'El token no existe o ha expirado');
        res.redirect('/');
      }
    } catch (error) {
      req.flash('error', 'Hubo un error, contacta a un administrador.');
      res.redirect('/');
      helpers.submitError('authController.validateResetPassword', error);
    }
  },

  /** Setea la nueva contraseña del usuario y envia un mail con estos datos al usuario */
  async handleResetPassword(req, res, next) {
    try {
      const buffer = await helpers.randomBytes(4);
      const account = res.locals.account;
      const newPassword = buffer.toString('hex');
      await Promise.all([
        db('MEMB_INFO').where('memb___id', account.memb___id).update({
          memb__pwd: newPassword,
          resetPasswordToken: db.raw('NULL'),
          resetPasswordExpires: db.raw('NULL')
        }),
        sendMailPassword(res, account, newPassword)
      ]);
      next();
    } catch (error) {
      req.flash('error', 'Hubo un error, contacta a un administrador.');
      res.redirect('/');
      helpers.submitError('authController.handleResetPassword', error);
    }
  },
};

/** Envia el mail de recuperación de contraseña al usuario y el token indicado */
function sendMailForgot(res, user, token) {
  return new Promise((fulfill, reject) => {
    mailer.sendMail({
      from: res.locals.config.app.name + ' ' + res.locals.config.app.smtp.auth.user,
      to: user.mail_addr,
      subject: 'Restablecer Contraseña: ' + user.memb___id,
      template: 'resetPasswordLink',
      context: {
        name: res.locals.config.app.name,
        user: user.memb___id,
        token: `http://${res.locals.config.app.domain}/auth/resetpassword/${token}`
      }
    }, (error, response) => {
      if (error) {
        reject(error);
      }
      mailer.close();
      fulfill();
    });
  });
}

/** Envia el mail con los datos de usuario */
function sendMailPassword(res, account, newPassword) {
  return new Promise((fulfill, reject) => {
    mailer.sendMail({
      from: res.locals.config.app.name + ' ' + res.locals.config.app.smtp.auth.user,
      to: account.mail_addr,
      subject: 'Nueva Contraseña: ' + account.memb___id,
      template: 'resetPasswordGive',
      context: {
        name: res.locals.config.app.name,
        user: account.memb___id,
        password: newPassword
      }
    }, (error, response) => {
      if (error) {
        reject(error);
      }
      mailer.close();
      fulfill();
    });
  });
}

export default controller;