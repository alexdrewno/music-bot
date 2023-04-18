const DEFAULT_LAVALINK_PORT = '2333'

export const LAVALINK_NODE_ID = process.env.LAVALINK_NODE_ID ?? ''
export const LAVALINK_HOST = process.env.LAVALINK_HOST ?? ''
export const LAVALINK_PORT = parseInt(
    process.env.LAVALINK_PORT ?? DEFAULT_LAVALINK_PORT
)
export const LAVALINK_PASSWORD = process.env.LAVALINK_PASSWORD ?? ''
