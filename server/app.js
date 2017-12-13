'use strict';

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var routes = require('./routes/'); 
var port = process.env.PORT || 4200;
var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send({
		title: 'AirCar API',
		version: '1.0'
	});
});


app.use('/car', routes);

app.listen(port, function() {
  console.log('Listening on port http://localhost:%d', port);
});