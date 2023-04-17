import { Client, WebSocketShard } from 'discord.js'
import { Rest, TrackData } from 'lavacord'
import { Manager } from '@lavacord/discord.js'

export let SONG_QUEUE: TrackData[] = []
const DEFAULT_VOLUME = 60

export async function initManager(client: any) {
    // Define the nodes array as an example
    const nodes = [
        { id: '1', host: 'localhost', port: 2333, password: 'youshallnotpass' },
    ]

    const manager = new Manager(client, nodes, { user: '1096889907185717288' })

    // Connects all the LavalinkNode WebSockets
    await manager.connect()

    // The error event, which you should handle otherwise your application will crash when an error is emitted
    manager.on('error', (error, node) => {
        console.error(error, node)
    })

    client.manager = manager
}

export async function searchSongs(manager: any, search: any) {
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

export async function startPlayer(
    manager: any,
    guildId: string,
    channelId: string
) {
    try {
        const player = await manager.join({
            guild: guildId, // Guild id
            channel: channelId, // Channel id
            node: '1', // lavalink node id, based on array of nodes
        })

        await player.play(SONG_QUEUE[0].track, {
            volume: DEFAULT_VOLUME,
        })

        player.once('error', (error: unknown) => console.error(error))
        player.once('end', async (data: any) => {
            if (data.type === 'TrackEndEvent' && data.reason === 'REPLACED')
                return // Ignore REPLACED reason to prevent skip loops

            // Remove the song from queue
            SONG_QUEUE = SONG_QUEUE.slice(1)

            // If there are still songs in the queue, play the next
            if (SONG_QUEUE.length) {
                await player.play(SONG_QUEUE[0].track, {
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

export async function addSongToQueue(
    manager: any,
    guildId: any,
    channelId: any,
    trackData: TrackData
) {
    SONG_QUEUE.push(trackData)
    console.log('CURRENT QUEUE: ', SONG_QUEUE)
    if (SONG_QUEUE.length === 1) {
        await startPlayer(manager, guildId, channelId)
    }
}

export async function playNextSong(
    manager: any,
    guildId: any,
    channelId: string
): Promise<TrackData | undefined> {
    if (!SONG_QUEUE.length) return

    const player = await manager.join({
        guild: guildId, // Guild id
        channel: channelId, // Channel id
        node: '1', // lavalink node id, based on array of nodes
    })

    const songToSkip = SONG_QUEUE[0]
    // Remove the song from queue
    SONG_QUEUE = SONG_QUEUE.slice(1)

    // If there are still songs in the queue, play the next
    if (SONG_QUEUE.length) {
        await player.play(SONG_QUEUE[0].track, {
            volume: DEFAULT_VOLUME,
        })
    } else {
        await player.stop()
    }

    return songToSkip
}

export function clearQueue() {
    SONG_QUEUE = []
}

export async function stopPlayer(
    manager: any,
    guildId: any,
    channelId: string
) {
    const player = await manager.join({
        guild: guildId, // Guild id
        channel: channelId, // Channel id
        node: '1', // lavalink node id, based on array of nodes
    })

    await player.stop()
    clearQueue()
}
