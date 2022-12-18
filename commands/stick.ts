import { commandModule, CommandType } from '@sern/handler';
import { ApplicationCommandOptionType, GuildMember } from 'discord.js';
import { prisma } from '../index.js';
import { publish } from '../plugins/index.js';

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish({defaultMemberPermissions: 'ManageGuild'})],
	description: 'Stick to a VC',
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
		
		switch (radioname) {
			case 'KNGI': {
				await createDoc(radioname)
				await ctx.reply({content: `${radioname} is going to be sticked from now on!`})
			} break;
			case 'Gensokyo Radio': {
				await createDoc(radioname)
				await ctx.reply({content: `${radioname} is going to be sticked from now on!`})
			} break;
			default: {
				await ctx.reply({content: `Couldn't find that radio!`, ephemeral: true})
			} break;
		}
		async function createDoc(radio: string) {
			return await prisma.stick.create({
				data: {
					channelid: fetchUser.voice.channel?.id!,
					guildid: ctx.guild.id,
					radio: radio
				}
			})
		}
	},
});