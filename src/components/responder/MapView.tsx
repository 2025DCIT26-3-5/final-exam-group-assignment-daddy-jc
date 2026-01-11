import { useState } from 'react';
import { MapPin, Navigation, Info, Filter } from 'lucide-react';

interface Alert {
  id: string;
  category: string;
  categoryId: string;
  timestamp: string;
  location: { lat: number; lng: number };
  status: 'active' | 'resolved' | 'cancelled';
  userName: string;
  userPhone: string;
}

interface MapViewProps {
  alerts: Alert[];
}

export function MapView({ alerts }: MapViewProps) {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  const displayedAlerts = showActiveOnly
    ? alerts.filter(a => a.status === 'active')
    : alerts;

  // Calculate center point of all alerts
  const getCenterLocation = () => {
    if (displayedAlerts.length === 0) {
      return { lat: 14.5995, lng: 120.9842 }; // Default Manila
    }

    const avgLat = displayedAlerts.reduce((sum, a) => sum + a.location.lat, 0) / displayedAlerts.length;
    const avgLng = displayedAlerts.reduce((sum, a) => sum + a.location.lng, 0) / displayedAlerts.length;
    
    return { lat: avgLat, lng: avgLng };
  };

  const center = getCenterLocation();

  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case 'crime':
        return '#DC2626';
      case 'medical':
        return '#DB2777';
      case 'fire':
        return '#EA580C';
      case 'accident':
        return '#CA8A04';
      case 'disaster':
        return '#9333EA';
      case 'home':
        return '#2563EB';
      default:
        return '#6B7280';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Emergency Map View</h2>
            <p className="text-gray-600 mt-1">
              Geographic visualization of all emergency alerts
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Active Alerts Only</span>
            </label>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {displayedAlerts.length} Alerts
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-[600px]">
          {displayedAlerts.length > 0 ? (
            <iframe
              src={`https://www.google.com/maps?q=${center.lat},${center.lng}&output=embed&z=12`}
              className="w-full h-full border-0"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Alerts to Display</h3>
                <p className="text-gray-600">
                  {showActiveOnly
                    ? 'No active alerts at this time'
                    : 'No emergency alerts available'}
                </p>
              </div>
            </div>
          )}

          {/* Map Legend */}
          {displayedAlerts.length > 0 && (
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Alert Categories
              </h4>
              <div className="space-y-2">
                {[
                  { id: 'crime', name: 'Crime/Threat', color: '#DC2626' },
                  { id: 'medical', name: 'Medical', color: '#DB2777' },
                  { id: 'fire', name: 'Fire', color: '#EA580C' },
                  { id: 'accident', name: 'Accident', color: '#CA8A04' },
                  { id: 'disaster', name: 'Disaster', color: '#9333EA' },
                  { id: 'home', name: 'Home Emergency', color: '#2563EB' },
                ].map((category) => {
                  const count = displayedAlerts.filter(a => a.categoryId === category.id).length;
                  if (count === 0) return null;
                  
                  return (
                    <div key={category.id} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-gray-700">
                        {category.name} ({count})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alert List with Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedAlerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedAlert(alert)}
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: getCategoryColor(alert.categoryId) + '20' }}
              >
                <MapPin
                  className="w-5 h-5"
                  style={{ color: getCategoryColor(alert.categoryId) }}
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{alert.category}</h4>
                <p className="text-xs text-gray-500">{alert.userName}</p>
              </div>
              {alert.status === 'active' && (
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              )}
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                <span className="text-xs">
                  {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
                </span>
              </div>
              <p className="text-xs">{formatTimestamp(alert.timestamp)}</p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://www.google.com/maps?q=${alert.location.lat},${alert.location.lng}`, '_blank');
              }}
              className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Open in Maps
            </button>
          </div>
        ))}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedAlert(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedAlert.category} Emergency</h3>
                <p className="text-gray-600 mt-1">Alert ID: {selectedAlert.id}</p>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="h-64 rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps?q=${selectedAlert.location.lat},${selectedAlert.location.lng}&output=embed&z=15`}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Reported By</p>
                  <p className="font-medium text-gray-900">{selectedAlert.userName}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Contact</p>
                  <p className="font-medium text-gray-900">{selectedAlert.userPhone}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  <p className="font-medium text-gray-900">
                    {selectedAlert.location.lat.toFixed(6)}, {selectedAlert.location.lng.toFixed(6)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Timestamp</p>
                  <p className="font-medium text-gray-900">{formatTimestamp(selectedAlert.timestamp)}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedAlert.location.lat},${selectedAlert.location.lng}`, '_blank')}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </button>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
