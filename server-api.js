global.XMLHttpRequest = require("w3c-xmlhttprequest").XMLHttpRequest;
var opn = require('opn');

require('./libs/gtpack-node');
define([
	'ServerAPI', 
	'crypto.DataManager'
], function(){
	crypto.connect.Connect.server_url = HostConfig.host + ':' + HostConfig.port.chain;
	
	opn(HostConfig.host + ':' + HostConfig.port.web);

	var dm = new crypto.DataManager({ 
		ping: false, 
		onready: function () {
			if(HostConfig.onready) {
				HostConfig.onready();
				
				console.log(`\x1b[33m\n\n
				>>>=================<<<
				>>> SERVER IS READY <<<
				>>>=================<<<
				\x1b[0m`);
			}
		}
	});

	this.httpPostRequest = function (req, res) {
		var cm = req.body.cm;
		//console.log('server-api.js::httpPostRequest >> ', req.body);
		switch (cm) {
			case 'reg': 
				var acc_num = req.body.acc_num;
				var publicKey = req.body.publicKey;
				
				if(!acc_num) {
					res.json({status: 'error', message: 'acc_num is not define' });
					return;
				}
				if(!publicKey || publicKey === "") {
					res.json({status: 'error', message: 'publicKey is not define' });
					return;
				}
				res.json({
					cm: cm,
					acc_num: acc_num,
					publicKey: publicKey,
					reg: dm.regByApi(acc_num, publicKey)
				});
				return;
			case 'send':
				if (dm.testSig(req.body)) {
					console.log('== record signed correct');
					if(dm.balance(req.body.from) >= req.body.sum * 1) {
						console.log('== The wallet has enough money');
						
						console.log(req.body);
						
						dm.saveObjectData(req.body);
						res.json({
							cm: cm,
							pack: req.body
						});
					} else {
						console.log("err:: not enough money");
						res.json({status: 'error', message: 'not enough money' });
					}
				} else {
					console.log('signature is incorrect');
					res.json({status: 'error', message: 'signature is incorrect' });
				}
				return;
			default: 
				res.json({status: 'error', message: 'unknow CM property' });
				return;
		}
	}
	this.httpRequest = function (req, res) {
		var acc_num = req.params.acc_num;
		var cm = req.params.cm;
		var param = req.params.param;
		switch (acc_num) {
			case 'ping':
				dm.ping();
				res.json({status: "ok"});

				return;
			case 'record':
				var num = cm * 1;
				if(!isNaN(cm * 1)) {
					crypto.connect.Connect.getRecord(cm * 1, function(data) {
						res.json(data);
					})
				}
				return;
			case 'search':
				var _result = dm.nn.search(cm.split(','))
				res.json({
					count: _result.length,
					result: _result.map(a=>{
						try {
							a[1] = JSON.parse(a[1]);
						} catch(e) { }
						a[0] = dm.nn.indexs[a[0]];
						return {
							recordId: a[0],
							data: a[1]
						};
					})
				});
				return;
			default:
				switch (cm) {
					case 'auth':
						res.json({
							cm: cm,
							acc_num: acc_num,
							signature: param,
							auth: dm.authBySig(acc_num, param)
						});
						return;
					case 'balance':
						res.json({
							cm: cm,
							acc_num: acc_num,
							balance: dm.balance(acc_num)
						});
						return;
					case 'history':
						res.json({
							cm: cm,
							acc_num: acc_num,
							history: dm.history(acc_num)
						});
						return;
					default:
						res.sendFile(__dirname + HostConfig.content.doc);
						return;
				}
		}
		res.sendFile(__dirname + HostConfig.content.doc);
	}
})

var api = new ServerAPI();

exports.init = function (app) {
	app.post('/',  api.httpPostRequest);
	app.get('/',  api.httpRequest);
	app.get('/:acc_num', api.httpRequest);
	app.get('/:acc_num/:cm', api.httpRequest);
	app.get('/:acc_num/:cm/:param', api.httpRequest);
}
