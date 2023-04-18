import {
    CommandInteraction,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    GuildMember,
} from 'discord.js'
import { Command } from '../command'
import { addSongToQueue, searchSongs, songQueue } from '../music'
import { TrackData } from 'lavacord'
import { BotInstance } from '../bot'

export const Play: Command = {
    name: 'play',
    description: 'Find and play a song from youtube',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: 'search',
            description: 'The song that you want to search for',
            required: true,
        },
    ],
    run: async (botInstance: BotInstance, interaction: CommandInteraction) => {
        const searchQuery = interaction.options.data[0].value as string

        const trackResult = await searchSongs(
            botInstance.musicManager,
            searchQuery
        )
        if (!trackResult) {
            const content =
                'Could not find song for search query: ' + searchQuery
            await interaction.followUp({
                ephemeral: true,
                content,
            })
        }

        const trackData = trackResult as TrackData

        const member = interaction.member as GuildMember

        if (member.voice && member.voice.channelId && interaction.guildId) {
            const addSongParams = {
                manager: botInstance.musicManager,
                guildId: interaction.guildId,
                channelId: member.voice.channelId,
                trackData,
            }

            await addSongToQueue(addSongParams)
        } else {
            const content = 'User must be in a channel.'
            await interaction.followUp({
                ephemeral: true,
                content,
            })
            return
        }

        // TODO make this embed
        const content =
            'Added to queue: ' +
            trackData.info.title +
            '\n\nCurrent queue:\n' +
            songQueue
                .map((song) => {
                    return song.info.title
                })
                .join('\n')

        await interaction.followUp({
            ephemeral: true,
            content,
        })
    },
}
