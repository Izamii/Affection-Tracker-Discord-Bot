const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
//Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI);

console.log('Connecting to MongoDB...');
mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB!');
});


//Create a new Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//Load all events from the events folder
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

//Create a new Collection for commands and load them from the commands folder
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client.login(process.env.TOKEN);