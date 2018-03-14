'use restrict';

define(['crypto.NNData'], NNData);

function NNData (data) {
	var CESHING = true, ceshBuffer = {};
	var self = this,
		db = this.db = data || [],
		indexs = this.indexs = [];
	
	this.save 		= save;
	this.read 		= read;
	this.readIndex 	= readIndex;
	this.search 	= search;
	//this.searchFirstOne 	= searchFirstOne;
	this.lastRecord = lastRecord;
	this.addLinks 	= addLinks;
	this.saveObject = saveObject;
	this.getIndexes = getIndexes;

	this.setData = function (data) {
		db = this.db = data;
		indexs = this.indexs = getIndexes();
	}
	function getIndexes() {
		var outArr = [],
			l = db.length,
			from = (indexs.slice(-1)[0] || 0)+2,
			arLength = 0;

		for (var i=0; i<l; i++,i++ ) {
			if( db.indexOf(i,i) == -1) {
				outArr[arLength++] = i;
			}
	    }
		return outArr;
	}

	this._getBuffer = function(){
		return ceshBuffer;
	}
	function saveObject(obj) {
		var strJson = JSON.stringify(obj),
			arr = strJson.match(/([^{}\[\:\],"\t\n\-\+ \\\/\.';\(\)_\=\<\>\*\%\&\?]+)|([{}\[\:\],"\t\n\-\+ \\\/\.';\(\)_\=\<\>\*\%\&\?]{1})/g),
			out = [];

		for(var i = 0, length1 = arr.length; i < length1; i++){
			out.push(save(arr[i]+'', true));
		}
		indexs.push(addLinks(out));
		
		return indexs.slice(-1)
	}
	function search (str, max_length) {
		var out = [], item = null;
		var cout = max_length - 1 || Number.MAX_VALUE;
		var bol = true;
		for (var i = 0; i< indexs.length; i++) {
			item = readIndex(i).join('');
			if (str instanceof Array) {
				bol = true;
				for (var j = 0; j < str.length; j++) {
					bol = bol && item.indexOf(str[j]) != -1
				}
				if(bol) {
					out.push([i, item]);
					if(cout-- == 0) {
						return out;
					}
				}
			} else if(item.indexOf(str) != -1) {
				out.push([i, item])
				if(cout-- == 0) {
					return out;
				}
			}
	    }

		return out;
	}
	function addLinks(arr) {
		if(arr.length == 1){
			return arr[0];
		}else{
			var outArr = [];
			for (var i = 0; i < arr.length; i+=2) {
				if(arr[i+1] != null) {
					outArr.push(addLink(arr[i], arr[i+1]))
				} else {
					outArr.push(arr[i]);
				}
			}
			return addLinks(outArr);
		}
	}
	function addLink(a,b){
		function indexOf(a, b){
			var i = (a != -1)? Math.max(a, b): 0, n = db.length;
			for ( ; i < n; i++,i++){
				if (a === db[i] && b === db[i + 1]) {
					return i;
				}
			}
			return -1;
		}
		var n = indexOf(a, b);
		if (n === -1) {
			db.push(a, b);
			return db.length - 2;
		} 
		return n;
	}
	function save(str, isNegative){
		if( CESHING ) {
			if(!!ceshBuffer[str]) return ceshBuffer[str];
		}
		function addData(arr){
			var outArr = [], item;
			for(var i=0;i<arr.length;i++){
				item  = db.indexOf(arr[i], arr[i])
				if(item != -1){
					outArr.push(item - 1);
				}else{
					db.push(-1, arr[i]);
					outArr.push(db.length - 2);
				}
			}
			return outArr;
		}
		
		var arrData = typeof str === 'string'? (str).split(''): str;
			ind = addLinks( addData( arrData ) );
		if(indexs.indexOf(ind) == -1 && !isNegative){
			indexs.push( ind );
		}
		if( CESHING ) {
			ceshBuffer[str] = ind;
		}
		return ind;
	}
	function readIndex(index) {
		return read(indexs[index]);
	}
	function read(n, limit){
		if(n%2) return -3;
		if(typeof n != 'number' || n < 0 || n >= db.length) return -3;
		limit = limit || 10000
		var t = [n], out = [], v;
		while (!(!t.length) || !(limit--) ) {
			if(t[0] != -1){
				v = t.shift();
				t.unshift(db[v],db[v+1]);
			}else{
				t.shift()
				out.push(t.shift())
			}
		}
		return out;
	}

	// added functions
	// very fast performance
	function lastRecord() {
		return read(db.length-2);
	}
};