(function(dom){
	define(['com.applicationView.PageNewSystem'], function(){
		var self = this, 
			buttons = {},
			a,b,c,d,e,f,g,h,i,j;
		
		var page = dom.div([
			dom.div([dom.text('Регистрация / Новая система')], 'h2'),
			dom.div(null, 'hr'),
			dom.div([dom.text('Данные системы')], 'h3'),
			dom.div([
				dom.div("Владелец: ", 'label', {style: 'display: block'}), 
				a = _input('Фамилия'),
				b = _input('Имя'),
				c = _input('Отчество'),
				_hr(),
				dom.div("О системе: ", 'label', {style: 'display: block'}), 
				d = _input('Название системы'),
				e = _input('Название монеты'),
				f = _input('URL адресс компании'),
				g = _input('email обратной связи'),
				h = _input('номер сертификата'),
				_hr(),
				dom.div("Пароль для закрытого ключа: ", 'label', {style: 'display: block'}), 
				i = _password('пароль'),
				_hr(),
				dom.div("Дополнительные данные: ", 'label', {style: 'display: block'}), 
				j = _input('Описание'),

			]).addClass('form'),
			
			buttons.btnBack = dom.button('<< отмена'),
			buttons.btnCreate = dom.button('Генерировать сертификат'),


		]);

		buttons.btnCreate.onclick = function () {
			if ( self.events.pageNewSystem.generateCertificate ) {
				var data = {
					type: 'system certificate',
					owner: {
						firstName: a.text(),
						seccondName: b.text(),
						lastName: c.text()
					},
					systemName: d.text(),
					coinName: e.text(),
					systemUrl: f.text(),
					emailFeedBack: g.text(),
					numberCertificate: h.text(),
					password: i.text(),
					description: j.text()
				}
				self.events.pageNewSystem.generateCertificate(data);
			}
		}
		buttons.btnBack.onclick = function(){
			self.setPage('PageHome');
		}
		return page;
	});

	function _input(placeholder) {
		return dom.input().attr('placeholder', placeholder)
	}
	function _password(placeholder) {
		return dom.inputPass().attr('placeholder', placeholder)
	}
	function _hr() {
		return dom.div(null, 'hr')
	}
})(new gtpack.DOM());