(function(dom){
	define(['com.applicationView.PageCreatedCertificate'], function(data, certificate, privateKey){
		var self = this;
		var buttons = {};
		var page = dom.div([
			_('h2', 'Регистрация / Сформирован новый сертификат'),
			_('hr'),
			_('h3', 'Данные системы'),
			_('div', [
				dom.div("Владелец: ", 'label', {style: 'display: block'}), 
				dom.p('Фамилия: ' + data.owner.firstName),
				dom.p('Имя: ' + data.owner.seccondName),
				dom.p('Отчество: ' + data.owner.lastName),
				_('hr'),
				dom.div("О системе: ", 'label', {style: 'display: block'}), 
				dom.p('Название системы: ' + data.systemName),
				dom.p('Название монеты: ' + data.coinName),
				dom.p('URL адресс компании: ' + data.systemUrl),
				dom.p('email обратной связи: ' + data.emailFeedBack),
				dom.p('номер сертификата: ' + data.numberCertificate),
				_('hr'),
				dom.div('Номер счета: ' + data.walletAccountNumber, 'p', {style: 'font-weight: bold;'}),
				_('hr'),
				dom.p('Описание: ' + data.description),

			]).addClass('form'),
			
			buttons.btnPublish = dom.button('Публиковать сертификат в блокчеин'),

			dom.p(certificate).addClass('code-container'),
			
			buttons.btnDownload = dom.button('Сохранить закрытый ключь на диск'),
			
			dom.p(privateKey).addClass('code-container'),
			
			buttons.btnBack = dom.button('<< отмена'),
		]);
		buttons.btnBack.onclick = function (e) {
			self.setPage('PageNewSystem');
		}
		buttons.btnDownload.onclick = function(e) { 
			if (self.events.pageNewSystem.savePrivateKey) {
				self.events.pageNewSystem.savePrivateKey();
			}
		};
		buttons.btnPublish.onclick = function(e) { 
			if (self.events.pageNewSystem.publishCertificateToNC) {
				self.events.pageNewSystem.publishCertificateToNC();
			}
		};
		gtpack.DOM.render(dom.div([ page ]));
	});

	function _(tagName, strText) {
		return dom.div(strText, tagName);
	}
	
})(new gtpack.DOM());