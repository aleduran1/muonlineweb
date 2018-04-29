import events from './modules/events';
import liveBG from './modules/livebg';
import widgets from './modules/widgets';
import './modules/sdk';
import bootstrap from 'bootstrap';
import jQuery from 'jquery';
import imagesLoaded from 'imagesloaded';

/**
 * MUWEB STARTUP
 */

/** This does the imagesLoad script a jQuery plugin */
imagesLoaded.makeJQueryPlugin($);

$(document).ready(() => {
  widgets.getTOP10();
  widgets.getTOP5();
  widgets.getStats();
  /** When all the images are loaded the loading animation finishes */
  $('img').imagesLoaded(() => $('body').addClass('loaded'));

  /** Buttons */
  $('#refresh-top10-players').click(() => widgets.getTOP10());
  $('#refresh-top5-guilds').click(() => widgets.getTOP5());
  $('#refresh-game-status').click(() => widgets.getStats());

  /** A little fix to the tooltips */
  $('[data-toggle="tooltip"]').tooltip();

  /** Back-To-Top Funcionality */
  /*browser window scroll (in pixels) after which the "back to top" link is shown*/
  const offset = 300;
  /* browser window scroll (in pixels) after which the "back to top" link opacity is reduced */
  const offset_opacity = 1200;
  /* duration of the top scrolling animation (in ms) */
  const scroll_top_duration = 700;
  /* grab the "back to top" link */
  const back_to_top_class = $('.cd-top');
  /* hide or show the "back to top" link */
  $(window).scroll(() => {
    if ($(this).scrollTop() > offset) {
      back_to_top_class.addClass('cd-is-visible');
    } else {
      back_to_top_class.removeClass('cd-is-visible cd-fade-out');
    }
    if ($(this).scrollTop() > offset_opacity) {
      back_to_top_class.addClass('cd-fade-out');
    }
  });
  /* smooth scroll to top */
  back_to_top_class.on('click', (event) => {
    event.preventDefault();
    $('body,html').animate({
      scrollTop: 0,
    }, scroll_top_duration);
  });
  /** Back-To-Top Funcionality end */

  /** The logo of the web unselectable and undraggable */
  $('#logo').on('dragstart', event => {
    event.preventDefault();
  });
  $('#logo').addClass('unselectable');
  $('#logo').attr("unselectable", "on");

  countdown.setLabels(
    ' :| |:|:|:|:|:|:|:|:|:',
    ' :| |:|:|:|:|:|:|:|:|:',
    '',
    '',
    'ahora');

  events.doUpdate();
  setInterval(events.doUpdate, 1000);
  liveBG.setRandomVideo();
  setInterval(function() {
    liveBG.setVideo();
  }, 20000);
});