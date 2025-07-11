'use client';

import React, { useState } from 'react';
import { Booking, Excavator } from '@/types';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  MapPin, 
  User, 
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  CreditCard,
  Download,
  Eye
} from 'lucide-react';

interface MyBookingsProps {
  bookings: Booking[];
  excavators: Excavator[];
}

const MyBookings: React.FC<MyBookingsProps> = ({ bookings, excavators }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const getExcavator = (excavatorId: string) => {
    return excavators.find(exc => exc.id === excavatorId);
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'active':
        return <AlertCircle className="w-5 h-5 text-green-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: Booking['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (selectedStatus === 'all') return true;
    return booking.status === selectedStatus;
  });

  const calculateDuration = (booking: Booking): number => {
    const diffTime = Math.abs(booking.endDate.getTime() - booking.startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60));
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
        <p className="text-gray-500">Start by browsing available excavators and making your first booking.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['all', 'confirmed', 'active', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                selectedStatus === status
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {status === 'all' ? 'All Bookings' : status}
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                {status === 'all' 
                  ? bookings.length 
                  : bookings.filter(b => b.status === status).length
                }
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map(booking => {
          const excavator = getExcavator(booking.excavatorId);
          const duration = calculateDuration(booking);
          
          return (
            <div key={booking.id} className="dashboard-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  {/* Status Icon */}
                  <div className="mt-1">
                    {getStatusIcon(booking.status)}
                  </div>
                  
                  {/* Booking Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {excavator?.model || 'Unknown Excavator'}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {excavator?.type} • {booking.projectType}
                    </p>
                    
                    {excavator && (
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{excavator.location.address}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  {booking.status === 'completed' && (
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Download Invoice"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Booking Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {/* Date and Time */}
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-medium">Schedule</span>
                  </div>
                  <p className="text-gray-900">
                    {format(booking.startDate, 'MMM dd, yyyy')}
                  </p>
                  <p className="text-gray-600">
                    {format(booking.startDate, 'HH:mm')} - {format(booking.endDate, 'HH:mm')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {duration} hour{duration !== 1 ? 's' : ''}
                  </p>
                </div>
                
                {/* Cost */}
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span className="font-medium">Cost</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{(booking.actualCost || booking.estimatedCost).toLocaleString()}
                  </p>
                  {booking.actualCost && booking.actualCost !== booking.estimatedCost && (
                    <p className="text-xs text-gray-500">
                      Est: ₹{booking.estimatedCost.toLocaleString()}
                    </p>
                  )}
                  {booking.actualHours && (
                    <p className="text-xs text-gray-500">
                      {booking.actualHours}h usage
                    </p>
                  )}
                </div>
                
                {/* Payment Status */}
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <CreditCard className="w-4 h-4 mr-2" />
                    <span className="font-medium">Payment</span>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                    {booking.paymentStatus}
                  </span>
                  {booking.paymentStatus === 'pending' && booking.status === 'confirmed' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Will be charged on usage
                    </p>
                  )}
                </div>
              </div>
              
              {/* Operator Info */}
              {booking.operatorId && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center text-sm">
                    <User className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-600">Operator assigned</span>
                  </div>
                </div>
              )}
              
              {/* Notes */}
              {booking.notes && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <FileText className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                    <p className="text-sm text-blue-800">{booking.notes}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-8">
          <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-gray-900 mb-1">No {selectedStatus} bookings</h3>
          <p className="text-sm text-gray-500">
            {selectedStatus === 'all' 
              ? 'You haven\'t made any bookings yet.'
              : `You don't have any ${selectedStatus} bookings.`
            }
          </p>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Booking Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Booking Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Booking ID:</span>
                    <p className="font-medium">{selectedBooking.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <p className={`font-medium`}>{selectedBooking.status}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <p className="font-medium">{format(selectedBooking.createdAt, 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Updated:</span>
                    <p className="font-medium">{format(selectedBooking.updatedAt, 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                </div>
              </div>
              
              {/* More details can be added here */}
              <div className="text-center">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;