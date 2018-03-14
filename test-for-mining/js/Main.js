(function(){
	define([
		'Main', 
		'Connect'
	], Application);

	gtpack.CSS({'.class-inlineblock': {
		display: 'inline-block',
		margin: '20px',
		padding: '15px !important',
		'font-size': '1em'
	}});

	function Application () {
		var self = this,
			dom = new gtpack.DOM(),
			_intAccNum, _cMessage, _setInterval01, _setInterval02;

		this.PageHome = function () {
			var b1, b2, b3, b4, b5;
			var _content = dom.div(),
				_result = dom.div(),
				_out = dom.div([
					dom.div("Давайте начнем добывать монеты.", 'h1'),
					dom.p('Введите номер счета:'),
					_intAccNum = dom.input().addClass('width-full-avilabel'),
					dom.div(null, 'ul'),
					_content,
					dom.div(null, 'hr'),
					_result
				]);
			
			function setResult (task) {
				Connect.miningTask(_intAccNum.text(), task, function(data){
					alertMessage('win ' + data.sum + ' ' + data.currencyType);
					console.log(data)
					_result.add(dom.div(data.user_acc, 'b'));
					_result.add(dom.div(data.sum + ' ' + data.currencyType + ' зачислено на Ваш кошелек.'));
					_result.add(dom.div(null, 'hr'));
				});
			}

			_intAccNum.onkeydown = 
			_intAccNum.onpress = 
			_intAccNum.onkeyup = 
			_intAccNum.onchange = function(e) {

				_content.text('')
				if(_intAccNum.text().length != 40) return;
				_content.add([
					b1 = dom.button('Полезное действие № 1, стоимость х1').addClass('class-inlineblock'),
					b2 = dom.button('Полезное действие № 2, стоимость х2').addClass('class-inlineblock'),
					b3 = dom.button('Полезное действие № 3, стоимость х4').addClass('class-inlineblock'),
					b4 = dom.button('Полезное действие № 4, стоимость х8').addClass('class-inlineblock'),
					b5 = dom.button('Полезное действие № 5, стоимость х30').addClass('class-inlineblock'),
				])
				
				b1.onclick = function (e) { setResult('taskName01'); }
				b2.onclick = function (e) { setResult('taskName02'); }
				b3.onclick = function (e) { setResult('taskName03'); }
				b4.onclick = function (e) { setResult('taskName04'); }
				b5.onclick = function (e) { setResult('taskName05'); }
			}
			return _out;
		}
		function setPage ( pageName ) {
			gtpack.DOM.render(dom.div([
				self[pageName || "PageHome"].apply(self)
			]));
			
		}
		function alertMessage ( strMessage ) {
			alertError( strMessage, 'green')
		}
		function alertError ( strMessage, _color ) {
			if(document.body.contains(_cMessage)) {
				document.body.removeChild(_cMessage);
				clearTimeout(_setInterval01);
				clearTimeout(_setInterval02);
			}
			document.body.appendChild(_cMessage = dom.div(strMessage).addClass('system-message'));
			if(_color) {
				_cMessage.addClass(_color);
			}
			 _setInterval01 = setTimeout(function() {
				_cMessage.style.opacity = 0;
				_cMessage.style.top = 0;
				_setInterval02 = setTimeout(function() {
					document.body.removeChild(_cMessage);
				}, 2500)
			}, 2000)
		}
		setPage();
	}

})();