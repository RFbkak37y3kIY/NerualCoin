define(['com.applicationView.PageHome',
	'com.applicationView.DOMcomponents'
], function(){
	var self = this,
		dom = new gtpack.DOM(),
		d = new com.applicationView.DOMcomponents();
	var pk, pass;
		
	var out =  dom.div([
		d.h2('Авторизация'),
		d.label('Введите приватный ключ'),
		pk = d.password(), 
		d.label('Введите пароль ключа'),
		pass = d.password(), 
		d.button('Авторизоваться', function(e){
			console.log('Авторизоваться', pk.text(), pass.text())
			if(self.events.pageAuth.auth) self.events.pageAuth.auth({
				privateKey: pk.text(),
				password: pass.text()
			})
		}),
		d.hr(),
		d.button('Регистрация', e => self.setPage('PageRegWallet'))


	]);
	pk.style.width = '-webkit-fill-available';
	return out;
});