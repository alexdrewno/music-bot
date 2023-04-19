import { EmbedBuilder } from 'discord.js'
import { TrackData } from 'lavacord'

type EmbedField = {
    name: string
    value: string
}

type CreateEmbedParams = {
    title: string
    description: string
    extraFields?: EmbedField[] | undefined
    color?: number
}

const ICON_URL = 'https://cdn.discordapp.com/embed/avatars/0.png'

export function getSongQueueEmbed(title: string, songQueue: TrackData[]) {
    let queueListString = 'Queue is empty'

    if (songQueue.length) {
        queueListString = _getQueueListString(songQueue)
    }

    const nowPlayingSongTitle = 'Now playing: ' + songQueue[0].info.title
    const extraFields = [
        {
            name: 'Queue',
            value: queueListString,
        },
    ]

    const createEmbedParams = {
        title,
        description: nowPlayingSongTitle,
        extraFields,
    }

    return _createEmbed(createEmbedParams)
}

export function getStopPlayingEmbed() {
    const title = '👋 Goodbye!'
    const description =
        'If you want me to come back, just add another song to the queue'

    const createEmbedParams = {
        title,
        description,
    }
    return _createEmbed(createEmbedParams)
}

export function getErrorEmbed(description: string) {
    const title = 'Oops'
    const color = 0xff2015

    const createEmbedParams = {
        title,
        description,
        color,
    }
    return _createEmbed(createEmbedParams)
}

export function getSuccessEmbed(description: string) {
    const title = '✔️ Done'
    const color = 0x77dd77

    const createEmbedParams = {
        title,
        description,
        color,
    }
    return _createEmbed(createEmbedParams)
}

function _getQueueListString(songQueue: TrackData[]) {
    return songQueue
        .map((trackData, i) => `${i + 1}. ${trackData.info.title}`)
        .join('\n')
}

function _createEmbed({
    title,
    description,
    extraFields,
    color,
}: CreateEmbedParams) {
    const EMBED_COLOR = 0x0099ff

    const exampleEmbed = new EmbedBuilder()
        .setColor(color ?? EMBED_COLOR)
        .setTitle(title)
        .setAuthor({
            name: 'MusicBot',
            iconURL: ICON_URL,
        })
        .setDescription(description)
        .setTimestamp()
        .setThumbnail(ICON_URL)

    if (extraFields) {
        exampleEmbed.addFields(extraFields)
    }

    return exampleEmbed
}
