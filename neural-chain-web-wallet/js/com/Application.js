(function(){
	define([
		'com.Application', 
		'com.ApplicationView',
		'Connect'
	], Application);

	/**
	 * CONTROLER
	 */
	function Application () {
		var oKey = {};
		var view = this.view = new ApplicationView();
		Connect.server_url = 'http://www.giper-troniks.com:9902';
		
		var _privateKey, _password, _accNumber;

		view.setConfig({
			pageAuth: {
				auth: function(data) {
					_privateKey = data.privateKey;
					_password = data.password;
					_accNumber = acc_num(_privateKey);

					Connect.auth( _accNumber, signature(acc_num(_privateKey), _privateKey, _password), function (data) {
						console.log('response', data)
						if (data.auth != null && (data.auth.type == 'wallet' || (data.auth.metadata != null && data.auth.metadata.type == "system certificate"))) {
							console.log('success')
							view.setPage('PageProfile');
						} else {
							console.log('faild')
							view.alertError("Пароль введен не верно!!!")
						}
					});
				},
				reg: function (data) {
					Connect.reg(data.acc_num, data.publicKey, function(data2) {
						console.log('reg response', data2);
						view.alertMessage("Регистрация отправлена в блокчейн.")
					})
				},
				profile: function(fn) {
					view.showPreloader();
					Connect.balance(_accNumber, function (balanceData) {
						Connect.history(_accNumber, function (historyData) {
							if(fn) fn({
								accountNumber: _accNumber,
								balance: balanceData,
								history: historyData
							});
							view.hidePreloader();
						});
					})
				},
				send: function(data) {
					console.log('send()', data);
					view.showPreloader();
					var date_time = Date.now();
					var _pack = {
						cm: "send",
						from: _accNumber,
						to: data.to,
						sum: data.sum,
						currencyType: 'ILC',
						datatime: date_time,
					}
					_pack.sig = signature(JSON.stringify(_pack),_privateKey, data.pass)
					Connect.send(_pack, function(data) {
						view.showPreloader();
						if(data.status === 'error') {
							view.alertError("ОШИБКА:", data.message);
							
						}
						console.log('send responce', data);
					})

				}
			}

		});
		view.hidePreloader();

		window.addEventListener("beforeunload", function (e) {
		  var confirmationMessage = "\o/";
		  view.setPage('PageProfile');

		  e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
		  return confirmationMessage;              // Gecko, WebKit, Chrome <34
		});
		window.onkeydown = function (e) {
			if(e.key === 'F5') {
				view.setPage('PageProfile');
				e.preventDefault();
			}
		}
	}
})();