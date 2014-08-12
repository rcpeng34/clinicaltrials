'use strict';

angular
  .module('clinicaltrialsApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/search', {
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl'
      })
      .when('/chart', {
        templateUrl: 'views/chart.html',
        controller: 'chartCtrl'
      })
      .otherwise({
        redirectTo: '/search'
      });
  });
