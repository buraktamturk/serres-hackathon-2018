
module.exports = require('angular')
    .module('serres-hackathon-2018.router', [
        require('angular-ui-router'),
        require('angular-moment')
    ])
    .config(function($locationProvider, $stateProvider, $urlRouterProvider) {
        'ngInject';

        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise(function($injector) {
            var $state = $injector.get('$state');
            $state.go('app.parta');
        });

        $stateProvider
          .state('app', {
            abstract: true,
            template: require('../html/app.html'),
            data: {

            }
          })
          .state('app.parta', {
            url: '/',
            template: require('../html/parta.html'),
            controller: require('./controllers/PartAController.js'),
            controllerAs: 'ctrl'
          })
          .state('app.partb', {
            url: '/b',
            template: require('../html/partb.html'),
            controller: require('./controllers/PartBController.js'),
            controllerAs: 'ctrl'
          })
          .state('app.partc', {
            url: '/c',
            template: require('../html/partc.html'),
            controller: require('./controllers/PartCController.js'),
            controllerAs: 'ctrl'
          });
    })
    .name;
