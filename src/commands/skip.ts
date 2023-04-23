import {
    CommandInteraction,
    ApplicationCommandType,
    GuildMember,
} from 'discord.js'
import { Command } from '../command'
import { songQueues, playNextSong } from '../music'
import { BotInstance } from '../bot'
import { getErrorEmbed, getSuccessEmbed } from '../embeds'
import { USER_MUST_BE_IN_CHANNEL } from '../errors'

export const Skip: Command = {
    name: 'skip',
    description: 'Skip the current song',
    type: ApplicationCommandType.ChatInput,
    run: async (botInstance: BotInstance, interaction: CommandInteraction) => {
        const member = interaction.member as GuildMember

        // User must be in channel
        if (!member.voice || !member.voice.channelId || !interaction.guildId) {
            const errorEmbed = getErrorEmbed(USER_MUST_BE_IN_CHANNEL)
            await interaction.followUp({
                ephemeral: true,
                embeds: [errorEmbed],
            })
            return
        }

        // A song must be playing
        if (!songQueues[interaction.guildId].length) {
            const description =
                'MusicBot is currently not playing. To add a song to queue, use /play'
            const errorEmbed = getErrorEmbed(description)

            await interaction.followUp({
                ephemeral: true,
                embeds: [errorEmbed],
            })
            return
        }

        // Skip the song
        const skipSongParams = {
            manager: botInstance.musicManager,
            guildId: interaction.guildId,
            channelId: member.voice.channelId,
        }

        const skippedSong = await playNextSong(skipSongParams)
        const description = 'Skipped song: ' + skippedSong?.info.title
        const successEmbed = getSuccessEmbed(description)

        await interaction.followUp({
            ephemeral: true,
            embeds: [successEmbed],
        })
    },
}
