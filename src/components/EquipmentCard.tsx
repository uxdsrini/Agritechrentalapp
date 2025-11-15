import { MapPin, IndianRupee } from 'lucide-react';
import { Equipment, Vendor } from '../types';

interface EquipmentCardProps {
  equipment: Equipment;
  vendor?: Vendor;
  onClick: () => void;
}

export function EquipmentCard({ equipment, vendor, onClick }: EquipmentCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group hover:scale-[1.02]"
    >
      <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-100">
        <img
          src={equipment.imageUrl}
          alt={equipment.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!equipment.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1.5 rounded-full font-semibold text-sm">
              Not Available
            </span>
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 line-clamp-1">{equipment.name}</h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-2">{equipment.category}</p>
        {vendor && (
          <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-3">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="line-clamp-1">{vendor.location}</span>
          </div>
        )}
        <div className="flex items-start sm:items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center text-green-600 font-bold text-base sm:text-lg flex-shrink-0">
            <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{equipment.pricePerDay}</span>
            <span className="text-xs sm:text-sm font-normal text-gray-500 ml-1">/day</span>
          </div>
          <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
