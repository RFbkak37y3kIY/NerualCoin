var Base64 = (function(s){
	var z = "charAt|fromCharCode|charCodeAt".split('|'),
		q = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	return {
		encode: function (input) {
			var output = "";
			var chr1, chr2, chr3 = "";
			var enc1, enc2, enc3, enc4 = "";
			var i = 0;

			input = escape(input);
			do {
				 chr1 = input[z[2]](i++);
				 chr2 = input[z[2]](i++);
				 chr3 = input[z[2]](i++);

				 enc1 = chr1 >> 2;
				 enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				 enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				 enc4 = chr3 & 63;

				 if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				 } else if (isNaN(chr3)) {
					enc4 = 64;
				 }

				 output = output +
					q[z[0]](enc1) +
					q[z[0]](enc2) +
					q[z[0]](enc3) +
					q[z[0]](enc4);
				 chr1 = chr2 = chr3 = "";
				 enc1 = enc2 = enc3 = enc4 = "";
			} while (i < input.length);

			return output;
		},
		decode: function (input) {
			var output = "", chr1, chr2, chr3 = "", enc1, enc2, enc3, enc4 = "", i = 0;

			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			do {
				 enc1 = q.indexOf(input[z[0]](i++));
				 enc2 = q.indexOf(input[z[0]](i++));
				 enc3 = q.indexOf(input[z[0]](i++));
				 enc4 = q.indexOf(input[z[0]](i++));

				 chr1 = (enc1 << 2) | (enc2 >> 4);
				 chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				 chr3 = ((enc3 & 3) << 6) | enc4;

				 output = output + s[z[1]](chr1);

				 if (enc3 != 64) {
					output = output + s[z[1]](chr2);
				 }
				 if (enc4 != 64) {
					output = output + s[z[1]](chr3);
				 }

				 chr1 = chr2 = chr3 = "";
				 enc1 = enc2 = enc3 = enc4 = "";

			} while (i < input.length);

			return unescape(output);
		}
	};
})(String);

define(['crypto.Base64'], Base64);