'use strict';
import 'promise-polyfill';
import 'whatwg-fetch';

(function() {
  return fetch('/api/appkeys').then((response) => response.json()).then((data) => {

    /**
     * Facebook API
     */
    window.fbAsyncInit = function() {
      FB.init({
        appId: data.fbapi,
        xfbml: true,
        version: 'v2.8'
      });
    };
    (function(d, s, id) {
      let js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/es_LA/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    /**
     * Analytics API
     */
    (function(b, o, i, l, e, r) {
      b.GoogleAnalyticsObject = l;
      b[l] || (b[l] =
        function() {
          (b[l].q = b[l].q || []).push(arguments);
        });
      b[l].l = +new Date;
      e = o.createElement(i);
      r = o.getElementsByTagName(i)[0];
      e.src = '//www.google-analytics.com/analytics.js';
      r.parentNode.insertBefore(e, r);
    }(window, document, 'script', 'ga'));
    ga('create', data.analytics, 'auto');
    ga('send', 'pageview');
  });
})();