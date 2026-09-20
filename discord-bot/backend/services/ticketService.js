const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Tenant = require('../models/Tenant');

class TicketService {
  constructor(client) {
    this.client = client;
  }

  // Create a ticket embed with customizable options
  createTicketEmbed(tenantSettings) {
    const embed = new EmbedBuilder()
      .setTitle(tenantSettings.settings.ticket.embedTitle)
      .setDescription(tenantSettings.settings.ticket.embedDescription)
      .setColor(tenantSettings.settings.ticket.embedColor);

    if (tenantSettings.settings.ticket.image) {
      embed.setImage(tenantSettings.settings.ticket.image);
    }

    return embed;
  }

  // Create ticket button
  createTicketButton(tenantSettings) {
    const button = new ButtonBuilder()
      .setCustomId('create_ticket')
      .setLabel(tenantSettings.settings.ticket.buttonLabel)
      .setStyle(ButtonStyle.Primary);

    return button;
  }

  // Create a ticket channel
  async createTicketChannel(guild, user, category, tenantId) {
    try {
      const ticketNumber = await this.getTicketNumber(tenantId);
      
      const channel = await guild.channels.create({
        name: `ticket-${ticketNumber}`,
        type: 0, // Text channel
        parent: category,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: ['ViewChannel'],
          },
          {
            id: user.id,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
          },
        ],
      });

