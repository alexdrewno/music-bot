import {
    CommandInteraction,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    GuildMember,
} from 'discord.js'
import { Command } from '../command'
import {
    SONG_QUEUE,
    addSongToQueue,
    clearQueue,
    playNextSong,
    searchSongs,
    stopPlayer,
} from '../music'
import { TrackData } from 'lavacord'

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
    run: async (client: any, interaction: CommandInteraction) => {
        const searchQuery = interaction.options.data[0].value

        const trackResult = await searchSongs(client.manager, searchQuery)
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

        if (member.voice && member.voice.channelId) {
            await addSongToQueue(
                client.manager,
                interaction.guildId,
                member.voice.channelId,
                trackData
            )
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
            SONG_QUEUE.map((song) => {
                return song.info.title
            }).join('\n')

        await interaction.followUp({
            ephemeral: true,
            content,
        })
    },
}

export const Skip: Command = {
    name: 'skip',
    description: 'Skip the current song',
    type: ApplicationCommandType.ChatInput,
    run: async (client: any, interaction: CommandInteraction) => {
        if (!SONG_QUEUE.length) {
            const content =
                'MusicBot is currently not playing. To add a song to queue, use /play'

            await interaction.followUp({
                ephemeral: true,
                content,
            })
        }

        const member = interaction.member as GuildMember

        if (member.voice && member.voice.channelId) {
            const skippedSong = await playNextSong(
                client.manager,
                interaction.guildId,
                member.voice.channelId
            )

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

export const Clear: Command = {
    name: 'clear',
    description: 'Clears the queue',
    type: ApplicationCommandType.ChatInput,
    run: async (client: any, interaction: CommandInteraction) => {
        if (!SONG_QUEUE.length) {
            const content =
                'The queue is already empty. To add a song to queue, use /play'

            await interaction.followUp({
                ephemeral: true,
                content,
            })
        }

        const member = interaction.member as GuildMember

        if (member.voice && member.voice.channelId) {
            clearQueue()

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

export const Stop: Command = {
    name: 'stop',
    description: 'Stops MusicBot from playing and clears the queue',
    type: ApplicationCommandType.ChatInput,
    run: async (client: any, interaction: CommandInteraction) => {
        const member = interaction.member as GuildMember

        if (member.voice && member.voice.channelId) {
            await stopPlayer(
                client.manager,
                interaction.guildId,
                member.voice.channelId
            )

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
    },
}
