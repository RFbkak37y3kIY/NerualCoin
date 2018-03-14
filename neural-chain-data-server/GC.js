function gcChain(nn) {
	var _length = nn.indexs.length;
	var _nn = new NNData()
	var record, out = [];
	for (var i = 0; i < _length; i++) {
		record = nn.readIndex(i).join('');
		try {
			record = JSON.parse(record);
			if(typeof record != 'number') {
				_nn.saveObject(record);
			}
		} catch(e) {
			// statements
			//console.log('err index:', nn.indexs[i]);
		}
	}
	return _nn;
}
