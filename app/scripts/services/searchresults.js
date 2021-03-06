'use strict';

var searchResults = function($rootScope){

  /*
  trials structure is created when setTrials is called
  trials is an object, example:
  trials = {
    status1: {
      trialcount: number
      conditions: {
        condition1: [trialObj, trialObj, trialObj, ...],
        condition2: [],
        ...
      }
    },
    status2: {
      trialcount: number
      conditions: {
        condition1: [trialObj, trialObj, trialObj, ...],
        condition2: [],
        ...
      }
    },
    ...
  }
  trialObj have keys (all arrays) 
  condition_summary: [string], last_changed: [string], nct_id: [string], order: [string], 
  score: [string], title: [string], urlstring: [string], status: [{$:object, _:string}]
  */

  var trials = {};
  var search = '';

  // public api
  return {
    getTrials: function(){
      if ($.isEmptyObject(trials)){
        return null;
      } else {
        return trials;
      }
    },
    setTrials: function(inputArray){ // array of trialObj
      trials = {};
      for (var i=0; i<inputArray.length; i++){
        var status = inputArray[i].status[0]._;
        var conditions = inputArray[i].condition_summary[0].split('; '); // array of strings
        // check if the status is already in trials, if not, create it
        if (!trials[status]){
          trials[status] = {trialcount: 0, conditions: {}};
        }
        trials[status].trialcount++;
        for (var j=0; j<conditions.length; j++){
          if(!trials[status].conditions[conditions[j]]){
            trials[status].conditions[conditions[j]] = [];
          }
          trials[status].conditions[conditions[j]].push(inputArray[i]);
        }
      }
      console.log('Finished building trial structure');
      $rootScope.$broadcast('dataReady');
    },
    getSearch: function(){
      return search;
    },
    setSearch: function(str){
      search = str;
    }
  };
};


angular.module('clinicaltrialsApp')
  .factory('searchResults', ['$rootScope', searchResults]);
