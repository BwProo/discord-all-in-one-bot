const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to kick')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the kick')),
  async execute(interaction) {
    try {
      const user = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason') || 'No reason provided';
      
      // Check if the user has permission to kick
      if (!interaction.member.permissions.has('KickMembers')) {
        await interaction.reply({ content: 'You do not have permission to kick members.', ephemeral: true });
        return;
      }
      
      // Check if the bot can kick
      if (!interaction.guild.members.me.permissions.has('KickMembers')) {
        await interaction.reply({ content: 'I do not have permission to kick members.', ephemeral: true });
        return;
      }
      
      // Kick the user
      await interaction.guild.members.kick(user, reason);
      
      await interaction.reply({ 
        content: `Successfully kicked ${user.tag} for: ${reason}`, 
        ephemeral: true 
      });
    } catch (error) {
      console.error('Error executing kick command:', error);
      await interaction.reply({ content: 'There was an error kicking this user!', ephemeral: true });
    }
  },
};