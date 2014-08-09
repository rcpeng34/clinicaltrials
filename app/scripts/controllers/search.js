'use strict';

var searchController = function($scope, $http){
  var searchTerms = [];
  $scope.searching = false;

  $scope.search = function(){
    if ($scope.searchTerm){
      $scope.searching = true;
      searchTerms = $scope.searchTerm.split(' ');
      var searchURL = '/searchstudies?query=';
      for (var i=0; i<searchTerms.length; i++){
        searchURL += searchTerms[i].toString() + '+';
      }
      // searchURL ends in a '+' so remove it
      searchURL = searchURL.substring(0, searchURL.length-1);
      console.log('searching for ', searchURL);
      $http({
        method: 'GET',
        url: searchURL
      })
      .success(function(data){
        console.log('from http', data);
      });
    } else {
      console.log('Search bar is empty!');
    }
  };
};

angular.module('clinicaltrialsApp')
  .controller('SearchCtrl', ['$scope', '$http', searchController]);
