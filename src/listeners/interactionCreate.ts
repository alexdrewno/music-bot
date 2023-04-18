import { CommandInteraction, Interaction } from 'discord.js'
import { Commands } from '../commands'
import { BotInstance } from '../bot'
import { UNKNOWN_ERROR } from '../errors'

export default (botInstance: BotInstance): void => {
    botInstance.discordClient.on(
        'interactionCreate',
        async (interaction: Interaction) => {
            if (interaction.isCommand() || interaction.isContextMenuCommand()) {
                await handleSlashCommand(botInstance, interaction)
            }
        }
    )
}

const handleSlashCommand = async (
    botInstance: BotInstance,
    interaction: CommandInteraction
): Promise<void> => {
    const slashCommand = Commands.find(
        (c) => c.name === interaction.commandName
    )
    if (!slashCommand) {
        interaction.followUp({ content: 'An error has occurred' })
        return
    }

    try {
        await interaction.deferReply()

        await slashCommand.run(botInstance, interaction)
    } catch (e) {
        console.error(UNKNOWN_ERROR, e)
    }
}
