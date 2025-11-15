import { useState, useEffect } from 'react';
import { MapPin, Phone, Star } from 'lucide-react';
import { Header } from '../components/Header';
import { EquipmentCard } from '../components/EquipmentCard';
import { Vendor, Equipment } from '../types';
import { getVendorById, getEquipmentByVendor } from '../services/firebaseService';

interface VendorDetailPageProps {
  vendorId: string;
  onBack: () => void;
  onEquipmentClick: (equipmentId: string) => void;
}

export function VendorDetailPage({ vendorId, onBack, onEquipmentClick }: VendorDetailPageProps) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [vendorData, equipmentData] = await Promise.all([
          getVendorById(vendorId),
          getEquipmentByVendor(vendorId)
        ]);
        setVendor(vendorData);
        setEquipment(equipmentData);
      } catch (error) {
        console.error('Error loading vendor details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [vendorId]);

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

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onBack={onBack} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">Vendor not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onBack={onBack} />

      <div className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-200 mb-4">
                <img
                  src={vendor.images[0] || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {vendor.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {vendor.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                      <img
                        src={image}
                        alt={`${vendor.name} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-800">{vendor.name}</h1>
                {vendor.rating > 0 && (
                  <div className="flex items-center bg-yellow-50 px-3 py-2 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-lg font-semibold text-gray-700">{vendor.rating}</span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{vendor.description}</p>

              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-800 font-medium">{vendor.location}</p>
                    <p className="text-sm text-gray-600">{vendor.address}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="text-gray-800 font-medium">{vendor.phone}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-green-800">
                  <span className="font-bold text-2xl">{equipment.length}</span> equipment available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Equipment</h2>
        {equipment.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map((item) => (
              <EquipmentCard
                key={item.id}
                equipment={item}
                vendor={vendor}
                onClick={() => onEquipmentClick(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No equipment available from this vendor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
