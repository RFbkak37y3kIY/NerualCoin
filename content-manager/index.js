var fs = require('fs');
var path = require('path');

function www (req, res){
	var origin = (req.get('origin') || req.get('host')) + '';
	origin = origin.split(':')[0];
	
	var sub_path = ''
	var file_web = req.params.file || 'index.html';
	
	if(!file_web.split('.')[1]){
		sub_path += file_web + '/';
		file_web = 'index.html'
	}
	file_web = file_web.split('//').join('/');
	for(var i=1; !!req.params['p'+i] ;i++){
		sub_path += req.params['p'+i] + '/';
	}
	
	var _filename = path.normalize(__dirname + '/../' + sub_path + file_web);
	fs.exists(_filename, function(exists) {
		if(!exists) {
			_filename = path.normalize(__dirname + '/../'+ origin +'/' + file_web);
			fs.exists(_filename, function(exists) {
				if(!exists){
					_filename = path.normalize(__dirname + '/../' + 'crypto/' + file_web);
					fs.exists(_filename, function(exists) {
						if(!exists){
							res.status(500).json({error:true})
							//.sendFile(__dirname + '/../_404_/index.html');
							var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
							console.log("("+ip+") - "+(new Date()).toISOString()+" - ["+origin+"]", '/../'+ origin +'/'+ sub_path + file_web);

						}else{
							res.sendFile(_filename);
						}
					})
				}else{
					res.sendFile(_filename);
				}
			});
		}else{
			res.sendFile(_filename);
		}
	});
}
exports.init = function (app) {
	app.get('/:file', www);
	app.get('/', www);

	var str = '';
	for(var i=1;i<25;i++) {
		str += '/:p'+i;
		app.get(str+ '/:file', www);
	}
}
