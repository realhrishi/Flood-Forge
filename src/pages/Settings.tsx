import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Shield, 
  Database,
  Globe,
  Clock,
  Save
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    autoRefresh: true,
    refreshInterval: 5,
    timezone: 'Asia/Kolkata',
    apiEndpoint: 'https://api.floodforge.local',
    dataRetention: 90,
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your FloodForge preferences</p>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
            <p className="text-sm text-muted-foreground">Configure alert delivery preferences</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label className="text-foreground">Email Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive alerts via email</p>
              </div>
            </div>
            <Switch 
              checked={settings.emailAlerts}
              onCheckedChange={(checked) => setSettings({ ...settings, emailAlerts: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label className="text-foreground">SMS Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive alerts via SMS</p>
              </div>
            </div>
            <Switch 
              checked={settings.smsAlerts}
              onCheckedChange={(checked) => setSettings({ ...settings, smsAlerts: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label className="text-foreground">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Browser push notifications</p>
              </div>
            </div>
            <Switch 
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
            />
          </div>
        </div>
      </motion.div>

      {/* Data Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
            <Database className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Data & Sync</h3>
            <p className="text-sm text-muted-foreground">Manage data refresh and storage</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label className="text-foreground">Auto Refresh</Label>
                <p className="text-sm text-muted-foreground">Automatically refresh data</p>
              </div>
            </div>
            <Switch 
              checked={settings.autoRefresh}
              onCheckedChange={(checked) => setSettings({ ...settings, autoRefresh: checked })}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground mb-2 block">Refresh Interval (minutes)</Label>
              <Input 
                type="number"
                value={settings.refreshInterval}
                onChange={(e) => setSettings({ ...settings, refreshInterval: parseInt(e.target.value) })}
                className="bg-muted border-border"
              />
            </div>
            <div>
              <Label className="text-foreground mb-2 block">Data Retention (days)</Label>
              <Input 
                type="number"
                value={settings.dataRetention}
                onChange={(e) => setSettings({ ...settings, dataRetention: parseInt(e.target.value) })}
                className="bg-muted border-border"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* System Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">System</h3>
            <p className="text-sm text-muted-foreground">Advanced configuration</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-foreground mb-2 block">Timezone</Label>
            <Input 
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="bg-muted border-border"
            />
          </div>
          <div>
            <Label className="text-foreground mb-2 block">API Endpoint</Label>
            <Input 
              value={settings.apiEndpoint}
              onChange={(e) => setSettings({ ...settings, apiEndpoint: e.target.value })}
              className="bg-muted border-border font-mono text-sm"
            />
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex justify-end"
      >
        <Button variant="hero" onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
      </motion.div>
    </div>
  );
};

export default Settings;
