export interface User {
  id: string;
  email: string;
  name: string;
  role: 'project_manager' | 'oem' | 'operator';
  avatar?: string;
}

export interface ExcavatorHealth {
  deviceId: string;
  engineHours: number;
  hydraulicPressure: number;
  fuelLevel: number;
  productivity: number;
  uptime: number;
  status: 'online' | 'offline' | 'maintenance';
  temperature: number;
  flowRate: number;
  cycleTime: number;
  faults: number;
  lastUpdate: Date;
}

export interface Excavator {
  id: string;
  model: string;
  type: string;
  costPerHour: number;
  fuelEfficiency: number;
  availability: boolean;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  health: ExcavatorHealth;
  assignedOperator?: Operator;
  image?: string;
}

export interface Operator {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: number;
  rating: number;
  availability: boolean;
  currentAssignments: string[];
  skills: string[];
}

export interface Booking {
  id: string;
  excavatorId: string;
  projectManagerId: string;
  operatorId?: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  estimatedCost: number;
  actualCost?: number;
  actualHours?: number;
  paymentMethod?: PaymentMethod;
  paymentStatus: 'pending' | 'processing' | 'paid' | 'failed';
  requiresOperator: boolean;
  projectType: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  holderName: string;
  isDefault: boolean;
}

export interface BookingForm {
  excavatorId: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  projectType: string;
  requiresOperator: boolean;
  notes?: string;
}

export interface Analytics {
  totalRevenue: number;
  totalBookings: number;
  averageUtilization: number;
  topPerformingMachines: string[];
  monthlyRevenue: { month: string; revenue: number }[];
  fuelEfficiencyTrend: { date: string; efficiency: number }[];
  faultFrequency: { machine: string; faults: number }[];
}

export interface DashboardStats {
  totalMachines: number;
  activeMachines: number;
  totalBookings: number;
  monthlyRevenue: number;
  averageUtilization: number;
  maintenanceAlerts: number;
}

export interface MaintenanceLog {
  id: string;
  excavatorId: string;
  type: 'scheduled' | 'emergency' | 'repair';
  description: string;
  technicianId?: string;
  scheduledDate: Date;
  completedDate?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  cost?: number;
  parts?: string[];
  notes?: string;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  availability: boolean;
  currentAssignments: string[];
  rating: number;
}

export interface Alert {
  id: string;
  type: 'fault' | 'maintenance' | 'low_fuel' | 'high_temperature' | 'operator_needed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  excavatorId?: string;
  timestamp: Date;
  acknowledged: boolean;
  resolvedAt?: Date;
}

export interface SensorData {
  device_id: string;
  timestamp: string;
  engine_hours: number;
  hydraulic_pressure: number;
  fuel_level: number;
  temperature: number;
  flow_rate: number;
  cycle_time: number;
  productivity_score: number;
  status: string;
  location: {
    latitude: number;
    longitude: number;
  };
  faults: Array<{
    code: string;
    description: string;
    severity: string;
  }>;
}

export interface FleetMetrics {
  totalFleetSize: number;
  activeUnits: number;
  utilizationRate: number;
  averageFuelEfficiency: number;
  totalFaultCount: number;
  averageProductivity: number;
}

export interface BookingStep {
  step: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface FilterOptions {
  projectType: string[];
  costRange: [number, number];
  fuelEfficiency: string;
  availability: boolean;
  location: string;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  maintenanceAlerts: boolean;
  bookingUpdates: boolean;
  systemAlerts: boolean;
}