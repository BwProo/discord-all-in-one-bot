import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import FeatureToggle from '../components/FeatureToggle';
import TicketSettings from '../components/ticket/TicketSettings';

const Dashboard = () => {
  const [activeFeature, setActiveFeature] = useState('overview');
  const [features, setFeatures] = useState({
    ticketSystem: true,
    moderation: true,
    welcome: true,
    leveling: true,
    utility: true,
    admin: true
  });
  const [tenantId, setTenantId] = useState('guild-123456789'); // Mock tenant ID

  useEffect(() => {
    // Load feature settings from API
    const loadSettings = async () => {
      try {
        // Mock data - in real implementation this would fetch from backend
        const mockSettings = {
          ticketSystem: true,
          moderation: true,
          welcome: false,
          leveling: true,
          utility: false,
          admin: true
        };
        setFeatures(mockSettings);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    loadSettings();
  }, []);

  const handleFeatureToggle = async (featureName, enabled) => {
    try {
      // Update feature status
      setFeatures(prev => ({
        ...prev,
        [featureName]: enabled
      }));
      
      // In real implementation this would send a request to backend
      console.log(`Updated ${featureName} to ${enabled}`);
    } catch (error) {
      console.error('Failed to update feature:', error);
    }
  };

  const handleSaveTicketSettings = async (settings) => {
    try {
      // In real implementation this would send to backend
      console.log('Saving ticket settings:', settings);
      alert('Ticket settings saved successfully!');
    } catch (error) {
      console.error('Failed to save ticket settings:', error);
      alert('Failed to save ticket settings');
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar activeFeature={activeFeature} setActiveFeature={setActiveFeature} />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Discord Bot Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Feature Overview</h2>
            <div className="space-y-4">
              {Object.entries(features).map(([feature, enabled]) => (
                <FeatureToggle 
                  key={feature}
                  feature={feature}
                  enabled={enabled}
                  onToggle={handleFeatureToggle}
                />
              ))}
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Server Statistics</h2>
            <div className="space-y-2">
              <p>Members: 1,234</p>
              <p>Boosts: 45</p>
              <p>Channels: 67</p>
              <p>Online: 892</p>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <ul className="space-y-2">
              <li>• New ticket created by User#1234</li>
              <li>• User banned for spam</li>
              <li>• Level up achieved by Member#5678</li>
              <li>• Welcome message sent</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Configuration Settings</h2>
          <p className="mb-4">Configure your bot features and settings here.</p>
          
          {activeFeature === 'overview' && (
            <div>
              <p>Overview of all bot features and their current status.</p>
            </div>
          )}
          
          {activeFeature === 'ticket' && (
            <TicketSettings 
              tenantId={tenantId} 
              onSave={handleSaveTicketSettings}
            />
          )}
          
          {activeFeature === 'moderation' && (
            <div>
              <h3 className="text-lg font-medium mb-2">Moderation</h3>
              <p>Set up spam protection, word filters, and security measures.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;