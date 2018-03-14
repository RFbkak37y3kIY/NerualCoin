define(['com.applicationView.PageHome',
	'com.applicationView.DOMcomponents'
], function(){
	var self = this,
		dom = new gtpack.DOM(),
		d = new com.applicationView.DOMcomponents();
		
	return dom.div([
		d.h2('Главная'),
		d.button('регистрация новой компании', function (e) {
			self.setPage("PageNewSystem");
		}), d.hr(),
		d.button('Список систем', function(){
			self.setPage("PageNewWallet");
		}), d.hr(),
		d.button('Войти в систему',function (e) {
			self.setPage("PageAuth");
		}), d.hr(),
		d.button('Просмотреть блокчеин', function (e) {
			self.setPage("PageNC");
		})
	]);
});