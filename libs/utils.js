var utils = {
	statArr: function (arr) {
		var out = [], n, filterBuffer = [];
		for (var i = arr.length - 1; i >= 0; i--) {
			n = arr[i];
			if (filterBuffer.indexOf(n) !== -1) {
				continue;
			}
			filterBuffer.push(n);
			out.push({
				length: arr.filter(a=>a===n).length,
				value: n
			})
		}
		return out;
	},
	// using: nxetCPUProcess([data], [function for worker], [callback function(data) { ... }: data is results object])
	// example: nxetCPUProcess([1,2,3,4,5], p => p.map(a=>a*2), data => console.log("root side:: onmessage::", data))
	nxetCPUProcess: function(data, fn, cbfn) {
		var code = fn.toString();
		//code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));

		code = "self.onmessage = function(e) { \nconsole.log(\"worker Side::self.onmessage::\", e.data); \nvar f = " + code + ";\nself.postMessage(f(e.data));\nself.close();\n}";

		var blob = new Blob([code], {type: 'application/javascript'});
		worker = new Worker(URL.createObjectURL(blob));
		worker.postMessage(data)
		worker.onmessage = function(e){
			if(cbfn) cbfn(e.data);
		};
	},
	download: function (data, filename, type) {
		var file = new Blob([data], {type: type || 'application/octet-stream'});
		if (window.navigator.msSaveOrOpenBlob) // IE10+
			window.navigator.msSaveOrOpenBlob(file, filename);
		else { // Others
			var a = document.createElement("a"),
				url = URL.createObjectURL(file);
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			setTimeout(function() {
				document.body.removeChild(a);
				window.URL.revokeObjectURL(url);
			}, 0);
		}
	}
}

//if(define) define(['utils'], utils);