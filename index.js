var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

global.HostConfig = require('./config.json');

function setExpress (arrFn, port, comment) {
	var app = express();

	app.use(bodyParser.json({limit: '5mb'}));
	app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

	app.use(function (req, res, next) {
	    res.setHeader('Access-Control-Allow-Origin', '*');
	    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, cache-control');
	    res.setHeader('Access-Control-Allow-Credentials', true);
	    next();
	});
	
	arrFn.map(a=>a(app));

	//fn_init(app);

	http.createServer(app).listen(port, function(){
		console.log(comment + ' server listening on port ' + port);
	});
}

setExpress([
	require('./server-api').init
], HostConfig.port.api, 'Neural-Chain API');

setExpress([
	require('./neural-chain-data-server').init
], HostConfig.port.chain, 'Neural-Chain DATA');

setExpress([
	require('./test-for-mining').init, 
	require('./content-manager').init
], HostConfig.port.web, 'http content');
