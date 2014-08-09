'use strict';

var searchController = function($scope){
  $scope.searching = false;
  $scope.search = function(){
    if ($scope.searchTerm){
      alert('searching for ' + $scope.searchTerm);
      $scope.searching = true;
    } else {
      alert('Search bar is empty!');
    }
  };
};

angular.module('clinicaltrialsApp')
  .controller('SearchCtrl', ['$scope', searchController]);
