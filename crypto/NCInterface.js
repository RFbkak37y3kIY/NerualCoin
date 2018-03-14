function NCInterface () {}

NCInterface.TYPE_WALLET					= 'wallet';
NCInterface.TYPE_SEND					= 'send';
NCInterface.TYPE_CERTIFICATE_COIN		= 'certificate_coin';
NCInterface.TYPE_ORDER					= 'order';

NCInterface.TYPE_ORDER_SEND				= 'order_send';
NCInterface.TYPE_ORDER_REMOVE_RECORD	= 'order_remove_record';
NCInterface.TYPE_ORDER_BLOCK_WALLET		= 'order_block_user';
NCInterface.TYPE_ORDER_UNBLOCK_WALLET	= 'order_unblock_user';
NCInterface.TYPE_ORDER_CASH_BACK		= 'order_cash_back';
NCInterface.TYPE_ORDER_SET_OPTINS		= 'order_set_options';
NCInterface.TYPE_ORDER_DELITE_OPTINS	= 'order_delite_options';

function normalise(_interface, _data) {
	var _out = {}, d, i;
	for (var seting in _interface) {
		d = _data[seting];
		i = _interface[seting];
		if ((d != null && i != null )|| i._bounden === true) {
			if(i._const){
				_out[seting] = i._const;
			}else if (i._class != null) {
				_out[seting] = d != null? i._class(d): new i._class();
			}else if (i._or != null) {
				if(i._or.filter(a=>a == d).length != 1) {
					return null;
				}
			}else if (typeof i === 'object') {
				_out[seting] = normalize(i, d)
			}
		}
	}
	return JSON.parse(JSON.stringify(_out));
}

NCInterface.WALLET = function (obj) {
	return normalise({
		type: 		{_const: NCInterface.TYPE_WALLET, _bounden: true},
		acc_num: 	{_class: String, _bounden: true},
		pk: 		{_class: String, _bounden: true}
	}, obj);
}
NCInterface.SEND = function (obj) {
	return normalise({
		type: 		{_const: NCInterface.TYPE_SEND, _bounden: true},
		from: 		{_class: String, _bounden: true},
		to: 		{_class: String, _bounden: true},
		sum: 		{_class: Number, _bounden: true},
		datatime: 	{_class: Number, _bounden: true},
		type_coin: 	{_class: String, _bounden: true},
		comment: 	{_class: String, _bounden: false},
		sig: 		{_class: String, _bounden: true}
	}, obj);
}
NCInterface.CERTIFICATE_COIN = function (obj) {
	return normalise({
		type: {_const: NCInterface.TYPE_CERTIFICATE_COIN, _bounden: true},
		metadata: {
			owner: 			{_class: String, _bounden: false},
			systemName: 	{_class: String, _bounden: true},
			coinName: 		{_class: String, _bounden: true},
			companyUrl: 	{_class: String, _bounden: true},
			emailFeedBack: 	{_class: String, _bounden: true},
			description: 	{_class: String, _bounden: false},
			other: 	{_class: Object, _bounden: false},
		},
		sig: 		{_class: String, _bounden: true},
		acc_num: 	{_class: String, _bounden: true},
		pk: 		{_class: String, _bounden: true},
	}, obj);
}
NCInterface.ORDER = function (obj) {
	return normalise({
		type: 		{_const: NCInterface.TYPE_SEND, _bounden: true},
		acc_num:	{_class: String, _bounden: true},
		order: {
			acc_num:	{_class: String, _bounden: true},
			order_type: {_or: [
				NCInterface.TYPE_ORDER_SEND,
				NCInterface.TYPE_ORDER_REMOVE_RECORD,
				NCInterface.TYPE_ORDER_BLOCK_WALLET,
				NCInterface.TYPE_ORDER_UNBLOCK_WALLET,
				NCInterface.TYPE_ORDER_CASH_BACK,
				NCInterface.TYPE_ORDER_SET_OPTINS,
				NCInterface.TYPE_ORDER_DELITE_OPTINS
			], _bounden: true},
			target_sig: {_class: String, _bounden: true},
			datatime: 	{_class: Number, _bounden: true},
		},
		sig: 		{_class: String, _bounden: true},
	}, obj);
}

