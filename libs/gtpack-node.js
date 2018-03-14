var path = require('path');

var app = {}, mainClass = null;

global.define = function(arr, fn, oStaticMethods) {
	var sClass = arr.shift();
	function each( obj, callback ) {
		var length, i = 0;
		if ( obj instanceof Array) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}
		return obj;
	}
	function buildPackage(obj, aPackage) {
		var ss = aPackage.shift();
		if (aPackage.length == 0) {
			obj[ss] = fn;
			each(oStaticMethods, function(staticMethodName, staticMethodValue) {
				obj[ss][staticMethodName] = staticMethodValue;
			});
			return;
		} else {
			if (obj[ss] == undefined)
				obj[ss] = {};
			buildPackage(obj[ss], aPackage);
		}
	};
	var cClass = cClass || function() {};
	var oStaticMethods = oStaticMethods || {};
		
	buildPackage(global, sClass.split('.'));

	/* load import files */
	while (arr.length) {
		require(path.normalize(__dirname + '/../' + arr.shift().split('.').join('/')+'.js'))
	}
	
	(function (sClassName) {
		if (sClassName == mainClass) {
			function stringToFunction(str) {
				var arr = str.split('.');
				var fn = (global || this);
				for (var i = 0, len = arr.length; i < len; i++) {
					fn = fn[arr[i]];
				}
				if (typeof fn !== 'function') {
					throw new Error('function not found');
				}
				return fn;
			};

			var cMainController = stringToFunction(sClassName);
			app = new cMainController();
			
		}
	})(sClass);
}
Object.more = function(o){
	Object.defineProperty(o, 'getset', {
		enumerable: false,
		configurable: true,
		get: function() {
			return function(PropName, fget, fset) {
				Object.defineProperty(this, PropName, {
					set: fset,
					get: fget
				});
				return this;
			}
		},
		set: function(a) {
			throw 'error'
		}
	});

	Object.defineProperty(o, 'Json', {
		enumerable: false,
		configurable: true,
		get: function() {
			return function() {
				return JSON.stringify(this);
			};
		}
	});
	Object.defineProperty(o, "prop", {
		enumerable: false,
		configurable: true,
		get: function() {
			return this
		},
		set: function(a) {
			for (var b in a){
				if(a[b] != this[b]){
					this[b] = a[b];
				}
			}
		}
	});
	return o;
};

module.exports = {
	run: function(cl){
		var c = './'+cl.split('.').join('/')+'.js';
		mainClass = cl;
		require(c)
	}
}
