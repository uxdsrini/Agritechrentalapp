import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { VendorCard } from '../components/VendorCard';
import { Vendor, Equipment } from '../types';
import { subscribeToVendors, subscribeToEquipment } from '../services/firebaseService';

interface VendorsPageProps {
  onBack: () => void;
  onVendorClick: (vendorId: string) => void;
}

export function VendorsPage({ onBack, onVendorClick }: VendorsPageProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeVendors = subscribeToVendors((data) => {
      setVendors(data);
      setLoading(false);
    });

    const unsubscribeEquipment = subscribeToEquipment((data) => {
      setEquipment(data);
    });

    return () => {
      unsubscribeVendors();
      unsubscribeEquipment();
    };
  }, []);

  const getEquipmentCount = (vendorId: string) => {
    return equipment.filter(e => e.vendorId === vendorId && !e.deleted).length;
  };

  const filteredVendors = vendors.filter(vendor => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      vendor.name.toLowerCase().includes(query) ||
      vendor.location.toLowerCase().includes(query) ||
      vendor.description.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onBack={onBack} title="All Vendors" />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onBack={onBack} title="All Vendors" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search vendors by name, location, or description..."
          />
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {searchQuery ? `Found ${filteredVendors.length} vendors` : `All Vendors (${vendors.length})`}
          </h2>
        </div>

        {filteredVendors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                equipmentCount={getEquipmentCount(vendor.id)}
                onClick={() => onVendorClick(vendor.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No vendors found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
