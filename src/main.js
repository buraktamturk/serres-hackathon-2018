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
    });
});