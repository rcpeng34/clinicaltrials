"use strict";

var express = require ('express'),
    http    = require ('http');

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

  // generate request url path
  // example http://clinicaltrial.gov/ct2/results?term=Stroke+AND+Brain&Search=Searc&displayxml=true
  var searchPath = '/';

  for(var i=0; i<searchTerms.length-1; i++){
    searchPath += searchTerms[i] + '+AND+';
  }
  // add the last term
  searchPath += searchTerms[searchTerms.length-1];
  searchPath += '&Search=Searc&displayxml=true';

  console.log('calling', searchPath);

  var call = http.get({
    host:'www.clinicaltrial.gov',
    path: '/ct2/results?term=' + searchPath
  }, function(response){
    var repString = [];
    console.log('success');
    response.setEncoding('utf8');
    response.on('data', function(chunk){
      repString.push(chunk);
    });
    response.on('end', function(){
      console.log('done clinicaltrial.gov request');
    res.status(200).send(repString);
    });
  });

  call.on('error', function(e){
    console.log('error', e.message);
  })
  // res.status(200).send(searchTerms);

})