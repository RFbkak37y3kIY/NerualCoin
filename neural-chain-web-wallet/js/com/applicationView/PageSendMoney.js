define(['com.applicationView.PageSendMoney',
	'com.applicationView.DOMcomponents'
], function(){
	var self = this,
		dom = new gtpack.DOM(),
		d = new com.applicationView.DOMcomponents();
		
	var out =  dom.div([
		d.h2('Отправить средства'),
		d.label('Введите номер счета получателя'),
		_to = d.input(), 
		
		d.label('Введите сумму'),
		_sum = d.input(), 
		
		d.label('Введите пароль ключа'),
		_pass = d.password(), 
		
		d.button('Отправить', function(e){
			if(self.events.pageAuth.send) self.events.pageAuth.send({
				to: _to.text(),
				sum: _sum.text(),
				pass: _pass.text(),
			});
			self.setPage('PageProfile');

		}),
		d.hr(),
		d.button('<< отмена', e => self.setPage('PageProfile'))


	]);
	return out;
});