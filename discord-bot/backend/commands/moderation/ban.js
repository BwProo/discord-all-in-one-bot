const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to ban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the ban')),
  async execute(interaction) {
    try {
      const user = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason') || 'No reason provided';
      
      // Check if the user has permission to ban
      if (!interaction.member.permissions.has('BanMembers')) {
        await interaction.reply({ content: 'You do not have permission to ban members.', ephemeral: true });
        return;
      }
      
      // Check if the bot can ban
      if (!interaction.guild.members.me.permissions.has('BanMembers')) {
        await interaction.reply({ content: 'I do not have permission to ban members.', ephemeral: true });
        return;
      }
      
      // Ban the user
      await interaction.guild.members.ban(user, { reason });
      
      await interaction.reply({ 
        content: `Successfully banned ${user.tag} for: ${reason}`, 
        ephemeral: true 
      });
    } catch (error) {
      console.error('Error executing ban command:', error);
      await interaction.reply({ content: 'There was an error banning this user!', ephemeral: true });
    }
  },
};