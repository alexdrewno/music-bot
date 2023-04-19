import {
    CommandInteraction,
    ApplicationCommandType,
    GuildMember,
} from 'discord.js'
import { Command } from '../command'
import { stopPlayer } from '../music'
import { BotInstance } from '../bot'
import { UNKNOWN_ERROR, USER_MUST_BE_IN_CHANNEL } from '../errors'
import { getErrorEmbed, getStopPlayingEmbed } from '../embeds'

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
                }

                await stopPlayer(stopPlayerParams)

                const stopPlayingEmbed = getStopPlayingEmbed()

                await interaction.followUp({
                    ephemeral: true,
                    embeds: [stopPlayingEmbed],
                })
            } else {
                const errorEmbed = getErrorEmbed(USER_MUST_BE_IN_CHANNEL)

                await interaction.followUp({
                    ephemeral: true,
                    embeds: [errorEmbed],
                })
            }
        } catch (e: unknown) {
            console.error(UNKNOWN_ERROR, e)
        }
    },
}
