import { CommandInteraction, ChatInputApplicationCommandData } from 'discord.js'
import { BotInstance } from './bot'

export interface Command extends ChatInputApplicationCommandData {
    run: (
        botInstance: BotInstance,
        interaction: CommandInteraction
    ) => Promise<void>
}
