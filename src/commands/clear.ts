import {
    CommandInteraction,
    ApplicationCommandType,
    GuildMember,
} from 'discord.js'
import { Command } from '../command'
import { songQueues, clearQueue } from '../music'
import { BotInstance } from '../bot'
import { getErrorEmbed, getSuccessEmbed } from '../embeds'

export const Clear: Command = {
    name: 'clear',
    description: 'Clears the queue',
    type: ApplicationCommandType.ChatInput,
    run: async (botInstance: BotInstance, interaction: CommandInteraction) => {
        const member = interaction.member as GuildMember
        if (!interaction.guildId || !member.voice.channelId) return

        // There must be a song in queue
        if (!songQueues[interaction.guildId].length) {
            const description =
                'The queue is already empty. To add a song to queue, use /play'
            const errorEmbed = getErrorEmbed(description)

            await interaction.followUp({
                ephemeral: true,
                embeds: [errorEmbed],
            })
        }

        // Otherwise clear queue
        const clearQueueParams = {
            manager: botInstance.musicManager,
            guildId: interaction.guildId,
        }

        await clearQueue(clearQueueParams)

        const description = 'The queue has been cleared'
        const successEmbed = getSuccessEmbed(description)

        await interaction.followUp({
            ephemeral: true,
            embeds: [successEmbed],
        })
    },
}
