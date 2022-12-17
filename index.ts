import { Client, GatewayIntentBits } from 'discord.js';
import { Sern, SernEmitter } from '@sern/handler';
import 'dotenv/config';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
	],
});
//View docs for all options
Sern.init({
	client,
	commands: 'dist/commands',
	events: 'dist/events',
	sernEmitter: new SernEmitter(),
});

client.login(process.env.TOKEN);
