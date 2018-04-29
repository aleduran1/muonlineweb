'use strict';

import db from '../db';
import helpers from '../helpers';

const controller = {

	async getNewsIndex(req, res, next) {
		try {
			const news = await db('News').where('active', '1').orderBy('id', 'desc').limit(10);
			res.locals.news = news;
			next();
		} catch (error) {
			helpers.submitError('newsController.getNewsIndex', error);
		}
	},

	async getNews(req, res, next) {
		if (isNaN(req.params.newsid)) {
			res.redirect('/');
		}
		try {
			const news = await db('News').where({
				id: req.params.newsid,
				active: '1'
			}).first();
			if (news) {
				res.locals.news = {};
				res.locals.news[0] = news;
				next();
			} else {
				res.redirect('/');
			}
		} catch (error) {
			helpers.submitError('newsController.getNews', error);
		}
	},
};

export default controller;