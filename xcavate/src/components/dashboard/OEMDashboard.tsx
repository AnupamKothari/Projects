'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockExcavators, mockAnalytics, mockDashboardStats, mockMaintenanceLogs, mockFleetMetrics } from '@/utils/mockData';
import { sensorDataService } from '@/utils/api';
import { SensorData } from '@/types';
import Navigation from '@/components/layout/Navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer
} from 'recharts';
import { 
  Truck, 
  Activity, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp, 
  MapPin, 
  Wrench, 
  Fuel,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const OEMDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'fleet' | 'maintenance' | 'analytics' | 'revenue'>('fleet');
  const [sensorData, setSensorData] = useState<Record<string, SensorData>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up real-time sensor data monitoring for all excavators
    const deviceIds = mockExcavators.map(exc => exc.health.deviceId);
    deviceIds.forEach(deviceId => {
      sensorDataService.subscribe(deviceId, (data: SensorData) => {
        setSensorData(prev => ({
          ...prev,
          [deviceId]: data
        }));
      }, 8000); // Update every 8 seconds
    });

    setIsLoading(false);

    // Cleanup on unmount
    return () => {
      sensorDataService.unsubscribeAll();
    };
  }, []);

  const COLORS = ['#ff7f00', '#ffc107', '#10b981', '#3b82f6', '#ef4444'];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onLogout={logout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            OEM Fleet Control Center
          </h1>
          <p className="text-gray-600">
            Monitor and manage your excavator fleet performance in real-time
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="metric-card">
            <div className="flex items-center">
              <Truck className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Fleet</p>
                <p className="text-2xl font-bold text-gray-900">{mockFleetMetrics.totalFleetSize}</p>
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Units</p>
                <p className="text-2xl font-bold text-gray-900">{mockFleetMetrics.activeUnits}</p>
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Utilization</p>
                <p className="text-2xl font-bold text-gray-900">{mockFleetMetrics.utilizationRate}%</p>
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{mockDashboardStats.monthlyRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'fleet', label: 'Fleet Monitoring', icon: Truck },
                { key: 'maintenance', label: 'Maintenance', icon: Wrench },
                { key: 'analytics', label: 'Analytics', icon: BarChart },
                { key: 'revenue', label: 'Revenue', icon: DollarSign }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.key
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'fleet' && (
          <div className="space-y-6">
            {/* Fleet Status Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockExcavators.map(excavator => {
                const currentData = sensorData[excavator.health.deviceId];
                const fuelLevel = currentData?.fuel_level || excavator.health.fuelLevel;
                const temperature = currentData?.temperature || excavator.health.temperature;
                const productivity = currentData?.productivity_score || excavator.health.productivity;
                const status = currentData?.status || excavator.health.status;
                
                return (
                  <div key={excavator.id} className="dashboard-card">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{excavator.model}</h3>
                        <p className="text-sm text-gray-600">{excavator.id}</p>
                      </div>
                      <span className={`status-badge ${
                        status === 'online' ? 'status-online' : 
                        status === 'maintenance' ? 'status-maintenance' : 'status-offline'
                      }`}>
                        {status}
                      </span>
                    </div>
                    
                    {/* Real-time Metrics */}
                    <div className="space-y-3 mb-4">
                      {/* Fuel Level */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center">
                            <Fuel className="w-4 h-4 mr-1 text-blue-500" />
                            Fuel Level
                          </span>
                          <span className="font-medium">{fuelLevel.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="progress-bar h-2 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(0, fuelLevel))}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Temperature */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center">
                            <Activity className="w-4 h-4 mr-1 text-red-500" />
                            Temperature
                          </span>
                          <span className="font-medium">{temperature.toFixed(1)}°C</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              temperature > 100 ? 'bg-red-500' : 
                              temperature > 90 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(100, (temperature / 120) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Productivity */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                            Productivity
                          </span>
                          <span className="font-medium">{productivity.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(0, productivity))}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Location and Assignment */}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="truncate">{excavator.location.address}</span>
                      </div>
                      
                      {excavator.assignedOperator && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Operator: {excavator.assignedOperator.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            {/* Maintenance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="metric-card">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Scheduled</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mockMaintenanceLogs.filter(log => log.status === 'scheduled').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="flex items-center">
                  <Activity className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mockMaintenanceLogs.filter(log => log.status === 'in_progress').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="flex items-center">
                  <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Emergency</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mockMaintenanceLogs.filter(log => log.type === 'emergency').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Maintenance Logs */}
            <div className="dashboard-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Maintenance Activities</h3>
              <div className="space-y-4">
                {mockMaintenanceLogs.map(log => (
                  <div key={log.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      log.type === 'emergency' ? 'bg-red-500' : 
                      log.type === 'repair' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{log.description}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          log.status === 'completed' ? 'bg-green-100 text-green-800' :
                          log.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {log.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Excavator: {mockExcavators.find(exc => exc.id === log.excavatorId)?.model}
                      </p>
                      {log.cost && (
                        <p className="text-sm text-gray-600">
                          Cost: ₹{log.cost.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Revenue Chart */}
              <div className="dashboard-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockAnalytics.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#ff7f00" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Fault Frequency */}
              <div className="dashboard-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fault Frequency by Machine</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockAnalytics.faultFrequency}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="machine" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="faults" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Fuel Efficiency Trend */}
              <div className="dashboard-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuel Efficiency Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockAnalytics.fuelEfficiencyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} L/hr`, 'Efficiency']} />
                    <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Fleet Utilization */}
              <div className="dashboard-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Active', value: mockFleetMetrics.activeUnits },
                        { name: 'Idle', value: mockFleetMetrics.totalFleetSize - mockFleetMetrics.activeUnits }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {[
                        { name: 'Active', value: mockFleetMetrics.activeUnits },
                        { name: 'Idle', value: mockFleetMetrics.totalFleetSize - mockFleetMetrics.activeUnits }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="space-y-6">
            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="metric-card">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{mockAnalytics.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">₹{mockDashboardStats.monthlyRevenue.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{mockAnalytics.totalBookings}</p>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Avg Utilization</p>
                  <p className="text-2xl font-bold text-gray-900">{mockAnalytics.averageUtilization}%</p>
                </div>
              </div>
            </div>
            
            {/* Revenue Chart */}
            <div className="dashboard-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={mockAnalytics.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#ff7f00" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OEMDashboard;