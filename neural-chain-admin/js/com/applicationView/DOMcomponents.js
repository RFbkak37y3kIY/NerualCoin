(function(){
	define(['com.applicationView.DOMcomponents'], DOMcomponents);	
	
	function DOMcomponents () {}
	
	DOMcomponents.prototype = {
		dom: new gtpack.DOM(),
		htm: function(tagName, strText) {
			return this.dom.div(strText, tagName);
		},
		button: function(text, fn) {
			var b = this.dom.button(text);
			b.onclick = fn;
			return b;
		},
		h2: function(text) {
			return this.dom.div([this.dom.text(text)], 'h2');
		},
		h3: function(text) {
			return this.dom.div([this.dom.text(text)], 'h3');
		},
		hr: function() {
			return this.htm('hr');
		},
		div: function() {
			return this.dom.div.apply(this, arguments);
		},
		password: function() {
			return this.dom.inputPass.apply(this, arguments);
		},
		input: function() {
			return this.dom.input.apply(this, arguments);
		},
		label: function(text) {
			return this.dom.div([this.dom.text(text)], 'label');
		}
		
	}
})();