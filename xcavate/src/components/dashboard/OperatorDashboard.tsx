'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockExcavators, mockBookings, mockAlerts } from '@/utils/mockData';
import { sensorDataService } from '@/utils/api';
import { SensorData, Alert } from '@/types';
import Navigation from '@/components/layout/Navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { format } from 'date-fns';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Wrench, 
  MapPin,
  Activity,
  Fuel,
  Thermometer,
  Settings,
  Calendar,
  User,
  TrendingUp,
  Bell,
  Eye
} from 'lucide-react';

const OperatorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'jobs' | 'machines' | 'alerts'>('jobs');
  const [sensorData, setSensorData] = useState<Record<string, SensorData>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Get operator's assigned machines (in real app, this would be fetched from API)
  const operatorMachines = mockExcavators.filter(excavator => 
    excavator.assignedOperator?.id === user?.id || excavator.id === 'EXC_003' // Mock assignment
  );

  // Get operator's job assignments
  const operatorJobs = mockBookings.filter(booking => 
    booking.operatorId === user?.id || 
    (booking.requiresOperator && operatorMachines.some(machine => machine.id === booking.excavatorId))
  );

  // Get relevant alerts
  const operatorAlerts = mockAlerts.filter(alert => 
    operatorMachines.some(machine => machine.health.deviceId === alert.excavatorId) ||
    alert.type === 'operator_needed'
  );

  useEffect(() => {
    // Set up real-time sensor data monitoring for assigned machines
    const deviceIds = operatorMachines.map(exc => exc.health.deviceId);
    deviceIds.forEach(deviceId => {
      sensorDataService.subscribe(deviceId, (data: SensorData) => {
        setSensorData(prev => ({
          ...prev,
          [deviceId]: data
        }));
      }, 6000); // Update every 6 seconds
    });

    setIsLoading(false);

    // Cleanup on unmount
    return () => {
      sensorDataService.unsubscribeAll();
    };
  }, []);

  const handleJobAction = (jobId: string, action: 'accept' | 'reject') => {
    // In real app, this would make an API call
    console.log(`${action} job ${jobId}`);
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
            Operator Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your assigned excavators and monitor job assignments
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="metric-card">
            <div className="flex items-center">
              <Wrench className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned Machines</p>
                <p className="text-2xl font-bold text-gray-900">{operatorMachines.length}</p>
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {operatorJobs.filter(job => job.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {operatorJobs.filter(job => job.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {operatorAlerts.filter(alert => !alert.acknowledged).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'jobs', label: 'Job Assignments', icon: Calendar },
                { key: 'machines', label: 'My Machines', icon: Wrench },
                { key: 'alerts', label: 'Alerts & Notifications', icon: Bell }
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
                    {tab.key === 'alerts' && operatorAlerts.filter(alert => !alert.acknowledged).length > 0 && (
                      <span className="ml-2 px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">
                        {operatorAlerts.filter(alert => !alert.acknowledged).length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {operatorJobs.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No job assignments</h3>
                <p className="text-gray-500">You don't have any job assignments at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {operatorJobs.map(job => {
                  const excavator = mockExcavators.find(exc => exc.id === job.excavatorId);
                  const duration = Math.ceil(
                    (job.endDate.getTime() - job.startDate.getTime()) / (1000 * 60 * 60)
                  );
                  
                  return (
                    <div key={job.id} className="dashboard-card">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {excavator?.model || 'Unknown Excavator'}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getJobStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            {job.projectType} • {duration} hours
                          </p>
                          
                          {excavator && (
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>{excavator.location.address}</span>
                            </div>
                          )}
                        </div>
                        
                        {job.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleJobAction(job.id, 'accept')}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleJobAction(job.id, 'reject')}
                              className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="flex items-center text-gray-600 mb-1">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="font-medium">Schedule</span>
                          </div>
                          <p className="text-gray-900">
                            {format(job.startDate, 'MMM dd, yyyy')}
                          </p>
                          <p className="text-gray-600">
                            {format(job.startDate, 'HH:mm')} - {format(job.endDate, 'HH:mm')}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-gray-600 mb-1">
                            <User className="w-4 h-4 mr-2" />
                            <span className="font-medium">Project Manager</span>
                          </div>
                          <p className="text-gray-900">John Smith</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-gray-600 mb-1">
                            <Settings className="w-4 h-4 mr-2" />
                            <span className="font-medium">Status</span>
                          </div>
                          <p className="text-gray-900 capitalize">{job.status}</p>
                        </div>
                      </div>
                      
                      {job.notes && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Notes:</strong> {job.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'machines' && (
          <div className="space-y-6">
            {operatorMachines.length === 0 ? (
              <div className="text-center py-12">
                <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assigned machines</h3>
                <p className="text-gray-500">You don't have any machines assigned to you.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {operatorMachines.map(excavator => {
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
                      
                      {/* Real-time Health Metrics */}
                      <div className="space-y-3 mb-4">
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
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="flex items-center">
                              <Thermometer className="w-4 h-4 mr-1 text-red-500" />
                              Engine Temp
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
                      
                      {/* Location */}
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{excavator.location.address}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <Activity className="w-4 h-4 mr-1" />
                          <span>Engine Hours: {currentData?.engine_hours?.toFixed(1) || excavator.health.engineHours}h</span>
                        </div>
                      </div>
                      
                      {/* Alerts for this machine */}
                      {currentData?.faults && currentData.faults.length > 0 && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <p className="text-sm font-medium text-red-800">Active Faults</p>
                          </div>
                          {currentData.faults.slice(0, 2).map((fault, index) => (
                            <p key={index} className="text-xs text-red-600">
                              {fault.code}: {fault.description}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            {operatorAlerts.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts</h3>
                <p className="text-gray-500">You don't have any alerts at the moment.</p>
              </div>
            ) : (
              operatorAlerts.map(alert => (
                <div key={alert.id} className={`dashboard-card border-l-4 ${getAlertSeverityColor(alert.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className={`w-5 h-5 ${
                          alert.severity === 'critical' ? 'text-red-500' :
                          alert.severity === 'high' ? 'text-orange-500' :
                          alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                        }`} />
                        <span className={`px-2 py-1 text-xs font-medium rounded-full uppercase ${getAlertSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(alert.timestamp, 'MMM dd, HH:mm')}
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-2">{alert.message}</h4>
                      
                      {alert.excavatorId && (
                        <p className="text-sm text-gray-600">
                          Machine: {mockExcavators.find(exc => exc.health.deviceId === alert.excavatorId)?.model}
                        </p>
                      )}
                    </div>
                    
                    {!alert.acknowledged && (
                      <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OperatorDashboard;