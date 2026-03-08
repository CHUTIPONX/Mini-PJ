// src/services/addressService.ts

export interface Address {
  id: number;
  type: 'home' | 'work' | 'other' | string;
  name: string;
  recipient: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

const STORAGE_KEY = 'user_addresses';

// Helper function to get addresses from localStorage
const getStoredAddresses = (): Address[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

// Helper function to save addresses to localStorage
const saveStoredAddresses = (addresses: Address[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    }
};

// API-like functions

export const fetchAddresses = async (): Promise<Address[]> => {
  // Simulate API delay
  await new Promise(res => setTimeout(res, 500));
  const addresses = getStoredAddresses();
  // If no addresses are stored, add some initial demo data for the first time
  if (addresses.length === 0) {
    const initialAddresses: Address[] = [
      {
        id: Date.now() + 1,
        type: 'home',
        name: 'บ้าน (ตัวอย่าง)',
        recipient: 'ผู้ใช้งานตัวอย่าง',
        phone: '0812345678',
        address: '123/45 ถนนสุขุมวิท, คลองเตย, กรุงเทพมหานคร 10110',
        isDefault: true
      },
      {
        id: Date.now() + 2,
        type: 'work',
        name: 'ออฟฟิศ (ตัวอย่าง)',
        recipient: 'ผู้ใช้งานตัวอย่าง',
        phone: '02-123-4567',
        address: '1 อาคารเอ็มไพร์ทาวเวอร์ ชั้น 50 ถนนสาทรใต้ ยานนาวา สาทร กรุงเทพมหานคร 10120',
        isDefault: false
      }
    ];
    saveStoredAddresses(initialAddresses);
    return initialAddresses;
  }
  return addresses.sort((a, b) => (a.isDefault ? -1 : 1)); // Always show default first
};

export const addAddress = async (newAddressData: Omit<Address, 'id'>): Promise<Address[]> => {
  await new Promise(res => setTimeout(res, 300));
  let addresses = getStoredAddresses();
  
  if (newAddressData.isDefault) {
    addresses.forEach(addr => addr.isDefault = false);
  }

  const newAddress: Address = {
    id: Date.now(),
    ...newAddressData
  };
  
  const updatedAddresses = [newAddress, ...addresses];
  saveStoredAddresses(updatedAddresses);
  return updatedAddresses.sort((a, b) => (a.isDefault ? -1 : 1));
};

export const updateAddress = async (updatedAddress: Address): Promise<Address[]> => {
    await new Promise(res => setTimeout(res, 300));
    let addresses = getStoredAddresses();

    if (updatedAddress.isDefault) {
        addresses.forEach(addr => {
            if (addr.id !== updatedAddress.id) addr.isDefault = false;
        });
    }

    const updatedAddresses = addresses.map(addr =>
        addr.id === updatedAddress.id ? updatedAddress : addr
    );

    saveStoredAddresses(updatedAddresses);
    return updatedAddresses.sort((a, b) => (a.isDefault ? -1 : 1));
};

export const deleteAddress = async (id: number): Promise<Address[]> => {
    await new Promise(res => setTimeout(res, 300));
    let addresses = getStoredAddresses();
    let updatedAddresses = addresses.filter(addr => addr.id !== id);

    const wasDefault = !addresses.find(a => a.id === id)?.isDefault;

    // If the deleted address was the default, make the first one the new default
    if (updatedAddresses.length > 0 && !updatedAddresses.some(a => a.isDefault) && wasDefault) {
        updatedAddresses[0].isDefault = true;
    }

    saveStoredAddresses(updatedAddresses);
    return updatedAddresses;
};

export const setDefaultAddress = async (id: number): Promise<Address[]> => {
    await new Promise(res => setTimeout(res, 300));
    let addresses = getStoredAddresses();
    const updatedAddresses = addresses.map(addr => ({ ...addr, isDefault: addr.id === id }));
    saveStoredAddresses(updatedAddresses);
    return updatedAddresses.sort((a, b) => (a.isDefault ? -1 : 1));
}
