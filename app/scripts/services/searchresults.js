'use strict';

var searchResults = function($rootScope){

  /*
  trials structure is created when setTrials is called
  trials is an object, example:
  trials = {
    status1: {
      condition1: [trialObj, trialObj, trialObj, ...],
      condition2: [],
      ...
    },
    status2: {
      condition1: [],
      condition2: [],
      ...
    },
    ...
  }
  trialObj have structure
  */

  var trials = {};
  // public api
  return {
    getTrials: function(){
      return trials;
    },
    setTrials: function(inputArray){ // array of trialObj
      for (var i=0; i<inputArray.length; i++){
        var status = inputArray[i].status[0]._;
        var conditions = inputArray[i].condition_summary[0].split('; '); // array of strings
        // check if the status is already in trials, if not, create it
        if (!trials[status]){
          trials[status] = {};
        }
        for (var j=0; j<conditions.length; j++){
          if(!trials[status][conditions[j]]){
            trials[status][conditions[j]] = [];
          }
          trials[status][conditions[j]].push(inputArray[i]);
        }
      }
      console.log('Finished building trial structure');
      $rootScope.$broadcast('dataReady');
    }
  };
};


angular.module('clinicaltrialsApp')
  .factory('searchResults', ['$rootScope', searchResults]);
