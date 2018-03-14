define(['com.applicationView.PageNewWallet',
	'com.applicationView.DOMcomponents'
], function() {
	var self = this, 
		d = new com.applicationView.DOMcomponents(),
		page = d.div([
			d.h2('Войти в систему'), d.hr(),
			d.button('<< отмена', function(){
				self.setPage('PageHome');
			})
		]);

	// TEST CSS
	gtpack.CSS({
		'.system-item': {
			backgroundColor: 'rgba(146, 178, 234, 0.61)',
			border: '0',
			//boxShadow: 'inset 0 2px 14px rgba(0,0,0,0.5)'
		},
		'.width-full-avilabel': {
			width: '-webkit-fill-available'
		}
	})
	function addItem(val, ind){
		return d.div(val + '', 'p', { "data-title": ind }).addClass('code-container')
	}
	if(self.events.listCerttificates) {
		var _list = self.events.listCerttificates,
			setSystemItem = function(data, index){
				data._content = d.div();
				data._contentAuth = d.div();
				var _a = data._contentAuth, 
					_r = data._content;
				data.viewResult = function(obj){
					for(var item in obj){
						_r.add(addItem(obj[item], item));	
					}
					_r.add(d.button('отправить запись в блокчейн', function(e){
						if(self.events.pageNewWallet.setDataToNC) {
							self.events.pageNewWallet.setDataToNC({
								type: 'wallet',
								publicKey: obj.publicKey,
								account_number: obj.account_number,
								certificateParrent: index
							});
						}
					}))
				}
				page.add(d.div([
					d.h3(data.metadata.systemName + ' (' + index + ')'),
					d.hr(),
					d.button('Регистрация кошелька', function(e) {
						_a.innerHTML = '';
						_r.innerHTML = '';
						_r.add(d.label('Введите пароль:'));
						_r.add(pass = d.password());
						_r.add(d.button('next >>', function(e){
							_r.innerHTML = '';
							console.log('password: ',pass.text());
							if(self.events.pageNewWallet.reg) {
								self.events.pageNewWallet.reg({
									password: pass.text(),
									viewResult: data.viewResult
								})
							}
						}));
						console.log('Reg::'+data.metadata.systemName)
					}), data._content,
					d.button('Авторизоваться', function(e) {
						_r.innerHTML = '';
						_a.innerHTML = '';
						data.viewResult = function(obj){
							_a.innerHTML = '';
							for (var item in obj){
								if (item == 'metadata') {
									for (var subitem in obj[item]){
										if (subitem == 'owner' ) {
											for (var subsubitem in obj[item][subitem]){
												_a.add(addItem(obj[item][subitem][subsubitem], subsubitem));
											}	
										} else {
											_a.add(addItem(obj[item][subitem], subitem));
										}
									}
								} else {
									_a.add(addItem(obj[item], item));	
								}
							}

							if(obj.metadata && obj.metadata.type == 'system certificate') {
								_a.add(d.button('Мониторинг', function(e) {
									//
								}));

							}
							_a.add(d.button('Отправить средства', function(e) {
								//
							}));
							/*
							_a.add(d.button('отправить запись в блокчейн', function(e){
								// 
							}))
							*/
						}
						_a.add(d.label('введите privatKey'));
						_a.add(pk = d.input().addClass('width-full-avilabel'));
						_a.add(d.label('Пароль'));
						_a.add(pass = d.password());
						_a.add(d.button('активировать', function(e){
							console.log('активировано..')
							_a.innerHTML = '';
							_a.add(d.h2('активировано..'));

							if(self.events.pageNewWallet.auth) {
								self.events.pageNewWallet.auth({
									password: pass.text(),
									privateKey: pk.text(),
									viewResult: data.viewResult
								})
							}
						}));

						console.log('Auth::'+data.metadata.systemName)
					}), data._contentAuth, d.hr(),
				]).addClass('system-item'));
			};

		for (var i = 0; i < _list.length; i++) {
			setSystemItem(_list[i][1], _list[i][0]);
		}
	}
	return page;
});