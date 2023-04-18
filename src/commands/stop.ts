import {
    CommandInteraction,
    ApplicationCommandType,
    GuildMember,
} from 'discord.js'
import { Command } from '../command'
import { stopPlayer } from '../music'
import { BotInstance } from '../bot'
import { UNKNOWN_ERROR } from '../errors'

export const Stop: Command = {
    name: 'stop',
    description: 'Stops MusicBot from playing and clears the queue',
    type: ApplicationCommandType.ChatInput,
    run: async (botInstance: BotInstance, interaction: CommandInteraction) => {
        const member = interaction.member as GuildMember

        try {
            if (member.voice && member.voice.channelId && interaction.guildId) {
                const stopPlayerParams = {
                    manager: botInstance.musicManager,
                    guildId: interaction.guildId,
                    channelId: member.voice.channelId,
                }

                await stopPlayer(stopPlayerParams)

                const content = 'MusicBot has stopped'

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
        } catch (e: unknown) {
            console.error(UNKNOWN_ERROR, e)
        }
    },
}
