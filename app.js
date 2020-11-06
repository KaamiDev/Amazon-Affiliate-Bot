// setup env variables
require('dotenv').config();

// require modules
const Discord = require('discord.js');
const db = require('diskdb');

// initalize client
const client = new Discord.Client();

// connect to json database
db.connect('./', [ 'tags' ]);

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
						'`a!set <tag>` - Set your affiliate tag to be used.\n`a!remove` - Remove your affiliate tag.\n`a!tag` - View your currently set affiliate tag.\n`a!create <link>` - Create an affiliate link for a product.'
					)
					.setTimestamp()
					.setFooter('Amazon Affiliates', 'https://i.imgur.com/h1SU6XO.png')
			);
		} else if (message.content.split(' ')[0] === 'set') {
			// extract tag from command
			let tag = message.content.split(' ')[1];

			// make sure tag exists
			if (tag) {
				// check if user already has tag set
				if (db.tags.findOne({ user: message.author.id })) {
					// prompt to first remove tag
					message.channel.send(
						createErr(
							'You already have an affiliate tag set.\nTo add a new one, please first remove it using `a!remove`',
							message.member.user.tag,
							message.member.user.avatarURL()
						)
					);
				} else {
					// save tag to db
					db.tags.save({
						tag,
						user: message.author.id
					});

					// display success
					message.channel.send(
						createMessage(
							'Your affiliate tag is now set to `' + tag + '`',
							message.member.user.tag,
							message.member.user.avatarURL()
						)
					);
				}
			} else {
				// display invalid
				message.channel.send(
					createErr('Invalid tag provided.', message.member.user.tag, message.member.user.avatarURL())
				);
			}
		} else if (message.content === 'remove') {
			// check if user has affiliate tag set
			if (db.tags.findOne({ user: message.author.id })) {
				// remove tag from db
				db.tags.remove({ user: message.author.id });

				// display success
				message.channel.send(
					createMessage(
						'Your affiliate tag was removed successfully!',
						message.member.user.tag,
						message.member.user.avatarURL()
					)
				);
			} else {
				// prompt to first set tag
				message.channel.send(
					createErr(
						'No affiliate tag currently set.\nSet one using `a!set <tag>`',
						message.member.user.tag,
						message.member.user.avatarURL()
					)
				);
			}
		} else if (message.content === 'tag') {
			// retrieve tag from db
			let tag = db.tags.findOne({ user: message.author.id });

			// check if user has tag set
			if (tag) {
				// display tag
				message.channel.send(
					createMessage(
						'Your affiliate tag is currently set to `' + tag.tag + '`',
						message.member.user.tag,
						message.member.user.avatarURL()
					)
				);
			} else {
				// prompt to first set tag
				message.channel.send(
					createErr(
						'No affiliate tag currently set.\nSet one using `a!set <tag>`',
						message.member.user.tag,
						message.member.user.avatarURL()
					)
				);
			}
		} else if (message.content.split(' ')[0] === 'create') {
			let link = message.content.split(' ')[1];
			let tag = db.tags.findOne({ user: message.author.id });

			// make sure link exists
			if (link) {
				// make sure link is a valid url
				if (link.slice(0, 8) === 'https://' || link.slice(0, 7) === 'http://') {
					// make sure user has tag set
					if (tag) {
						affiliate.create(link, tag.tag).then((res) => {
							// display created link embed
							message.channel.send(
								new Discord.MessageEmbed()
									.setColor('#FD9901')
									.setTitle('Affiliate Link Created!')
									.setDescription('Your affiliate link was created successfully!')
									.addField('Link', res)
									.setTimestamp()
									.setFooter('Amazon Affiliates', 'https://i.imgur.com/h1SU6XO.png')
							);
						});
					} else {
						// prompt to first set tag
						message.channel.send(
							createErr(
								'No affiliate tag currently set.\nSet one using `a!set <tag>`',
								message.member.user.tag,
								message.member.user.avatarURL()
							)
						);
					}
				} else {
					// display invalid
					message.channel.send(
						createErr(
							'Invalid amazon link provided.',
							message.member.user.tag,
							message.member.user.avatarURL()
						)
					);
				}
			} else {
				// display invalid
				message.channel.send(
					createErr('Invalid amazon link provided.', message.member.user.tag, message.member.user.avatarURL())
				);
			}
		}
	}
});

client.login(process.env.TOKEN);
