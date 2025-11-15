export interface Vendor {
  id: string;
  name: string;
  phone: string;
  address: string;
  location: string;
  description: string;
  images: string[];
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
}

export interface Equipment {
  id: string;
  vendorId: string;
  name: string;
  category: string;
  description: string;
  pricePerDay: number;
  imageUrl: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
}

export interface Booking {
  id?: string;
  bookingId?: string;
  itemId: string;
  vendorId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  date: Date;
  status: 'pending' | 'approved' | 'declined';
  createdAt: Date;
}

export type Category = 'Tractor' | 'Tiller' | 'Harvester' | 'Planter' | 'Sprayer' | 'Other';
