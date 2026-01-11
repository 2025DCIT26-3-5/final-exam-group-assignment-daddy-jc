import { useState, useEffect } from 'react';
import { MapPin, Navigation, RefreshCw, CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';

export function LocationTracker() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isTracking, setIsTracking] = useState(true);
  const [error, setError] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedLocations, setCachedLocations] = useState<any[]>([]);

  useEffect(() => {
    // Load cached locations
    const cached = localStorage.getItem('cachedLocations');
    if (cached) {
      setCachedLocations(JSON.parse(cached));
    }

    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isTracking) {
      updateLocation();
      const interval = setInterval(updateLocation, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isTracking]);

  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date().toISOString()
          };
          
          setLocation({ lat: newLocation.lat, lng: newLocation.lng });
          setAccuracy(position.coords.accuracy);
          setLastUpdate(new Date());
          setError('');

          // Cache location for offline mode
          const cached = [...cachedLocations, newLocation].slice(-10); // Keep last 10
          setCachedLocations(cached);
          localStorage.setItem('cachedLocations', JSON.stringify(cached));
        },
        (error) => {
          setError(error.message);
          // Use mock location for demo
          setLocation({
            lat: 14.5995,
            lng: 120.9842
          });
          setLastUpdate(new Date());
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setError('Geolocation is not supported by your device');
    }
  };

  const getAccuracyStatus = () => {
    if (!accuracy) return { text: 'Unknown', color: 'text-gray-600' };
    if (accuracy < 10) return { text: 'Excellent', color: 'text-green-600' };
    if (accuracy < 50) return { text: 'Good', color: 'text-blue-600' };
    if (accuracy < 100) return { text: 'Fair', color: 'text-yellow-600' };
    return { text: 'Poor', color: 'text-red-600' };
  };

  const accuracyStatus = getAccuracyStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">GPS Location Tracker</h2>
            <p className="text-gray-600 mt-1">
              Real-time location monitoring for emergency response
            </p>
          </div>
          <button
            onClick={updateLocation}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            title="Refresh location"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Online Status */}
        <div className={`flex items-center gap-2 p-3 rounded-lg ${isOnline ? 'bg-green-50' : 'bg-orange-50'}`}>
          {isOnline ? (
            <>
              <Wifi className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-800 font-medium">Online - Real-time sync enabled</span>
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-orange-800 font-medium">Offline - Data cached locally</span>
            </>
          )}
        </div>
      </div>

      {/* Current Location */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-gray-900 text-lg mb-4">Current Location</h3>
        
        {error && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Location access limited</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {location ? (
          <div className="space-y-4">
            {/* Map Preview */}
            <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
              <iframe
                src={`https://www.google.com/maps?q=${location.lat},${location.lng}&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
              />
              <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-900">Live</span>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Coordinates</span>
                </div>
                <p className="text-sm text-gray-600">
                  Latitude: {location.lat.toFixed(6)}
                </p>
                <p className="text-sm text-gray-600">
                  Longitude: {location.lng.toFixed(6)}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">Accuracy</span>
                </div>
                <p className={`text-sm font-medium ${accuracyStatus.color}`}>
                  {accuracyStatus.text}
                  {accuracy && ` (±${accuracy.toFixed(0)}m)`}
                </p>
              </div>

              {lastUpdate && (
                <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Last Updated</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {lastUpdate.toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => window.open(`https://www.google.com/maps?q=${location.lat},${location.lng}`, '_blank')}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Open in Google Maps
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${location.lat}, ${location.lng}`);
                  alert('Coordinates copied to clipboard!');
                }}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Copy Coordinates
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">Acquiring location...</p>
          </div>
        )}
      </div>

      {/* Tracking Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-gray-900 text-lg mb-4">Tracking Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Auto-tracking</p>
              <p className="text-sm text-gray-600">Updates location every 30 seconds</p>
            </div>
            <button
              onClick={() => setIsTracking(!isTracking)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isTracking
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              {isTracking ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Battery Optimization:</strong> Location tracking uses GPS which may drain battery. 
              Consider disabling auto-tracking when not needed.
            </p>
          </div>
        </div>
      </div>

      {/* Cached Locations (Offline Support) */}
      {cachedLocations.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 text-lg mb-4">
            Cached Locations (Last {cachedLocations.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {cachedLocations.slice().reverse().map((loc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                <div>
                  <p className="text-gray-900 font-medium">
                    {loc.lat.toFixed(6)}, {loc.lng.toFixed(6)}
                  </p>
                  <p className="text-gray-600 text-xs">
                    {new Date(loc.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => window.open(`https://www.google.com/maps?q=${loc.lat},${loc.lng}`, '_blank')}
                  className="text-blue-600 hover:text-blue-700 text-xs"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
