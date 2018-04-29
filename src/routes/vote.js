import express from 'express';
import helpers from '../helpers';
import controller from '../controllers/voteController';

const router = express.Router();

router.get('/', helpers.isAuth, controller.initialize, controller.canVoteUT100, (req, res) => {
  res.locals.moduleTitle = 'Votar';
  res.locals.module = () => 'vote';
  res.locals.active = {
    vote: true
  };
  res.render('index');
});

router.get('/ultratop100', controller.initialize, controller.verifyRewardUT100, controller.handleRewardUT100);

export default router;