import jQuery from 'jquery';
import 'promise-polyfill';
import 'whatwg-fetch';

const $messages = $(`div#messages`);

const helpers = {

  async fetchURL(url, $loadingSelector) {
    if ($loadingSelector)
      $loadingSelector.show();
    try {
      const response = await fetch(`/api/${url}`);
      const data = await response.json();
      if ($loadingSelector)
        $loadingSelector.hide();
      if (data.message) {
        if (data.message.type === 'error') {
          helpers.errorMessage(data.message.text);
        }
        if (data.message.type === 'warning') {
          helpers.warningMessage(data.message.text);
        }
        if (data.message.type === 'success') {
          helpers.successMessage(data.message.text);
        }
      }
      return data;
    } catch (e) {
      helpers.errorMessage(`Hubo un error`);
    }
  },

  getColors() {
    return new Promise(async function(fulfill, reject) {
      try {
        const data = await helpers.fetchURL(`game/content`);;
        fulfill(data.guildColors);
      } catch (e) {
        reject(e);
      }
    });
  },

  makeLogo(mark, colors, size) {
    size = size ? size : 3;
    let i = 0;
    let ii = 0;
    let it = `<center><table style="width:${(8 * size)}px; height:${(8 * size)}px;" border=0 cellpadding=0 cellspacing=0><tr>`;

    while (i < 64) {

      let place = mark.charAt(i);

      i++;
      ii++;

      let add = colors[place];
      it += `<td class="guildlogo" style="background-color: ${add}; width=${size}; height=${size}"></td>`;

      if (ii === 8) {
        it += `</tr>`;
        if (ii !== 64) {
          it += `<tr>`;
        }
        ii = 0;
      }
    }

    it += `</table></center>`;

    return it;
  },

  formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  clearMessages() {
    if ($messages.children().length >= 1)
      $messages.empty();
  },

  errorMessage(msg) {
    helpers.clearMessages();
    $messages.append(`
      <div class="alert alert-danger alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><i class="fa fa-times" aria-hidden="true"></i>
        </button>
        <i class="fa fa-exclamation-circle" aria-hidden="true"></i> ${msg}
      </div>
    `);
  },

  warningMessage(msg) {
    helpers.clearMessages();
    $messages.append(`
      <div class="alert alert-warning alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><i class="fa fa-times" aria-hidden="true"></i>
        </button>
        <i class="fa fa-exclamation-triangle" aria-hidden="true"></i> ${msg}
      </div>
    `);
  },

  successMessage(msg) {
    helpers.clearMessages();
    $messages.append(`
      <div class="alert alert-success alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><i class="fa fa-times" aria-hidden="true"></i>
        </button>
        <i class="fa fa-check-circle" aria-hidden="true"></i> ${msg}
      </div>
    `);
  },

};

export default helpers;