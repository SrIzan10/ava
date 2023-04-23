import { commandModule, CommandType } from '@sern/handler';
import { publish } from '../plugins/publish.js';
import { prisma } from '../index.js';
import { getVoiceConnection } from '@discordjs/voice'

export default commandModule({
    type: CommandType.Slash,
    plugins: [publish({defaultMemberPermissions: 'ManageGuild'})],
    description: 'Unstick the sticking',
    options: [],
    execute: async (ctx, options) => {
        const countDocs = await prisma.stick.count({
			where: {
				guildid: ctx.guild!.id
			}
		})
		if (countDocs === 0)
			return await ctx.reply({
				content: 'You can\'t unstick if the bot isn\'t sticked!',
				ephemeral: true
			})
        
        await prisma.stick.deleteMany({
            where: {
                guildid: ctx.guild!.id
            }
        })
        const connection = getVoiceConnection(ctx.guild!.id)
        connection!.destroy()

        await ctx.reply({
            content: 'Unsticked and left the VC successfully!',
            ephemeral: true
        })
    },
});