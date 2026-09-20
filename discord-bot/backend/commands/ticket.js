const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Ticket system commands')
    .addSubcommand(subcommand =>
      subcommand
        .setName('open')
        .setDescription('Open a new ticket'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('close')
        .setDescription('Close the current ticket'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add a user to the ticket')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('The user to add')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a user from the ticket')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('The user to remove')
            .setRequired(true))),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    
    switch (subcommand) {
      case 'open':
        // Implementation for opening ticket
        await interaction.reply({ content: 'Ticket opened!', ephemeral: true });
        break;
      case 'close':
        // Implementation for closing ticket
        await interaction.reply({ content: 'Ticket closed!', ephemeral: true });
        break;
      case 'add':
        // Implementation for adding user to ticket
        const user = interaction.options.getUser('user');
        await interaction.reply({ content: `Added ${user.tag} to ticket!`, ephemeral: true });
        break;
      case 'remove':
        // Implementation for removing user from ticket
        const removeUser = interaction.options.getUser('user');
        await interaction.reply({ content: `Removed ${removeUser.tag} from ticket!`, ephemeral: true });
        break;
    }
  },
};