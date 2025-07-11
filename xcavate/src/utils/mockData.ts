import { Excavator, Operator, Booking, Analytics, DashboardStats, MaintenanceLog, Technician, Alert, SensorData, FleetMetrics } from '@/types';

// Mock Operators
export const mockOperators: Operator[] = [
  {
    id: 'op1',
    name: 'David Martinez',
    email: 'david@xcavate.com',
    phone: '+1-555-0101',
    experience: 8,
    rating: 4.8,
    availability: true,
    currentAssignments: [],
    skills: ['Hydraulic Systems', 'Heavy Machinery', 'Site Safety']
  },
  {
    id: 'op2',
    name: 'Lisa Chen',
    email: 'lisa@xcavate.com',
    phone: '+1-555-0102',
    experience: 12,
    rating: 4.9,
    availability: true,
    currentAssignments: ['EXC_003'],
    skills: ['Precision Operations', 'Hydraulic Systems', 'Advanced Controls']
  },
  {
    id: 'op3',
    name: 'Carlos Rodriguez',
    email: 'carlos@xcavate.com',
    phone: '+1-555-0103',
    experience: 6,
    rating: 4.6,
    availability: false,
    currentAssignments: ['EXC_002'],
    skills: ['Site Preparation', 'Heavy Machinery', 'Equipment Maintenance']
  }
];

// Mock Technicians
export const mockTechnicians: Technician[] = [
  {
    id: 'tech1',
    name: 'Robert Kim',
    email: 'robert@xcavate.com',
    phone: '+1-555-0201',
    specialization: ['Hydraulic Systems', 'Engine Diagnostics'],
    availability: true,
    currentAssignments: [],
    rating: 4.7
  },
  {
    id: 'tech2',
    name: 'Anna Thompson',
    email: 'anna@xcavate.com',
    phone: '+1-555-0202',
    specialization: ['Electrical Systems', 'Control Units'],
    availability: true,
    currentAssignments: ['EXC_004'],
    rating: 4.9
  }
];

