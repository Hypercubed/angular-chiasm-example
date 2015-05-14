'use strict';

require(['angular','scripts/controllers/main','angular-route'], function(angular,main) {

  angular
    .module('angularChiasmApp', [
      //'ngAnimate',
      //'ngCookies',
      //'ngResource',
      'ngRoute',
      //'ngSanitize',
      //'ngTouch'
      main.name
    ])
    .config(function ($routeProvider) {
      $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      //.when('/about', {
      //  templateUrl: 'views/about.html',
      //  controller: 'AboutCtrl'
      //})
      .otherwise({
        redirectTo: '/'
      });
    });

  //require('controllers/main.js');

  angular.bootstrap(document.documentElement, ["angularChiasmApp"]);
});
