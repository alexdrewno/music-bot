import {
    CommandInteraction,
    ApplicationCommandType,
    GuildMember,
} from 'discord.js'
import { Command } from '../command'
import { songQueue, clearQueue } from '../music'
import { BotInstance } from '../bot'

export const Clear: Command = {
    name: 'clear',
    description: 'Clears the queue',
    type: ApplicationCommandType.ChatInput,
    run: async (botInstance: BotInstance, interaction: CommandInteraction) => {
        if (!songQueue.length) {
            const content =
                'The queue is already empty. To add a song to queue, use /play'

            await interaction.followUp({
                ephemeral: true,
                content,
            })
        }

        const member = interaction.member as GuildMember

        if (member.voice && member.voice.channelId && interaction.guildId) {
            const clearQueueParams = {
                manager: botInstance.musicManager,
                guildId: interaction.guildId,
                channelId: member.voice.channelId,
            }

            await clearQueue(clearQueueParams)

            const content = 'The queue has been cleared'

            await interaction.followUp({
                ephemeral: true,
                content,
            })
        } else {
            const content = 'User must be in a channel'
            await interaction.followUp({
                ephemeral: true,
                content,
            })
        }
    },
}
