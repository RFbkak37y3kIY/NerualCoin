// for NODE.JS

function hesh(str, len) {
	len = len || 16;
	str = str || "";
	var m = Math, abs = m.abs, tan = m.tan, max = m.max, ar = str? str.split('').map(function (a) {
			return a.charCodeAt(0)
		}): [], a8 = new Uint8Array(len), a = [(function () {
			var l = ar.length, z = 0, i = max(len, l - 1);
			for (; i >= 0; i--) {
				z += ar[i % l] + a8[(i+1) % len] || 1.3216549;
				a8[i % len] += abs(tan(i + z * i)) * 1000000;
			}
			return Array.from(a8).map(function(a){
				return('0'+a.toString(16)).slice(-2)
			}).join('')
		})(),(function() {
			len *= 2;
			var s2alength = ar.length || 1, i = ar.length ? ar.reduce(function(p, c) {
				return p + c
			}) : 1, s = "", A, B, k = 0;
			while (s.length < len) {
				A = ar[k++ % s2alength] || 0.5;
				B = ar[k++ % s2alength ^ len] || 1.5 ^ len;
				i = i + (A ^ B) % len;
				s += tan(i * B / A).toString(16).split('.')[1].slice(0, 10);
			}
			return s.slice(-len);
		})()];

	return Array.from(Uint8Array.from(a[0].match(/.{2}/g).map(function(v,k) {
		return parseInt(v,16) ^ parseInt(a[1].match(/.{2}/g)[k],16)
	} ))).map(function(v){
		return ('0'+v.toString(16)).slice(-2)
	}).join('');
}

function owf(a,b){ /* one-way function */
	function toarr(s){
		if(s.length<2) return [parseInt(s, 16)];
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
function grb(len){ /* generate rundom bytes */
	var r = Math.random;

	return Array.from(Uint8Array.from({
		length: len || 32
	}, function () {
		return r() * 0xffff;
	})).map(function (a) {
		return ('0'+a.toString(16)).slice(-2);
	}).join('');
}
function signature(objMessage, privateKey, pass, bolBackWithObject) {
	var protecttor, message;

	if(typeof objMessage != 'string') {
		message = JSON.stringify(objMessage);
	} else {
		message = objMessage;
	}
	
	if ( pass ) {
		protecttor = owf(privateKey, hesh(pass, privateKey.length))
	} else {
		protecttor = privateKey;
	}

	/*TEST SIGNATURE on correction */
	var _signature = owf(hesh(message, privateKey.length), protecttor);
	if(!bolBackWithObject){
		return _signature;
	}

	if(typeof objMessage == 'string') {
		objMessage = {
			message: objMessage,
		}
	}
	
	objMessage.sig = _signature;
	
	return objMessage;
}
function generateKeys(password, $Length) {
	$Length = $Length || 128;
	var g = grb($Length / 2),
		privateK = grb($Length / 2);

	return {
		privateKey: {
			k: privateK
		},
		publicKey: {
			g: g,
			k: owf(g, password? owf(privateK, hesh(password, $Length)): privateK)
		}
	}
}

exports.signature = signature;
exports.generateKeys = generateKeys;
exports.hesh = hesh;