const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Mock user data - in a real implementation this would be from a database
const users = [
  {
    id: 'user-123',
    discordId: '123456789012345678',
    username: 'TestUser',
    discriminator: '1234',
    avatar: 'avatar_hash',
    guilds: [
      {
        id: 'guild-123456789',
        name: 'Test Server',
        permissions: 2147483647, // Administrator permission
        owner: true
      }
    ]
  }
];

// OAuth2 login route
router.get('/login', (req, res) => {
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI)}&response_type=code&scope=identify%20guilds`;
  
  res.redirect(discordAuthUrl);
});

// OAuth2 callback route
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }
  
  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', 
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    const accessToken = tokenResponse.data.access_token;
    
    // Get user information from Discord API
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const userData = userResponse.data;
    
    // In a real implementation, we would check if this user exists in our database
    // and create/update their record here
    
    // Generate JWT token for the dashboard
    const token = jwt.sign(
      { 
        userId: userData.id,
        username: userData.username,
        discriminator: userData.discriminator,
        avatar: userData.avatar
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Redirect to dashboard with token
    res.redirect(`${process.env.DASHBOARD_URL}?token=${token}`);
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Get user guilds
router.get('/guilds', authenticateToken, async (req, res) => {
  try {
    // In a real implementation, this would fetch the actual guilds from Discord API
    // For now, we'll return mock data
    
    const user = users.find(u => u.discordId === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      guilds: user.guilds
    });
  } catch (error) {
    console.error('Error fetching guilds:', error);
    res.status(500).json({ error: 'Failed to fetch guilds' });
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

module.exports = router;