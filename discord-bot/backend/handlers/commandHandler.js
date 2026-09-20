const fs = require('fs');
const path = require('path');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

module.exports = (client) => {
  client.commands = new Map();
  
  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    client.commands.set(command.data.name, command);
  }

  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
  });
};