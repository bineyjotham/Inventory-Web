// src/pages/Settings.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import { 
  Cog6ToothIcon,
  BellIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ServerIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    companyName: 'StockMaster Inc.',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    language: 'English',
    
    // Notification Settings
    emailNotifications: true,
    lowStockAlerts: true,
    movementAlerts: true,
    reportAlerts: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    ipRestrictions: false,
    
    // System Settings
    autoBackup: true,
    backupFrequency: 'daily',
    apiAccess: true,
    debugMode: false
  });

  const handleSaveSettings = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Settings saved:', settings);
      setLoading(false);
    }, 1000);
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      // Reset to defaults
      setSettings({
        companyName: 'StockMaster Inc.',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        language: 'English',
        emailNotifications: true,
        lowStockAlerts: true,
        movementAlerts: true,
        reportAlerts: true,
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordExpiry: 90,
        ipRestrictions: false,
        autoBackup: true,
        backupFrequency: 'daily',
        apiAccess: true,
        debugMode: false
      });
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'users', name: 'User Management', icon: UserGroupIcon },
    { id: 'system', name: 'System', icon: ServerIcon },
    { id: 'audit', name: 'Audit Log', icon: DocumentTextIcon }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure application settings and preferences</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleResetSettings}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveSettings}
            loading={loading}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
          
          {/* System Status */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white">
            <h3 className="font-semibold mb-2">System Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-blue-100">Uptime</span>
                <span className="font-medium">99.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-100">Active Users</span>
                <span className="font-medium">42</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-100">Storage Used</span>
                <span className="font-medium">1.2 GB / 10 GB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={settings.companyName}
                          onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        <select
                          value={settings.timezone}
                          onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                          <option value="Europe/London">GMT (London)</option>
                          <option value="Asia/Tokyo">JST (Tokyo)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date Format
                        </label>
                        <select
                          value={settings.dateFormat}
                          onChange={(e) => setSettings({...settings, dateFormat: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select
                          value={settings.language}
                          onChange={(e) => setSettings({...settings, language: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Email Notifications</div>
                        <div className="text-sm text-gray-600">Receive system notifications via email</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Low Stock Alerts</div>
                        <div className="text-sm text-gray-600">Get notified when items reach low stock levels</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.lowStockAlerts}
                          onChange={(e) => setSettings({...settings, lowStockAlerts: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Movement Alerts</div>
                        <div className="text-sm text-gray-600">Receive notifications for inventory movements</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.movementAlerts}
                          onChange={(e) => setSettings({...settings, movementAlerts: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Report Generation Alerts</div>
                        <div className="text-sm text-gray-600">Notify when reports are generated</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.reportAlerts}
                          onChange={(e) => setSettings({...settings, reportAlerts: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                        <div>
                          <div className="font-semibold text-blue-900">Security Status: Protected</div>
                          <div className="text-sm text-blue-700">All security features are properly configured</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                          <div className="text-sm text-gray-600">Add an extra layer of security to your account</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.twoFactorAuth}
                            onChange={(e) => setSettings({...settings, twoFactorAuth: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="120"
                          step="5"
                          value={settings.sessionTimeout}
                          onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>5 min</span>
                          <span className="font-medium">{settings.sessionTimeout} min</span>
                          <span>120 min</span>
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password Expiry (days)
                        </label>
                        <select
                          value={settings.passwordExpiry}
                          onChange={(e) => setSettings({...settings, passwordExpiry: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="30">30 days</option>
                          <option value="60">60 days</option>
                          <option value="90">90 days</option>
                          <option value="180">180 days</option>
                          <option value="365">365 days</option>
                          <option value="0">Never expire</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">IP Restrictions</div>
                          <div className="text-sm text-gray-600">Restrict access to specific IP addresses</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.ipRestrictions}
                            onChange={(e) => setSettings({...settings, ipRestrictions: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <ServerIcon className="w-6 h-6 text-blue-600" />
                        <div>
                          <div className="font-semibold text-blue-900">System Status: Operational</div>
                          <div className="text-sm text-blue-700">All systems are running normally</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Automatic Backups</div>
                          <div className="text-sm text-gray-600">Automatically backup system data</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.autoBackup}
                            onChange={(e) => setSettings({...settings, autoBackup: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      {settings.autoBackup && (
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Backup Frequency
                          </label>
                          <select
                            value={settings.backupFrequency}
                            onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                      )}

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">API Access</div>
                          <div className="text-sm text-gray-600">Enable external API access</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.apiAccess}
                            onChange={(e) => setSettings({...settings, apiAccess: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Debug Mode</div>
                          <div className="text-sm text-gray-600">Enable detailed logging for troubleshooting</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.debugMode}
                            onChange={(e) => setSettings({...settings, debugMode: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;