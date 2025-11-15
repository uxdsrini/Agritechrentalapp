import { useState, useEffect } from 'react';
import { MapPin, Phone, IndianRupee, Package, CheckCircle, XCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { BookingModal } from '../components/BookingModal';
import { Equipment, Vendor } from '../types';
import { getEquipmentById, getVendorById } from '../services/firebaseService';

interface EquipmentDetailPageProps {
  equipmentId: string;
  onBack: () => void;
  onVendorClick: (vendorId: string) => void;
}

export function EquipmentDetailPage({ equipmentId, onBack, onVendorClick }: EquipmentDetailPageProps) {
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const equipmentData = await getEquipmentById(equipmentId);
        setEquipment(equipmentData);

        if (equipmentData) {
          const vendorData = await getVendorById(equipmentData.vendorId);
          setVendor(vendorData);
        }
      } catch (error) {
        console.error('Error loading equipment details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [equipmentId]);

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onBack={onBack} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (!equipment || !vendor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onBack={onBack} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">Equipment not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header onBack={onBack} />

      {bookingSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
            <p className="text-green-800">
              Booking request submitted successfully! The vendor will contact you soon.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-4 sm:mb-8">
          <div>
            <div className="aspect-video sm:aspect-square rounded-xl sm:rounded-lg overflow-hidden bg-gray-100 shadow-sm sm:shadow-lg">
              <img
                src={equipment.imageUrl}
                alt={equipment.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-lg shadow-sm sm:shadow-md p-4 sm:p-6">
            <div className="mb-3 sm:mb-4">
              <span className="inline-block px-2.5 py-1 sm:px-3 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm font-medium mb-2 sm:mb-3">
                {equipment.category}
              </span>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2">{equipment.name}</h1>
              <div className="flex items-center mb-3 sm:mb-4">
                {equipment.available ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Available</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <XCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Not Available</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-3 sm:mb-6 pb-3 sm:pb-6 border-b border-gray-200">
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{equipment.description}</p>
            </div>

            <div className="mb-3 sm:mb-6 pb-3 sm:pb-6 border-b border-gray-200">
              <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Rental Price</p>
              <div className="flex items-center text-green-600">
                <IndianRupee className="w-6 h-6 sm:w-8 sm:h-8" />
                <span className="text-3xl sm:text-4xl font-bold">{equipment.pricePerDay}</span>
                <span className="text-base sm:text-lg text-gray-500 ml-2">/day</span>
              </div>
            </div>

            <div className="mb-3 sm:mb-6">
              <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-3">Vendor Information</p>
              <div
                onClick={() => onVendorClick(vendor.id)}
                className="border border-gray-200 rounded-lg p-2.5 sm:p-4 hover:border-green-500 transition-colors cursor-pointer"
              >
                <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-1.5 sm:mb-2">{vendor.name}</h3>
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{vendor.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{vendor.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowBookingModal(true)}
              disabled={!equipment.available}
              className="w-full py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {equipment.available ? 'Request Booking' : 'Currently Unavailable'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-lg shadow-sm sm:shadow-md p-4 sm:p-6">
          <div className="flex items-center mb-3 sm:mb-4">
            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-2" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Equipment Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-sm">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Category</p>
              <p className="text-sm sm:text-base text-gray-800 font-medium">{equipment.category}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Availability</p>
              <p className="text-sm sm:text-base text-gray-800 font-medium">
                {equipment.available ? 'Available Now' : 'Currently Rented'}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Location</p>
              <p className="text-sm sm:text-base text-gray-800 font-medium">{vendor.location}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Vendor</p>
              <p className="text-sm sm:text-base text-gray-800 font-medium">{vendor.name}</p>
            </div>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          equipment={equipment}
          vendor={vendor}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
