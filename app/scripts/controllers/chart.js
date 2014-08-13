'use strict';

var chartController = function($scope, $location, searchResults){
  // check if a search has been carried out, else redirect back to search
  console.log('running chartController');

  if (searchResults.getTrials() === null){
    $location.path('/search');
  } else {

    var trials = searchResults.getTrials();
    $scope.tableTrials = [];
    $scope.searchTerm = searchResults.getSearch();
    // set global options for the 2 charts here
    Highcharts.setOptions({
      title: {
        text: 'source: clinicaltrial.gov'
      },
      legend: {
        enabled: false
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
          text: 'Trials'
        }
      },
      series: [{
        name: 'Clinical Trials',
        data: []
      }]
    };
    // populate categories for x-axis
    for (var status in trials){
      $scope.statusChartOptions.xAxis.categories.push(status);
      $scope.statusChartOptions.series[0].data.push({
        y: trials[status].trialcount,
        events:{
          click: function(){ //invokes with an jquery event but we don't need it
            // things to clear the trial table if it's not empty
            $scope.tableTrials = [];
            $scope.selectedCategory = '';
            $scope.selectedStatus = this.category;
            $scope.$apply();

            $scope.buildCategoryChart(this.category);
          }
        }
      });
    }

    $scope.statusChart = new Highcharts.Chart($scope.statusChartOptions);

    $scope.buildCategoryChart = function(status){ // status is a string
      $scope.categoryChartOptions = {
        chart: {
          type: 'bar',
          renderTo: 'categoryChart',
        },
        xAxis: {
          categories: []
        },
        yAxis: {
          title: {
            text: 'Trials'
          }
        },
        series: [{
          name: 'Clinical Trials',
          data: []
        }]
      };

      // count how many categories there are and set height = 100 + #conditions*20
      var conditions = 0;

      for (var category in trials[status].conditions){
        conditions++;
        console.log(category);
        $scope.categoryChartOptions.xAxis.categories.push(category);
        $scope.categoryChartOptions.series[0].data.push({
          y: trials[status].conditions[category].length,
          events: {
            click: function(){
              $scope.selectedCategory = this.category;
              // empty the array
              $scope.tableTrials = [];
              for (var i=0; i<trials[status].conditions[this.category].length; i++){
                $scope.tableTrials = $scope.tableTrials.concat(trials[status].conditions[this.category][i]);
              }
              $scope.$apply();
            }
          }
        });
      }
      $scope.categoryChartOptions.chart.height = Math.max(100 + conditions*20, 200);
      $scope.categoryChart = new Highcharts.Chart($scope.categoryChartOptions);
    };
  }
};

angular.module('clinicaltrialsApp')
  .controller('chartCtrl', ['$scope', '$location','searchResults', chartController]);
