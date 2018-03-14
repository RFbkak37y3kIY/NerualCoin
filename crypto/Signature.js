/**
 * Class Signature
 * version 1.0.0
 * auther: Eduard Klimenko <edik.klimenko@gmail.com>
 */

define(['crypto.Signature', 'crypto.Base64'], Signature);

function hesh(str, len) {
	len = len || 16;
	str = str || "";
	var m = Math,
		abs = m.abs,
		tan = m.tan,
		max = m.max,
		ar = str? str.split('').map(function(a){
			return a.charCodeAt(0)
		}): [],
		a8 = new Uint8Array(len),
		a = [(function () {
			var l = ar.length,
				z = 0,
				i = max(len, l - 1);
				
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

function Signature ( config ) {

	var privateKey = {
			k: ''		
		},
		publicKey = {
			g: '',
			k: ''
		};
	if(!crypto.Base64) gtpack.import('crypto.Base64', function(){});
	// config.password
	// config.length

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
	function generateKeys(password, $Length) {
		$Length = $Length || 128;
		function grb(len){ /* rundom bytes generator */
			var r = Math.random;
			return Array.from(Uint8Array.from({
				length: len || 32
			}, function () {
				return r() * 0xffff;
			})).map(function (a) {
				return ('0'+a.toString(16)).slice(-2);
			}).join('');
		}

		var g = grb($Length / 2),
			privateK = grb($Length / 2),
			publicK = calcAB(g, password? calcAB(privateK, hesh(password, $Length)): privateK);

		privateKey = {
			k: privateK
		};
		publicKey = {
			g: g,
			k: publicK
		}
		return {
			privateKey: privateKey,
			publicKey: publicKey
		}
	}
	this.setPublicKey = function (pk) {
		if(!pk || !pk.g) return false;
		if(!pk || !pk.k) return false;
		publicKey = pk
		return true;
	}
	this.setPrivateKey = function (pk) {
		if(!pk || !pk.k) return false;
		privateKey = pk
		return true;
	}
	function setSignature(message, pass) {
		var protecttor;
		if ( pass ) {
			protecttor = calcAB(privateKey.k, hesh(pass, privateKey.k.length))
		} else {
			protecttor = privateKey.k;
		}
		/*TEST SIGNATURE on correction */
		var _signature = calcAB(hesh(message, privateKey.k.length), protecttor);
		if (testSignature(message, _signature, publicKey)) {
			return _signature;
		}
		return null;
	}
	function testSignature(message, signature, publicKey) {
		return calcAB(signature, publicKey.g) === calcAB(hesh(message, publicKey.k.length), publicKey.k);
	}
	this.setPrivatKeyBase64 = function ( strBase64 ) {
		var _decodedString = crypto.Base64.decode(strBase64);
		try {
			privateKey = JSON.parse(_decodedString);
		} catch(e) {
			console.log(e);
			return false;
		}
		return true;
	}
	this.setPrivateKeyString = function (str) {
		privateKey = { k: str }
	}
	this.testSignature = testSignature;
	this.setSignature = setSignature;
	this.generateKeys = generateKeys;
}
Signature.hesh = hesh;