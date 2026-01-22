import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Bell,
  ClipboardList,
  Database,
  Settings,
  Droplets,
  Menu,
  X,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/map', icon: Map, label: 'Risk Map' },
    { path: '/dashboard/analytics', icon: LayoutDashboard, label: 'Analytics' },
    { path: '/dashboard/alerts', icon: Bell, label: 'Alerts' },
    { path: '/dashboard/response', icon: ClipboardList, label: 'Response Planner' },
    { path: '/dashboard/sources', icon: Database, label: 'Data Sources' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-black" style={{ color: '#E6F1FF' }}>
      <div className="bg-dark-gradient min-h-screen flex">
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card-darker border-r border-primary/20 transform transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-6 border-b border-primary/20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <Droplets className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold">FloodGuard AI</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden hover:text-primary"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/50'
                          : 'hover:text-white hover:bg-card-dark border border-transparent'
                      }`}
                      style={{ color: isActive ? '#0077FF' : 'rgba(230, 241, 255, 0.7)' }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="bg-card-darker border-b border-primary/20 px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden hover:text-primary"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4 ml-auto text-sm" style={{ color: 'rgba(230, 241, 255, 0.7)' }}>
              {new Date().toLocaleString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
