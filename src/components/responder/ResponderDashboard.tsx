import { useState, useEffect } from 'react';
import { AlertMonitor } from './AlertMonitor';
import { MapView } from './MapView';
import { Statistics } from './Statistics';
import { Radio, Map, BarChart3, LogOut, Bell, Menu, X } from 'lucide-react';

interface ResponderDashboardProps {
  onLogout: () => void;
}

type Tab = 'alerts' | 'map' | 'stats';

export function ResponderDashboard({ onLogout }: ResponderDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('alerts');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = () => {
    const stored = localStorage.getItem('responderAlerts');
    if (stored) {
      const parsedAlerts = JSON.parse(stored);
      setAlerts(parsedAlerts);
      
      // Count active alerts
      const activeCount = parsedAlerts.filter((a: any) => a.status === 'active').length;
      setUnreadCount(activeCount);
    }
  };

  const tabs = [
    { id: 'alerts' as Tab, label: 'Active Alerts', icon: Bell },
    { id: 'map' as Tab, label: 'Map View', icon: Map },
    { id: 'stats' as Tab, label: 'Statistics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Radio className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold">Emergency Response Center</h1>
                <p className="text-sm text-blue-100">Real-time Alert Monitoring</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Alert Counter */}
              {unreadCount > 0 && (
                <div className="hidden md:flex items-center gap-2 bg-red-500 px-4 py-2 rounded-lg">
                  <Bell className="w-5 h-5 animate-pulse" />
                  <span className="font-bold">{unreadCount} Active</span>
                </div>
              )}

              <button
                onClick={onLogout}
                className="hidden md:flex items-center gap-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 hover:bg-blue-700 rounded-lg"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-blue-500 space-y-2">
              {unreadCount > 0 && (
                <div className="flex items-center justify-center gap-2 bg-red-500 px-4 py-2 rounded-lg">
                  <Bell className="w-5 h-5 animate-pulse" />
                  <span className="font-bold">{unreadCount} Active Alerts</span>
                </div>
              )}
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  {tab.id === 'alerts' && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'alerts' && <AlertMonitor alerts={alerts} onUpdate={loadAlerts} />}
        {activeTab === 'map' && <MapView alerts={alerts} />}
        {activeTab === 'stats' && <Statistics alerts={alerts} />}
      </main>
    </div>
  );
}
