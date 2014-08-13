'use strict';

var chartController = function($scope, $location, searchResults, ngTableParams){
  // check if a search has been carried out, else redirect back to search
  console.log('running chartController');

  if (searchResults.getTrials() === null){
    $location.path('/search');
  } else {

    var trials = searchResults.getTrials();
    $scope.tableTrials = [];
    $scope.searchTerm = searchResults.getSearch();
    $scope.showTable = false;
// ************************************* set global options for the 2 charts here ************************************* //
    Highcharts.setOptions({
      title: {
        text: 'source: clinicaltrial.gov'
      },
      legend: {
        enabled: false
      }
    });

// ************************************* build StatusChart ************************************* //

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
            $scope.showTable = false;
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

// ************************************* build category chart ************************************* //

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
              // ******************* trial table stuff ******************* //
              $scope.tableTrials = trials[status].conditions[this.category];
              // go through each and parse the date into a usable number
              for (var i=0; i<$scope.tableTrials.length; i++){
                $scope.tableTrials[i].last_changed[1] = Date.parse($scope.tableTrials[i].last_changed[0]);
              }
              $scope.sort = 'score';
              $scope.showTable = true;
              $scope.$apply();
              $('.trialTitle').tooltip({placement: 'top'}); // initialize bootstrap opt in for title hovering on each td
            }
          }
        });
      }
      $scope.categoryChartOptions.chart.height = Math.max(100 + conditions*20, 200);
      $scope.categoryChart = new Highcharts.Chart($scope.categoryChartOptions);
    };

  } // from else li9
};

angular.module('clinicaltrialsApp')
  .controller('chartCtrl', ['$scope', '$location','searchResults', chartController]);
