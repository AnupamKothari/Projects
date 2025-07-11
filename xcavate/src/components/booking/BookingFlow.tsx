'use client';

import React, { useState, useEffect } from 'react';
import { Excavator, Booking, BookingForm, PaymentMethod, Operator } from '@/types';
import { autoAssignOperator, calculateBookingCost } from '@/utils/mockData';
import { createBooking, savePaymentMethod } from '@/utils/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  CreditCard, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  MapPin,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

interface BookingFlowProps {
  excavator: Excavator;
  onComplete: (booking: Booking) => void;
  onClose: () => void;
}

type FlowStep = 'booking' | 'payment' | 'confirmation';

const BookingFlow: React.FC<BookingFlowProps> = ({ excavator, onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('booking');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Booking form state
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    excavatorId: excavator.id,
    startDate: '',
    endDate: '',
    startTime: '08:00',
    endTime: '17:00',
    projectType: '',
    requiresOperator: false,
    notes: ''
  });
  
  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: '',
    isDefault: true
  });
  
  const [assignedOperator, setAssignedOperator] = useState<Operator | null>(null);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Calculate cost when form changes
  useEffect(() => {
    if (bookingForm.startDate && bookingForm.endDate && bookingForm.startTime && bookingForm.endTime) {
      const startDateTime = new Date(`${bookingForm.startDate}T${bookingForm.startTime}`);
      const endDateTime = new Date(`${bookingForm.endDate}T${bookingForm.endTime}`);
      
      if (startDateTime < endDateTime) {
        const cost = calculateBookingCost(excavator.id, startDateTime, endDateTime);
        const hours = Math.ceil((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60));
        setEstimatedCost(cost);
        setTotalHours(hours);
      }
    }
  }, [bookingForm, excavator.id]);

  // Auto-assign operator when checkbox is checked
  useEffect(() => {
    if (bookingForm.requiresOperator && bookingForm.startDate && bookingForm.endDate) {
      const startDateTime = new Date(`${bookingForm.startDate}T${bookingForm.startTime}`);
      const endDateTime = new Date(`${bookingForm.endDate}T${bookingForm.endTime}`);
      const operator = autoAssignOperator(startDateTime, endDateTime);
      setAssignedOperator(operator);
    } else {
      setAssignedOperator(null);
    }
  }, [bookingForm.requiresOperator, bookingForm.startDate, bookingForm.endDate, bookingForm.startTime, bookingForm.endTime]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!bookingForm.projectType) {
      setError('Please select a project type');
      return;
    }
    
    if (bookingForm.requiresOperator && !assignedOperator) {
      setError('No operator available for the selected time slot');
      return;
    }
    
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Save payment method
      const paymentResult = await savePaymentMethod(paymentForm);
      
      if (!paymentResult.success) {
        setError(paymentResult.error || 'Failed to save payment method');
        setIsLoading(false);
        return;
      }

      // Create booking
      const bookingData = {
        ...bookingForm,
        operatorId: assignedOperator?.id,
        estimatedCost,
        paymentMethodId: paymentResult.paymentMethodId
      };

      const bookingResult = await createBooking(bookingData);
      
      if (!bookingResult.success) {
        setError(bookingResult.error || 'Failed to create booking');
        setIsLoading(false);
        return;
      }

      // Create booking object for confirmation
      const newBooking: Booking = {
        id: bookingResult.bookingId!,
        excavatorId: excavator.id,
        projectManagerId: '1', // Current user ID
        operatorId: assignedOperator?.id,
        startDate: new Date(`${bookingForm.startDate}T${bookingForm.startTime}`),
        endDate: new Date(`${bookingForm.endDate}T${bookingForm.endTime}`),
        status: 'confirmed',
        estimatedCost,
        paymentStatus: 'pending',
        requiresOperator: bookingForm.requiresOperator,
        projectType: bookingForm.projectType,
        notes: bookingForm.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setCreatedBooking(newBooking);
      setCurrentStep('confirmation');
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    if (createdBooking) {
      onComplete(createdBooking);
    }
  };

  const projectTypes = [
    'Site Preparation',
    'Foundation Work',
    'Landscaping',
    'Road Construction',
    'Demolition',
    'Utility Work',
    'Other'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Book Excavator</h2>
            <p className="text-gray-600">{excavator.model} - {excavator.type}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center space-x-2 ${currentStep === 'booking' ? 'text-orange-600' : currentStep === 'payment' || currentStep === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-green-100' : 'bg-gray-100'}`}>
                {currentStep === 'payment' || currentStep === 'confirmation' ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <span className="font-medium">Booking Details</span>
            </div>
            
            <ArrowRight className="w-4 h-4 text-gray-400" />
            
            <div className={`flex items-center space-x-2 ${currentStep === 'payment' ? 'text-orange-600' : currentStep === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'payment' ? 'bg-orange-100' : currentStep === 'confirmation' ? 'bg-green-100' : 'bg-gray-100'}`}>
                {currentStep === 'confirmation' ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <span className="font-medium">Payment Method</span>
            </div>
            
            <ArrowRight className="w-4 h-4 text-gray-400" />
            
            <div className={`flex items-center space-x-2 ${currentStep === 'confirmation' ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'confirmation' ? 'bg-orange-100' : 'bg-gray-100'}`}>
                3
              </div>
              <span className="font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="p-6">
          {currentStep === 'booking' && (
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              {/* Date and Time Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={bookingForm.startDate}
                    onChange={(e) => setBookingForm({...bookingForm, startDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={bookingForm.endDate}
                    onChange={(e) => setBookingForm({...bookingForm, endDate: e.target.value})}
                    min={bookingForm.startDate || new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={bookingForm.startTime}
                    onChange={(e) => setBookingForm({...bookingForm, startTime: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={bookingForm.endTime}
                    onChange={(e) => setBookingForm({...bookingForm, endTime: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type
                </label>
                <select
                  value={bookingForm.projectType}
                  onChange={(e) => setBookingForm({...bookingForm, projectType: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select project type</option>
                  {projectTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Operator Assignment */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <input
                    type="checkbox"
                    id="requireOperator"
                    checked={bookingForm.requiresOperator}
                    onChange={(e) => setBookingForm({...bookingForm, requiresOperator: e.target.checked})}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="requireOperator" className="text-sm font-medium text-gray-700">
                    Require Operator?
                  </label>
                </div>
                
                {bookingForm.requiresOperator && (
                  <div className="mt-3">
                    {assignedOperator ? (
                      <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <User className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            Auto-assigned: {assignedOperator.name}
                          </p>
                          <p className="text-xs text-green-600">
                            {assignedOperator.experience} years exp • ⭐ {assignedOperator.rating}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <p className="text-sm text-red-600">
                          No operator available for selected time slot
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cost Summary */}
              {estimatedCost > 0 && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Cost Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{totalHours} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate per hour:</span>
                      <span>₹{excavator.costPerHour}</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg border-t pt-2">
                      <span>Total Estimated Cost:</span>
                      <span className="cost-display">₹{estimatedCost.toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    * Final billing based on actual usage
                  </p>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Any special requirements or instructions..."
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary"
                disabled={!estimatedCost}
              >
                Continue to Payment
              </button>
            </form>
          )}

          {currentStep === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Add Payment Method</h3>
                <p className="text-sm text-gray-600">
                  Payment will be charged automatically based on actual usage
                </p>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Estimated Cost: ₹{estimatedCost.toLocaleString()}</strong>
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    No charge until excavator usage begins
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={paymentForm.cardNumber}
                  onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Month
                  </label>
                  <select
                    value={paymentForm.expiryMonth}
                    onChange={(e) => setPaymentForm({...paymentForm, expiryMonth: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">MM</option>
                    {Array.from({length: 12}, (_, i) => (
                      <option key={i+1} value={String(i+1).padStart(2, '0')}>
                        {String(i+1).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Year
                  </label>
                  <select
                    value={paymentForm.expiryYear}
                    onChange={(e) => setPaymentForm({...paymentForm, expiryYear: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">YYYY</option>
                    {Array.from({length: 10}, (_, i) => (
                      <option key={i} value={String(new Date().getFullYear() + i)}>
                        {new Date().getFullYear() + i}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={paymentForm.cvv}
                    onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value})}
                    placeholder="123"
                    maxLength={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={paymentForm.holderName}
                  onChange={(e) => setPaymentForm({...paymentForm, holderName: e.target.value})}
                  placeholder="John Doe"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="defaultPayment"
                  checked={paymentForm.isDefault}
                  onChange={(e) => setPaymentForm({...paymentForm, isDefault: e.target.checked})}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="defaultPayment" className="text-sm text-gray-700">
                  Set as default payment method
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep('booking')}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 btn-primary"
                >
                  {isLoading ? (
                    <LoadingSpinner size="small" color="text-white" />
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </form>
          )}

          {currentStep === 'confirmation' && createdBooking && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600">
                  Your excavator booking has been successfully created.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg text-left">
                <h4 className="font-medium text-gray-900 mb-4">Booking Details</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium">{createdBooking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Excavator:</span>
                    <span className="font-medium">{excavator.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{totalHours} hours</span>
                  </div>
                  {assignedOperator && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Operator:</span>
                      <span className="font-medium">{assignedOperator.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Cost:</span>
                    <span className="font-medium">₹{estimatedCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">Card on file</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Payment will be charged automatically based on actual usage.</strong>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  You'll receive a notification when the excavator starts and stops working.
                </p>
              </div>

              <button
                onClick={handleComplete}
                className="w-full btn-primary"
              >
                View My Bookings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;