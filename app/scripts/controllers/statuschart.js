'use strict';

var StatuschartController = function($scope, searchResults){
  console.log(searchResults.getTrials());
};

angular.module('clinicaltrialsApp')
  .controller('StatuschartCtrl', ['$scope','searchResults', StatuschartController]);
