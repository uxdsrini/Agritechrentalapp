import { collection, getDocs, getDoc, doc, addDoc, query, where, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Vendor, Equipment, Booking } from '../types';

export const getVendors = async (): Promise<Vendor[]> => {
  const vendorsCol = collection(db, 'vendors');
  const vendorSnapshot = await getDocs(vendorsCol);
  return vendorSnapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Vendor))
    .filter(vendor => !vendor.deleted);
};

export const getVendorById = async (id: string): Promise<Vendor | null> => {
  const vendorDoc = await getDoc(doc(db, 'vendors', id));
  if (!vendorDoc.exists()) return null;
  return {
    id: vendorDoc.id,
    ...vendorDoc.data(),
    createdAt: vendorDoc.data().createdAt?.toDate(),
    updatedAt: vendorDoc.data().updatedAt?.toDate(),
  } as Vendor;
};

export const getEquipment = async (): Promise<Equipment[]> => {
  const equipmentCol = collection(db, 'equipment');
  const equipmentSnapshot = await getDocs(equipmentCol);
  return equipmentSnapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Equipment))
    .filter(equipment => !equipment.deleted);
};

export const getEquipmentById = async (id: string): Promise<Equipment | null> => {
  const equipmentDoc = await getDoc(doc(db, 'equipment', id));
  if (!equipmentDoc.exists()) return null;
  return {
    id: equipmentDoc.id,
    ...equipmentDoc.data(),
    createdAt: equipmentDoc.data().createdAt?.toDate(),
    updatedAt: equipmentDoc.data().updatedAt?.toDate(),
  } as Equipment;
};

export const getEquipmentByVendor = async (vendorId: string): Promise<Equipment[]> => {
  const equipmentCol = collection(db, 'equipment');
  const q = query(equipmentCol, where('vendorId', '==', vendorId));
  const equipmentSnapshot = await getDocs(q);
  return equipmentSnapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Equipment))
    .filter(equipment => !equipment.deleted);
};

export const createBooking = async (booking: Omit<Booking, 'id' | 'bookingId' | 'createdAt'>): Promise<string> => {
  const bookingsCol = collection(db, 'bookings');
  
  // Create a temporary doc reference to get the ID
  const tempDoc = doc(bookingsCol);
  const bookingId = tempDoc.id;
  
  // Add document with bookingId included
  await addDoc(bookingsCol, {
    ...booking,
    bookingId: bookingId,
    date: Timestamp.fromDate(booking.date),
    status: 'pending',
    createdAt: Timestamp.now(),
  });
  
  return bookingId;
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  const bookingsCol = collection(db, 'bookings');
  const q = query(bookingsCol, where('userId', '==', userId));
  const bookingSnapshot = await getDocs(q);
  return bookingSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
  } as Booking));
};

export const subscribeToVendors = (callback: (vendors: Vendor[]) => void) => {
  const vendorsCol = collection(db, 'vendors');
  return onSnapshot(vendorsCol, (snapshot) => {
    const vendors = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      } as Vendor))
      .filter(vendor => !vendor.deleted);
    callback(vendors);
  }, (error) => {
    console.error('Error fetching vendors:', error);
    console.error('Please update Firestore security rules to allow read access');
  });
};

export const subscribeToEquipment = (callback: (equipment: Equipment[]) => void) => {
  const equipmentCol = collection(db, 'equipment');
  return onSnapshot(equipmentCol, (snapshot) => {
    const equipment = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      } as Equipment))
      .filter(equipment => !equipment.deleted);
    callback(equipment);
  }, (error) => {
    console.error('Error fetching equipment:', error);
    console.error('Please update Firestore security rules to allow read access');
  });
};
