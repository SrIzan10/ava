import { EventType, eventModule } from '@sern/handler';
import axios from 'axios';
import { ActivityType, Client } from 'discord.js';

export default eventModule({
	type: EventType.Discord,
	name: 'ready',
	execute: async (client: Client) => {
		setInterval(async () => {
			// For KNGI
			const nowplayingapi = await axios.get('https://network.kngi.org/api/nowplaying').then(res => res.data[0])
			client.user?.setActivity({type: ActivityType.Listening, name: `KNGI | ${nowplayingapi.now_playing.song.text}`})
		}, 30_000)
		setInterval(async () => {
			// For Gensokyo Radio
			const nowplayingapi = await axios.get('https://gensokyoradio.net/api/station/playing/').then(res => res.data)
			client.user?.setActivity({type: ActivityType.Listening, name: `Gensokyo | ${nowplayingapi.SONGINFO.TITLE}`})
		}, 20_000)
		setInterval(async () => {
			// For Gensokyo Radio
			client.user?.setActivity({type: ActivityType.Watching, name: `${client.guilds.cache.filter((g)=> g.members.me!.voice.channelId).size} voice connections`})
		}, 10_000)
	},
});
