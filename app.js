// setup env variables
require('dotenv').config();
// require modules
const Discord = require('discord.js');

// initalize client
const client = new Discord.Client();

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
					.setTitle('Amazon Affiliates')
					.setDescription('Create quick amazon affiliate links!')
					.setThumbnail('https://i.imgur.com/h1SU6XO.png')
					.addField(
						'Bot Commands',
						'`a!set <code>` - Set your affiliate code to be used.\n`a!create <link>` - Create an affiliate link for a product.'
					)
					.setTimestamp()
					.setFooter('Amazon Affiliates', 'https://i.imgur.com/h1SU6XO.png')
			);
		}
	}
});

client.login(process.env.TOKEN);
