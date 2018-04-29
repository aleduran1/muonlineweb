import axios from 'axios';
import FormData from 'form-data';
import helpers, { readConfigFile } from '../helpers';
import db from '../db';

const controller = {
  getRewards(req, res) {
    res.locals.moduleTitle = 'Rewards';
    res.locals.module = () => 'rewards';
    res.locals.moduleScript = 'rewards';
    res.locals.active = {
      rewards: true
    };
    res.render('index');
  },

  async postRewards(req, res) {
    try {
      const user = req.user.memb___id;
      const key = res.locals.config.rewards.private;
      const balance = await getBalance(user, key);
      const MUCOINS_BONUS = balance / 20000;

      if (balance && balance > 0) {
        const didWithdraw = await withdraw(user, key, balance);
        if (didWithdraw) {
          await db('MEMB_INFO').where('memb___id', user).update({
            mucoins: req.user.mucoins + MUCOINS_BONUS
          });
          req.flash('success', 'Has intercambiado los creditos por MUCOINS correctamente!');
          res.redirect('/rewards');
        } else {
          req.flash('error', 'Hubo un error, contacta a un administrador.');
          res.redirect('/rewards');
        }
      } else {
        req.flash('error', 'No posees creditos.');
        res.redirect('/rewards');
      }
    } catch (e) {
      req.flash('error', 'Hubo un error, contacta a un administrador.');
      res.redirect('/rewards');
      helpers.submitError('rewardsController.postRewards', e);
    }
  }

};

async function getBalance(user, key) {
  const BALANCE_URL = `https://api.coinhive.com/user/balance?secret=${key}&name=${user}@mueurus`;
  const response = await axios.get(BALANCE_URL);
  return response.data.balance;
}

async function withdraw(user, key, amount) {
  const WITHDRAW_URL = 'https://api.coinhive.com/user/withdraw';
  const data = new FormData();
  data.append('secret', key);
  data.append('name', `${user}@mueurus`);
  data.append('amount', amount);
  const response = await axios.post(WITHDRAW_URL, data, { headers: data.getHeaders() });
  console.log(response.data);
  return response.data.success;
}

export default controller;