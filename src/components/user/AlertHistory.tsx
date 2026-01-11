import { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Calendar,
  Filter
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

export function AlertHistory() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved' | 'cancelled'>('all');

  useEffect(() => {
    const stored = localStorage.getItem('alertHistory');
    if (stored) {
      setAlerts(JSON.parse(stored));
    }
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case 'crime':
        return 'bg-red-100 text-red-800';
      case 'medical':
        return 'bg-pink-100 text-pink-800';
      case 'fire':
        return 'bg-orange-100 text-orange-800';
      case 'accident':
        return 'bg-yellow-100 text-yellow-800';
      case 'disaster':
        return 'bg-purple-100 text-purple-800';
      case 'home':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Alert History</h2>
            <p className="text-gray-600 mt-1">
              View all your emergency alerts and their status
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Alerts</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600 mb-1">Total Alerts</p>
          <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600 mb-1">Active</p>
          <p className="text-2xl font-bold text-yellow-600">
            {alerts.filter(a => a.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600 mb-1">Resolved</p>
          <p className="text-2xl font-bold text-green-600">
            {alerts.filter(a => a.status === 'resolved').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600 mb-1">This Month</p>
          <p className="text-2xl font-bold text-gray-900">
            {alerts.filter(a => {
              const date = new Date(a.timestamp);
              const now = new Date();
              return date.getMonth() === now.getMonth() && 
                     date.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'No Alerts Yet' : `No ${filter} alerts`}
          </h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? 'Your emergency alerts will appear here'
              : `You don't have any ${filter} alerts`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    {getStatusIcon(alert.status)}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(alert.categoryId)}`}>
                          {alert.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(alert.status)}`}>
                          {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        Emergency Alert: {alert.category}
                      </h3>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(alert.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(alert.timestamp)}</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-600 md:col-span-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        {alert.location.lat.toFixed(6)}, {alert.location.lng.toFixed(6)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2">
                  <button
                    onClick={() => window.open(`https://www.google.com/maps?q=${alert.location.lat},${alert.location.lng}`, '_blank')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Map
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
