import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Lock, Eye } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: true,
      push: true,
    },
    alerts: {
      lowRisk: false,
      moderateRisk: true,
      highRisk: true,
    },
    theme: 'dark',
    language: 'en',
  });

  function toggleNotification(key: 'email' | 'sms' | 'push') {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
  }

  function toggleAlert(key: 'lowRisk' | 'moderateRisk' | 'highRisk') {
    setSettings({
      ...settings,
      alerts: {
        ...settings.alerts,
        [key]: !settings.alerts[key],
      },
    });
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-text-light/70">Manage your preferences and notification settings</p>
        </div>

        <div className="bg-card-dark p-6 rounded-xl border border-primary/20">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Notification Preferences</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-card-darker rounded-lg border border-primary/10 hover:border-primary/30 transition-all">
              <div>
                <h3 className="font-semibold mb-1">Email Notifications</h3>
                <p className="text-sm text-text-light/60">Receive alerts via email</p>
              </div>
              <button
                onClick={() => toggleNotification('email')}
                className={`relative w-12 h-6 rounded-full transition-all ${
                  settings.notifications.email ? 'bg-primary' : 'bg-text-light/20'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-card-darker rounded-lg border border-primary/10 hover:border-primary/30 transition-all">
              <div>
                <h3 className="font-semibold mb-1">SMS Notifications</h3>
                <p className="text-sm text-text-light/60">Receive alerts via SMS</p>
              </div>
              <button
                onClick={() => toggleNotification('sms')}
                className={`relative w-12 h-6 rounded-full transition-all ${
                  settings.notifications.sms ? 'bg-primary' : 'bg-text-light/20'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.notifications.sms ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-card-darker rounded-lg border border-primary/10 hover:border-primary/30 transition-all">
              <div>
                <h3 className="font-semibold mb-1">Push Notifications</h3>
                <p className="text-sm text-text-light/60">Receive push alerts on your device</p>
              </div>
              <button
                onClick={() => toggleNotification('push')}
                className={`relative w-12 h-6 rounded-full transition-all ${
                  settings.notifications.push ? 'bg-primary' : 'bg-text-light/20'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.notifications.push ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card-dark p-6 rounded-xl border border-primary/20">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Alert Severity Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-card-darker rounded-lg border border-green-500/20 hover:border-green-500/50 transition-all">
              <div>
                <h3 className="font-semibold mb-1">Low Risk Alerts</h3>
                <p className="text-sm text-text-light/60">Risk probability &lt; 30%</p>
              </div>
              <button
                onClick={() => toggleAlert('lowRisk')}
                className={`relative w-12 h-6 rounded-full transition-all ${
                  settings.alerts.lowRisk ? 'bg-green-500' : 'bg-text-light/20'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.alerts.lowRisk ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-card-darker rounded-lg border border-yellow-500/20 hover:border-yellow-500/50 transition-all">
              <div>
                <h3 className="font-semibold mb-1">Moderate Risk Alerts</h3>
                <p className="text-sm text-text-light/60">Risk probability 30-70%</p>
              </div>
              <button
                onClick={() => toggleAlert('moderateRisk')}
                className={`relative w-12 h-6 rounded-full transition-all ${
                  settings.alerts.moderateRisk ? 'bg-yellow-500' : 'bg-text-light/20'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.alerts.moderateRisk ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-card-darker rounded-lg border border-red-500/20 hover:border-red-500/50 transition-all">
              <div>
                <h3 className="font-semibold mb-1">High Risk Alerts</h3>
                <p className="text-sm text-text-light/60">Risk probability &gt; 70%</p>
              </div>
              <button
                onClick={() => toggleAlert('highRisk')}
                className={`relative w-12 h-6 rounded-full transition-all ${
                  settings.alerts.highRisk ? 'bg-red-500' : 'bg-text-light/20'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.alerts.highRisk ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card-dark p-6 rounded-xl border border-primary/20">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Display Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-card-darker rounded-lg border border-primary/10">
              <div>
                <h3 className="font-semibold">Theme</h3>
                <p className="text-sm text-text-light/60">{settings.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
              </div>
              <span className="text-primary font-semibold">Dark</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-card-darker rounded-lg border border-primary/10">
              <div>
                <h3 className="font-semibold">Language</h3>
                <p className="text-sm text-text-light/60">English (US)</p>
              </div>
              <span className="text-primary font-semibold">EN</span>
            </div>
          </div>
        </div>

        <div className="bg-card-dark p-6 rounded-xl border border-primary/20">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Security</h2>
          </div>

          <div className="space-y-3">
            <button className="w-full p-4 bg-card-darker rounded-lg border border-primary/10 hover:border-primary/30 transition-all text-left font-semibold hover:bg-primary/5">
              Change Password
            </button>
            <button className="w-full p-4 bg-card-darker rounded-lg border border-primary/10 hover:border-primary/30 transition-all text-left font-semibold hover:bg-primary/5">
              Two-Factor Authentication
            </button>
            <button className="w-full p-4 bg-card-darker rounded-lg border border-red-500/20 hover:border-red-500/50 transition-all text-left font-semibold hover:bg-red-500/5 text-red-400">
              Logout All Devices
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 px-6 py-3 bg-ocean-gradient rounded-lg font-semibold hover:shadow-blue-glow transition-all duration-300">
            Save Changes
          </button>
          <button className="flex-1 px-6 py-3 bg-card-darker border border-primary/30 rounded-lg font-semibold hover:border-primary/50 transition-all">
            Cancel
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
