import { joinVoiceChannel, createAudioResource, createAudioPlayer } from '@discordjs/voice';
import { EventType, eventModule } from '@sern/handler';
import type { Client, VoiceChannel } from 'discord.js';
import got from 'got';
import { prisma } from '../index.js';
import { radioResolver } from '../util/radioResolver.js';

export default eventModule({
	type: EventType.Discord,
	name: 'ready',
	execute: async (client: Client) => {
		const documents = await prisma.stick.findMany();
		documents.forEach(async (document) => {
			const fetchguild = await client.guilds.fetch(document.guildid);
			try {
				await fetchguild.channels.fetch(document.channelid) as VoiceChannel
			} catch {
				await prisma.stick.delete({
					where: {
						id: document.id
					}
				})
			}
			const stream = got.stream(radioResolver(document.radio as "KNGI" | "Gensokyo Radio"));
			const connection = joinVoiceChannel({
				adapterCreator: fetchguild.voiceAdapterCreator,
				guildId: fetchguild.id,
				channelId: document.channelid,
			});
			const resource = createAudioResource(stream);
			const player = createAudioPlayer();
			connection.subscribe(player);
			player.play(resource);
		});
	},
});
