function Connect () {
	var __url = '/chain';
	
	var ajax = {};
	ajax.x = function () {
		if (typeof XMLHttpRequest !== 'undefined') {
			return new XMLHttpRequest();
		}
		var versions = ["MSXML2.XmlHttp.6.0", "MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp"];

		var xhr;
		for (var i = 0; i < versions.length; i++) {
			try {
				xhr = new ActiveXObject(versions[i]);
				break;
			} catch (e) {}
		}
		return xhr;
	}
	ajax.send = function (url, callback, method, data, async) {
		if (async === undefined) {
			async = true;
		}
		var x = ajax.x();
		x.open(method, url, async);
		x.onreadystatechange = function() {
			if (x.readyState == 4) {
				callback(x.responseText)
			}
		}
		;
		if (method == 'POST') {
			x.setRequestHeader('Content-type', 'application/json');
		}
		x.send(data)
	}
	ajax.get = function (url, data, callback, async) {
		var query = [];
		for (var key in data) {
			query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
		}
		ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
	}
	ajax.post = function (url, data, callback, async) {
		ajax.send(url, callback, 'POST', JSON.stringify(data), async)
	}
	function request (data, url, type, fn){
		// console.log('XHR::'+ Connect.server_url + __url + url)
		ajax[type.toLowerCase()](Connect.server_url + __url + url, data, function (r) {
			var jsonObj;
			try {
				jsonObj = JSON.parse(r);
			} catch(e) {
				jsonObj = r;
				console.log(e);
			}
			if (fn) fn(jsonObj);
		});
	}
	this.request = request;
}

(function(){
	var connect = new Connect();
	
	define(['crypto.connect.Connect'], Connect, {
		server_url: '',
		request: function (data, url, type, fn) {
			connect.request(data, url, type, fn)
		},
		// data.from
		// data.to
		getData: function(data, fn){
			var p = ""
			if(data.from) p+='/' + data.from;
			if(data.to) p+='/' + data.to;

			connect.request({}, p, 'get', fn);
		},
		getDataLength: function(fn){
			connect.request({}, 'Length', 'get', fn);
		},
		getAllChain: function(fn){
			connect.request({}, '.json', 'get', fn);
		},
		setArray: function (arr, fn) {
			console.log('Connect.setArray::',JSON.stringify({
				cm: 'save',
				arr: arr
			}));
			connect.request({
				cm: 'save',
				arr: arr
			}, '/', 'post', fn);
		},
		getRecord: function(num, fn) {
			connect.request({}, '-record/'+num+'/', 'get', fn);

		}

	});


})();