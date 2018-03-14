define(['crypto.Certificate',
	/*import*/ 'crypto.Signature',
	/*import*/ 'crypto.Base64',
], Certificate);

function Certificate () {
	var sig = new crypto.Signature();
	this.certificate = null;
	this.generateCertificate = function (objMetaData, pass, lengthKey) {
		var oKey = sig.generateKeys(pass, lengthKey);
		
		objMetaData = objMetaData || {};
		objMetaData.walletAccountNumber = oKey.privateKey.k.hash(2048*5).match(/[0-9A-F]{4}/g).map(function(a) { 
			return String.fromCharCode(parseInt(a,16));
		}).join('').hash(40);
		
		var meta = {
				metadata: objMetaData,
				signature: sig.setSignature(JSON.stringify(objMetaData), pass),
				publicKey: oKey.publicKey.g + oKey.publicKey.k,
			},
			_json = {
				certificate: Base64.encode(JSON.stringify(meta))
			};


		meta.privateKey = oKey.privateKey.k;
		_json.privateKey = Base64.encode(JSON.stringify(meta));
		
		console.log('meta', meta);
		console.log('outData', _json);

		return _json;
	}
	this.setPrivatKey = function(privateKey, pass) {
		var oPK = JSON.parse(Base64.decode(privateKey)),
			r = oPK.publicKey.match(new RegExp(".{" + (oPK.publicKey.length / 2) + "}", 'g'));
		
		console.log('oPK', oPK)
		console.log('r', r)
		this.certificate = oPK.metadata		
		sig.setPrivateKey({k: oPK.privateKey});
		sig.setPublicKey({g: r[0], k: r[1]});
		var isCorrectPassword = !!sig.setSignature(r[0] + r[1], pass);
		if (!isCorrectPassword) {
			console.warn('ERROR: incorrect password on certificate');
			return false;
		}
		return true;
	}
	this.setCertificate = function(privateKey, pass) {
		var oPK = JSON.parse(Base64.decode(privateKey)),
			r = oPK.publicKey.match(new RegExp(".{" + (oPK.publicKey.length / 2) + "}", 'g'));
		
		console.log('oPK', oPK)
		console.log('r', r)
		this.certificate = oPK.metadata		
		sig.setPrivateKey({k: oPK.privateKey});
		sig.setPublicKey({g: r[0], k: r[1]});
		var isCorrectPassword = !!sig.setSignature(r[0] + r[1], pass);
		if (!isCorrectPassword) {
			console.warn('ERROR: incorrect password on certificate');
			return false;
		}
		var isCorrectMetadata = sig.testSignature(JSON.stringify(oPK.metadata), oPK.signature, {g: r[0], k: r[1]})
		if (!isCorrectMetadata) {
			console.warn('ERROR: metadata is broken');
			return false;
		}
		return true;
	}

}