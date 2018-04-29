import jQuery from 'jquery';
import 'promise-polyfill';
import 'whatwg-fetch';

/**
 * WEBSHOP MODULE JS
 *
 */
// jQuery stuff
const $buybtn = $(`.buybtn`);
const $modal = $('#buyModal');
const $mbody = $('#buy-body');
const $mloading = $('#loading-buy');
const $mheader = $('.modal-header');
const $mfooter = $('.modal-footer');
const $mform = $(`#buy-item-form`);

// item stuff
let costxITEM = 0;
let costxLVL = 0;
let costxOPTION = 0;
let costxLUCK = 0;
let costxSKILL = 0;
let costxEX1 = 0;
let costxEX2 = 0;
let costxEX3 = 0;
let costxEX4 = 0;
let costxEX5 = 0;
let costxEX6 = 0;
let maxOptions = 0;
let percent = 100;
let checked = 0;

$(document).ready(() => {
  $('#centerColumn').css('overflow', 'visible');

  $buybtn.click(function(event) {
    showModal();
    event.preventDefault();
    let itemID = $(this).attr(`data-item-id`);
    return fetch(`/api/webshop/item/${itemID}`).then((response) => response.json()).then((data) => {
      setWebshopVariables(data);
      generateModal(data, $(this).prev().prev());
    });
  });
});

function showModal() {
  $mheader.hide();
  $mbody.empty();
  $mfooter.hide();
  $mloading.show();
  $modal.modal();
}

function generateModal(data, $image) {
  $mform.attr('action', `/webshop/buy/${data.id}`);
  $mheader.show();
  $mloading.hide();
  $mfooter.show();
  $mbody.html(`
    <div class="row">
      <div class="col-md-12">
      </div>
    </div>
  `);
  const $column = $(`div#buy-body > div.row > div.col-md-12`);
  $column.append(`<h4>${data.name}</h4><center><div id="item-capsule">
      </div></center>`);
  $image.clone().attr('data-placement', 'bottom').appendTo('#item-capsule');
  $('[data-toggle="tooltip"]').tooltip();

  if (data.maxLevel) { // Si el item puede tener nivel, se agrega el select
    $column.append(`
      <div class="form-group">
        <label for="level" class="control-label">Nivel del item:</label>
        <span class="help-block pull-right">Costo por nivel: ${data.details.coinsPerItemLevel}</span>
        <select id="level" name="level" class="form-control">
        </select>
      </div>
    `);
    for (let i = 0; i <= data.maxLevel; i++) {
      $('select#level').append(`<option value="${i}">${i}</option>`);
    }
  }

  if (data.maxOption) { // Si el item puede tener opcion, se agrega el select
    $column.append(`
      <div class="form-group">
        <label for="option" class="control-label">Opción del item:</label>
        <span class="help-block pull-right">Costo por opción: ${data.details.coinsPerOptionLevel}</span>
        <select id="option" name="option" class="form-control">
        </select>
      </div>
    `);
    for (let i = 0; i <= data.maxOption; i++) {
      $(`select#option`).append(`<option value="${i}">${i * data.data.optionMultiplier}</option>`);
    }
  }

  if (data.canLuck) { // Si el item puede tener luck, se agrega el checkbox
    $column.append(`
      <div class="checkbox clearfix">
        <label>
          <input type="checkbox" id="luck" name="luck" value="1">
            +Luck
        </label>
        <span class="help-block pull-right">Costo: ${data.details.coinsForLuck}</span>
      </div>
    `);
  }

  if (data.canSkill) { // Si el item puede tener skill, se agrega el checkbox
    $column.append(`
      <div class="checkbox clearfix">
        <label>
          <input type="checkbox" id="skill" name="skill" value="1">
            +Skill
        </label>
        <span class="help-block pull-right">Costo: ${data.details.coinsForSkill}</span>
      </div>
    `);
  }

  if (data.excellentOption1) { // Si el item puede tener la opción 1 excellent, se agrega el checkbox
    $column.append(`
      <div class="checkbox clearfix">
        <label>
          <input type="checkbox" class="exc" id="excellentOption1" name="excellentOption1" value="1">
            +${data.data.excellentText1}
        </label>
        <span class="help-block pull-right">Costo: ${data.details.coinsForExcellentOption1}</span>
      </div>
    `);
  }

  if (data.excellentOption2) { // Si el item puede tener la opción 2 excellent, se agrega el checkbox
    $column.append(`
      <div class="checkbox clearfix">
        <label>
          <input type="checkbox" class="exc" id="excellentOption2" name="excellentOption2" value="1">
            +${data.data.excellentText2}
        </label>
        <span class="help-block pull-right">Costo: ${data.details.coinsForExcellentOption2}</span>
      </div>
    `);
  }

  if (data.excellentOption3) { // Si el item puede tener la opción 3 excellent, se agrega el checkbox
    $column.append(`
      <div class="checkbox clearfix">
        <label>
          <input type="checkbox" class="exc" id="excellentOption3" name="excellentOption3" value="1">
            +${data.data.excellentText3}
        </label>
        <span class="help-block pull-right">Costo: ${data.details.coinsForExcellentOption3}</span>
      </div>
    `);
  }

  if (data.excellentOption4) { // Si el item puede tener la opción 4 excellent, se agrega el checkbox
    $column.append(`
      <div class="checkbox clearfix">
        <label>
          <input type="checkbox" class="exc" id="excellentOption4" name="excellentOption4" value="1">
            +${data.data.excellentText4}
        </label>
        <span class="help-block pull-right">Costo: ${data.details.coinsForExcellentOption4}</span>
      </div>
    `);
  }

  if (data.excellentOption5) { // Si el item puede tener la opción 5 excellent, se agrega el checkbox
    $column.append(`
      <div class="checkbox clearfix">
        <label>
          <input type="checkbox" class="exc" id="excellentOption5" name="excellentOption5" value="1">
            +${data.data.excellentText5}
        </label>
        <span class="help-block pull-right">Costo: ${data.details.coinsForExcellentOption5}</span>
      </div>
    `);
  }

  if (data.excellentOption6) { // Si el item puede tener la opción 6 excellent, se agrega el checkbox
    $column.append(`
      <div class="checkbox clearfix">
        <label>
          <input type="checkbox" class="exc" id="excellentOption1" name="excellentOption6" value="1">
            +${data.data.excellentText6}
        </label>
        <span class="help-block pull-right">Costo: ${data.details.coinsForExcellentOption6}</span>
      </div>
    `);
  }

  // Agregamos el costo
  $column.append(`
    <hr>
    <p>
      <span class="total-cost"> Costo total: 
        <span class="cost">100</span>
      </span>
  `);
  setCost();
  if (data.discount) {
    $('span.total-cost').append(`
      <sup class="sup-red">-${data.discount}%</sup>
    `);
  }

  $('#buy-body :checkbox').change(function() {
    setCost();
  });

  $('#level').change(function() {
    setCost();
  });

  $('#option').change(function() {
    setCost();
  });

  $('.exc').change(function() {
    if (this.checked) {
      checked++;
      setCost();
    } else {
      checked--;
    }
    if (checked > maxOptions) {
      $('.exc').attr('checked', false);
      checked = 0;
      setCost();
    }
  });

}

