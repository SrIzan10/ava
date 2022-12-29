import { commandModule, CommandType } from '@sern/handler';
import { publish } from '../plugins/publish.js';
import { getVoiceConnection } from '@discordjs/voice'
import type { GuildMember } from 'discord.js';

export default commandModule({
    type: CommandType.Slash,
    plugins: [publish()],
    description: 'Stop the radio of that guild',
    options: [],
    execute: async (ctx, options) => {
        const fetchUser = await (await ctx.client.guilds.fetch(ctx.guild!.id)).members.fetch(ctx.user.id) as GuildMember
        const fetchBot = await (await ctx.client.guilds.fetch(ctx.guild!.id)).members.fetch(ctx.client.user!.id) as GuildMember
        
        if (fetchUser.voice.channel?.id !== fetchBot.voice.channel?.id) 
            return await ctx.reply({
                content: 'You are not in the same VC as me or I\'m not on a VC in this discord server.',
                ephemeral: true
            })

        const connection = getVoiceConnection(ctx.guild!.id)
        connection!.destroy()

        await ctx.reply({
            content: 'Radio stopped successfully!',
            ephemeral: true
        })
    },
});