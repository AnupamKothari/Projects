'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockExcavators, mockBookings, calculateBookingCost, autoAssignOperator } from '@/utils/mockData';
import { fetchSensorData, sensorDataService } from '@/utils/api';
import { Excavator, Booking, BookingForm, SensorData } from '@/types';
import Navigation from '@/components/layout/Navigation';
import ExcavatorCard from '@/components/excavator/ExcavatorCard';
import BookingFlow from '@/components/booking/BookingFlow';
import MyBookings from '@/components/booking/MyBookings';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const ProjectManagerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'browse' | 'bookings'>('browse');
  const [excavators, setExcavators] = useState<Excavator[]>(mockExcavators);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [selectedExcavator, setSelectedExcavator] = useState<Excavator | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [sensorData, setSensorData] = useState<Record<string, SensorData>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user bookings
    const userSpecificBookings = mockBookings.filter(
      booking => booking.projectManagerId === user?.id
    );
    setUserBookings(userSpecificBookings);

    // Set up real-time sensor data monitoring
    const deviceIds = mockExcavators.map(exc => exc.health.deviceId);
    deviceIds.forEach(deviceId => {
      sensorDataService.subscribe(deviceId, (data: SensorData) => {
        setSensorData(prev => ({
          ...prev,
          [deviceId]: data
        }));
      }, 10000); // Update every 10 seconds
    });

    setIsLoading(false);

    // Cleanup on unmount
    return () => {
      sensorDataService.unsubscribeAll();
    };
  }, [user?.id]);

  // Filter excavators based on search and type
  const filteredExcavators = excavators.filter(excavator => {
    const matchesSearch = excavator.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         excavator.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         excavator.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || excavator.type.toLowerCase().includes(filterType.toLowerCase());
    
    return matchesSearch && matchesType;
  });

  const handleBookExcavator = (excavator: Excavator) => {
    setSelectedExcavator(excavator);
    setShowBookingFlow(true);
  };

  const handleBookingComplete = (booking: Booking) => {
    setUserBookings(prev => [booking, ...prev]);
    setShowBookingFlow(false);
    setSelectedExcavator(null);
  };

  const stats = {
    totalBookings: userBookings.length,
    activeBookings: userBookings.filter(b => b.status === 'active').length,
    totalSpent: userBookings.reduce((sum, b) => sum + (b.actualCost || b.estimatedCost), 0),
    avgCostPerHour: 820
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
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-600">
            Manage your excavator bookings and monitor fleet health in real-time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="metric-card">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Cost/Hour</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.avgCostPerHour}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('browse')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'browse'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Browse Excavators
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Bookings ({userBookings.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'browse' && (
          <div>
            {/* Search and Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by model, type, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="compact">Compact Excavator</option>
                  <option value="medium">Medium Excavator</option>
                  <option value="large">Large Excavator</option>
                </select>
              </div>
            </div>

            {/* Excavator Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExcavators.map(excavator => (
                <ExcavatorCard
                  key={excavator.id}
                  excavator={excavator}
                  sensorData={sensorData[excavator.health.deviceId]}
                  onBook={() => handleBookExcavator(excavator)}
                />
              ))}
            </div>

            {filteredExcavators.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No excavators found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <MyBookings bookings={userBookings} excavators={excavators} />
        )}
      </div>

      {/* Booking Flow Modal */}
      {showBookingFlow && selectedExcavator && (
        <BookingFlow
          excavator={selectedExcavator}
          onComplete={handleBookingComplete}
          onClose={() => {
            setShowBookingFlow(false);
            setSelectedExcavator(null);
          }}
        />
      )}
    </div>
  );
};

export default ProjectManagerDashboard;