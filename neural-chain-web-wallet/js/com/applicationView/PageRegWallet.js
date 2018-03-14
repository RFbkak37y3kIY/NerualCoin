define(['com.applicationView.PageRegWallet',
	'com.applicationView.DOMcomponents'
], function () {
	var self = this,
		dom = new gtpack.DOM(),
		d = new com.applicationView.DOMcomponents();
	var _objAcc = {};

	var out = dom.div([
		d.h2('регистрация кошелька'),
		d.label('Введите пароль ключа'),
		pass = d.password(), 
		_container = dom.div([
			d.hr(),
			d.label('Приватный ключ:'),
			pkQR  = d.div(''),
			pk = d.div(' ').addClass('code-container'), 
			dom.div('Сохраните Ваш приватный ключ, и никому его не давайте, так как это единственный доступ к вашему счету. Ключ восстановлению не подлежит', null, {
				style: 'color: #900;'
			}),
			d.hr(),
			d.label('номер счета аккаунта:'),
			accQR  = d.div(''),
			acc  = d.div(' ').addClass('code-container'),
			d.hr(),
			d.button('Сохранить запись регистрации в БЛОКЧЕЙН', function(e){
				console.log('>>>',_objAcc);
				if(self.events.pageAuth.reg){
					self.events.pageAuth.reg({
						publicKey: _objAcc.publicKey.g + _objAcc.publicKey.k,
						acc_num: acc_num(_objAcc.privateKey.k)
					})

				}
			}),
			d.button('Распечатать', e => window.print())
		], null, {style: 'display: none'}),
		d.hr(),
		d.button('<< назад', e => self.setPage())
	]);
	
	var qrcodePK = new QRCode(pkQR, { width : 200, height : 200 });
	var qrcodeACC = new QRCode(accQR, { width : 200, height : 200 });

	pass.onkeyup = function (e) {
		_container.style.display = '';
		_objAcc = generateKeys(pass.text());
		_objAcc.pass = pass.text();
		pk.innerHTML = _objAcc.privateKey.k;
		qrcodePK.makeCode(_objAcc.privateKey.k);

		acc.innerHTML = acc_num(_objAcc.privateKey.k);
		qrcodeACC.makeCode(acc_num(_objAcc.privateKey.k));
	}

	return out;
});