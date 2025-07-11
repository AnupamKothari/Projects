import axios from 'axios';
import { SensorData } from '@/types';
import { generateSensorData } from './mockData';

// AWS API configuration
const AWS_API_BASE_URL = 'https://6ur6ae6kal.execute-api.eu-north-1.amazonaws.com/prod';

// Create axios instance with default config
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch real-time sensor data from AWS API
export const fetchSensorData = async (deviceId: string): Promise<SensorData> => {
  try {
    const response = await apiClient.get(`${AWS_API_BASE_URL}/sensor-data`, {
      params: { device_id: deviceId }
    });
    
    return response.data;
  } catch (error) {
    console.warn(`Failed to fetch AWS sensor data for ${deviceId}, using mock data:`, error);
    // Fallback to mock data if AWS API fails
    return generateSensorData(deviceId);
  }
};

// Fetch sensor data for multiple devices
export const fetchMultipleSensorData = async (deviceIds: string[]): Promise<Record<string, SensorData>> => {
  const promises = deviceIds.map(async (deviceId) => {
    try {
      const data = await fetchSensorData(deviceId);
      return { deviceId, data };
    } catch (error) {
      console.warn(`Failed to fetch data for ${deviceId}:`, error);
      return { deviceId, data: generateSensorData(deviceId) };
    }
  });

  const results = await Promise.allSettled(promises);
  const sensorDataMap: Record<string, SensorData> = {};

  results.forEach((result, index) => {
    const deviceId = deviceIds[index];
    if (result.status === 'fulfilled') {
      sensorDataMap[deviceId] = result.value.data;
    } else {
      console.warn(`Failed to process sensor data for ${deviceId}:`, result.reason);
      sensorDataMap[deviceId] = generateSensorData(deviceId);
    }
  });

  return sensorDataMap;
};

// Real-time sensor data subscription using polling
export class SensorDataService {
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private callbacks: Map<string, (data: SensorData) => void> = new Map();

  subscribe(deviceId: string, callback: (data: SensorData) => void, intervalMs: number = 5000) {
    // Clear existing subscription if any
    this.unsubscribe(deviceId);

    // Store callback
    this.callbacks.set(deviceId, callback);

    // Initial fetch
    this.fetchAndNotify(deviceId);

    // Set up polling interval
    const interval = setInterval(() => {
      this.fetchAndNotify(deviceId);
    }, intervalMs);

    this.intervals.set(deviceId, interval);
  }

  unsubscribe(deviceId: string) {
    const interval = this.intervals.get(deviceId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(deviceId);
    }
    this.callbacks.delete(deviceId);
  }

  unsubscribeAll() {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals.clear();
    this.callbacks.clear();
  }

  private async fetchAndNotify(deviceId: string) {
    try {
      const data = await fetchSensorData(deviceId);
      const callback = this.callbacks.get(deviceId);
      if (callback) {
        callback(data);
      }
    } catch (error) {
      console.error(`Failed to fetch sensor data for ${deviceId}:`, error);
    }
  }
}

// Create singleton instance
export const sensorDataService = new SensorDataService();

// Health status calculation utilities
export const calculateHealthStatus = (sensorData: SensorData): 'excellent' | 'good' | 'warning' | 'critical' => {
  const criticalThresholds = {
    temperature: 100,
    fuelLevel: 20,
    hydraulicPressure: 300,
  };

  const warningThresholds = {
    temperature: 90,
    fuelLevel: 30,
    hydraulicPressure: 280,
  };

  // Check for critical conditions
  if (
    sensorData.temperature > criticalThresholds.temperature ||
    sensorData.fuel_level < criticalThresholds.fuelLevel ||
    sensorData.hydraulic_pressure > criticalThresholds.hydraulicPressure ||
    sensorData.faults.length > 2
  ) {
    return 'critical';
  }

  // Check for warning conditions
  if (
    sensorData.temperature > warningThresholds.temperature ||
    sensorData.fuel_level < warningThresholds.fuelLevel ||
    sensorData.hydraulic_pressure > warningThresholds.hydraulicPressure ||
    sensorData.faults.length > 0
  ) {
    return 'warning';
  }

  // Check for good conditions
  if (sensorData.productivity_score > 85 && sensorData.fuel_level > 50) {
    return 'excellent';
  }

  return 'good';
};

