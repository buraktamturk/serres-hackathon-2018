'use strict';

import "babel-polyfill";

import '../assets/main.css';

serres(null, function(config) {
  const angular = require('angular');

  window.jQuery = window.$ = $;

  window.Promise = require('bluebird');
  require('babel-runtime/core-js/promise').default = require('bluebird');

  window.Promise.config({
      warnings: false
  });

  angular
    .module('serres-hackathon-2018', [
      require('angular-ui-router'),
      require('./router.js'),
      require('ng-dialog'),
      require('angular-animate'),
      require('angular-translate'),
      require('angular1-scaffolder'),
      require('./maps.js')
    ])
    .config(function ($sceProvider, $compileProvider) {
      'ngInject';

      $sceProvider.enabled(false);
      $compileProvider.debugInfoEnabled(false);
    })
    .filter('add_one', function() {
     return function(data) {
       return (data || []).concat([""]);
     };
   })
    .filter('add_one_if', function() {
     return function(data, condition1, condition2) {
       return condition1 != condition2 ? (data || []).concat([""]) : data;
     };
   })
   .filter("no", function () {
      'ngInject';

      return function (collection, key, other_collection, other_key, except_id) {
        return (collection || []).filter((obj1) => {
          for (let obj2 of (other_collection || [])) {
            if (obj1[key] == obj2[other_key] && obj1[key] != except_id) {
              return false;
            }
          }

          return true;
        });
      };
    });
});
