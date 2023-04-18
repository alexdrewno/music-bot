import {
    CommandInteraction,
    ApplicationCommandType,
    GuildMember,
} from 'discord.js'
import { Command } from '../command'
import { songQueue, playNextSong } from '../music'
import { BotInstance } from '../bot'

export const Skip: Command = {
    name: 'skip',
    description: 'Skip the current song',
    type: ApplicationCommandType.ChatInput,
    run: async (botInstance: BotInstance, interaction: CommandInteraction) => {
        if (!songQueue.length) {
            const content =
                'MusicBot is currently not playing. To add a song to queue, use /play'

            await interaction.followUp({
                ephemeral: true,
                content,
            })
            return
        }

        const member = interaction.member as GuildMember

        if (member.voice && member.voice.channelId && interaction.guildId) {
            const skipSongParams = {
                manager: botInstance.musicManager,
                guildId: interaction.guildId,
                channelId: member.voice.channelId,
            }

            const skippedSong = await playNextSong(skipSongParams)

            const content = 'Skipped song: ' + skippedSong?.info.title

            await interaction.followUp({
                ephemeral: true,
                content,
            })
        } else {
            const content = 'User must be in a channel.'
            await interaction.followUp({
                ephemeral: true,
                content,
            })
        }
    },
}
