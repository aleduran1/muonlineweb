import jQuery from 'jquery';
import helpers from './modules/helpers';
import 'promise-polyfill';
import 'whatwg-fetch';

const $module = $(`div.moduleContent`);
const $pagination = $(`#pagination`);
const $ranking = $(`#ranking-table-body`);
const $types = $(`div#ranking-types`);
const $loading = $(`#loading-ranking`);
let classType = {};

function hasChildren() {
  return $ranking.children().length >= 1;
}

function doPaginate(pages, typeEvent) {
  if ($pagination.children().length >= 1) {
    $pagination.empty();
  }
  for (let i = 0; i < pages; i++) {
    $(`#pagination`).append(`<button type="button" data-page="${i+1}" class="btn btn-danger ${i === 0 ? `active` : ``}">${i+1}`);
  }
  $('#pagination button').click(function(e) {
    e.preventDefault();
    $('#pagination button').removeClass(`active`);
    $(this).addClass(`active`);
    const dataPage = Number($(this).attr(`data-page`));
    switch (typeEvent) {
      case `player`:
        getRankingPlayers(dataPage);
        break;
      case `playerDW`:
        getRankingPlayers(dataPage, `DW`);
        break;
      case `playerDK`:
        getRankingPlayers(dataPage, `DK`);
        break;
      case `playerFE`:   
        getRankingPlayers(dataPage, `FE`);
        break;
      case `playerMG`:
        getRankingPlayers(dataPage, `MG`);
        break;
      case `playerDL`:
        getRankingPlayers(dataPage, `DL`);
        break;
      case `playerSU`:
        getRankingPlayers(dataPage, `SU`);
        break;
      case `playerRF`:
        getRankingPlayers(dataPage, `RF`);
        break;
      case `guild`:
        getRankingGuilds(dataPage);
        break;
      case `blood`:
        getRankingEvent(dataPage, `blood`);
        break;
      case `chaos`:
        getRankingEvent(dataPage, `chaos`);
        break;
      case `devil`:
        getRankingEvent(dataPage, `devil`);
        break;
      case `duels`:
        getRankingDuels(dataPage);
        break;
    }
  });
}

async function getRankingPlayers(page, classSpec, change) {
  page = page ? page : 1;

  if (hasChildren())
    $ranking.empty();

  const data = await helpers.fetchURL(`ranking/players?max=50${page ? `&page=${page}` : ``}${classSpec ? `&class=${classSpec}` : ``}`, $loading);

  if (change)
    doPaginate(data.maxPages, classSpec ? `player${classSpec}` : `player`);

  $ranking.append(`
    <div class="ranking-table-row">
      <div class="ranking-table-header">#</div>
      <div class="ranking-table-header">CLASE</div>
      <div class="ranking-table-header">NOMBRE</div>
      <div class="ranking-table-header">LEVEL</div>
      <div class="ranking-table-header">RESETS</div>
    </div>
    `);
  for (let i = 0; i < data.ranking.length; i++) {
    $ranking.append(`
      <div class="ranking-table-row">
        <div class="ranking-table-cell">${(i+1)+((page-1)*50)}</div>
        <div class="ranking-table-cell">
          <img class="img-rounded ranking-image" src="/img/classes/${classType[data.ranking[i].Class]}.png">
        </div>
        <div class="ranking-table-cell">${data.ranking[i].Name}</div>
        <div class="ranking-table-cell">${data.ranking[i].Level}</div>
        <div class="ranking-table-cell">${helpers.formatNumber(data.ranking[i].Resets)}</div>
      </div>
    `);
  }
}

async function getRankingGuilds(page, change) {
  page = page ? page : 1;

  if (hasChildren()) {
    $ranking.empty();
  }

  const [data, colors] = await Promise.all([helpers.fetchURL(`ranking/guild?max=50&${page ? `&page=${page}` : ``}`, $loading),
                                            helpers.getColors()]);

  if (change)
    doPaginate(data.maxPages, `guild`);

  $ranking.append(`
    <div class="ranking-table-row">
      <div class="ranking-table-header">#</div>
      <div class="ranking-table-header">LOGO</div>
      <div class="ranking-table-header">NOMBRE</div>
      <div class="ranking-table-header">SCORE</div>
      <div class="ranking-table-header">G. MASTER</div>
    </div>
    `);
  for (let i = 0; i < data.ranking.length; i++) {
    $ranking.append(`
      <div class="ranking-table-row">
        <div class="ranking-table-cell">${(i+1)+((page-1)*50)}</div>
        <div class="ranking-table-cell ranking-table-cell-guildmark">
          ${helpers.makeLogo(data.ranking[i].Mark, colors, 10)}
        </div>
        <div class="ranking-table-cell">${data.ranking[i].Name}</div>
        <div class="ranking-table-cell">${data.ranking[i].Score}</div>
        <div class="ranking-table-cell">${data.ranking[i].Owner}</div>
      </div>
    `);
  }
}