// Calculate uptime percentage
export const calculateUptime = (sensorData: SensorData, totalHours: number = 24): number => {
  // This is a simplified calculation - in real implementation, 
  // you'd track actual uptime from historical data
  const isOnline = sensorData.status === 'online';
  const hasFaults = sensorData.faults.length > 0;
  
  if (!isOnline) return 0;
  if (hasFaults) return Math.max(75, 100 - (sensorData.faults.length * 10));
  
  return Math.min(100, sensorData.productivity_score + 5);
};

// Format sensor data for display
export const formatSensorValue = (value: number, unit: string, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}${unit}`;
};

// Determine status color based on health
export const getHealthColor = (status: 'excellent' | 'good' | 'warning' | 'critical'): string => {
  switch (status) {
    case 'excellent':
      return '#10b981'; // green
    case 'good':
      return '#f59e0b'; // yellow
    case 'warning':
      return '#f97316'; // orange
    case 'critical':
      return '#ef4444'; // red
    default:
      return '#6b7280'; // gray
  }
};

// Get status icon based on health
export const getHealthIcon = (status: 'excellent' | 'good' | 'warning' | 'critical'): string => {
  switch (status) {
    case 'excellent':
      return '✅';
    case 'good':
      return '✳️';
    case 'warning':
      return '⚠️';
    case 'critical':
      return '🚨';
    default:
      return '❓';
  }
};

// Mock API functions for other operations
export const mockApiDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Booking API functions
export const createBooking = async (bookingData: any): Promise<{ success: boolean; bookingId?: string; error?: string }> => {
  await mockApiDelay(1500);
  
  // Simulate success/failure
  if (Math.random() < 0.9) {
    return {
      success: true,
      bookingId: `book_${Date.now()}`
    };
  } else {
    return {
      success: false,
      error: 'Failed to create booking. Please try again.'
    };
  }
};

// Payment API functions
export const savePaymentMethod = async (paymentData: any): Promise<{ success: boolean; paymentMethodId?: string; error?: string }> => {
  await mockApiDelay(2000);
  
  // Simulate success/failure
  if (Math.random() < 0.95) {
    return {
      success: true,
      paymentMethodId: `pm_${Date.now()}`
    };
  } else {
    return {
      success: false,
      error: 'Failed to save payment method. Please check your details and try again.'
    };
  }
};

// Process usage-based payment
export const processUsagePayment = async (bookingId: string, actualHours: number): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  await mockApiDelay(3000);
  
  // Simulate success/failure
  if (Math.random() < 0.92) {
    return {
      success: true,
      transactionId: `txn_${Date.now()}`
    };
  } else {
    return {
      success: false,
      error: 'Payment processing failed. Please contact support.'
    };
  }
};

// Operator assignment API
export const assignOperator = async (bookingId: string, operatorId: string): Promise<{ success: boolean; error?: string }> => {
  await mockApiDelay(800);
  
  return {
    success: true
  };
};

// Auto-assign technician for maintenance
export const autoAssignTechnician = async (excavatorId: string, faultType: string): Promise<{ success: boolean; technicianId?: string; estimatedArrival?: string }> => {
  await mockApiDelay(1200);
  
  // Simulate technician assignment
  return {
    success: true,
    technicianId: 'tech1',
    estimatedArrival: '30 minutes'
  };
};

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || `Server error: ${error.response.status}`;
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error. Please check your internet connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred.';
  }
};

// Rate limiting utility for API calls
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  isAllowed(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the time window
    const validRequests = requests.filter(timestamp => now - timestamp < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();