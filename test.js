const discord = require('discord.js')

const comp = new discord.ActionRowBuilder()
.addComponents(
	new discord.ButtonBuilder()
	.setLabel("a")
	.setCustomId("b")
	.setStyle(discord.ButtonStyle.Primary)
)

console.log(JSON.stringify(comp))