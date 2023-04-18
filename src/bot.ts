import { Client, GatewayIntentBits } from 'discord.js'
import ready from './listeners/ready'
import interactionCreate from './listeners/interactionCreate'
import { initManager } from './music'
import dotenv from 'dotenv'
import { Manager } from '@lavacord/discord.js'

console.log('MusicBot is starting...')

export type BotInstance = {
    discordClient: Client
    musicManager: Manager
}

if (!process.env.ENVIRONMENT || process.env.ENVIRONMENT === 'dev') {
    dotenv.config()
}

async function start() {
    const client = new Client({
        intents: [
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildPresences,
        ],
    })

    const manager = await initManager(client)

    const botInstance: BotInstance = {
        discordClient: client,
        musicManager: manager,
    }

    ready(botInstance)
    interactionCreate(botInstance)

    client.login(process.env.DISCORD_TOKEN)
}

start()
