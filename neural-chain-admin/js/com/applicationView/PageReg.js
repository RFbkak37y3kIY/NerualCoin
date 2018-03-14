(function(dom){
	define(['com.applicationView.PageReg'], function(){
		var self = this, buttons = {};

		var page = dom.div([
			htm('h2', 'Регистрация'),
			buttons.regCoin = dom.button('регистрация новой компании (монеты)'),
			htm('hr'),
			buttons.regAcc = dom.button('регистрация аккаунта пользователя'),
			htm('hr'),
			buttons.btnBack = dom.button('отмена'),
		]);
		
		buttons.regCoin.onclick = function (e) {
			self.setPage("PageNewSystem");
		}
		buttons.regAcc.onclick = function(){
			self.setPage("PageNewWallet");
		}
		buttons.btnBack.onclick = function(){
			self.setPage('PageHome');
		}
		return page;
	});

	function htm(tagName, strText) {
		return dom.div(strText, tagName);
	}

})(new gtpack.DOM());