// Mock Excavators with Health Data
export const mockExcavators: Excavator[] = [
  {
    id: 'EXC_001',
    model: 'CAT 320D',
    type: 'Medium Excavator',
    costPerHour: 850,
    fuelEfficiency: 18.5,
    availability: true,
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: 'New York Construction Site A'
    },
    health: {
      deviceId: 'EXCAVATOR_001',
      engineHours: 2450,
      hydraulicPressure: 285,
      fuelLevel: 78,
      productivity: 92,
      uptime: 94,
      status: 'online',
      temperature: 85,
      flowRate: 125,
      cycleTime: 24,
      faults: 0,
      lastUpdate: new Date()
    },
    assignedOperator: mockOperators[0],
    image: '/excavators/cat-320d.jpg'
  },
  {
    id: 'EXC_002',
    model: 'Komatsu PC200',
    type: 'Medium Excavator',
    costPerHour: 800,
    fuelEfficiency: 19.2,
    availability: false,
    location: {
      lat: 40.7589,
      lng: -73.9851,
      address: 'Manhattan Infrastructure Project'
    },
    health: {
      deviceId: 'EXCAVATOR_002',
      engineHours: 3120,
      hydraulicPressure: 270,
      fuelLevel: 45,
      productivity: 88,
      uptime: 87,
      status: 'online',
      temperature: 92,
      flowRate: 118,
      cycleTime: 26,
      faults: 1,
      lastUpdate: new Date()
    },
    assignedOperator: mockOperators[2],
    image: '/excavators/komatsu-pc200.jpg'
  },
  {
    id: 'EXC_003',
    model: 'Volvo EC140',
    type: 'Compact Excavator',
    costPerHour: 650,
    fuelEfficiency: 22.1,
    availability: true,
    location: {
      lat: 40.6892,
      lng: -74.0445,
      address: 'Brooklyn Residential Development'
    },
    health: {
      deviceId: 'EXCAVATOR_003',
      engineHours: 1890,
      hydraulicPressure: 245,
      fuelLevel: 82,
      productivity: 95,
      uptime: 96,
      status: 'online',
      temperature: 78,
      flowRate: 105,
      cycleTime: 22,
      faults: 0,
      lastUpdate: new Date()
    },
    assignedOperator: mockOperators[1],
    image: '/excavators/volvo-ec140.jpg'
  },
  {
    id: 'EXC_004',
    model: 'JCB JS330',
    type: 'Large Excavator',
    costPerHour: 950,
    fuelEfficiency: 16.8,
    availability: true,
    location: {
      lat: 40.8176,
      lng: -73.9482,
      address: 'Bronx Highway Extension'
    },
    health: {
      deviceId: 'EXCAVATOR_004',
      engineHours: 4200,
      hydraulicPressure: 295,
      fuelLevel: 23,
      productivity: 78,
      uptime: 82,
      status: 'maintenance',
      temperature: 105,
      flowRate: 140,
      cycleTime: 30,
      faults: 3,
      lastUpdate: new Date()
    },
    image: '/excavators/jcb-js330.jpg'
  },
  {
    id: 'EXC_005',
    model: 'Hitachi ZX200',
    type: 'Medium Excavator',
    costPerHour: 780,
    fuelEfficiency: 20.3,
    availability: true,
    location: {
      lat: 40.7282,
      lng: -73.7949,
      address: 'Queens Commercial District'
    },
    health: {
      deviceId: 'EXCAVATOR_005',
      engineHours: 2780,
      hydraulicPressure: 275,
      fuelLevel: 91,
      productivity: 91,
      uptime: 93,
      status: 'online',
      temperature: 83,
      flowRate: 122,
      cycleTime: 25,
      faults: 0,
      lastUpdate: new Date()
    },
    image: '/excavators/hitachi-zx200.jpg'
  }
];

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    id: 'book1',
    excavatorId: 'EXC_001',
    projectManagerId: '1',
    operatorId: 'op1',
    startDate: new Date('2024-01-15T08:00:00'),
    endDate: new Date('2024-01-15T17:00:00'),
    status: 'active',
    estimatedCost: 7650,
    actualCost: 7650,
    actualHours: 9,
    paymentStatus: 'paid',
    requiresOperator: true,
    projectType: 'Site Preparation',
    notes: 'Foundation excavation for new building',
    createdAt: new Date('2024-01-10T10:00:00'),
    updatedAt: new Date('2024-01-15T08:00:00')
  },
  {
    id: 'book2',
    excavatorId: 'EXC_003',
    projectManagerId: '1',
    startDate: new Date('2024-01-20T09:00:00'),
    endDate: new Date('2024-01-22T16:00:00'),
    status: 'confirmed',
    estimatedCost: 10400,
    paymentStatus: 'pending',
    requiresOperator: false,
    projectType: 'Landscaping',
    notes: 'Garden preparation and pond excavation',
    createdAt: new Date('2024-01-12T14:30:00'),
    updatedAt: new Date('2024-01-12T14:30:00')
  }
];

// Mock Analytics
export const mockAnalytics: Analytics = {
  totalRevenue: 485000,
  totalBookings: 127,
  averageUtilization: 78.5,
  topPerformingMachines: ['EXC_003', 'EXC_001', 'EXC_005'],
  monthlyRevenue: [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 58000 },
    { month: 'Jun', revenue: 67000 }
  ],
  fuelEfficiencyTrend: [
    { date: '2024-01', efficiency: 18.2 },
    { date: '2024-02', efficiency: 18.8 },
    { date: '2024-03', efficiency: 19.1 },
    { date: '2024-04', efficiency: 19.5 },
    { date: '2024-05', efficiency: 19.8 },
    { date: '2024-06', efficiency: 20.2 }
  ],
  faultFrequency: [
    { machine: 'EXC_001', faults: 2 },
    { machine: 'EXC_002', faults: 4 },
    { machine: 'EXC_003', faults: 1 },
    { machine: 'EXC_004', faults: 8 },
    { machine: 'EXC_005', faults: 3 }
  ]
};

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalMachines: 5,
  activeMachines: 4,
  totalBookings: 127,
  monthlyRevenue: 67000,
  averageUtilization: 78.5,
  maintenanceAlerts: 3
};

// Mock Maintenance Logs
export const mockMaintenanceLogs: MaintenanceLog[] = [
  {
    id: 'maint1',
    excavatorId: 'EXC_004',
    type: 'emergency',
    description: 'Hydraulic system pressure anomaly detected',
    technicianId: 'tech1',
    scheduledDate: new Date('2024-01-16T10:00:00'),
    status: 'in_progress',
    cost: 2500,
    parts: ['Hydraulic Pump', 'Pressure Sensor'],
    notes: 'Requires immediate attention due to high pressure readings'
  },
  {
    id: 'maint2',
    excavatorId: 'EXC_002',
    type: 'scheduled',
    description: 'Regular 500-hour maintenance service',
    scheduledDate: new Date('2024-01-25T08:00:00'),
    status: 'scheduled',
    notes: 'Standard preventive maintenance'
  }
];

