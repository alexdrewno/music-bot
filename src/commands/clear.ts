import {
    CommandInteraction,
    ApplicationCommandType,
    GuildMember,
} from 'discord.js'
import { Command } from '../command'
import { songQueue, clearQueue } from '../music'
import { BotInstance } from '../bot'
import { getErrorEmbed, getSuccessEmbed } from '../embeds'
import { USER_MUST_BE_IN_CHANNEL } from '../errors'

export const Clear: Command = {
    name: 'clear',
    description: 'Clears the queue',
    type: ApplicationCommandType.ChatInput,
    run: async (botInstance: BotInstance, interaction: CommandInteraction) => {
        if (!songQueue.length) {
            const description =
                'The queue is already empty. To add a song to queue, use /play'
            const errorEmbed = getErrorEmbed(description)

            await interaction.followUp({
                ephemeral: true,
                embeds: [errorEmbed],
            })
        }

        const member = interaction.member as GuildMember

        if (member.voice && member.voice.channelId && interaction.guildId) {
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
        } else {
            const errorEmbed = getErrorEmbed(USER_MUST_BE_IN_CHANNEL)

            await interaction.followUp({
                ephemeral: true,
                embeds: [errorEmbed],
            })
        }
    },
}
