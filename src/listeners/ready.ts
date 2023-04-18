import { Commands } from '../commands'
import { BotInstance } from '../bot'

export default (botInstance: BotInstance): void => {
    botInstance.discordClient.on('ready', async () => {
        if (
            !botInstance.discordClient.user ||
            !botInstance.discordClient.application
        ) {
            return
        }

        await botInstance.discordClient.application.commands.set(Commands)

        console.log(`${botInstance.discordClient.user.username} is online`)
    })
}
