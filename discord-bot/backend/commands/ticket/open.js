const { SlashCommandBuilder } = require('discord.js');
const TicketService = require('../../services/ticketService');

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
    
    // Get tenant ID from guild
    const tenantId = interaction.guild.id;
    
    try {
      switch (subcommand) {
        case 'open':
          // Initialize ticket service
          const ticketService = new TicketService(interaction.client);
          await ticketService.handleTicketCreation(interaction, tenantId);
          break;
        case 'close':
          const ticketServiceClose = new TicketService(interaction.client);
          await ticketServiceClose.closeTicket(interaction, tenantId);
          break;
        case 'add':
          const targetUser = interaction.options.getUser('user');
          const ticketServiceAdd = new TicketService(interaction.client);
          await ticketServiceAdd.addUserToTicket(interaction, targetUser, tenantId);
          break;
        case 'remove':
          const targetUserRemove = interaction.options.getUser('user');
          const ticketServiceRemove = new TicketService(interaction.client);
          await ticketServiceRemove.removeUserFromTicket(interaction, targetUserRemove, tenantId);
          break;
      }
    } catch (error) {
      console.error('Error executing ticket command:', error);
      await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
  },
};