// Mock Alerts
export const mockAlerts: Alert[] = [
  {
    id: 'alert1',
    type: 'high_temperature',
    severity: 'high',
    message: 'Engine temperature exceeding normal range on EXC_004',
    excavatorId: 'EXC_004',
    timestamp: new Date(),
    acknowledged: false
  },
  {
    id: 'alert2',
    type: 'low_fuel',
    severity: 'medium',
    message: 'Fuel level below 25% on EXC_004',
    excavatorId: 'EXC_004',
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    acknowledged: false
  },
  {
    id: 'alert3',
    type: 'maintenance',
    severity: 'low',
    message: 'Scheduled maintenance due for EXC_002',
    excavatorId: 'EXC_002',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    acknowledged: true
  }
];

// Mock Fleet Metrics
export const mockFleetMetrics: FleetMetrics = {
  totalFleetSize: 5,
  activeUnits: 4,
  utilizationRate: 78.5,
  averageFuelEfficiency: 19.38,
  totalFaultCount: 4,
  averageProductivity: 88.8
};

// Utility function to simulate AWS sensor data API response
export const generateSensorData = (deviceId: string): SensorData => {
  const excavator = mockExcavators.find(exc => exc.health.deviceId === deviceId);
  if (!excavator) {
    throw new Error(`Device ${deviceId} not found`);
  }

  // Add some randomness to simulate real sensor readings
  const variation = () => (Math.random() - 0.5) * 0.1; // ±5% variation

  return {
    device_id: deviceId,
    timestamp: new Date().toISOString(),
    engine_hours: excavator.health.engineHours + Math.random() * 0.1,
    hydraulic_pressure: excavator.health.hydraulicPressure * (1 + variation()),
    fuel_level: Math.max(0, excavator.health.fuelLevel * (1 + variation())),
    temperature: excavator.health.temperature * (1 + variation()),
    flow_rate: excavator.health.flowRate * (1 + variation()),
    cycle_time: excavator.health.cycleTime * (1 + variation()),
    productivity_score: excavator.health.productivity * (1 + variation()),
    status: excavator.health.status,
    location: {
      latitude: excavator.location.lat + (Math.random() - 0.5) * 0.001,
      longitude: excavator.location.lng + (Math.random() - 0.5) * 0.001
    },
    faults: excavator.health.faults > 0 ? [
      {
        code: 'HYD_001',
        description: 'Hydraulic pressure anomaly',
        severity: 'medium'
      }
    ] : []
  };
};

// Utility function to calculate booking cost
export const calculateBookingCost = (
  excavatorId: string,
  startDate: Date,
  endDate: Date,
  actualHours?: number
): number => {
  const excavator = mockExcavators.find(exc => exc.id === excavatorId);
  if (!excavator) return 0;

  if (actualHours) {
    return actualHours * excavator.costPerHour;
  }

  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  return diffHours * excavator.costPerHour;
};

// Utility function to check operator availability
export const checkOperatorAvailability = (
  operatorId: string,
  startDate: Date,
  endDate: Date
): boolean => {
  const operator = mockOperators.find(op => op.id === operatorId);
  if (!operator || !operator.availability) return false;

  // Check for conflicts with existing bookings
  const conflictingBookings = mockBookings.filter(booking => 
    booking.operatorId === operatorId &&
    booking.status !== 'cancelled' &&
    booking.status !== 'completed' &&
    (
      (startDate >= booking.startDate && startDate < booking.endDate) ||
      (endDate > booking.startDate && endDate <= booking.endDate) ||
      (startDate <= booking.startDate && endDate >= booking.endDate)
    )
  );

  return conflictingBookings.length === 0;
};

// Utility function to auto-assign operator
export const autoAssignOperator = (startDate: Date, endDate: Date): Operator | null => {
  const availableOperators = mockOperators.filter(operator => 
    checkOperatorAvailability(operator.id, startDate, endDate)
  );

  if (availableOperators.length === 0) return null;

  // Return the operator with highest rating
  return availableOperators.reduce((best, current) => 
    current.rating > best.rating ? current : best
  );
};