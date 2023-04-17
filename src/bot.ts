import { Client, GatewayIntentBits } from 'discord.js'
import ready from './listeners/ready'
import interactionCreate from './listeners/interactionCreate'
import { initManager } from './music'
import dotenv from 'dotenv'

console.log('MusicBot is starting...')

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

    ready(client)
    interactionCreate(client)

    await initManager(client)

    client.login(process.env.DISCORD_TOKEN)
}

start()
