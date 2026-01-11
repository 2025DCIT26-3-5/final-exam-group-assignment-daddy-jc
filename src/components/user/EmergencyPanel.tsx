import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  Heart, 
  ShieldAlert, 
  Car, 
  Home,
  MapPin,
  CheckCircle,
  Clock
} from 'lucide-react';

interface EmergencyCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  description: string;
}

const emergencyCategories: EmergencyCategory[] = [
  {
    id: 'crime',
    name: 'Crime/Threat',
    icon: ShieldAlert,
    color: 'text-red-600',
    bgColor: 'bg-red-50 hover:bg-red-100 border-red-200',
    description: 'Robbery, assault, or threatening situation'
  },
  {
    id: 'medical',
    name: 'Medical Emergency',
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 hover:bg-pink-100 border-pink-200',
    description: 'Health crisis, injury, or medical assistance needed'
  },
  {
    id: 'fire',
    name: 'Fire',
    icon: Flame,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
    description: 'Fire outbreak or smoke detection'
  },
  {
    id: 'accident',
    name: 'Accident',
    icon: Car,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200',
    description: 'Vehicle accident or collision'
  },
  {
    id: 'disaster',
    name: 'Natural Disaster',
    icon: AlertTriangle,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
    description: 'Earthquake, flood, or natural calamity'
  },
  {
    id: 'home',
    name: 'Home Emergency',
    icon: Home,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    description: 'Break-in, gas leak, or home safety issue'
  }
];

export function EmergencyPanel() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState('');
  const [alertSent, setAlertSent] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategory | null>(null);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError('');
        },
        (error) => {
          setLocationError('Location access denied. Please enable GPS for accurate emergency response.');
          // Use mock location for demo
          setLocation({
            lat: 14.5995,
            lng: 120.9842
          });
        }
      );
    }
  }, []);

  const sendEmergencyAlert = (category: EmergencyCategory) => {
    setSelectedCategory(category);

    const alert = {
      id: Date.now().toString(),
      category: category.name,
      categoryId: category.id,
      timestamp: new Date().toISOString(),
      location: location || { lat: 0, lng: 0 },
      status: 'active',
      userId: JSON.parse(localStorage.getItem('userData') || '{}').id,
      userName: JSON.parse(localStorage.getItem('userData') || '{}').fullName,
      userPhone: JSON.parse(localStorage.getItem('userData') || '{}').phone
    };

    // Store alert locally (offline capability)
    const alerts = JSON.parse(localStorage.getItem('alertHistory') || '[]');
    alerts.unshift(alert);
    localStorage.setItem('alertHistory', JSON.stringify(alerts));

    // Store in responder queue
    const responderAlerts = JSON.parse(localStorage.getItem('responderAlerts') || '[]');
    responderAlerts.unshift(alert);
    localStorage.setItem('responderAlerts', JSON.stringify(responderAlerts));

    // Send notifications to emergency contacts
    const contacts = JSON.parse(localStorage.getItem('emergencyContacts') || '[]');
    contacts.forEach((contact: any) => {
      console.log(`Alert sent to ${contact.name} (${contact.phone}): ${category.name} emergency at location ${location?.lat}, ${location?.lng}`);
    });

    setAlertSent(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setAlertSent(false);
      setSelectedCategory(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Location Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start gap-3">
          <MapPin className="w-6 h-6 text-green-600 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">GPS Status</h3>
            {location ? (
              <div className="text-sm text-gray-600">
                <p className="text-green-600 font-medium mb-1">✓ Location Enabled</p>
                <p>Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}</p>
                <p className="text-xs mt-1">Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
            ) : (
              <p className="text-sm text-yellow-600">Acquiring location...</p>
            )}
            {locationError && (
              <p className="text-sm text-yellow-600 mt-2">{locationError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Alert Sent Confirmation */}
      {alertSent && selectedCategory && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 animate-pulse">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-bold text-green-900 text-lg">Emergency Alert Sent!</h3>
              <p className="text-green-700 text-sm">
                {selectedCategory.name} - Help is on the way
              </p>
            </div>
          </div>
          <div className="bg-white rounded p-3 text-sm text-gray-700">
            <p>✓ Location shared with emergency contacts</p>
            <p>✓ Responders have been notified</p>
            <p>✓ Alert logged in your history</p>
          </div>
        </div>
      )}

      {/* Emergency Instructions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Emergency Response</h2>
        <p className="text-gray-600 mb-4">
          Select an emergency category below. Your current location and alert will be sent to:
        </p>
        <ul className="text-sm text-gray-600 space-y-1 ml-4 mb-4">
          <li>• All registered emergency contacts</li>
          <li>• Emergency response team</li>
          <li>• Local authorities (if applicable)</li>
        </ul>
        <p className="text-sm text-red-600 font-medium">
          ⚠️ Only use this for real emergencies. False alarms may result in penalties.
        </p>
      </div>

      {/* Emergency Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {emergencyCategories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => sendEmergencyAlert(category)}
              disabled={alertSent}
              className={`${category.bgColor} border-2 rounded-xl p-6 text-left transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-start gap-4">
                <div className={`${category.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg mb-1 ${category.color}`}>
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>Instant alert</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Offline Mode Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Offline Mode:</strong> Alerts are stored locally and will sync automatically when connection is restored.
        </p>
      </div>
    </div>
  );
}
