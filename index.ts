import { Client, GatewayIntentBits } from 'discord.js';
import { Sern, SernEmitter } from '@sern/handler';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

export const prisma = new PrismaClient()

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
