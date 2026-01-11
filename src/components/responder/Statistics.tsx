import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, AlertCircle, Clock, CheckCircle } from 'lucide-react';

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

interface StatisticsProps {
  alerts: Alert[];
}

export function Statistics({ alerts }: StatisticsProps) {
  // Category distribution
  const categoryData = [
    { name: 'Crime/Threat', value: alerts.filter(a => a.categoryId === 'crime').length, color: '#DC2626' },
    { name: 'Medical', value: alerts.filter(a => a.categoryId === 'medical').length, color: '#DB2777' },
    { name: 'Fire', value: alerts.filter(a => a.categoryId === 'fire').length, color: '#EA580C' },
    { name: 'Accident', value: alerts.filter(a => a.categoryId === 'accident').length, color: '#CA8A04' },
    { name: 'Disaster', value: alerts.filter(a => a.categoryId === 'disaster').length, color: '#9333EA' },
    { name: 'Home Emergency', value: alerts.filter(a => a.categoryId === 'home').length, color: '#2563EB' },
  ].filter(item => item.value > 0);

  // Status distribution
  const statusData = [
    { name: 'Active', value: alerts.filter(a => a.status === 'active').length },
    { name: 'Resolved', value: alerts.filter(a => a.status === 'resolved').length },
    { name: 'Cancelled', value: alerts.filter(a => a.status === 'cancelled').length },
  ];

  // Time series data (last 7 days)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const count = alerts.filter(a => {
        const alertDate = new Date(a.timestamp);
        return alertDate >= date && alertDate < nextDay;
      }).length;

      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        alerts: count
      });
    }
    return days;
  };

  const timeSeriesData = getLast7Days();

  // Calculate statistics
  const totalAlerts = alerts.length;
  const activeAlerts = alerts.filter(a => a.status === 'active').length;
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved').length;
  const resolutionRate = totalAlerts > 0 ? ((resolvedAlerts / totalAlerts) * 100).toFixed(1) : 0;

  // Average response time (mock calculation)
  const avgResponseTime = '12 min';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Emergency Response Statistics</h2>
        <p className="text-gray-600">Analytics and insights from emergency alerts</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{totalAlerts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600 animate-pulse" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-red-600">{activeAlerts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{resolvedAlerts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Resolution Rate</p>
              <p className="text-2xl font-bold text-purple-600">{resolutionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Time Series Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Trend (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="alerts" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <p className="text-sm text-gray-600">Avg Response Time</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{avgResponseTime}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-gray-600">Most Common</p>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {categoryData.length > 0
              ? categoryData.reduce((prev, current) => (prev.value > current.value ? prev : current)).name
              : 'N/A'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Today's Alerts</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {alerts.filter(a => {
              const today = new Date();
              const alertDate = new Date(a.timestamp);
              return alertDate.toDateString() === today.toDateString();
            }).length}
          </p>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Response Efficiency</span>
              <span className="text-sm font-medium text-gray-900">{resolutionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${resolutionRate}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">System Uptime</span>
              <span className="text-sm font-medium text-gray-900">99.8%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '99.8%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">User Satisfaction</span>
              <span className="text-sm font-medium text-gray-900">94.5%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '94.5%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
