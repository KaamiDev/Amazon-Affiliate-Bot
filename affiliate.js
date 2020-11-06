// require modules
const Deshortifier = require('deshortify');
const axios = require('axios');

// create new deshortifier instance
let deshortifier = new Deshortifier({ verbose: false });

// export create function
module.exports.create = (url, tag) => {
	return new Promise((resolve) => {
		// use deshortifier to unshorten url
		deshortifier.deshortify(url).then((u) => {
			// split new url to remove all query strings
			url = u.split('?')[0].split('ref')[0];

			// add tag query string with affiliate tag
			url += `?tag=${tag}`;

			// shorten url once again using bit.ly
			axios
				.post(
					'https://api-ssl.bitly.com/v4/shorten',
					{
						long_url: url,
						domain: 'bit.ly',
						group_guid: 'Bh58hbj2Sqg'
					},
					{
						headers: {
							Authorization: 'Bearer ' + process.env.BITLY_TOKEN,
							'Content-Type': 'application/json'
						}
					}
				)
				.then((response) => {
					// resolve content with url replace with new url
					resolve(response.data.link);
				})
				.catch((err) => {
					// catch and log error(s)
					console.log(err);
				});
		});
	});
};
