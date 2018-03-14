define(['com.ApplicationView',
	'com.applicationView.PageHome',
	'com.applicationView.PageNewSystem',
	'com.applicationView.PageAuth',
	'com.applicationView.PageCreatedCertificate',
	'com.applicationView.PageReg',
	'com.applicationView.PageNewWallet'
], ApplicationView);
/**
 * VIEWER
 */
function ApplicationView (configEvents) {
	var self = this;
	var dom = new gtpack.DOM();
	var _preloaderElement = dom.div('Loading neural-chain ..').addClass('preloader-fullscreen');
	var isPreloader = true;
	var _c = this.conteiner = dom.p('');
	var _open = this.openFile = dom.p('');
	var _openContent = this._openContent = dom.div(null, 'p');
	var _neuralChainContent = dom.div('');

	this.events = configEvents || {
		pageHome: {},
		pageAuth: {},
		pageNewSystem: {},
	};

	this.setConfig = function (configEvents) {
		self.events = configEvents || self.events;
	}
	this.pageCreatedCertificate = com.applicationView.PageCreatedCertificate;
	this.pageNC = com.applicationView.PageNC = function () {
		return _neuralChainContent;
	}
	this.hidePreloader = function() {
		isPreloader = false;
		_preloaderElement.parentNode.removeChild(_preloaderElement);
	}

	this.showPreloader = function() {
		isPreloader = true;
		document.body.appendChild(_preloaderElement);
	}
	
	this.updateNeuralChainContent = function(arr) {
		
		var arrDOM = [];
		var itemDOM = null;
		for (var i = 0; i < arr.length; i++) {
			itemDOM = [];
			for(var item in arr[i]) {
				/// console.log('arr[i][item]', arr[i][item], objectToDom(arr[i][item]))
				itemDOM.push(dom.div([
					dom.div(item + ": ", "b"),
					dom.div(objectToDom(arr[i][item]), "p")
				], 'p'));
			}
			arrDOM.push(dom.div(itemDOM).attr('style', 'background-color: #fff'))
		}
		_neuralChainContent.innerHTML = '';
		_neuralChainContent.add(btn = dom.button('<< отмена'));
		_neuralChainContent.add(dom.div(arrDOM));
		
		btn.onclick = function(e) {
			self.setPage('PageHome');
		}
	}
	
	
	
	this.updateOpenContent = function (str) {
		_openContent.innerHTML = ''; //str.match(/.{4}/g).join(' ');
		_openContent.add(dom.div(objectToDom(str)))
	}
	


	this.setPage = setPage;
	function setPage(pageName){
		gtpack.DOM.render(dom.div([
			com.applicationView[pageName || "PageHome"].apply(self)
			// self[pageName || "pageHome"]()
		]));
		if(isPreloader) {
			document.body.appendChild(_preloaderElement);
		}
	}
	function objectToDom(o){
		if(typeof o === 'string'){
			return o;
		} else if(typeof o === 'number') {
			return o + '';
		}
		var n = dom.div();
		for(var item in o) {
			n.add([
				dom.div(null, 'hr'),
				dom.div(item + ": ", 'b'), 
				dom.div(objectToDom(o[item]), 'i')
			]);
			
		}
		return n;
	}
	setPage("PageHome");

}