function setCost() {
  $('.cost').text(formula());
}

function formula() {
  let step = [10];
  step[0] = $('#level').length ? parseInt(costxLVL * $('#level').val()) : 0;
  step[1] = $('#option').length ? parseInt(costxOPTION * $('#option').val()) : 0;
  step[2] = $('#luck').length ? parseInt(costxLUCK * $('#luck').is(':checked')) : 0;
  step[3] = $('#skill').length ? parseInt(costxSKILL * $('#skill').is(':checked')) : 0;
  step[4] = $('#excellentOption1').length ? parseInt(costxEX1 * $('#excellentOption1').is(':checked')) : 0;
  step[5] = $('#excellentOption2').length ? parseInt(costxEX1 * $('#excellentOption2').is(':checked')) : 0;
  step[6] = $('#excellentOption3').length ? parseInt(costxEX1 * $('#excellentOption3').is(':checked')) : 0;
  step[7] = $('#excellentOption4').length ? parseInt(costxEX1 * $('#excellentOption4').is(':checked')) : 0;
  step[8] = $('#excellentOption5').length ? parseInt(costxEX1 * $('#excellentOption5').is(':checked')) : 0;
  step[9] = $('#excellentOption6').length ? parseInt(costxEX1 * $('#excellentOption6').is(':checked')) : 0;
  step[10] = parseInt(costxITEM);
  let retorno = 0;
  for (let i = 0; i < step.length; i++) {
    retorno += step[i];
  }
  return parseInt(retorno * (percent / 100));
    
}

function setWebshopVariables(data) {
  costxITEM = data.cost;
  costxLVL = data.details.coinsPerItemLevel;
  costxOPTION = data.details.coinsPerOptionLevel;
  costxLUCK = data.details.coinsForLuck;
  costxSKILL = data.details.coinsForSkill;
  costxEX1 = data.details.coinsForExcellentOption1;
  costxEX2 = data.details.coinsForExcellentOption2;
  costxEX3 = data.details.coinsForExcellentOption3;
  costxEX4 = data.details.coinsForExcellentOption4;
  costxEX5 = data.details.coinsForExcellentOption5;
  costxEX6 = data.details.coinsForExcellentOption6;
  maxOptions = data.maxExcellent;
  percent = 100 - data.discount;
}