import { MapPin, Phone, Star } from 'lucide-react';
import { Vendor } from '../types';

interface VendorCardProps {
  vendor: Vendor;
  equipmentCount?: number;
  onClick: () => void;
}

export function VendorCard({ vendor, equipmentCount = 0, onClick }: VendorCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group hover:-translate-y-1"
    >
      <div className="relative h-40 overflow-hidden bg-gray-200">
        <img
          src={vendor.images[0] || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400'}
          alt={vendor.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{vendor.name}</h3>
          {vendor.rating > 0 && (
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="text-sm font-semibold text-gray-700">{vendor.rating}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{vendor.description}</p>
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{vendor.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{vendor.phone}</span>
          </div>
        </div>
        <div className="pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-green-600">{equipmentCount}</span> equipment available
          </p>
        </div>
      </div>
    </div>
  );
}