      return channel;
    } catch (error) {
      console.error('Error creating ticket channel:', error);
      throw error;
    }
  }

  // Get next ticket number
  async getTicketNumber(tenantId) {
    try {
      const tenant = await Tenant.findById(tenantId);
      if (!tenant) {
        return 1;
      }
      
      // In a real implementation, this would increment and save the ticket number
      // For now, we'll just return a placeholder
      return Math.floor(Math.random() * 1000) + 1;
    } catch (error) {
      console.error('Error getting ticket number:', error);
      return 1;
    }
  }

  // Handle ticket creation
  async handleTicketCreation(interaction, tenantId) {
    try {
      const tenant = await Tenant.findById(tenantId);
      if (!tenant || !tenant.settings.ticket.enabled) {
        await interaction.reply({ content: 'Ticket system is disabled.', ephemeral: true });
        return;
      }

      // Get the ticket category from settings or use default
      let category = null;
      if (tenant.settings.ticket.categoryId) {
        category = interaction.guild.channels.cache.get(tenant.settings.ticket.categoryId);
      }
      
      if (!category) {
        // Create a new category if none exists
        category = await interaction.guild.channels.create({
          name: 'Tickets',
          type: 4, // Category channel
        });
        
        // Save the category ID to tenant settings
        tenant.settings.ticket.categoryId = category.id;
        await tenant.save();
      }

      const ticketChannel = await this.createTicketChannel(
        interaction.guild,
        interaction.user,
        category,
        tenantId
      );

      const embed = this.createTicketEmbed(tenant);
      const button = this.createTicketButton(tenant);

      const row = new ActionRowBuilder().addComponents(button);

      await ticketChannel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [embed],
        components: [row]
      });

      await interaction.reply({ 
        content: `Your ticket has been created in ${ticketChannel.toString()}`, 
        ephemeral: true 
      });
    } catch (error) {
      console.error('Error handling ticket creation:', error);
      await interaction.reply({ content: 'There was an error creating your ticket.', ephemeral: true });
    }
  }

  // Handle ticket closing
  async closeTicket(interaction, tenantId) {
    try {
      const tenant = await Tenant.findById(tenantId);
      if (!tenant || !tenant.settings.ticket.enabled) {
        await interaction.reply({ content: 'Ticket system is disabled.', ephemeral: true });
        return;
      }

      // Check if the channel is a ticket channel
      if (!interaction.channel.name.startsWith('ticket-')) {
        await interaction.reply({ content: 'This is not a ticket channel.', ephemeral: true });
        return;
      }

      // Archive the ticket (in real implementation, this would save to database)
      await interaction.reply({ content: 'Ticket closed.' });
      
      // In a real implementation, we might set a timeout to delete the channel
      setTimeout(async () => {
        try {
          await interaction.channel.delete();
        } catch (error) {
          console.error('Error deleting ticket channel:', error);
        }
      }, 30000); // Delete after 30 seconds
    } catch (error) {
      console.error('Error closing ticket:', error);
      await interaction.reply({ content: 'There was an error closing the ticket.', ephemeral: true });
    }
  }

  // Add user to ticket
  async addUserToTicket(interaction, targetUser, tenantId) {
    try {
      const tenant = await Tenant.findById(tenantId);
      if (!tenant || !tenant.settings.ticket.enabled) {
        await interaction.reply({ content: 'Ticket system is disabled.', ephemeral: true });
        return;
      }

      // Check if the channel is a ticket channel
      if (!interaction.channel.name.startsWith('ticket-')) {
        await interaction.reply({ content: 'This is not a ticket channel.', ephemeral: true });
        return;
      }

      await interaction.channel.permissionOverwrites.create(targetUser, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true
      });

      await interaction.reply({ 
        content: `Added ${targetUser.tag} to the ticket.`, 
        ephemeral: true 
      });
    } catch (error) {
      console.error('Error adding user to ticket:', error);
      await interaction.reply({ content: 'There was an error adding the user to the ticket.', ephemeral: true });
    }
  }

  // Remove user from ticket
  async removeUserFromTicket(interaction, targetUser, tenantId) {
    try {
      const tenant = await Tenant.findById(tenantId);
      if (!tenant || !tenant.settings.ticket.enabled) {
        await interaction.reply({ content: 'Ticket system is disabled.', ephemeral: true });
        return;
      }

      // Check if the channel is a ticket channel
      if (!interaction.channel.name.startsWith('ticket-')) {
        await interaction.reply({ content: 'This is not a ticket channel.', ephemeral: true });
        return;
      }

      await interaction.channel.permissionOverwrites.delete(targetUser);

      await interaction.reply({ 
        content: `Removed ${targetUser.tag} from the ticket.`, 
        ephemeral: true 
      });
    } catch (error) {
      console.error('Error removing user from ticket:', error);
      await interaction.reply({ content: 'There was an error removing the user from the ticket.', ephemeral: true });
    }
  }

  // Update tenant settings for tickets
  async updateTicketSettings(tenantId, settings) {
    try {
      const tenant = await Tenant.findById(tenantId);
      if (!tenant) {
        throw new Error('Tenant not found');
      }

      // Merge the new settings with existing ones
      Object.assign(tenant.settings.ticket, settings);
      await tenant.save();

      return tenant;
    } catch (error) {
      console.error('Error updating ticket settings:', error);
      throw error;
    }
  }

  // Get ticket categories for a tenant
  async getTicketCategories(tenantId) {
    try {
      const tenant = await Tenant.findById(tenantId);
      if (!tenant) {
        return [];
      }

      return tenant.settings.ticket.categories || [];
    } catch (error) {
      console.error('Error getting ticket categories:', error);
      return [];
    }
  }

  // Add a new ticket category
  async addTicketCategory(tenantId, categoryName, roleId = null) {
    try {
      const tenant = await Tenant.findById(tenantId);
      if (!tenant) {
        throw new Error('Tenant not found');
      }

      const categoryId = `cat-${Date.now()}`;
      const newCategory = {
        id: categoryId,
        name: categoryName,
        roleId: roleId
      };

      tenant.settings.ticket.categories.push(newCategory);
      await tenant.save();

      return newCategory;
    } catch (error) {
      console.error('Error adding ticket category:', error);
      throw error;
    }
  }

  // Remove a ticket category
  async removeTicketCategory(tenantId, categoryId) {
    try {
      const tenant = await Tenant.findById(tenantId);
      if (!tenant) {
        throw new Error('Tenant not found');
      }

      tenant.settings.ticket.categories = tenant.settings.ticket.categories.filter(
        cat => cat.id !== categoryId
      );
      
      await tenant.save();

      return true;
    } catch (error) {
      console.error('Error removing ticket category:', error);
      throw error;
    }
  }
}

module.exports = TicketService;