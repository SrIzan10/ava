import { commandModule, CommandType } from '@sern/handler';
import { publish } from '../plugins/index.js';
import { ActionRowBuilder, ComponentType, EmbedBuilder, StringSelectMenuBuilder } from 'discord.js';
import axios from 'axios';
import progressbar from 'string-progressbar'

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'Check what\'s playing on both radios',
	options: [],
	execute: async (ctx, options) => {
		const nowplayingkngi = await axios.get('https://network.kngi.org/api/nowplaying').then(res => res.data[0])
		const nowplayingensokyo = await axios.get('https://gensokyoradio.net/api/station/playing/').then(res => res.data)

		const selectMenu = new ActionRowBuilder<StringSelectMenuBuilder>()
			.setComponents(
				new StringSelectMenuBuilder()
					.setCustomId('nowplaying-selectmenu')
					.setMinValues(1)
					.setMaxValues(1)
					.addOptions(
						{
							label: 'KNGI',
							value: 'kngi',
						},
						{
							label: 'Gensokyo Radio',
							value: 'gensokyo'
						},
					)
					.setPlaceholder('Select the radio')
			);

		const kngiembed = new EmbedBuilder()
			.setAuthor({
				iconURL: 'https://kngi.org/public_html/wp-content/uploads/NGI2015AlbumArt-200.png',
				name: 'KNGI'
			})
			.setColor('Random')
			.setTitle('Now playing on KNGI Radio')
			.setThumbnail(nowplayingkngi.now_playing.song.art)
			.setFields(
				{
					name: 'Name',
					value: nowplayingkngi.now_playing.song.text,
					inline: true
				},
				{
					name: 'Artist',
					value: nowplayingkngi.now_playing.song.artist,
					inline: true
				},
				{
					name: '\u200B',
					value: '\u200B',
					inline: true
				},
				{
					name: 'Playing next: Name',
					value: nowplayingkngi.playing_next.song.text,
					inline: true
				},
				{
					name: 'Playing next: Artist',
					value: nowplayingkngi.playing_next.song.artist,
					inline: true
				},
				{
					name: '\u200B',
					value: '\u200B',
					inline: true
				},
				{
					name: 'Progressbar',
					value: (progressbar.splitBar(nowplayingkngi.now_playing.duration, nowplayingkngi.now_playing.elapsed, 20))[0],
					inline: true
				},
			)
			.setFooter({text: `Total listeners: ${nowplayingkngi.station.mounts[0].listeners.total}`})
		const gensokyoembed = new EmbedBuilder()
			.setAuthor({
				iconURL: 'https://img.srizan.ml/gensokyo-removebg.png',
				name: 'Gensokyo Radio'
			})
			.setColor('Random')
			.setTitle('Now playing on Gensokyo Radio')
			.setThumbnail(`https://gensokyoradio.net/images/albums/500/${nowplayingensokyo.MISC.ALBUMART}`)
		
		const msg = await ctx.reply({embeds: [kngiembed], components: [selectMenu]})
		const collector = msg.createMessageComponentCollector({time: 30_000, componentType: ComponentType.StringSelect})
		
		collector.on('collect', async (i) => {
			if (i.customId === 'nowplaying-selectmenu') {
				const selected = i.values[0]
				if (selected === 'kngi') {
					// KNGI
					await ctx.interaction.editReply({embeds: [kngiembed], components: [selectMenu]})
					await i.deferUpdate()
				} else if (selected === 'gensokyo') {
					// Gensokyo
					await ctx.interaction.editReply({embeds: [gensokyoembed], components: [selectMenu]})
					await i.deferUpdate()
				}
			}
		})
	},
});