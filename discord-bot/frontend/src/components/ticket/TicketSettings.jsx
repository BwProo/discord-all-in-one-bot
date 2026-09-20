import React, { useState, useEffect } from 'react';

const TicketSettings = ({ tenantId, onSave }) => {
  const [settings, setSettings] = useState({
    enabled: true,
    embedTitle: '🎟️ | Tickets',
    embedDescription: 'Erstelle ein Ticket für Support.',
    embedColor: '#0099ff',
    buttonLabel: 'Create Ticket',
    image: '',
    categories: [],
    autoClose: false,
    autoCloseTimeout: 3600 // in seconds
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    roleId: ''
  });

  useEffect(() => {
    // Load settings from API
    const loadSettings = async () => {
      try {
        // Mock data - in real implementation this would fetch from backend
        const mockData = {
          enabled: true,
          embedTitle: '🎟️ | Tickets',
          embedDescription: 'Erstelle ein Ticket für Support.',
          embedColor: '#0099ff',
          buttonLabel: 'Create Ticket',
          image: '',
          categories: [
            { id: '1', name: 'Support', roleId: 'support-role-id' },
            { id: '2', name: 'Report', roleId: 'report-role-id' }
          ],
          autoClose: false,
          autoCloseTimeout: 3600
        };
        setSettings(mockData);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    loadSettings();
  }, [tenantId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addCategory = () => {
    if (newCategory.name.trim()) {
      const category = {
        id: Date.now().toString(),
        name: newCategory.name,
        roleId: newCategory.roleId
      };
      
      setSettings(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }));
      
      setNewCategory({ name: '', roleId: '' });
    }
  };

  const removeCategory = (categoryId) => {
    setSettings(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat.id !== categoryId)
    }));
  };

  const saveSettings = async () => {
    try {
      // In real implementation this would send to backend
      console.log('Saving ticket settings:', settings);
      await onSave(settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Ticket System Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Embed Title</label>
          <input
            type="text"
            name="embedTitle"
            value={settings.embedTitle}
            onChange={handleInputChange}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Button Label</label>
          <input
            type="text"
            name="buttonLabel"
            value={settings.buttonLabel}
            onChange={handleInputChange}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Embed Color</label>
          <input
            type="color"
            name="embedColor"
            value={settings.embedColor}
            onChange={handleInputChange}
            className="w-full h-10 bg-gray-700 border border-gray-600 rounded cursor-pointer"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Banner Image URL</label>
          <input
            type="text"
            name="image"
            value={settings.image}
            onChange={handleInputChange}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          name="embedDescription"
          value={settings.embedDescription}
          onChange={handleInputChange}
          rows="3"
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
        />
      </div>
      
      <div className="flex items-center mb-6">
        <input
          type="checkbox"
          name="enabled"
          checked={settings.enabled}
          onChange={handleInputChange}
          className="mr-2"
        />
        <label>Enable Ticket System</label>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Ticket Categories</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={newCategory.name}
            onChange={handleCategoryChange}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          />
          <input
            type="text"
            name="roleId"
            placeholder="Role ID (optional)"
            value={newCategory.roleId}
            onChange={handleCategoryChange}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          />
        </div>
        
        <button
          onClick={addCategory}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2"
        >
          Add Category
        </button>
        
        <div className="mt-4">
          {settings.categories.map(category => (
            <div key={category.id} className="flex items-center justify-between bg-gray-700 p-3 rounded mb-2">
              <span>{category.name}</span>
              <button
                onClick={() => removeCategory(category.id)}
                className="text-red-500 hover:text-red-400"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default TicketSettings;