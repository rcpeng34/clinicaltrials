"use strict";

var express = require ('express'),
    http    = require ('http'),
    https   = require ('https');

var app = express();
var httpport = process.env.port || 9000;

var server = app.listen(httpport, function() {
    console.log('Listening on port %d', '|', server.address().port, '|' + typeof(server.address().port));
});

// Serve up content from public directory
app.use('/', express.static(__dirname + '/app'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/app/index.html');
});
