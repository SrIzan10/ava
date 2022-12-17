import { commandModule, CommandType } from '@sern/handler';
import { publish } from '../plugins/index.js';
import {
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} from '@discordjs/voice';
import { ApplicationCommandOptionType, EmbedBuilder, GuildMember } from 'discord.js';
import got from 'got';

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'Play the radio you want',
	options: [
		{
			name: 'radio',
			description: 'The radio you want to play.',
			type: ApplicationCommandOptionType.String,
			required: true,
			autocomplete: true,
			command: {
				onEvent: [],
				execute: async (ctx) => {
					const focusedValue = ctx.options.getFocused();
					const choices = ['KNGI', 'Gensokyo Radio'];
					const filtered = choices.filter((choice) =>
						choice.startsWith(focusedValue)
					);
					await ctx.respond(
						filtered.map((choice) => ({ name: choice, value: choice }))
					);
				},
			},
		},
	],
	execute: async (ctx, options) => {
        const radioname = options[1].getString('radio', true);
        const fetchUser = await (await ctx.client.guilds.fetch(ctx.guild.id)).members.fetch(ctx.user.id) as GuildMember

		if (!fetchUser.voice.channel?.id) 
            return await ctx.reply({
                content: 'You are not in a VC!',
                ephemeral: true
            })
        if (!fetchUser.voice.channel!.joinable)
            return await ctx.reply({
                content: 'I can\'t join that VC!',
                ephemeral: true
            })
        

        const embed = new EmbedBuilder()
            .setAuthor({name: ctx.user.username, iconURL: ctx.user.displayAvatarURL()})
            .setColor('Green')
            .setTitle(`Started playing ${radioname} in ${fetchUser.voice.channel?.name}`)
            .setDescription(`Go ahead and join <#${fetchUser.voice.channelId}> to listen ${radioname}!`)
        const embedNotFound = new EmbedBuilder()
            .setAuthor({name: ctx.user.username, iconURL: ctx.user.displayAvatarURL()})
            .setColor('Red')
            .setTitle(`Radio not found.`)
            .setDescription(`Make sure you select the radio from the autocomplete!`)
		switch (radioname) {
			case 'KNGI':
				{
                    const stream = got.stream('https://network.kngi.org/radio/8000/stream')
                    const connection = joinVoiceChannel({
                        adapterCreator: ctx.interaction.guild!
                            .voiceAdapterCreator,
                        guildId: ctx.guild.id,
                        channelId: fetchUser.voice.channelId!
                    });
                    const resource = createAudioResource(stream);
                    const player = createAudioPlayer();
                    connection.subscribe(player);
                    player.play(resource);
                    await ctx.reply({embeds: [embed]})
				}
				break;
			case 'Gensokyo Radio':
				{
                    const stream = got.stream('https://stream.gensokyoradio.net/1')
                    const connection = joinVoiceChannel({
                        adapterCreator: ctx.interaction.guild!
                            .voiceAdapterCreator,
                        guildId: ctx.guild.id,
                        channelId: fetchUser.voice.channelId!
                    });
                    const resource = createAudioResource(stream);
                    const player = createAudioPlayer();
                    connection.subscribe(player);
                    player.play(resource);
                    await ctx.reply({embeds: [embed]}) 
				}
				break;
            default: 
                {
                    await ctx.reply({embeds: [embedNotFound]})
                }
                break;
		}
	},
});
