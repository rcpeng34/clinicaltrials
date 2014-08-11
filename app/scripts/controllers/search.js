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
        // data is an object with data.search_results.clinical_study being an array of studies returned
        // each object in the array is of form {condition_summary, last_changed, nct_id, order, score, status, title, url}
        // all fields in the objects are arrays of strings except status
        // status is an array of objects example: {$:{open: "N"}, _:"Completed"}
      });
    } else {
      console.log('Search bar is empty!');
    }
  };
};

angular.module('clinicaltrialsApp')
  .controller('SearchCtrl', ['$scope', '$http', searchController]);
