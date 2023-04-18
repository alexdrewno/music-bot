import { Client } from 'discord.js'
import { Rest, TrackData, LavalinkEvent } from 'lavacord'
import { Manager } from '@lavacord/discord.js'
import {
    LAVALINK_HOST,
    LAVALINK_NODE_ID,
    LAVALINK_PASSWORD,
    LAVALINK_PORT,
} from './config/lavalink'

export let songQueue: TrackData[] = []
const DEFAULT_VOLUME = 60

export type AddSongParams = {
    manager: Manager
    guildId: string
    channelId: string
    trackData: TrackData
}

export type ManagerParams = {
    manager: Manager
    guildId: string
    channelId: string
}

export async function initManager(client: Client) {
    // Define the nodes array as an example
    const nodes = [
        {
            id: LAVALINK_NODE_ID,
            host: LAVALINK_HOST,
            port: LAVALINK_PORT,
            password: LAVALINK_PASSWORD,
        },
    ]

    const manager = new Manager(client, nodes, { user: '1096889907185717288' })

    // Connects all the LavalinkNode WebSockets
    await manager.connect()

    // The error event, which you should handle otherwise your application will crash when an error is emitted
    manager.on('error', (error, node) => {
        console.error(error, node)
    })

    return manager
}

export async function searchSongs(manager: Manager, search: string) {
    // This gets the best node available, what I mean by that is the idealNodes getter will filter all the connected nodes and then sort them from best to least beast.
    try {
        const ytSearch = 'ytsearch:' + search
        const node = manager.idealNodes[0]
        const data = await Rest.load(node, ytSearch)

        if (data.tracks) {
            return data.tracks[0]
        }

        return
    } catch (e) {
        console.error(e)
        return
    }
}

export async function startPlayer({
    manager,
    guildId,
    channelId,
}: ManagerParams) {
    try {
        const player = await manager.join({
            guild: guildId,
            channel: channelId,
            node: LAVALINK_NODE_ID,
        })

        await player.play(songQueue[0].track, {
            volume: DEFAULT_VOLUME,
        })

        player.once('error', (error: unknown) => console.error(error))
        player.once('end', async (data: LavalinkEvent) => {
            if (data.type === 'TrackEndEvent' && data.reason === 'REPLACED')
                return // Ignore REPLACED reason to prevent skip loops

            // Remove the song from queue
            songQueue = songQueue.slice(1)

            // If there are still songs in the queue, play the next
            if (songQueue.length) {
                await player.play(songQueue[0].track, {
                    volume: DEFAULT_VOLUME,
                })
            } else {
                // Otherwise leave the server
                await manager.leave(guildId) // Player ID aka guild id
            }
        })
    } catch (e) {
        console.error('ERROR IN PLAY SONG:', e)
    }
}

export async function addSongToQueue({
    manager,
    guildId,
    channelId,
    trackData,
}: AddSongParams) {
    songQueue.push(trackData)
    if (songQueue.length === 1) {
        const startPlayerParams = { manager, guildId, channelId }
        await startPlayer(startPlayerParams)
    }
}

export async function playNextSong({
    manager,
    guildId,
    channelId,
}: ManagerParams): Promise<TrackData | undefined> {
    if (!songQueue.length) return

    const player = await manager.join({
        guild: guildId,
        channel: channelId,
        node: LAVALINK_NODE_ID,
    })

    const songToSkip = songQueue[0]

    // Go to the end of the song
    await player.seek(songQueue[0].info.length)

    // Added a pause so the player does not leave right away if no other songs
    await player.pause(true)

    // Remove the song from queue
    songQueue = songQueue.slice(1)

    // If there are still songs in the queue, play the next
    if (songQueue.length) {
        console.log(songQueue[0])
        await player.play(songQueue[0].track, {
            volume: DEFAULT_VOLUME,
        })
    }

    return songToSkip
}

export async function clearQueue({
    manager,
    guildId,
    channelId,
}: ManagerParams) {
    const player = await manager.join({
        guild: guildId,
        channel: channelId,
        node: LAVALINK_NODE_ID,
    })

    // Go to the end of the song
    await player.seek(songQueue[0].info.length)

    // Added a pause so the player does not leave right away if no other songs
    await player.pause(true)

    songQueue = []
}

export async function stopPlayer({
    manager,
    guildId,
    channelId,
}: ManagerParams) {
    const player = await manager.join({
        guild: guildId,
        channel: channelId,
        node: LAVALINK_NODE_ID,
    })

    const clearQueueParams = {
        manager,
        guildId,
        channelId,
    }

    if (songQueue.length) {
        clearQueue(clearQueueParams)
    }

    await player.stop()
}