async function getRankingEvent(page, event, change) {
  page = page ? page : 1;

  if (hasChildren())
    $ranking.empty();

  const data = await helpers.fetchURL(`ranking/${event}?max=50${page ? `&page=${page}` : ``}`, $loading);

  if (change)
    doPaginate(data.maxPages, event);

  $ranking.append(`
    <div class="ranking-table-row">
      <div class="ranking-table-header">#</div>
      <div class="ranking-table-header">CLASE</div>
      <div class="ranking-table-header">NOMBRE</div>
      <div class="ranking-table-header">SCORE</div>
    </div>
    `);

  for (let i = 0; i < data.ranking.length; i++) {
    $ranking.append(`
      <div class="ranking-table-row">
        <div class="ranking-table-cell">${(i+1)+((page-1)*50)}</div>
        <div class="ranking-table-cell">
          <img class="img-rounded ranking-image" src="/img/classes/${classType[data.ranking[i].Class]}.png">
        </div>
        <div class="ranking-table-cell">${data.ranking[i].Name}</div>
        <div class="ranking-table-cell">${helpers.formatNumber(data.ranking[i].Score)}</div>
      </div>
    `);
  }
}


async function getRankingDuels(page, change) {
  page = page ? page : 1;

  if (hasChildren())
    $ranking.empty();

  const data = await helpers.fetchURL(`ranking/duels?max=50${page ? `&page=${page}` : ``}`, $loading);

  if (change)
    doPaginate(data.maxPages, `duels`);

  $ranking.append(`
    <div class="ranking-table-row">
      <div class="ranking-table-header">#</div>
      <div class="ranking-table-header">CLASE</div>
      <div class="ranking-table-header">NOMBRE</div>
      <div class="ranking-table-header">GANADOS</div>
      <div class="ranking-table-header">PERDIDOS</div>
    </div>
    `);

  for (let i = 0; i < data.ranking.length; i++) {
    $ranking.append(`
      <div class="ranking-table-row">
        <div class="ranking-table-cell">${(i+1)+((page-1)*50)}</div>
        <div class="ranking-table-cell">
          <img class="img-rounded ranking-image" src="/img/classes/${classType[data.ranking[i].Class]}.png">
        </div>
        <div class="ranking-table-cell">${data.ranking[i].Name}</div>
        <div class="ranking-table-cell">${data.ranking[i].WinScore}</div>
        <div class="ranking-table-cell">${data.ranking[i].LoseScore}</div>
      </div>
    `);
  }
}

$(document).ready(async function() {
  const data = await helpers.fetchURL(`game/content`);
  classType = data.classes;
  getRankingPlayers(null, null, true);
  $(`div#ranking-types button, div#ranking-types a`).click(function(e) {
    e.preventDefault();
    if ($(this).attr(`data-type`)) {
      $(`div#ranking-types button, div#ranking-types a, div#ranking-types li`).removeClass(`active`);
      $(this).addClass(`active`);
      switch ($(this).attr(`data-type`)) {
        case `player`:
          getRankingPlayers(null, null, true);
          break;
        case `playerDW`:
          $('#classdropdown').toggleClass(`active`);
          $(this).parent().toggleClass(`active`);
          getRankingPlayers(null, `DW`, true);
          break;
        case `playerDK`:
          $('#classdropdown').toggleClass(`active`);
          $(this).parent().toggleClass(`active`);
          getRankingPlayers(null, `DK`, true);
          break;
        case `playerFE`:
          $('#classdropdown').toggleClass(`active`);
          $(this).parent().toggleClass(`active`);
          getRankingPlayers(null, `FE`, true);
          break;
        case `playerMG`:
          $('#classdropdown').toggleClass(`active`);
          $(this).parent().toggleClass(`active`);
          getRankingPlayers(null, `MG`, true);
          break;
        case `playerDL`:
          $('#classdropdown').toggleClass(`active`);
          $(this).parent().toggleClass(`active`);
          getRankingPlayers(null, `DL`, true);
          break;
        case `playerSU`:
          $('#classdropdown').toggleClass(`active`);
          $(this).parent().toggleClass(`active`);
          getRankingPlayers(null, `SU`, true);
          break;
        case `playerRF`:
          $('#classdropdown').toggleClass(`active`);
          $(this).parent().toggleClass(`active`);
          getRankingPlayers(null, `RF`, true);
          break;
        case `guild`:
          getRankingGuilds(null, true);
          break;
        case `blood`:
          getRankingEvent(null, `blood`, true);
          break;
        case `chaos`:
          getRankingEvent(null, `chaos`, true);
          break;
        case `devil`:
          getRankingEvent(null, `devil`, true);
          break;
        case `duels`:
          getRankingDuels(null, true);
          break;
      }
    }
  });
});