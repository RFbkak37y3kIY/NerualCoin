define(['com.applicationView.PageProfile',
	'com.applicationView.DOMcomponents'
], function(){
	var self = this,
		dom = new gtpack.DOM(),
		d = new com.applicationView.DOMcomponents();
	
	var out =  dom.div([
		d.h2('Профиль'),
		d.label('Номер вашего счета:'),
		accNumDiv = d.div(' . . . ').addClass('code-container'),       
		d.label('Баланс:'),
		balanceDiv = d.div(' . . . ').addClass('code-container'),  
		d.button('обновить', function(e){
			self.setPage('PageProfile')
		}),    
		d.button('Отправить средства', function(e){
			self.setPage('PageSendMoney')
		}),    
		d.label('История операций'),
		historyDiv = d.div(' . . . '),      
	]);

	if(self.events.pageAuth.profile) self.events.pageAuth.profile(function(data){
		console.log(data)
		function dataFormat (date) {
			var d = new Date();
			return ("00" + (d.getMonth() + 1)).slice(-2) + "/" + ("00" + d.getDate()).slice(-2) + "/" + d.getFullYear() + " " + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2);
		}
		accNumDiv.innerHTML = data.accountNumber;
		balanceDiv.innerHTML = `<div class="history_item"><big>${(data.balance.balance * 1).toFixed(12)} COINS</big></div>`;
		historyDiv.innerHTML = data.history.history.reverse().map(function(a){
			var dformat = dataFormat(a.datatime),
				b = a.from === data.accountNumber,
				route = b? '\u25C0': '\u25B6',
				numAcc = b? a.to: a.from,
				_color = b? 'red': 'green';
			
			return `<div class="history_item">
				<div>${numAcc}</div>
				<big style="color:${_color};">${route} ${(a.sum * 1).toFixed(12)} COINS</big>
				<span>${dformat}</span>
			</div>`
		}).join('')
	})



	return out;
});