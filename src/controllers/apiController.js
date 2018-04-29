'use strict';

import db from '../db';
import helpers from '../helpers';
import content from '../../mucontent.json';
import item from '../models/item';
import axios from 'axios';

const controller = {

  getContent(req, res) {
    res.json(content);
  },

  getAppKeys(req, res) {
    res.json({
      fbapi: res.locals.config.app.apis.facebook.apikey,
      analytics: res.locals.config.app.apis.analytics.apikey
    });
  },

  async getStats(req, res) {
    try {
      const [serverOnline, playersOnline] = await Promise.all([helpers.getStatus(), db('MEMB_STAT').count('ConnectStat').where({
        ConnectStat: 1
      })]);
      res.json({
        serverOnline: serverOnline,
        playersOnline: playersOnline[0]['']
      });
    } catch (error) {
      res.status(500).json({
        message: {
          type: 'error',
          text: 'Hubo un error en tu solicitud'
        }
      });
      helpers.submitError('apiController.getStats', error);
    }
  },

  async getRankingPlayers(req, res) {
    try {
      const limit = req.query.max ? req.query.max : 10;
      const page = req.query.page ? req.query.page : 1;
      const classes = req.query.class ? getClass(req.query.class) : 'IS NOT NULL';
      const max = await db.select(db.raw('count(*) as max')).from('Character').whereRaw(`CtlCode != 32 AND CtlCode != 8 AND CtlCode != 1 AND Class ${classes}`).first();
      const players = await db.select(db.raw(`Name, cLevel as Level, ResetCount as Resets, Class`)).from(db.raw(`
          ( SELECT    ROW_NUMBER() OVER ( ORDER BY ResetCount DESC, cLevel DESC ) AS RowNum, *
            FROM      Character
            WHERE     CtlCode != 32 AND CtlCode != 8 AND CtlCode != 1 AND Class ${classes}
          ) AS RowConstrainedResult
        `)).where('RowNum', '>', limit * (page - 1)).andWhere('RowNum', '<=', limit * page);
      res.json({
        maxPages: Math.ceil(Number(max.max) / Number(limit)),
        ranking: players
      });
    } catch (error) {
      res.status(500).json({
        message: {
          type: 'error',
          text: 'Hubo un error en tu solicitud'
        }
      });
      helpers.submitError('apiController.getRankingPlayers', error);
    }
  },

  async getRankingGuilds(req, res) {
    try {
      const limit = req.query.max ? req.query.max : 5;
      const page = req.query.page ? req.query.page : 1;
      const max = await db.select(db.raw('count(*) as max')).from('Guild').first();
      const guild = await db.select(db.raw(`G_Name as Name, G_Score as Score, G_Mark as Mark, G_Master as Owner`)).from(db.raw(`
          ( SELECT    ROW_NUMBER() OVER ( ORDER BY G_Score DESC) AS RowNum, *
            FROM      Guild
          ) AS RowConstrainedResult
          `)).where('RowNum', '>', limit * (page - 1)).andWhere('RowNum', '<=', limit * page);
      for (let i in guild) {
        guild[i].Mark = guild[i].Mark.toString('hex');
      }
      res.json({
        maxPages: Math.ceil(Number(max.max) / Number(limit)),
        ranking: guild
      });
    } catch (error) {
      res.status(500).json({
        message: {
          type: 'error',
          text: 'Hubo un error en tu solicitud'
        }
      });
      helpers.submitError('apiController.getRankingGuilds', error);
    }
  },

  async getRankingBloodCastle(req, res) {
    try {
      const limit = req.query.max ? req.query.max : 10;
      const page = req.query.page ? req.query.page : 1;
      const max = await db.select(db.raw('count(*) as max')).from('RankingBloodCastle').first();
      const blood = await db.select(db.raw(`Name, Score, Class`)).from(db.raw(`
          ( SELECT    ROW_NUMBER() OVER ( ORDER BY Score DESC) AS RowNum, r.Name, r.Score, c.Class
            FROM      RankingBloodCastle as r
            LEFT JOIN Character as c on r.Name = c.Name
          ) AS RowConstrainedResult
          `)).where('RowNum', '>', limit * (page - 1)).andWhere('RowNum', '<=', limit * page);
      res.json({
        maxPages: Math.ceil(Number(max.max) / Number(limit)),
        ranking: blood
      });
    } catch (error) {
      res.status(500).json({
        message: {
          type: 'error',
          text: 'Hubo un error en tu solicitud'
        }
      });
      helpers.submitError('apiController.getRankingBloodCastle', error);
    }
  },

  async getRankingChaosCastle(req, res) {
    try {
      const limit = req.query.max ? req.query.max : 10;
      const page = req.query.page ? req.query.page : 1;
      const max = await db.select(db.raw('count(*) as max')).from('RankingChaosCastle').first();
      const chaos = await db.select(db.raw(`Name, Score, Class`)).from(db.raw(`
          ( SELECT    ROW_NUMBER() OVER ( ORDER BY Score DESC) AS RowNum, r.Name, r.Score, c.Class
            FROM      RankingChaosCastle as r
            LEFT JOIN Character as c on r.Name = c.Name
          ) AS RowConstrainedResult
          `)).where('RowNum', '>', limit * (page - 1)).andWhere('RowNum', '<=', limit * page);
      res.json({
        maxPages: Math.ceil(Number(max.max) / Number(limit)),
        ranking: chaos
      });
    } catch (error) {
      res.status(500).json({
        message: {
          type: 'error',
          text: 'Hubo un error en tu solicitud'
        }
      });
      helpers.submitError('apiController.getRankingChaosCastle', error);
    }
  },

  async getRankingDevilSquare(req, res) {
    try {
      const limit = req.query.max ? req.query.max : 10;
      const page = req.query.page ? req.query.page : 1;
      const max = await db.select(db.raw('count(*) as max')).from('RankingDevilSquare').first();
      const devil = await db.select(db.raw(`Name, Score, Class`)).from(db.raw(`
          ( SELECT    ROW_NUMBER() OVER ( ORDER BY Score DESC) AS RowNum, r.Name, r.Score, c.Class
            FROM      RankingDevilSquare as r
            LEFT JOIN Character as c on r.Name = c.Name
          ) AS RowConstrainedResult
          `)).where('RowNum', '>', limit * (page - 1)).andWhere('RowNum', '<=', limit * page);
      res.json({
        maxPages: Math.ceil(Number(max.max) / Number(limit)),
        ranking: devil
      });
    } catch (error) {
      res.status(500).json({
        message: {
          type: 'error',
          text: 'Hubo un error en tu solicitud'
        }
      });
      helpers.submitError('apiController.getRankingDevilSquare', error);
    }
  },

  async getRankingDuels(req, res) {
    try {
      const limit = req.query.max ? req.query.max : 10;
      const page = req.query.page ? req.query.page : 1;
      const max = await db.select(db.raw('count(*) as max')).from('RankingDuel').first();
      const duel = await db.select(db.raw(`Name, WinScore, LoseScore, Class`)).from(db.raw(`
          ( SELECT    ROW_NUMBER() OVER ( ORDER BY WinScore DESC, LoseScore ASC) AS RowNum, r.Name, r.WinScore, r.LoseScore, c.Class
            FROM      RankingDuel as r
            LEFT JOIN Character as c on r.Name = c.Name
          ) AS RowConstrainedResult
          `)).where('RowNum', '>', limit * (page - 1)).andWhere('RowNum', '<=', limit * page);
      res.json({
        maxPages: Math.ceil(Number(max.max) / Number(limit)),
        ranking: duel
      });
    } catch (error) {
      res.status(500).json({
        message: {
          type: 'error',
          text: 'Hubo un error en tu solicitud'
        }
      });
      helpers.submitError('apiController.getRankingDuels', error);
    }
  },

  async getWebshopItemDetails(req, res) {
    try {
      const itemfound = await db('Webshop_items').where({
        active: 1,
        id: req.params.itemid
      }).first();
      if (itemfound) {
        const categoryfound = await db('Webshop_categories').where({
          id: itemfound.categoryid
        }).first();
        itemfound.data = new item(itemfound.hex);
        itemfound.discount = (itemfound.discount > categoryfound.discount ? itemfound.discount : categoryfound.discount);
        const wconfig = res.locals.config.webshop;
        let buyItem = itemfound;
        buyItem.details = wconfig;
        res.json(buyItem);
      } else {
        throw new Error('No existe item con ese id');
      }
    } catch (error) {
      res.status(500).json({
        message: {
          type: 'error',
          text: 'Hubo un error en tu solicitud'
        }
      });
      helpers.submitError('apiController.getWebshopItemDetails', error);
    }
  },

  async getNews(req, res) {
    try {
      const limit = req.query.max ? req.query.max : 10;
      const page = req.query.page ? req.query.page : 1;
      const max = await db.select(db.raw('count(*) as max')).from('News').where({
        active: 1
      }).first();
      const news = await db.select(db.raw(`id, title, content, author, created_at as date`)).from(db.raw(`
          ( SELECT    ROW_NUMBER() OVER ( ORDER BY id DESC) AS RowNum, *
            FROM      News
            WHERE     active = 1
          ) AS RowConstrainedResult
        `)).where('RowNum', '>', limit * (page - 1)).andWhere('RowNum', '<=', limit * page);
      res.json({
        maxPages: Math.ceil(Number(max.max) / Number(limit)),
        news: news
      });
    } catch (error) {
      res.status(500).json({
        message: {
          type: 'error',
          text: 'Hubo un error en tu solicitud'
        }
      });
      helpers.submitError('apiController.getNews', error);
    }
  },

  async getNew(req, res) {
    try {
      const id = req.params.newsid;
      const news = await db.select('id', 'title', 'content', 'author', 'created_at as date').from('News').where({
        id: id,
        active: 1
      }).first();
      if (news) {
        res.json(news);
      } else {
        throw Error(`No ha sido encontrada la noticia`);
      }
    } catch (error) {
      res.status(500).json({
        message: {
          type: 'error',
          text: 'Hubo un error en tu solicitud'
        }
      });
      helpers.submitError('apiController.getNew', error);
    }
  },

  async getBalance(req, res) {
    try {
      const BALANCE_URL = `https://api.coinhive.com/user/balance?secret=${res.locals.config.rewards.private}&name=${req.user.memb___id}@mueurus`;
      const response = await axios.get(BALANCE_URL);
      res.json({ credits: response.data.balance });
    } catch (error) {
      res.status(500).json({
        message: {
          type: 'error',
          text: 'Hubo un error en tu solicitud'
        }
      });
      helpers.submitError('apiController.getBalance', error);
    }
  }
};

function getClass(query) {
  switch (query) {
    case 'DW':
      return 'BETWEEN 0 AND 2';
    case 'DK':
      return 'BETWEEN 16 AND 18';
    case 'FE':
      return 'BETWEEN 32 AND 34';
    case 'MG':
      return 'BETWEEN 48 AND 50';
    case 'DL':
      return 'BETWEEN 64 AND 66';
    case 'SU':
      return 'BETWEEN 80 AND 82';
    case 'RF':
      return 'BETWEENN 96 AND 97';
  }
}

export default controller;