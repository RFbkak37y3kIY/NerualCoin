define([
	'crypto.DataManager',
	/*import*/ 'crypto.Certificate',
	/*import*/ 'crypto.Signature',
	/*import*/ 'crypto.NNData',
	/*import*/ 'crypto.connect.Connect'

], DataManager);

function DataManager ( config ) {
	var self = this,
		cert = new crypto.Certificate(),
		nnData = new crypto.NNData(),
		_ceshArr = [],
		ping_delay = config.ping_delay || 5000;

	/* TEST */ this.nn = nnData;

	// Event fired when incoming a new data from a server
	this.onupdate = config? config.onupdate || null: null;
	this.onready = config? config.onready || null: null;
	
	// Flag - to do ping or are not to do ping ;)
	this.isPing = config && config.ping != null ? config.ping : true;

	crypto.connect.Connect.getAllChain(function(data){
		nnData.setData(Array.from(data));
		initDataManager();
		if(self.isPing) {
			setTimeout(update, ping_delay);
		}
	})
	this.ping = function() {
		update();
	}
	this.getAccNumFromPrivatKey = function(privateKey){
		return privateKey
			.hash(2048*5)
			.match(/[0-9A-F]{4}/g)
			.map(a => String.fromCharCode(parseInt(a,16)))
			.join('')
			.hash(40);
	}
	function testSignature(message, signature, publicKey) {
		function calcAB(a,b){
			function toarr(s){
				return s.match(/.{2}/g).map(function(am){
					return parseInt(am, 16);
				});
			}
			var out=[], aArr = toarr(a), bArr = toarr(b), leng = Math.min(aArr.length,bArr.length);
			for(var i=0; i<leng; i++) {
				out.push(('0'+((aArr[i] * bArr[i]) % 0xFF).toString(16)).slice(-2))
			}
			return out.join("");
		}
		return calcAB(signature, publicKey.g) === calcAB(crypto.Signature.hesh(message, publicKey.k.length), publicKey.k);
	}
	function _getPubKeyByAccNum (accNum, isData){
		var _searchResult = nnData.search(accNum).map(a=>{
			try {
				a[1] = JSON.parse(a[1]);
			} catch(e) {
				console.log(a[1], e);
				throw 'error';
			}
			a[0] = nnData.indexs[a[0]];
			return a;
		});

		if(_searchResult.length == 0) {
			return null;
		}
		if(isData) {
			return _searchResult[0][1];
		}
		return _searchResult[0][1].publicKey;
	}
	this.setSignature = function(messageObject, privateKey, password, bolBackWithObject) {
		var accNum = this.getAccNumFromPrivatKey(privateKey);
		var publicKey = _getPubKeyByAccNum(accNum),
			sig = new crypto.Signature(),
			r = publicKey.match(new RegExp(".{" + (publicKey.length / 2) + "}", 'g'));

		sig.setPrivateKey({k: privateKey});
		sig.setPublicKey({g: r[0], k: r[1]});
		if(!bolBackWithObject){
			return sig.setSignature(JSON.stringify(messageObject), password);
		}
		messageObject.sig = sig.setSignature(JSON.stringify(messageObject), password);
		return messageObject;
	}
	this.authBySig = function (acc_num, signature) {
		var acc_Data = _getPubKeyByAccNum(acc_num, true)
		var pk = acc_Data.publicKey;
		
		if(!pk) return null;
	
		var r = pk.match(new RegExp(".{" + (pk.length / 2) + "}", 'g'));
		var publicKey = {g: r[0], k: r[1]};
		
		console.log('authBySig::publicKey', JSON.stringify(publicKey));

		if (testSignature(acc_num, signature, publicKey)){
			return acc_Data;
		}
		return null;
	}
	this.authByCertificate = function(data, fn) {
		if(!data.privateKey) { throw 'error data.privateKey' }
		if(!data.password) { throw 'error data.privateKey' }

		var accNum = this.getAccNumFromPrivatKey(data.privateKey);
		var pk = _getPubKeyByAccNum(accNum);
		if(!pk) {
			return {
				status: 'error',
				message: 'данный номер счета отсутствует в блокчейне'
			}
		}
		var meta = {
			publicKey: pk,
			privateKey: data.privateKey
		};
		var certAuth = new Certificate();
		var protection = certAuth.setPrivatKey(Base64.encode(JSON.stringify(meta)), data.password);
		
		if(protection){
			var _out = _searchResult[0][1];
			return _searchResult[0][1]
		}
		return {
			status: 'error',
			message: 'неверный пароль'
		};
	}
	this.generatePrivateKey = function(data) {
		var pass = null;
		if(data.password){
			pass = data.password;
			delete data.password;
		}
		return cert.generateCertificate(data, pass);
	}
	this.getDecodedArray = function () {
		var arr = [], item;
		for (var i = nnData.indexs.length - 1; i >= 0; i--) {
			try {
				item = JSON.parse(nnData.read(nnData.indexs[i]).join(''))
			} catch(e) {
				item = nnData.read(nnData.indexs[i]).join('')
			}
			arr.push(item)
		}
		return arr;
	}
	this.testSigByID = testSigByID;
	function testSigByID (id) {
		var record = JSON.parse(nnData.read(id).join(''))
		return testSig(record);
	}
	this.testSig = testSig;
	function testSig(record) {
		//var record = JSON.parse(nnData.read(id).join(''))
		
		if (record.metadata && record.metadata.type === 'system certificate') {

			try {
				var pk = record.publicKey,
					sig = record.signature,
					message = JSON.stringify(record.metadata),
					r = pk.match(new RegExp(".{" + (pk.length / 2) + "}", 'g')),
					publicKey = {g: r[0], k: r[1]};

				console.log('test secure a sertificate')

				return testSignature(message, sig, publicKey)
			} catch(e) {
				console.log('e::',e)
				return false;
			}
		}
		
		var sig = record.sig || record.signature;
		
		console.log('testSigByID::sig = ', sig)
		
		if(!sig) return false;

		/* test */ var acc_num = record.from || 
			record.account_number ||
			record.acc_num ||
			(!!record.metadata ? record.metadata.walletAccountNumber : 0);

		console.log('testSigByID::acc_num = ', acc_num)
			
		var pk = _getPubKeyByAccNum(acc_num);
		
		console.log('testSigByID::pk = ', pk)
		
		if (!pk) return false;
		
		var r = pk.match(new RegExp(".{" + (pk.length / 2) + "}", 'g'));
		var publicKey = {g: r[0], k: r[1]};
		delete record.sig;
		return testSignature(JSON.stringify(record), sig, publicKey);
	}


	this.sendFromApi = function (acc_num, _to, _sum, signature){
		// if(self.authBySig(acc_num + _to + _sum, signature))
		app.dm.saveObjectData({
			type: 'send',
			from: acc_num,
			to: _to,
			sum: _sum,
			datatime: Date.now(),
			sig: signature
		});
	}
	this.send = function (_to, _sum, privateKey, password){
		app.dm.saveObjectData(app.dm.setSignature({
			type: 'send',
			from: self.getAccNumFromPrivatKey(privateKey),
			to: _to,
			sum: _sum,
			datatime: Date.now()
		}, privateKey, password, true));
	}
	this.regByApi = function(acc_num, publicKey) {
		if(!_getPubKeyByAccNum(acc_num)) {
			self.saveObjectData({
				type: "wallet",
				publicKey: publicKey,
				account_number: acc_num
			})
			return { status: 'ok' };
		}
		return {
			acc_num: acc_num,
			status: 'error',
			message: 'this account number alredy exist.'
		}
	}
	this.balance = function ( id ) {
		var arr = nnData.search(["send", id]).map(a=>JSON.parse(a[1]))
		if(arr.length > 0){
			try {
				return arr.map(a=>a.to == id? a.sum*1: -a.sum*1).reduce((a,b)=>a+b);
			} catch(e) {
				return 0;
			}
		}
		return 0;
	}
	this.history = function ( id ) {
		var arr = nnData.search(["send", id]).map(a=>JSON.parse(a[1]))
		if(arr.length > 0){
			try {
				return arr.map(a=>{
					a.sum = a.to == id? a.sum: -a.sum;
					return a;
				})
			} catch(e) {
				return arr;
			}
		}
		return arr;
	}
	this.getCertificatesList = function() {
		return nnData.search("system certificate").map(a=>{
			a[1] = JSON.parse(a[1]);
			a[0] = nnData.indexs[a[0]];
			return a; 
		})
	}
	this.setCertificate = function (privateKey, pass) {
		return cert.setCertificate(privateKey, pass)
	}
	this.saveObjectData = function(obj) {
		if(typeof obj === 'object') {
			_ceshArr.push(obj);
			function saveObject3(obj) {
				var strJson = JSON.stringify(obj),
					arr = strJson.match(/([^{}\[\:\]," ]+)|([{}\[\:\]," ]+)/g);

				//nnData.indexs.push(nnData.save(arr));
				nnData.indexs.push(nnData.save(arr));
				return nnData.indexs.slice(-1)
			}
			nnData.saveObject(obj);
			//saveObject3(obj);
			var arrToServer = nnData.db.slice(nnData.indexs[nnData.indexs.length -2] +2);
			crypto.connect.Connect.setArray(arrToServer, function(data){
				console.log("save Data to server::", data);
				initDataManager()
			})
			return true;
		}
		return false;
	}
	this.getCeshArray = function () {
		return _ceshArr;
	}
	function update(intervalPing) {
		crypto.connect.Connect.getDataLength(function(data){
			if (data && data.length > nnData.db.length){
				crypto.connect.Connect.getData({
					from: nnData.db.length
				}, function(data){
					nnData.setData(Array.from(nnData.db.concat(data)));
					initDataManager()
				})
			}
		})
		if (intervalPing === false) return;
		setTimeout(update, intervalPing || 5000)
	}

	function initDataManager() {
		console.log('dm::initDataManager')
		_ceshArr = self.getDecodedArray();
		if(self.onupdate) self.onupdate(_ceshArr.slice(0, 10));
		if(self.onready) {
			self.onready(); 
			self.onready = null;
		}
		
	}
	
}