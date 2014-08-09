'use strict';

var searchController = function($scope){
  alert('running controller);
};

angular.module('clinicaltrialsApp')
  .controller('SearchCtrl', ['$scope', searchController]);
