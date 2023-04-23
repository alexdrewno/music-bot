import {
    CommandInteraction,
    ApplicationCommandType,
    GuildMember,
} from 'discord.js'
import { Command } from '../command'
import { stopPlayer } from '../music'
import { BotInstance } from '../bot'
import { getStopPlayingEmbed } from '../embeds'

export const Stop: Command = {
    name: 'stop',
    description: 'Stops MusicBot from playing and clears the queue',
    type: ApplicationCommandType.ChatInput,
    run: async (botInstance: BotInstance, interaction: CommandInteraction) => {
        const member = interaction.member as GuildMember
        if (!interaction.guildId || !member.voice.channelId) return

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
    },
}
