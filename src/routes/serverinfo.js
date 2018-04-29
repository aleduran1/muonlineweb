'use strict';

import express from 'express';
import controller from '../controllers/serverinfoController';

const router = express.Router();

router.get('/', controller.getPlayersOnline,
  controller.getServerStatus,
  controller.getBannedAccounts,
  controller.getCreatedAccounts,
  controller.getCreatedCharacters,
  controller.getCreatedGuilds,
  controller.getAdmins,
  (req, res) => {
    res.locals.moduleTitle = 'Información del Servidor';
    res.locals.module = () => 'serverinfo';
    res.locals.active = {
      serverinfo: true
    };
    res.render('index');
  });

export default router;