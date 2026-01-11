import { useState, useEffect } from 'react';
import { EmergencyPanel } from './EmergencyPanel';
import { ContactList } from './ContactList';
import { AlertHistory } from './AlertHistory';
import { LocationTracker } from './LocationTracker';
import { Shield, Users, History, MapPin, LogOut, Menu, X } from 'lucide-react';

interface UserDashboardProps {
  onLogout: () => void;
}

type Tab = 'emergency' | 'contacts' | 'history' | 'location';

export function UserDashboard({ onLogout }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('emergency');
  const [userData, setUserData] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('userData');
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  const tabs = [
    { id: 'emergency' as Tab, label: 'Emergency', icon: Shield },
    { id: 'contacts' as Tab, label: 'Contacts', icon: Users },
    { id: 'history' as Tab, label: 'History', icon: History },
    { id: 'location' as Tab, label: 'Location', icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold">SafeAlert</h1>
                <p className="text-sm text-red-100">
                  {userData?.fullName || 'User Dashboard'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onLogout}
                className="hidden md:flex items-center gap-2 bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 hover:bg-red-700 rounded-lg"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-red-500">
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg transition-colors"
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
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'emergency' && <EmergencyPanel />}
        {activeTab === 'contacts' && <ContactList />}
        {activeTab === 'history' && <AlertHistory />}
        {activeTab === 'location' && <LocationTracker />}
      </main>
    </div>
  );
}
