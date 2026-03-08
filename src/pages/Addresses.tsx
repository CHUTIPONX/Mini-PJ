import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Edit, Trash2, Home, Building, Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '@/src/context/AuthContext';
import { cn } from '@/src/lib/utils';
import { DashboardLayout } from '../components/laout/DashboardLayout';
import { 
  Address,
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../services/addressService';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const initialFormData = {
  type: 'home' as const,
  name: '',
  recipient: '',
  phone: '',
  address: '',
  isDefault: false
};

export const Addresses = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [addressList, setAddressList] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [markerPos, setMarkerPos] = useState<[number, number]>([13.7563, 100.5018]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoadingAddresses(true);
      fetchAddresses()
        .then(setAddressList)
        .finally(() => setIsLoadingAddresses(false));
    }
  }, [isAuthenticated]);

  const fetchAddressName = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
      const data = await res.json();
      if (data.display_name) {
        setFormData(prev => ({ ...prev, address: data.display_name }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPos([lat, lng]);
        fetchAddressName(lat, lng);
      },
    });
    return null;
  };

  const handleAddAddress = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const updatedAddresses = await addAddress(formData);
      setAddressList(updatedAddresses);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setFormData({
      type: address.type,
      name: address.name,
      recipient: address.recipient,
      phone: address.phone,
      address: address.address,
      isDefault: address.isDefault
    });
    setEditingId(address.id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateAddress = async () => {
    if (!editingId || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const updatedAddresses = await updateAddress({ ...formData, id: editingId });
      setAddressList(updatedAddresses);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const updatedAddresses = await deleteAddress(id);
      setAddressList(updatedAddresses);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefault = async (id: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const updatedAddresses = await setDefaultAddress(id);
      setAddressList(updatedAddresses);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setShowAddForm(false);
    setEditingId(null);
    setIsMapOpen(false);
  };

  if (isAuthLoading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-blue-600">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">ที่อยู่จัดส่ง</h2>
            <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-[0.2em]">Delivery Addresses</p>
          </div>
          {!showAddForm && (
            <button
              onClick={() => { setShowAddForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-[#0F172A] text-white text-xs font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl uppercase tracking-widest"
            >
              <Plus className="w-4 h-4" /> เพิ่มที่อยู่ใหม่
            </button>
          )}
        </header>

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[3rem] border border-blue-100 p-8 md:p-10 shadow-xl shadow-blue-50/50"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <div className="w-2 h-8 bg-blue-600 rounded-full" />
                  {editingId ? 'แก้ไขข้อมูล' : 'เพิ่มที่อยู่ใหม่'}
                </h3>
                <button 
                  type="button" onClick={() => setIsMapOpen(!isMapOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-100"
                >
                  <MapPin className="w-3 h-3" /> {isMapOpen ? 'ปิดแผนที่' : 'เลือกจากแผนที่'}
                </button>
              </div>

              {isMapOpen && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-8">
                  <div className="rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-inner h-[300px]">
                    <MapContainer center={markerPos} zoom={13} style={{ height: '100%', width: '100%' }}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={markerPos} />
                      <MapEvents />
                    </MapContainer>
                  </div>
                </motion.div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">ประเภท</label>
                  <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                    {['home', 'work', 'other'].map((t) => (
                      <button
                        key={t} type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: t as any }))}
                        className={cn("flex-1 py-2.5 rounded-xl text-xs font-black uppercase transition-all", formData.type === t ? "bg-white text-blue-600 shadow-sm" : "text-slate-400")}
                      >
                        {t === 'home' ? 'บ้าน' : t === 'work' ? 'งาน' : 'อื่นๆ'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">ชื่อเรียก</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">ชื่อผู้รับ</label>
                  <input type="text" value={formData.recipient} onChange={(e) => setFormData(prev => ({ ...prev, recipient: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">เบอร์โทรศัพท์</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">ที่อยู่โดยละเอียด</label>
                  <textarea value={formData.address} onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))} rows={3} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none resize-none" />
                </div>
                <div className="md:col-span-2 flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                  <input type="checkbox" id="isDefault" checked={formData.isDefault} onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))} className="w-5 h-5 rounded-lg text-blue-600" />
                  <label htmlFor="isDefault" className="text-sm font-black text-blue-900 cursor-pointer">ตั้งเป็นที่อยู่เริ่มต้น</label>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-10">
                <button onClick={resetForm} disabled={isSubmitting} className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">ยกเลิก</button>
                <button onClick={editingId ? handleUpdateAddress : handleAddAddress} disabled={isSubmitting} className="w-48 flex items-center justify-center px-10 py-4 bg-blue-600 text-white text-xs font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 uppercase tracking-widest">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingId ? 'บันทึกแก้ไข' : 'ยืนยัน')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoadingAddresses ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div>
        ) : (
          <div className="grid gap-6">
            {addressList.map((address) => (
              <motion.div
                key={address.id} layout
                className={cn("group bg-white rounded-[2.5rem] border-2 p-8 transition-all hover:shadow-xl relative overflow-hidden", address.isDefault ? "border-blue-600 shadow-lg" : "border-slate-50")}
              >
                {address.isDefault && (
                  <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                    <div className="absolute top-4 -right-8 w-32 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest text-center rotate-45">Default</div>
                  </div>
                )}
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center border", address.isDefault ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-slate-50 text-slate-400 border-slate-100")}>
                      {address.type === 'home' ? <Home /> : address.type === 'work' ? <Building /> : <MapPin />}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-black text-slate-900 text-xl tracking-tight uppercase">{address.name}</h3>
                      <p className="font-black text-slate-800 flex items-center gap-2">{address.recipient} <span className="w-1 h-1 bg-slate-300 rounded-full" /> <span className="text-slate-500 font-bold">{address.phone}</span></p>
                      <p className="text-sm text-slate-400 font-bold leading-relaxed max-w-lg">{address.address}</p>
                    </div>
                  </div>
                  <div className="flex md:flex-col gap-2 w-full md:w-auto">
                    <button onClick={() => handleEditAddress(address)} className="flex-1 p-3 text-slate-400 hover:text-blue-600 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-xs"><Edit className="w-4 h-4" /> แก้ไข</button>
                    <button onClick={() => handleDeleteAddress(address.id)} className="flex-1 p-3 text-slate-400 hover:text-red-600 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-xs"><Trash2 className="w-4 h-4" /> ลบ</button>
                  </div>
                </div>
                {!address.isDefault && (
                  <div className="mt-8 pt-6 border-t border-slate-50 flex justify-end">
                    <button onClick={() => handleSetDefault(address.id)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-4 py-2 rounded-lg">ตั้งเป็นที่อยู่เริ่มต้น</button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};