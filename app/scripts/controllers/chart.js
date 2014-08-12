'use strict';

var chartController = function($scope, $location, searchResults){
  // check if a search has been carried out, else redirect back to search
  console.log('running chartController');

  if (searchResults.getTrials() === null){
    $location.path('/search');
  } else {

    var trials = searchResults.getTrials();
    console.log(trials);
    // set global options for the 2 charts here
    Highcharts.setOptions({
      title: {
        text: 'source: clinicaltrial.gov'
      }
    });

    $scope.statusChartOptions = {
      chart: {
        type: 'bar',
        renderTo: 'statusChart'
      },
      xAxis: {
        categories: []
      },
      yAxis: {
        title: {
          text: 'Studies'
        }
      },
      series: [{
        data: []
      }]
    };
    // populate categories for x-axis
    for (status in trials){
      $scope.statusChartOptions.xAxis.categories.push(status);
      $scope.statusChartOptions.series[0].data.push(trials[status].trialcount);
    }

    $scope.statusChart = new Highcharts.Chart($scope.statusChartOptions);
    
  }
};

angular.module('clinicaltrialsApp')
  .controller('chartCtrl', ['$scope', '$location','searchResults', chartController]);
