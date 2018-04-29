import jQuery from 'jquery';
import helpers from './modules/helpers';
import 'promise-polyfill';
import 'whatwg-fetch';
import moment from 'moment';

const $module = $(`div.moduleContent`);
const $pagination = $(`#pagination`);
const $news = $(`#news`);
const $loading = $(`#loading-news`);

function hasChildren() {
  return $news.children().length >= 1;
}

function doPaginate(pages) {
  if ($pagination.children().length >= 1) {
    $pagination.empty();
  }
  for (let i = 0; i < pages; i++) {
    $(`#pagination`).append(`<button type="button" data-page="${i+1}" class="btn btn-danger ${i === 0 ? `active` : ``}">${i+1}`);
  }
  $pagination.show();
  $('#pagination button').click(function(e) {
    e.preventDefault();
    $('#pagination button').removeClass(`active`);
    $(this).addClass(`active`);
    const dataPage = Number($(this).attr(`data-page`));
    getNews(dataPage);
  });
}

async function getNews(page, change) {
  page = page ? page : 1;

  if (hasChildren())
    $news.empty();

  const data = await helpers.fetchURL(`news?max=10${page ? `&page=${page}` : ``}`, $loading);

  if (change)
    doPaginate(data.maxPages);

  for (let i = 0; i < data.news.length; i++) {
    $news.append(`
      <a class="news-title-link" href="${data.news[i].id}">
        <h3 class="news-title"><i class="fa fa-newspaper-o" aria-hidden="true"></i> ${data.news[i].title}</h3>
      </a>
      <p class="news-date"><i class="fa fa-calendar" aria-hidden="true"></i> ${moment(data.news[i].date).format(`DD/MM/YYYY - hh:mm:ss a`)} - ${data.news[i].author}</p>
      ${data.news[i].content}
      <hr class="news-hr">
    `);
  }

  $('#news a.news-title-link').click(function(event) {
      event.preventDefault();
      getNew($(this).attr(`href`));
  });

}

async function getNew(id) {
  try {
    $news.empty();
    $pagination.hide();
    const data = await helpers.fetchURL(`news/${id}`, $loading);
    $news.append(`
        <a class="news-title-link" href="#">
          <h3 class="news-title"><i class="fa fa-newspaper-o" aria-hidden="true"></i> ${data.title}</h3>
        </a>
        <p class="news-date"><i class="fa fa-calendar" aria-hidden="true"></i> ${moment(data.date).format(`DD/MM/YYYY - hh:mm:ss a`)} - ${data.author}</p>
        ${data.content}
        <hr class="news-hr">
        <button id="back" class="btn btn-info raised">
          <i class="fa fa-chevron-circle-left" aria-hidden="true"></i>
          Volver al principio
        </button>
    `);
    $(`button#back`).click(function(event) {
      event.preventDefault();
      getNews(null, true);
    });
  } catch(e) {
    console.log(e);
  }
  
}

$(document).ready(async function() {
  if (typeof nid !== "undefined") {
    getNew(nid);
  } else {
    getNews(null, true);
  }
});