'use strict';

/* require(['angular','scripts/controllers/main','angular-route'], function(angular,main) { */

  import angular from 'angular';
  import main from 'components/kitchensink/kitchensink-controller';

  import 'bootstrap';
  import 'bootstrap/css/bootstrap.css!';

  import './app.css!';

  import 'angular-route';

  //console.log(main);

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
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
      .when('/', {
        templateUrl: 'components/kitchensink/kitchensink.html',
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
    }]);

  //require('controllers/main.js');

  angular.bootstrap(document.documentElement, ['angularChiasmApp']);

//});
