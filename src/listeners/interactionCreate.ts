import { CommandInteraction, GuildMember, Interaction } from 'discord.js'
import { Commands } from '../commands'
import { BotInstance } from '../bot'
import { UNKNOWN_ERROR, USER_MUST_BE_IN_CHANNEL } from '../errors'
import { getErrorEmbed } from '../embeds'

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

    const member = interaction.member as GuildMember

    // User must be in channel
    if (!member.voice || !member.voice.channelId || !interaction.guildId) {
        const errorEmbed = getErrorEmbed(USER_MUST_BE_IN_CHANNEL)
        await interaction.followUp({
            ephemeral: true,
            embeds: [errorEmbed],
        })
        return
    }

    try {
        await interaction.deferReply()
        await slashCommand.run(botInstance, interaction)
    } catch (e) {
        console.error(UNKNOWN_ERROR, e)
    }
}
