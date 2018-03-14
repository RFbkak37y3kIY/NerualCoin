define(['com.applicationView.PageAuth'], function(){
	var self = this;
	var dom = new gtpack.DOM();
	
	var buttons = {};
	
	var page = dom.div([
		dom.div([dom.text('Войти в систему')], 'h2'),
		dom.div(null, 'hr'),
		btnBack = dom.button('<< отмена'),
		dom.div([
			dom.text('Загрузить Сертификат'),
			buttons.fileDom = dom.div(null, 'input', {
				type: 'file', 
				id: 'file-upload', 
				style: "display: none;",
				accept: '.key,.pkey'
			})
		], 'label', {
			for: 'file-upload',
			class: 'custom-file-upload'
		}),
		self._openContent.addClass('code-container'),
	]);
	
	if (self.events.pageAuth.uploadCertificate) {
		buttons.fileDom.addEventListener('change', self.events.pageAuth.uploadCertificate );
	}
	btnBack.onclick = function(){
		self.setPage('PageHome');
	}
	return page;
});