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
import { getErrorEmbed, getSongQueueEmbed } from '../embeds'
import { USER_MUST_BE_IN_CHANNEL } from '../errors'

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
            const description =
                'Could not find song for search query: ' + searchQuery
            const errorEmbed = getErrorEmbed(description)
            await interaction.followUp({
                ephemeral: true,
                embeds: [errorEmbed],
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
            const errorEmbed = getErrorEmbed(USER_MUST_BE_IN_CHANNEL)
            await interaction.followUp({
                ephemeral: true,
                embeds: [errorEmbed],
            })
            return
        }

        const embedTitle = `Added to queue: ${trackData.info.title}`
        const embed = getSongQueueEmbed(embedTitle, songQueue)

        await interaction.followUp({
            ephemeral: true,
            embeds: [embed],
        })
    },
}
