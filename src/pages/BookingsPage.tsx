import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { getUserBookings } from '../services/firebaseService';
import { Booking, Equipment, Vendor } from '../types';
import { getEquipmentById, getVendorById } from '../services/firebaseService';
import { Calendar, Phone, MapPin, Package, Clock, CheckCircle, XCircle } from 'lucide-react';

interface BookingsPageProps {
  onBack: () => void;
}

interface BookingWithDetails extends Booking {
  equipment?: Equipment;
  vendor?: Vendor;
}

export function BookingsPage({ onBack }: BookingsPageProps) {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      if (!currentUser) return;

      try {
        const userBookings = await getUserBookings(currentUser.uid);
        
        // Fetch equipment and vendor details for each booking
        const bookingsWithDetails = await Promise.all(
          userBookings.map(async (booking) => {
            const equipment = await getEquipmentById(booking.itemId);
            const vendor = equipment ? await getVendorById(equipment.vendorId) : null;
            return {
              ...booking,
              equipment: equipment || undefined,
              vendor: vendor || undefined,
            };
          })
        );

        // Sort by creation date (newest first)
        bookingsWithDetails.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setBookings(bookingsWithDetails);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [currentUser]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5" />;
      case 'declined':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Your booking has been confirmed! The vendor will contact you soon.';
      case 'declined':
        return 'This booking request was declined. Please try another equipment or date.';
      default:
        return 'Your booking request is pending. Please wait for the vendor to confirm. They will call you soon.';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onBack={onBack} title="My Bookings" />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header onBack={onBack} title="My Bookings" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Bookings</h2>
          <p className="text-gray-600 mt-1">Track your equipment rental requests</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No bookings yet</h3>
            <p className="text-gray-600">
              Start browsing equipment and make your first booking!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {booking.equipment?.name || 'Equipment'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Category: {booking.equipment?.category || 'N/A'}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="text-sm font-medium capitalize">{booking.status}</span>
                    </div>
                  </div>

                  {booking.equipment?.imageUrl && (
                    <img
                      src={booking.equipment.imageUrl}
                      alt={booking.equipment.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Rental Date</p>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Vendor</p>
                        <p className="text-sm text-gray-600">{booking.vendor?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{booking.vendor?.location || ''}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Your Contact</p>
                        <p className="text-sm text-gray-600">{booking.userPhone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Booked On</p>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border-l-4 ${
                    booking.status === 'approved' 
                      ? 'bg-green-50 border-green-500' 
                      : booking.status === 'declined'
                      ? 'bg-red-50 border-red-500'
                      : 'bg-blue-50 border-blue-500'
                  }`}>
                    <p className="text-sm text-gray-700">
                      {getStatusMessage(booking.status)}
                    </p>
                    {booking.status === 'pending' && booking.vendor?.phone && (
                      <p className="text-xs text-gray-600 mt-2">
                        Vendor contact: {booking.vendor.phone}
                      </p>
                    )}
                  </div>

                  {booking.equipment?.pricePerDay && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Price per day:</span>
                        <span className="text-lg font-bold text-green-600">
                          ₹{booking.equipment.pricePerDay}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
