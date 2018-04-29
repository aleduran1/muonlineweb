import moment from 'moment';
import countdown from 'countdown';
import momentCountdown from 'moment-countdown';
import jQuery from 'jquery';

const events = {

  bloodCastleTime() {
    // Blood Castle
    if (moment(events.getTiempo()).isSameOrBefore(moment('00:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('00:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('02:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('02:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('04:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('04:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('06:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('06:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('08:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('08:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('10:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('10:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('12:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('12:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('14:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('14:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('16:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('16:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('18:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('18:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('20:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('20:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('22:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('22:00:00', 'HH:mm:ss')).toString();
    } else {
      return moment(events.getTiempo()).countdown(moment('00:00:00', 'HH:mm:ss').add('1', 'days')).toString();
    }
  },

  castleDeepTime() {
    // Castle Deep Time
    if (moment(events.getTiempo()).isSameOrBefore(moment('00:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('00:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('08:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('08:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('16:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('16:00:00', 'HH:mm:ss')).toString();
    } else {
      return moment(events.getTiempo()).countdown(moment('00:00:00', 'HH:mm:ss').add('1', 'days')).toString();
    }
  },

  chaosCastleTime() {
    // Chaos Castle
    if (moment(events.getTiempo()).isSameOrBefore(moment('01:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('01:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('04:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('04:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('07:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('07:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('10:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('10:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('13:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('13:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('16:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('16:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('19:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('19:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('22:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('22:00:00', 'HH:mm:ss')).toString();
    } else {
      return moment(events.getTiempo()).countdown(moment('01:00:00', 'HH:mm:ss').add('1', 'days')).toString();
    }
  },

  devilSquareTime() {
    // Devil Square Time
    if (moment(events.getTiempo()).isSameOrBefore(moment('00:30:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('00:30:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('04:30:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('04:30:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('08:30:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('08:30:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('12:30:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('12:30:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('16:30:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('16:30:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('20:30:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('20:30:00', 'HH:mm:ss')).toString();
    } else {
      return moment(events.getTiempo()).countdown(moment('00:30:00', 'HH:mm:ss').add('1', 'days')).toString();
    }
  },

  dropEventTime() {
    // Drop Event Time
    if (moment(events.getTiempo()).isSameOrBefore(moment('00:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('00:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('06:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('06:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('12:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('12:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('18:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('18:00:00', 'HH:mm:ss')).toString();
    } else {
      return moment(events.getTiempo()).countdown(moment('00:00:00', 'HH:mm:ss').add('1', 'days')).toString();
    }
  },

  eggInvasionTime() {
    // Egg Invasion Time
    if (moment(events.getTiempo()).isSameOrBefore(moment('04:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('04:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('10:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('10:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('16:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('16:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('22:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('22:00:00', 'HH:mm:ss')).toString();
    } else {
      return moment(events.getTiempo()).countdown(moment('04:00:00', 'HH:mm:ss').add('1', 'days')).toString();
    }
  },

  goldenInvasionTime() {
    // Golden Time
    if (moment(events.getTiempo()).isSameOrBefore(moment('00:30:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('00:30:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('06:30:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('06:30:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('12:30:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('12:30:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('18:30:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('18:30:00', 'HH:mm:ss')).toString();
    } else {
      return moment(events.getTiempo()).countdown(moment('00:30:00', 'HH:mm:ss').add('1', 'days')).toString();
    }
  },

  happyHourTime() {
    // Happy Hour
    if (moment(events.getTiempo()).isBefore(moment('19:00:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('19:00:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSame(moment('19:00:00', 'HH:mm:ss'))) {
      return 'ACTIVO';
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('21:00:00', 'HH:mm:ss'))) {
      return 'ACTIVO';
    } else {
      return moment(events.getTiempo()).countdown(moment('19:00:00', 'HH:mm:ss').add('1', 'days')).toString();
    }
  },

  mossMerchantTime() {
    // Moss Merchant
    if (moment(events.getTiempo()).isSameOrBefore(moment('01:30:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('01:30:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('13:30:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('13:30:00', 'HH:mm:ss')).toString();
    } else {
      return moment(events.getTiempo()).countdown(moment('01:30:00', 'HH:mm:ss').add('1', 'days')).toString();
    }
  },

  redDragonTime() {
    // Red Dragon Time
    if (moment(events.getTiempo()).isSameOrBefore(moment('02:15:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('02:15:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('06:15:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('06:15:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('10:15:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('10:15:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('14:15:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('14:15:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('18:15:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('18:15:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('22:15:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('22:15:00', 'HH:mm:ss')).toString();
    } else {
      return moment(events.getTiempo()).countdown(moment('02:15:00', 'HH:mm:ss').add('1', 'days')).toString();
    }
  },

  skeletonKingTime() {
    // Skeleton King Time
    if (moment(events.getTiempo()).isSameOrBefore(moment('00:05:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('00:05:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('04:05:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('04:05:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('08:05:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('08:05:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('12:05:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('12:05:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('16:05:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('16:05:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('20:05:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('20:05:00', 'HH:mm:ss')).toString();
    } else {
      return moment(events.getTiempo()).countdown(moment('00:05:00', 'HH:mm:ss').add('1', 'days')).toString();
    }
  },

  whiteWizardTime() {
    // White Wizard Time
    if (moment(events.getTiempo()).isSameOrBefore(moment('00:45:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('00:45:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('04:45:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('04:45:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('08:45:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('08:45:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('12:45:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('12:45:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('16:45:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('16:45:00', 'HH:mm:ss')).toString();
    } else if (moment(events.getTiempo()).isSameOrBefore(moment('20:45:00', 'HH:mm:ss'))) {
      return moment(events.getTiempo()).countdown(moment('20:45:00', 'HH:mm:ss')).toString();
    } else {
      return moment(events.getTiempo()).countdown(moment('00:45:00', 'HH:mm:ss').add('1', 'days')).toString();
    }
  },

  getTiempo(tiempo) {
    if (tiempo) {
      return moment(tiempo, 'HH:mm:ss');
    } else {
      return moment().utcOffset(-3);
    }
  },

  doUpdate() {
    $('#server-time').text(events.getTiempo().format('H:m:s'));
    $('#blood-castle-time').text(events.bloodCastleTime());
    $('#castle-deep-time').text(events.castleDeepTime());
    $('#chaos-castle-time').text(events.chaosCastleTime());
    $('#devil-square-time').text(events.devilSquareTime());
    $('#drop-event-time').text(events.dropEventTime());
    $('#egg-invasion-time').text(events.eggInvasionTime());
    $('#golden-invasion-time').text(events.goldenInvasionTime());
    $('#happy-hour-time').text(events.happyHourTime());
    $('#moss-merchant-time').text(events.mossMerchantTime());
    $('#red-dragon-time').text(events.redDragonTime());
    $('#skeleton-king-time').text(events.skeletonKingTime());
    $('#white-wizard-time').text(events.whiteWizardTime());
  }

};

export default events;