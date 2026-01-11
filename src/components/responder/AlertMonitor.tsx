import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Phone,
  MapPin,
  Clock,
  User,
  Navigation,
  Shield
} from 'lucide-react';

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

interface AlertMonitorProps {
  alerts: Alert[];
  onUpdate: () => void;
}

export function AlertMonitor({ alerts, onUpdate }: AlertMonitorProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('active');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.status === filter;
  });

  const updateAlertStatus = (alertId: string, newStatus: 'resolved' | 'cancelled') => {
    // Update in responder alerts
    const responderAlerts = JSON.parse(localStorage.getItem('responderAlerts') || '[]');
    const updated = responderAlerts.map((a: Alert) =>
      a.id === alertId ? { ...a, status: newStatus } : a
    );
    localStorage.setItem('responderAlerts', JSON.stringify(updated));

    // Also update in user's alert history
    const alertHistory = JSON.parse(localStorage.getItem('alertHistory') || '[]');
    const updatedHistory = alertHistory.map((a: Alert) =>
      a.id === alertId ? { ...a, status: newStatus } : a
    );
    localStorage.setItem('alertHistory', JSON.stringify(updatedHistory));

    onUpdate();
    setSelectedAlert(null);
  };

  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case 'crime':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medical':
        return 'bg-pink-100 text-pink-800 border-pink-300';
      case 'fire':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'accident':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'disaster':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'home':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityLevel = (categoryId: string) => {
    switch (categoryId) {
      case 'crime':
      case 'medical':
      case 'fire':
        return 'CRITICAL';
      case 'accident':
      case 'disaster':
        return 'HIGH';
      default:
        return 'MEDIUM';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-600 text-white';
      case 'HIGH':
        return 'bg-orange-600 text-white';
      default:
        return 'bg-yellow-600 text-white';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Emergency Alerts</h2>
            <p className="text-gray-600 mt-1">Monitor and respond to incoming alerts</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Active ({alerts.filter(a => a.status === 'active').length})
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'resolved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Resolved ({alerts.filter(a => a.status === 'resolved').length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({alerts.length})
            </button>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'active' ? 'No Active Alerts' : 'No Alerts Found'}
          </h3>
          <p className="text-gray-600">
            {filter === 'active'
              ? 'All clear! No emergencies requiring attention.'
              : 'No alerts match the selected filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAlerts.map((alert) => {
            const priority = getPriorityLevel(alert.categoryId);
            const isActive = alert.status === 'active';

            return (
              <div
                key={alert.id}
                className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all ${
                  isActive ? 'border-l-4 border-red-600' : ''
                }`}
              >
                <div className="p-6">
                  {/* Alert Header */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(priority)}`}>
                          {priority}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(alert.categoryId)}`}>
                          {alert.category}
                        </span>
                        {isActive && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                            ⚠️ ACTIVE
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {alert.category} Emergency
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimestamp(alert.timestamp)}</span>
                    </div>
                  </div>

                  {/* Alert Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Reported by</p>
                        <p className="font-medium text-gray-900">{alert.userName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-500">Contact</p>
                        <p className="font-medium text-gray-900">{alert.userPhone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="font-medium text-gray-900">
                          {alert.location.lat.toFixed(6)}, {alert.location.lng.toFixed(6)}
                        </p>
                      </div>
                      <button
                        onClick={() => window.open(`https://www.google.com/maps?q=${alert.location.lat},${alert.location.lng}`, '_blank')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                      >
                        <Navigation className="w-4 h-4" />
                        Navigate
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  {isActive && (
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setSelectedAlert(alert)}
                        className="flex-1 md:flex-none bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Resolved
                      </button>
                      <button
                        onClick={() => updateAlertStatus(alert.id, 'cancelled')}
                        className="flex-1 md:flex-none bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={() => window.location.href = `tel:${alert.userPhone}`}
                        className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Call User
                      </button>
                    </div>
                  )}

                  {alert.status === 'resolved' && (
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Alert has been resolved</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Resolution</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to mark this {selectedAlert.category} emergency as resolved?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => updateAlertStatus(selectedAlert.id, 'resolved')}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Yes, Resolve
              </button>
              <button
                onClick={() => setSelectedAlert(null)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
