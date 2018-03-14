var fs = require('fs');
var _fileName = '/chain-data/nChain.json';
var nnData = require('.' + _fileName);
var ncFilePuth = __dirname + _fileName;

exports.init = function (app) {
	app.get('/chainLength', ChainLength);
	app.get('/chain.json', raedChainFile);
	app.get('/chain/:from/:to', raedChain);
	app.get('/chain/:from', raedChain);
	app.get('/chain/', raedChain);
	app.get('/chain-record/:num', record);
	app.post('/chain/', postNC);

	//openFileChain();
}
function record (req, res) {
	var item = readData(req.params.num * 1)
	try {
		res.json(JSON.parse(item));
	}catch (e) {
		res.json({record: item});
	}
}
function postNC (req, res) {
	var _json = req.body, status = "", lengthItems = 0;
	switch (_json.cm) {
		case "save":
			addData(_json.arr);
			status = "saved";
			lengthItems = _json.arr.length
			res.json({command: 'save', status: status, "added-length": lengthItems});
			return;

		default:
			res.json({message: 'unknow command', status: 'error'});
			return;
	}
}
function ChainLength (req, res) {
	res.json({length: nnData.length});
}
function raedChainFile (req, res) {
	console.log("res.sendFile('/nChain.json')");
	res.sendFile(ncFilePuth);
	return;
}
function raedChain (req, res) {
	var _data = read(req.params.from, req.params.to);
	res.json(_data);
}
function addData (arr, isIndex) {
	console.log('addData:' + JSON.stringify(arr));
	nnData = nnData.concat(arr)
	saveFileChain(isIndex);
}
function readData (n) {
	var db = nnData;
	if(typeof n != 'number' || n < 0 || n >= db.length) return -3;
	var t = [n], out = [], v;
	while (t.length){
		if(t[0] != -1){
			v = t.shift();
			t.unshift(db[v],db[v+1]);
		}else{
			t.shift()
			out.push(t.shift())
		}
	}
	return out.join('');
}
function read (_from, _to) {
	if(!_from) {
		return nnData
	}
	if(!_to) {
		return nnData.slice(_from)
	}
	return nnData.slice(_from, _to)
}
function saveFileChain (isIndex) {
	fs.writeFile(isIndex? ncIndexFilePuth: ncFilePuth, 
		JSON.stringify(isIndex? nnDataIndex: nnData), 'utf8', function(err) {
		if(err) {
			return console.log(err);
		}
		console.log("The file was saved!", (isIndex? ncIndexFilePuth: ncFilePuth));
	}); 
}