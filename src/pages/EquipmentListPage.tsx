import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { EquipmentCard } from '../components/EquipmentCard';
import { Equipment, Vendor } from '../types';
import { subscribeToEquipment, subscribeToVendors } from '../services/firebaseService';

interface EquipmentListPageProps {
  onBack: () => void;
  onEquipmentClick: (equipmentId: string) => void;
  category?: string;
}

export function EquipmentListPage({ onBack, onEquipmentClick, category }: EquipmentListPageProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(category || 'All');
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

  const categories = ['All', 'Tractor', 'Tiller', 'Harvester', 'Planter', 'Sprayer', 'Other'];

  const filteredEquipment = equipment.filter(e => {
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    if (!searchQuery) return matchesCategory;

    const query = searchQuery.toLowerCase();
    const vendor = vendors.find(v => v.id === e.vendorId);
    return matchesCategory && (
      e.name.toLowerCase().includes(query) ||
      e.category.toLowerCase().includes(query) ||
      vendor?.name.toLowerCase().includes(query) ||
      vendor?.location.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onBack={onBack} title="All Equipment" />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header onBack={onBack} title="All Equipment" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search equipment by name, category, vendor, or location..."
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {searchQuery
              ? `Found ${filteredEquipment.length} results`
              : selectedCategory === 'All'
              ? `All Equipment (${filteredEquipment.length})`
              : `${selectedCategory} (${filteredEquipment.length})`}
          </h2>
        </div>

        {filteredEquipment.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((item) => {
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
            <p className="text-gray-500">
              {searchQuery
                ? 'No equipment found matching your search.'
                : `No equipment available in ${selectedCategory} category.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
