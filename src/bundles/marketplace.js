'use strict';
import jQuery from 'jquery';

/**
 * Marketplace JS Module
 */

$(document).ready(function() {
  $('#centerColumn').css('overflow', 'visible');
  $('.warehouse img').click(function() {
    $('#item-capsule').empty();
    $(this).clone().appendTo('#item-capsule');
    $('#item-capsule').children().addClass("center-block");
    $('#item-capsule').children().removeClass("item-marketplace");
    $('#row').val($(this).parent().attr('data-row'));
    $('#column').val($(this).parent().attr('data-column'));
    $('#sellModal').modal();
    $('[data-toggle="tooltip"]').tooltip();
  });

});