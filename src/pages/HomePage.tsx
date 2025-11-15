import { useState, useEffect } from 'react';
import { Tractor, Wrench, Pickaxe, Sprout, Droplets, Package } from 'lucide-react';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { CategoryCard } from '../components/CategoryCard';
import { EquipmentCard } from '../components/EquipmentCard';
import { Equipment, Vendor, Category } from '../types';
import { subscribeToEquipment, subscribeToVendors } from '../services/firebaseService';

interface HomePageProps {
  onCategoryClick: (category: string) => void;
  onEquipmentClick: (equipmentId: string) => void;
  onViewAllEquipment: () => void;
  onViewAllVendors: () => void;
}

const categoryIcons: Record<string, typeof Tractor> = {
  Tractor: Tractor,
  Tiller: Wrench,
  Harvester: Pickaxe,
  Planter: Sprout,
  Sprayer: Droplets,
  Other: Package,
};

export function HomePage({ onCategoryClick, onEquipmentClick, onViewAllEquipment, onViewAllVendors }: HomePageProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeEquipment = subscribeToEquipment((data) => {
      setEquipment(data);
      setLoading(false);
    });

    const unsubscribeVendors = subscribeToVendors((data) => {
      setVendors(data);
    });

    return () => {
      unsubscribeEquipment();
      unsubscribeVendors();
    };
  }, []);

  const categories: Category[] = ['Tractor', 'Tiller', 'Harvester', 'Planter', 'Sprayer', 'Other'];

  const getCategoryCount = (category: string) => {
    return equipment.filter(e => e.category === category && e.available).length;
  };

  const filteredEquipment = equipment.filter(e => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const vendor = vendors.find(v => v.id === e.vendorId);
    return (
      e.name.toLowerCase().includes(query) ||
      e.category.toLowerCase().includes(query) ||
      vendor?.name.toLowerCase().includes(query) ||
      vendor?.location.toLowerCase().includes(query)
    );
  });

  const featuredEquipment = filteredEquipment.filter(e => e.available).slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <div className="bg-gradient-to-br from-green-50 to-green-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
              Rent Agricultural Equipment
            </h2>
            <p className="text-gray-600 text-lg">
              Find the right machinery for your farm from trusted vendors
            </p>
          </div>
          <div className="flex justify-center">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Browse by Category</h3>
          </div>
          <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-4 sm:grid sm:grid-cols-3 lg:grid-cols-6 min-w-max sm:min-w-0">
              {categories.map((category) => (
                <div key={category} className="flex-shrink-0 w-40 sm:w-auto">
                  <CategoryCard
                    name={category}
                    icon={categoryIcons[category]}
                    count={getCategoryCount(category)}
                    onClick={() => onCategoryClick(category)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {searchQuery ? 'Search Results' : 'Featured Equipment'}
            </h3>
            <button
              onClick={onViewAllEquipment}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              View All →
            </button>
          </div>
          {featuredEquipment.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredEquipment.map((item) => {
                const vendor = vendors.find(v => v.id === item.vendorId);
                return (
                  <EquipmentCard
                    key={item.id}
                    equipment={item}
                    vendor={vendor}
                    onClick={() => onEquipmentClick(item.id)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No equipment found matching your search.</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Looking for a Vendor?</h3>
          <p className="text-gray-600 mb-6">
            Browse our trusted vendors and see all available equipment in your area
          </p>
          <button
            onClick={onViewAllVendors}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Browse Vendors
          </button>
        </div>
      </div>
    </div>
  );
}
