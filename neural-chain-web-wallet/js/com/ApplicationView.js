define(['com.ApplicationView',
	'com.applicationView.PageHome',
	'com.applicationView.PageRegWallet',
	'com.applicationView.PageProfile',
	'com.applicationView.PageSendMoney'
], ApplicationView);
/**
 * VIEWER
 */
function ApplicationView (configEvents) {
	var self = this;
	var dom = new gtpack.DOM();
	var _preloaderElement = dom.div('Loading neural-chain ..').addClass('preloader-fullscreen');
	var isPreloader = true;
	var _cMessage, _setInterval01, _setInterval02;


	this.events = configEvents || {	pageAuth: {} };

	this.setConfig = function (configEvents) {
		self.events = configEvents || self.events;
	}
	this.alertMessage = function ( strMessage ) {
		self.alertError( strMessage, 'green')
	}
	this.alertError = function ( strMessage, _color ) {
		_color = _color || 'red';
		if(document.body.contains(_cMessage)) {
			document.body.removeChild(_cMessage);
			clearTimeout(_setInterval01);
			clearTimeout(_setInterval02);
		}
		document.body.appendChild(_cMessage = dom.div(strMessage).addClass('system-message'));
		
		_cMessage.addClass(_color);
		
		_setInterval01 = setTimeout(function() {
			_cMessage.style.opacity = 0;
			_cMessage.style.top = 0;
			_setInterval02 = setTimeout(function() {
				document.body.removeChild(_cMessage);
			}, 2500)
		}, 2000)
	}
	this.hidePreloader = function() {
		isPreloader = false;
		_preloaderElement.parentNode.removeChild(_preloaderElement);
	}
	this.showPreloader = function() {
		isPreloader = true;
		document.body.appendChild(_preloaderElement);
	}
	this.setPage = function (pageName){
		gtpack.DOM.render(dom.div([
			com.applicationView[pageName || "PageHome"].apply(self)
		]));
		if(isPreloader) {
			document.body.appendChild(_preloaderElement);
		}
	}
	this.setPage();

}