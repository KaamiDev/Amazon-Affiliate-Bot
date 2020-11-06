// setup env variables
require('dotenv').config();

// require modules
const Discord = require('discord.js');
const db = require('diskdb');

// initalize client
const client = new Discord.Client();

// connect to json database
db.connect('./', [ 'codes' ]);

// connect to discord
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

// message template functions for reples
const createMessage = (desc, name, image) => {
	return new Discord.MessageEmbed().setAuthor(name, image).setColor('#00D632').setDescription(desc);
};

const createErr = (desc, name, image) => {
	return new Discord.MessageEmbed().setAuthor(name, image).setColor('#F8453C').setDescription(desc);
};

// listen for messages
client.on('message', (message) => {
	// make sure prefix is used
	if (message.content.slice(0, 2) === 'a!') {
		// remove prefix from content string
		message.content = message.content.slice(2);

		// if help command
		if (message.content === 'help') {
			// display help embed
			message.channel.send(
				new Discord.MessageEmbed()
					.setColor('#FD9901')
					.setTitle('Amazon Affiliate Bot')
					.setDescription('Create quick amazon affiliate links!')
					.setThumbnail('https://i.imgur.com/h1SU6XO.png')
					.addField(
						'Bot Commands',
						'`a!set <code>` - Set your affiliate code to be used.\n`a!remove` - Remove your affiliate code.\n`a!code` - View your currently set affiliate code.\n`a!create <link>` - Create an affiliate link for a product.'
					)
					.setTimestamp()
					.setFooter('Amazon Affiliates', 'https://i.imgur.com/h1SU6XO.png')
			);
		} else if (message.content.split(' ')[0] === 'set') {
			// extract code from command
			let code = message.content.split(' ')[1];

			// make sure code exists
			if (code) {
				// check if user already has code set
				if (db.codes.findOne({ user: message.author.id })) {
					// prompt to first remove code
					message.channel.send(
						createErr(
							'You already have an affiliate code set.\nTo add a new one, please first remove it using `a!remove`',
							message.member.user.tag,
							message.member.user.avatarURL()
						)
					);
				} else {
					// save code to db
					db.codes.save({
						code,
						user: message.author.id
					});

					// display success
					message.channel.send(
						createMessage(
							'Your affiliate code is now set to `' + code + '`',
							message.member.user.tag,
							message.member.user.avatarURL()
						)
					);
				}
			} else {
				// display invalid
				message.channel.send(
					createErr('Invalid code provided.', message.member.user.tag, message.member.user.avatarURL())
				);
			}
		} else if (message.content === 'remove') {
			// check if user has affiliate code set
			if (db.codes.findOne({ user: message.author.id })) {
				// remove code from db
				db.codes.remove({ user: message.author.id });

				// display success
				message.channel.send(
					createMessage(
						'Your affiliate code was removed successfully!',
						message.member.user.tag,
						message.member.user.avatarURL()
					)
				);
			} else {
				// prompt to first set code
				message.channel.send(
					createErr(
						'No affiliate code currently set.\nSet one using `a!set <code>`',
						message.member.user.tag,
						message.member.user.avatarURL()
					)
				);
			}
		} else if (message.content === 'code') {
			// retrieve code from db
			let code = db.codes.findOne({ user: message.author.id });

			// check if user has code set
			if (code) {
				// display code
				message.channel.send(
					createMessage(
						'Your affiliate code is currently set to `' + code.code + '`',
						message.member.user.tag,
						message.member.user.avatarURL()
					)
				);
			} else {
				// prompt to first set code
				message.channel.send(
					createErr(
						'No affiliate code currently set.\nSet one using `a!set <code>`',
						message.member.user.tag,
						message.member.user.avatarURL()
					)
				);
			}
		}
	}
});

client.login(process.env.TOKEN);
