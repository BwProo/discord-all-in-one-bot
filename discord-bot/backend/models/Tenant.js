const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  ownerId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  features: {
    ticketSystem: {
      enabled: { type: Boolean, default: true }
    },
    moderation: {
      enabled: { type: Boolean, default: true }
    },
    welcome: {
      enabled: { type: Boolean, default: true }
    },
    leveling: {
      enabled: { type: Boolean, default: true }
    },
    utility: {
      enabled: { type: Boolean, default: true }
    },
    admin: {
      enabled: { type: Boolean, default: true }
    }
  },
  settings: {
    // General settings
    prefix: { type: String, default: '!' },
    
    // Ticket system settings
    ticket: {
      embedTitle: { type: String, default: '🎟️ | Tickets' },
      embedDescription: { type: String, default: 'Erstelle ein Ticket für Support.' },
      embedColor: { type: String, default: '#0099ff' },
      buttonLabel: { type: String, default: 'Create Ticket' },
      categories: [{
        id: { type: String },
        name: { type: String },
        roleId: { type: String }
      }]
    },
    
    // Moderation settings
    moderation: {
      antiSpam: { type: Boolean, default: true },
      antiInvite: { type: Boolean, default: true },
      wordFilter: [{ type: String }],
      whitelistDomains: [{ type: String }]
    },
    
    // Welcome settings
    welcome: {
      message: { type: String, default: 'Willkommen auf dem Server!' },
      autoRole: { type: String }
    },
    
    // Leveling settings
    leveling: {
      xpPerMessage: { type: Number, default: 5 },
      currencyName: { type: String, default: 'Coins' },
      dailyReward: { type: Number, default: 100 }
    }
  }
});

module.exports = mongoose.model('Tenant', tenantSchema);