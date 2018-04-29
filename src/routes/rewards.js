import express from 'express';
import helpers from '../helpers';
import controller from '../controllers/rewardsController';

const router = express.Router();

router.route('/')
  .all(helpers.isAuth)
  .get(controller.getRewards)
  .post(controller.postRewards);

export default router;