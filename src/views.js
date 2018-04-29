import fs from 'fs';
import hbs from 'hbs';
import moment from 'moment';
import path from 'path';
import helpers, { readConfigFileSync } from './helpers';

/* Registramos los partials */
hbs.registerPartial('head', fs.readFileSync(path.join(__dirname, '../views/layout/head.hbs'), 'utf-8'));
hbs.registerPartial('leftColumn', fs.readFileSync(path.join(__dirname, '../views/layout/leftColumn.hbs'), 'utf-8'));
hbs.registerPartial('rightColumn', fs.readFileSync(path.join(__dirname, '../views/layout/rightColumn.hbs'), 'utf-8'));
hbs.registerPartial('footer', fs.readFileSync(path.join(__dirname, '../views/layout/footer.hbs'), 'utf-8'));

hbs.registerPartials(path.join(__dirname, '../views/layout'));
hbs.registerPartials(path.join(__dirname, '../views/modules'));
hbs.registerPartials(path.join(__dirname, '../views/user_modules'));
hbs.registerPartials(path.join(__dirname, '../views/admin_modules'));
hbs.registerPartials(path.join(__dirname, '../views/error'));

/* Registramos los helpers */
hbs.registerHelper('incremented', (index) => ++index);

hbs.registerHelper('multiply', (index, number) => ++index * number);

hbs.registerHelper('for', (n, block) => {
	let finalblock = '';
	for (let i = 0; i < n; ++i)
		finalblock += block.fn(i);
	return finalblock;
});

hbs.registerHelper('date-format-dmy', (date) => moment(date).utcOffset(0).format('DD-MM-YYYY'));

hbs.registerHelper('date-format-dmyhms', (date) => moment(date).utcOffset(0).format('DD-MM-YYYY [a las] h:mm:ss a'));

hbs.registerHelper('getClass', (classid) => helpers.getClass(classid));

hbs.registerHelper('getMap', (mapid) => helpers.getMap(mapid));

hbs.registerHelper('getHex', (id, group) => helpers.getItemHex(id, group));

hbs.registerHelper('getPK', (pkid) => helpers.getPK(pkid));

hbs.registerHelper('upperCase', (text) => text.toUpperCase());

hbs.registerHelper('ifIsAdmin', (accesslevel, block) => {
	if (parseInt(accesslevel) === 3) {
		return block.fn(this);
	}
});

hbs.registerHelper('ifCanReset', (level, zen, resets, acclvl, block) => {
	let canReset = helpers.canReset(level, zen, resets, acclvl);

	if (canReset) {
		return block.fn(this);
	} else {
		return block.inverse(this);
	}
});

hbs.registerHelper('ifCanClearPK', (pklvl, zen, acclvl, block) => {
	let canClearPK = helpers.canClearPK(pklvl, zen, acclvl);

	if (canClearPK) {
		return block.fn(this);
	} else {
		return block.inverse(this);
	}

});

hbs.registerHelper('ifGotLimit', (stats, block) => {
	const config = readConfigFileSync();
	if (parseInt(stats) === parseInt(config.addStats.limit)) {
		return block.fn(this);
	} else {
		return block.inverse(this);
	}
});

hbs.registerHelper('ifDL', (classid, block) => {
	if (helpers.getClass(classid) === 'DL') {
		return block.fn(this);
	} else {
		return block.inverse(this);
	}
});

hbs.registerHelper('logo', (mark, size, css) => {

	mark = mark.toString('hex');

	if (css) {
		css = 'class="' + css + '"';
	} else {
		css = '';
	}

	let i = 0;
	let ii = 0;

	let it = '<table ' + css + ' style=\'width: ' + (8 * size) + 'px;height:' + (8 * size) + 'px\' border=0 cellpadding=0 cellspacing=0><tr>';

	while (i < 64) {

		let place = mark.charAt(i);

		i++;
		ii++;

		let add = helpers.getColor(place);
		it += '<td class=\'guildlogo\' style=\'background-color: ' + add + ';\' width=\'' + size + '\' height=\'' + size + '\'></td>';

		if (ii === 8) {
			it += '</tr>';
			if (ii !== 64) {
				it += '<tr>';
			}
			ii = 0;
		}
	}

	it += '</table>';

	return it;

});

export default hbs;