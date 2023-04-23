import { Client, GatewayIntentBits } from 'discord.js';

import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { type Dependencies, type Singleton, DefaultLogging, Sern, single } from '@sern/handler';

export const prisma = new PrismaClient()

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
	],
});

interface MyDependencies extends Dependencies {
    '@sern/client' : Singleton<Client>;
    '@sern/logger' : Singleton<DefaultLogging>
}
export const useContainer = Sern.makeDependencies<MyDependencies>({
    build: root => root
        .add({ '@sern/client': single(client)  }) 
        .add({ '@sern/logger': single(new DefaultLogging()) })
});
Sern.init({
	commands: 'dist/commands',
	events: 'dist/events',
	containerConfig: {
		get: useContainer
	}
});

client.login(process.env.TOKEN);
