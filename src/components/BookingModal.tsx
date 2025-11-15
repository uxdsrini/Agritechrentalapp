import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Equipment, Vendor } from '../types';
import { createBooking } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';

interface BookingModalProps {
  equipment: Equipment;
  vendor: Vendor;
  onClose: () => void;
  onSuccess: () => void;
  onNavigateToBookings?: () => void;
}

export function BookingModal({ equipment, vendor, onClose, onSuccess, onNavigateToBookings }: BookingModalProps) {
  const { currentUser } = useAuth();
  const [userPhone, setUserPhone] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to make a booking');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      await createBooking({
        itemId: equipment.id,
        vendorId: vendor.id,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Unknown User',
        userEmail: currentUser.email || '',
        userPhone,
        date: new Date(date),
        status: 'pending',
      });
      onSuccess();
      if (onNavigateToBookings) {
        onNavigateToBookings();
      }
    } catch (err) {
      console.error('Booking error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit booking request. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Request Booking</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-1">{equipment.name}</h3>
            <p className="text-xs sm:text-sm text-gray-600">Vendor: {vendor.name}</p>
            <p className="text-xs sm:text-sm text-gray-600">Location: {vendor.location}</p>
            <p className="text-base sm:text-lg font-bold text-green-600 mt-2">₹{equipment.pricePerDay}/day</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="p-2.5 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-800">
                <span className="font-semibold">Booking as:</span> {currentUser?.displayName}
              </p>
              <p className="text-xs text-blue-600 mt-1">{currentUser?.email}</p>
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                required
                pattern="[0-9]{10}"
                placeholder="10-digit mobile number"
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Rental Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                min={today}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {error && (
              <div className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-3 py-2 sm:px-4 text-sm sm:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
