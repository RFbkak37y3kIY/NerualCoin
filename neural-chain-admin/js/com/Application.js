(function(){
	define(['com.Application', 'com.ApplicationView',
	/*import*/ 'crypto.DataManager'
	], Application);

	/**
	 * CONTROLER
	 */
	function Application () {

		crypto.connect.Connect.server_url = "http://localhost:9901"
		
		var oKey = {};
		var view = this.view = new ApplicationView();
		var dm = new DataManager({
			onupdate: view.updateNeuralChainContent,
			onready: view.hidePreloader
		});
		
		

		/* TEST */ this.dm = dm;

		view.setConfig({
			get listCerttificates() {
				return dm.getCertificatesList();
			},
			pageNewWallet: {
				setDataToNC: function(data) {
					dm.saveObjectData(data);
				},
				reg: function (data) {
					var key = dm.generatePrivateKey({
						password: data.password
					});
					
					var pk = JSON.parse(Base64.decode(key.privateKey)).privateKey;
					var pubk = JSON.parse(Base64.decode(key.privateKey)).publicKey;
					console.log('pk', pk)
					data.viewResult({
						publicKey: pubk,
						privateKey: pk,
						account_number: pk.hash(2048*5).match(/[0-9A-F]{4}/g).map(function(a) { 
							return String.fromCharCode(parseInt(a,16));
						}).join('').hash(40)
						
					})
				},
				auth: function (data) {
					console.log('auth:', data)
					var loginData = dm.authByCertificate(data);
					loginData.balance = dm.balance(loginData.account_number)+" "+loginData.coinName;

					data.viewResult({
						'Account Number': loginData.account_number,
						'Ballance': loginData.balance
					})
				},
				stat: function (data) {

				},
				about: function (data) {

				}
			},
			pageNewSystem: {
				generateCertificate: function (data) {
					oKey = dm.generatePrivateKey(data);
					view.pageCreatedCertificate(data, oKey.certificate, oKey.privateKey);
				},
				savePrivateKey: function() {
					utils.download(oKey.privateKey, 'privatKey.key');
				},
				publishCertificateToNC: function() {
					var certificateObject = JSON.parse(Base64.decode(oKey.certificate));
					dm.saveObjectData(certificateObject)
				}
			},
			pageAuth: {
				uploadCertificate: function (e) {
					var file = e.target.files[0],
						reader = new FileReader();

					reader.onload = function(e) {
						var res = reader.result;
						var keyFile = JSON.parse(Base64.decode(res));
						console.log('keyFile.metadata: ',keyFile.metadata);
						function isAccessCert(pass) {
							if( !dm.setCertificate(res, pass) ) {
								var pass = prompt('пароль: ');
								console.log('pass: ', pass)
								if(pass == null){
									alert("Неверный пароль");
									return;
								}
								isAccessCert(pass);
							} else {
								view.updateOpenContent(keyFile);
							}
						}
						isAccessCert();
					}
					if(file) reader.readAsText(file, 'utf8');
					console.log('uploadCertificate clicked')
				}
			}

		});
	}
})();