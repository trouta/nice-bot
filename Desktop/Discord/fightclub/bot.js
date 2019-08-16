const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.msgs = require('./msgs.json');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
/****************************************************************************************/

function addUser() {
	var userString = localTag + '||' + 0 + '||' + 0 + '||' + 'Peasant';

	//write to JSON file
	client.msgs[localTag] = {
		message: userString
	}
	fs.writeFile('./msgs.json', JSON.stringify(client.msgs, null, 4), err => {
		if (err) throw err;
		console.log('User added to JSON file msgs.json.');
	});
}


function getUser() {
	if (!client.msgs[localTag]) {
		addUser();
	}
	let _message = client.msgs[localTag].message;
	tempArray = _message.split('||');
	localTag = tempArray[0];
	localWins = tempArray[1];
	localLosses = tempArray[2];
	localRank = tempArray[3];
}


function alterUser() {
	var userString = localTag + '||' + localWins + '||' + localLosses + '||' + localRank;

	//write to JSON file
	client.msgs[localTag] = {
		message: userString
	}
	fs.writeFile('./msgs.json', JSON.stringify(client.msgs, null, 4), err => {
		if (err) throw err;
		console.log('User altered in JSON file msgs.json.');
	});
}

/****************************************************************************************/
var localTag = '';
var localWins = 0;
var localLosses = 0;
var localRank = '';


for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');

	var testChannel = client.channels.find(channel => channel.id === '610534720626884617');
	setInterval(function() {
		testChannel.send('A new challenger is approaching! To challenge, enter the command f!attack.');
	}, 30 * 60 * 1000);
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (commandName === 'help') {
		message.channel.send('Command -- description\nf!rank -- display current rank\nf!record -- display current record\nf!attack -- fight');
	}

	localTag = message.author.tag;

	if (commandName === 'rank') {
		getUser();
		message.channel.send(`${message.author}\'s current rank is **${localRank}**.`);
	}

	if (commandName === 'record') {
		getUser();
		message.channel.send(`${message.author}\'s current record: Wins:  ${localWins}; Losses: ${localLosses}`);
	}

	if (commandName === 'attack') {
		var success = Math.floor(Math.random() * Math.floor(2));
		var previousWins = localWins;

		if (success == 0) {
			localLosses++;
			alterUser();
			message.channel.send(`Sorry, ${message.author}. You were unsuccessful in your challenge. Better luck next time!\nCurrent record: Wins:  ${localWins}; Losses: ${localLosses}`);
		}

		else {
			localWins++;
			alterUser();
			message.channel.send(`Congratulations, ${message.author}. You were successful in your challenge. Your record of wins has increased by 1!\nCurrent record: Wins:  ${localWins}; Losses: ${localLosses}`);
		}

		if (localWins !== 0 && localWins%5 == 0 && (previousWins !== localWins)) {

			var dictRankTitles = {5 : 'Citizen', 10 : 'Volunteer', 15 : 'Tyro', 20 : 'Legionary', 25 : 'Veteran', 30 : 'Corporal', 35 : 'Sergeant', 40 : 'First Sergeant', 45 : 'Lieutenant', 50 : 'Captain', 55 : 'Major', 60 : 'Centurion', 65 : 'Colonel', 70 : 'Tribune', 75 : 'Brigadier', 80 : 'Prefect', 85 : 'Praetorian', 90 : 'Palatine', 95 : 'August Palatine', 100 : 'Legate', 105 : 'General', 110 : 'Warlord', 115 : 'Grand Warlord', 120 : 'Overlord', 125 : 'Grand Overlord'};

			for (key in dictRankTitles) {
				if (key === localWins){
					localRank = dictRankTitles[key];
					alterUser();
					message.channel.send(`Congratulations, ${message.author}! You have moved up one rank. Your new rank: **${localRank}**`);

				}
			}
		}

		};	//end attack function

});//end message function

client.login(token);
