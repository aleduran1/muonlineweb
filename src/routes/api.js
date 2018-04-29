'use strict';

import express from 'express';
import helpers from '../helpers';
import item from '../models/item';
import controller from '../controllers/apiController';
const router = express.Router();

router.get('/ranking/players', controller.getRankingPlayers);
router.get('/ranking/guild', controller.getRankingGuilds);
router.get('/ranking/blood', controller.getRankingBloodCastle);
router.get('/ranking/chaos', controller.getRankingChaosCastle);
router.get('/ranking/devil', controller.getRankingDevilSquare);
router.get('/ranking/duels', controller.getRankingDuels);
router.get('/game/status', controller.getStats);
router.get('/game/content', controller.getContent);
router.get('/webshop/item/:itemid', controller.getWebshopItemDetails);
router.get('/appkeys', controller.getAppKeys);
router.get('/news', controller.getNews);
router.get('/news/:newsid', controller.getNew);

/***************************************************************
 *	ITEMS ROUTE
 ***************************************************************/

router.get('/itemlist/byid/:itemid/:itemgroup', (req, res) => {
  let itemid = req.params.itemid;
  let group = req.params.itemgroup;
  let tempItem = new item(helpers.getItemHex(itemid, group));
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(tempItem, null, 3));

});

router.get('/itemlist/byhex/:hexstring', (req, res) => {
  let hexstring = req.params.hexstring;
  let tempItem = new item(hexstring);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(tempItem, null, 3));
});

router.get('/credits', controller.getBalance);

export default router;