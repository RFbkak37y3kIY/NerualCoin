var request = require('request');
var sig = require('./signature');

var config = require('./config.json');


function miningCalc (taskName, user_acc_num, fn) {
	var sum, task = config.mining_withdrows.filter(a=>a.taskName == taskName);
	
	if(task.length != 1){
		if(fn) fn({err: true});
		return;
	}

	sum = task[0].mining_multiplier * config.base_proportion * config.system_wallet.balance;

	sendCoinsToUser(sum, user_acc_num, function(data) {
		if(fn) fn(data);
	});
}

function sendCoinsToUser (sum, user_acc_num, fn) {
	var date_time = Date.now();
	
	var _pack = {
		cm: "send",
		from: config.system_wallet.acc_num,
		to: user_acc_num,
		sum: sum,
		currencyType: config.system_wallet.currencyType,
		datatime: date_time,
	}
	
	_pack.sig = sig.signature(JSON.stringify(_pack), 
		config.system_wallet.privat_key, 
		config.system_wallet.password);

	console.log('JSON.stringify(_pack) >> ', JSON.stringify(_pack))

	var options = {
		uri: HostConfig.host + ':' + HostConfig.port.api,
		method: 'POST',
		json: _pack
	};

	request.post(options, function (err, httpResponse, body) {
		if (err) {
			if(fn) fn({err: true});
			return console.error('upload failed:', err);
		}
		console.log('user_acc_num: ' + user_acc_num + 'takes a ' + sum + " COINS.\n\t", body);
		if(fn) fn({
			user_acc: user_acc_num,
			sum: sum,
			currencyType: config.system_wallet.currencyType,
			status: 'ok'
		});
		systemWalletBalanceUpdate();
	});
}
function systemWalletBalanceUpdate () {
	var _url = HostConfig.host + ':' + HostConfig.port.api + '/' + 
		config.system_wallet.acc_num + '/balance/';

	request(_url, function (error, response, body) {
		config.system_wallet.balance = JSON.parse(body).balance * 1;

		console.log('system balance:', JSON.parse(body).balance);
	});
	
}

HostConfig.onready = function () {
	systemWalletBalanceUpdate();
}


exports.init = function (app) {
	app.get('/mining', function (req, res) {
		res.sendFile(__dirname + '/index.html');
	})
	app.get('/mining/:acc_num/:taskName', function (req, res) {
		var acc_num = req.params.acc_num, 
			taskName = req.params.taskName;
			
		miningCalc(taskName, acc_num, function(data) {
			if(data && data.err) {
				res.render(`<html>
					<h3>ERROR</h3>
				</html>`);
			}

			res.json(data);

		});
		
		console.log({ acc_num: acc_num, taskName: taskName });
		
		//res.redirect(HostConfig.host + '/mining')
	});
}