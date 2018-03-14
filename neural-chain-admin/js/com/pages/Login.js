(function(){
	define(['com.pages.Login'], Login);

	var style;

	function Login (config) {
		LoginController.call(this, config);
	}

	/// Controller
	function LoginController (config) {
		
		var view = new LoginView(config.content || []);
		var $ = view.$view;
		this.dom = view.dom;
		this.$ = $;

		$.myButton.onclick = function (e) {
			if (config.onLogin) config.onLogin({
				login: $.login.text(),
				pass: $.pass.text()
			});
		}
	}
	
	/// VIEW
	function LoginView (content) { 
		gtpack.DOM.call(this)
		/*gtpack.CSS({
			'.someOneClass input': {
				border: '3px solid #000'
			}
		})*/

		var view = this.$view = {
				login: this.input(),
				pass: this.input(),
				myButton: this.button('Generate Keys')
			},
			domView = [
				this.p('Certificate Name:'),
				view.login.attr('placeholder', 'Certificate Name'),
				this.p('Password:'),
				view.pass.attr('placeholder', 'Password').attr('type', 'password'),
				this.div(null, 'hr'),
				view.myButton
			];
		for (var i=0; i < content.length; i++) {
			domView.push(content[i]);
		}

		// this.render(
		this.dom = this.div([
			this.div(domView).addClass('someOneClass')
		])
		// );
	}
})();