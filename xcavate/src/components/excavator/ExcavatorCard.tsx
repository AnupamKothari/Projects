'use client';

import React from 'react';
import { Excavator, SensorData } from '@/types';
import { calculateHealthStatus, formatSensorValue, getHealthColor } from '@/utils/api';
import { 
  MapPin, 
  DollarSign, 
  Fuel, 
  Thermometer, 
  Activity, 
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react';

interface ExcavatorCardProps {
  excavator: Excavator;
  sensorData?: SensorData;
  onBook: () => void;
}

const ExcavatorCard: React.FC<ExcavatorCardProps> = ({ 
  excavator, 
  sensorData, 
  onBook 
}) => {
  // Use sensor data if available, otherwise fall back to static health data
  const currentData = sensorData || {
    device_id: excavator.health.deviceId,
    timestamp: new Date().toISOString(),
    engine_hours: excavator.health.engineHours,
    hydraulic_pressure: excavator.health.hydraulicPressure,
    fuel_level: excavator.health.fuelLevel,
    temperature: excavator.health.temperature,
    flow_rate: excavator.health.flowRate,
    cycle_time: excavator.health.cycleTime,
    productivity_score: excavator.health.productivity,
    status: excavator.health.status,
    location: {
      latitude: excavator.location.lat,
      longitude: excavator.location.lng
    },
    faults: []
  };

  const healthStatus = calculateHealthStatus(currentData);
  const healthColor = getHealthColor(healthStatus);

  const getStatusBadge = () => {
    if (!excavator.availability) {
      return <span className="status-badge status-offline">Busy</span>;
    }
    
    switch (currentData.status) {
      case 'online':
        return <span className="status-badge status-online">Available</span>;
      case 'maintenance':
        return <span className="status-badge status-maintenance">Maintenance</span>;
      default:
        return <span className="status-badge status-offline">Offline</span>;
    }
  };

  const getHealthIndicator = () => {
    const baseClass = 'health-indicator';
    switch (healthStatus) {
      case 'excellent':
        return <span className={`${baseClass} health-excellent`}>🟢 Excellent</span>;
      case 'good':
        return <span className={`${baseClass} health-good`}>🟡 Good</span>;
      case 'warning':
        return <span className={`${baseClass} health-warning`}>🟠 Warning</span>;
      case 'critical':
        return <span className={`${baseClass} health-warning`}>🔴 Critical</span>;
      default:
        return <span className={`${baseClass} health-good`}>❓ Unknown</span>;
    }
  };

  return (
    <div className="excavator-card dashboard-card">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {excavator.model}
          </h3>
          <p className="text-sm text-gray-600">{excavator.type}</p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Health Status */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Health Status</span>
          {getHealthIndicator()}
        </div>
        
        {/* Health Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Fuel className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600">Fuel:</span>
            <span className="font-medium">{currentData.fuel_level.toFixed(1)}%</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Thermometer className="w-4 h-4 text-red-500" />
            <span className="text-gray-600">Temp:</span>
            <span className="font-medium">{currentData.temperature.toFixed(1)}°C</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">Productivity:</span>
            <span className="font-medium">{currentData.productivity_score.toFixed(1)}%</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-purple-500" />
            <span className="text-gray-600">Engine Hours:</span>
            <span className="font-medium">{currentData.engine_hours.toFixed(1)}h</span>
          </div>
        </div>
      </div>

      {/* Real-time Metrics Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
          <span>Live Metrics</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Real-time</span>
          </div>
        </div>
        
        <div className="space-y-2">
          {/* Fuel Level Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Fuel Level</span>
              <span>{currentData.fuel_level.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="progress-bar h-2 rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, currentData.fuel_level))}%` }}
              ></div>
            </div>
          </div>
          
          {/* Productivity Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Productivity</span>
              <span>{currentData.productivity_score.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, currentData.productivity_score))}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Location and Cost */}
      <div className="mb-4">
        <div className="flex items-start space-x-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
          <p className="text-sm text-gray-600">{excavator.location.address}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-gray-600">Cost:</span>
          </div>
          <div className="text-right">
            <p className="cost-display text-lg">₹{excavator.costPerHour}</p>
            <p className="text-xs text-gray-500">per hour</p>
          </div>
        </div>
      </div>

      {/* Operator Assignment */}
      {excavator.assignedOperator && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {excavator.assignedOperator.name}
              </p>
              <p className="text-xs text-gray-500">
                {excavator.assignedOperator.experience} years exp • ⭐ {excavator.assignedOperator.rating}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Efficiency Badge */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-600">Fuel Efficiency:</span>
          </div>
          <span className="font-medium text-gray-900">
            {excavator.fuelEfficiency} L/hr
          </span>
        </div>
      </div>

      {/* Alerts */}
      {currentData.faults && currentData.faults.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <p className="text-sm font-medium text-red-800">
              {currentData.faults.length} Active Fault{currentData.faults.length > 1 ? 's' : ''}
            </p>
          </div>
          {currentData.faults.slice(0, 2).map((fault, index) => (
            <p key={index} className="text-xs text-red-600 mt-1">
              {fault.code}: {fault.description}
            </p>
          ))}
        </div>
      )}

      {/* Book Button */}
      <button
        onClick={onBook}
        disabled={!excavator.availability || currentData.status === 'maintenance'}
        className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
          excavator.availability && currentData.status !== 'maintenance'
            ? 'btn-primary'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {excavator.availability && currentData.status !== 'maintenance' ? (
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Book Excavator</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>
              {currentData.status === 'maintenance' ? 'Under Maintenance' : 'Not Available'}
            </span>
          </div>
        )}
      </button>
    </div>
  );
};

export default ExcavatorCard;