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
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={equipment.imageUrl}
          alt={equipment.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {!equipment.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
              Not Available
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{equipment.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{equipment.category}</p>
        {vendor && (
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{vendor.location}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-green-600 font-bold text-lg">
            <IndianRupee className="w-5 h-5" />
            <span>{equipment.pricePerDay}</span>
            <span className="text-sm font-normal text-gray-500 ml-1">/day</span>
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
