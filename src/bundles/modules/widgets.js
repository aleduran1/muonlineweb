import 'promise-polyfill';
import 'whatwg-fetch';
import jQuery from 'jquery';
import helpers from './helpers';

let guildColors;

const widgets = {

  async getStats() {
    try {
      if ($('#panel-status').children().length >= 1) {
        $('#panel-status').empty();
      }
      const data = await helpers.fetchURL(`game/status`);
      const css = (data.serverOnline) ? `green` : `red`;
      const status = (data.serverOnline) ? `ONLINE` : `OFFLINE`;
      $('#panel-status').html(`
        <p><span class="panel-text">Estado del servidor: <span class="pull-right ${css}"><i class="fa fa-circle"></i> ${status}</span></span>
        </p>
        <p><span class="panel-text">Jugadores en línea: <span class="pull-right">${data.playersOnline}</span></span>
        </p>
      `);
    } catch (error) {
      console.log('Hubo un error');
    }
  },

  async getTOP5() {
    try {
      if ($('#top-5-guild-table tr').length > 1) {
        $('#top-5-guild-table tr:not(:first)').remove();
      }
      const [data, colors] = await Promise.all([helpers.fetchURL(`ranking/guild`), helpers.getColors()]);
      for (let i = 0; i < data.ranking.length; i++) {
        $('<tr>').append(
          $('<td class="ranking-cell">').text(Number(i) + 1),
          $('<td class="ranking-cell">').text(data.ranking[i].Name),
          $('<td class="ranking-cell">').text(data.ranking[i].Score),
          $('<td class="ranking-cell">').html(helpers.makeLogo(data.ranking[i].Mark, colors))
        ).appendTo('#top-5-guild-table');
      }
    } catch (error) {
      console.log('Hubo un error');
    }
  },

  async getTOP10() {
    try {
      if ($('#top-10-players-table tr').length > 1) {
        $('#top-10-players-table tr:not(:first)').remove();
      }
      const data = await helpers.fetchURL(`ranking/players`);
      const ranking = data.ranking;
      for (let i = 0; i < ranking.length; i++) {
        $('<tr>').append(
          $('<td class="ranking-cell">').text(Number(i) + 1),
          $('<td class="ranking-cell">').text(ranking[i].Name),
          $('<td class="ranking-cell">').text(ranking[i].Level),
          $('<td class="ranking-cell">').text(ranking[i].Resets)
        ).appendTo('#top-10-players-table');
      }
    } catch (error) {
      console.log('Hubo un error');
    }
  }
};

export default widgets;