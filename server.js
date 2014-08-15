"use strict";

var express = require ('express'),
    http    = require ('http'),
    xml2js  = require ('xml2js').parseString;

var app = express();
var httpport = process.env.port || 9000;

var server = app.listen(httpport, function() {
    console.log('Listening on port %d', '|', server.address().port, '|' + typeof(server.address().port));
});

// Serve up content from public directory
app.use('/', express.static(__dirname + '/app'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get('/searchstudies', function(req, res){
  var searchTerms = req.query.query.split(' ');
  var trials = [];
  var searchPath= '';
  var called = 0;

  for (var j=1; j < 6; j++){
    // make 5 calls to get 100 trials
    // generate request url path
    // example http://clinicaltrial.gov/ct2/results?term=Stroke+AND+Brain&Search=Searc&displayxml=true
    searchPath = '/';
    for(var i=0; i<searchTerms.length-1; i++){
      searchPath += searchTerms[i] + '+AND+';
    }
    // add the last term
    searchPath += searchTerms[searchTerms.length-1];
    searchPath += '&Search=Searc&displayxml=true&pg=' + j;

    var call = http.get({
      host:'www.clinicaltrial.gov',
      path: '/ct2/results?term=' + searchPath
    }, function(response){
      var repString = '';
      response.setEncoding('utf8');
      response.on('data', function(chunk){
        repString+=chunk;
      });
      response.on('end', function(){
        xml2js(repString, function(err, result){
          if (err){
            console.log('error parsing xml ', err);
          } else {
            // extract clinical studies and add to trials
            called++;
            // some searches might have less than 100 results, check if result has any studies
            if (result.search_results.clinical_study){
              for (var k=0; k < result.search_results.clinical_study.length; k++){
                trials.push(result.search_results.clinical_study[k]);
              }
            }
            // check if trials has 5 objects, if it does all calls completed
            if (called === 5){
              res.status(200).send(JSON.stringify(trials));
            }
          }
        });
      });
    });

    call.on('error', function(e){
      console.log('error', e.message);
    });
  }
});
