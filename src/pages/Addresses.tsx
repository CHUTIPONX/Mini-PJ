import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Plus, Edit, Trash2, Home, Building, Check
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { cn } from '@/src/lib/utils';
import { DashboardLayout } from '../components/laout/DashboardLayout'; // ดึง Layout มาใช้

const initialAddresses = [
  {
    id: 1,
    type: 'home',
    name: 'บ้านหลัก',
    recipient: 'ชุติพนธ์ ใจดี',
    phone: '081-234-5678',
    address: '123/45 หมู่บ้านนวธานี ถนนเสรีไทย แขวงคันนายาว เขตคันนายาว กรุงเทพมหานคร 10230',
    isDefault: true
  },
  {
    id: 2,
    type: 'work',
    name: 'ออฟฟิศ',
    recipient: 'ชุติพนธ์ ใจดี',
    phone: '092-888-9999',
    address: 'อาคารเอ็มไพร์ ทาวเวอร์ ชั้น 45 ถนนสาทรใต้ แขวงยานนาวา เขตสาทร กรุงเทพมหานคร 10120',
    isDefault: false
  }
];

export const Addresses = () => {
  const { isAuthenticated, isLoading } = useAuth();
  // --- Logic เดิมของคุณทั้งหมด ---
  const [addressList, setAddressList] = useState(initialAddresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    type: 'home',
    name: '',
    recipient: '',
    phone: '',
    address: '',
    isDefault: false
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleAddAddress = () => {
    if (formData.isDefault) {
      setAddressList(prev => prev.map(addr => ({ ...addr, isDefault: false })));
    }
    const newAddress = { id: Date.now(), ...formData };
    setAddressList(prev => [...prev, newAddress]);
    resetForm();
  };

  const handleEditAddress = (address: any) => {
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
  };

  const handleUpdateAddress = () => {
    if (formData.isDefault) {
      setAddressList(prev => prev.map(addr => ({ ...addr, isDefault: false })));
    }
    setAddressList(prev => prev.map(addr =>
      addr.id === editingId ? { ...addr, ...formData } : addr
    ));
    resetForm();
  };

  const handleDeleteAddress = (id: number) => {
    setAddressList(prev => prev.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id: number) => {
    setAddressList(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const resetForm = () => {
    setFormData({ type: 'home', name: '', recipient: '', phone: '', address: '', isDefault: false });
    setShowAddForm(false);
    setEditingId(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">ที่อยู่จัดส่ง</h2>
            <p className="text-slate-400 font-bold mt-1">จัดการสถานที่รับสินค้าเพื่อความรวดเร็วในการจัดส่ง</p>
          </div>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-[#0F172A] text-white text-xs font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest"
            >
              <Plus className="w-4 h-4" /> เพิ่มที่อยู่ใหม่
            </button>
          )}
        </header>

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[3rem] border border-blue-100 p-8 md:p-10 shadow-xl shadow-blue-50/50"
            >
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-600 rounded-full" />
                {editingId ? 'แก้ไขข้อมูลที่อยู่' : 'เพิ่มที่อยู่ใหม่'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">ประเภทที่อยู่</label>
                  <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                    {['home', 'work', 'other'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setFormData(prev => ({ ...prev, type: t }))}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl text-xs font-black uppercase transition-all",
                          formData.type === t ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        {t === 'home' ? 'บ้าน' : t === 'work' ? 'งาน' : 'อื่นๆ'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">ชื่อเรียกที่อยู่</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="เช่น คอนโดสุขุมวิท"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">ชื่อผู้รับ</label>
                  <input
                    type="text"
                    value={formData.recipient}
                    onChange={(e) => setFormData(prev => ({ ...prev, recipient: e.target.value }))}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">เบอร์โทรศัพท์</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">ที่อยู่โดยละเอียด</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none"
                  />
                </div>
                <div className="md:col-span-2 flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                    className="w-5 h-5 rounded-lg border-blue-200 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                  />
                  <label htmlFor="isDefault" className="text-sm font-black text-blue-900 cursor-pointer">ตั้งเป็นที่อยู่เริ่มต้นสำหรับการสั่งซื้อ</label>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-10">
                <button onClick={resetForm} className="px-8 py-4 text-xs font-black text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest">ยกเลิก</button>
                <button
                  onClick={editingId ? handleUpdateAddress : handleAddAddress}
                  className="px-10 py-4 bg-blue-600 text-white text-xs font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 uppercase tracking-widest"
                >
                  {editingId ? 'บันทึกการแก้ไข' : 'ยืนยันเพิ่มที่อยู่'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-6">
          {addressList.map((address) => (
            <motion.div
              key={address.id}
              layout
              className={cn(
                "group bg-white rounded-[2.5rem] border-2 p-8 transition-all hover:shadow-xl hover:shadow-slate-200/50 relative overflow-hidden",
                address.isDefault ? "border-blue-600" : "border-slate-50"
              )}
            >
              {address.isDefault && (
                <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                  <div className="absolute top-4 -right-8 w-32 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest text-center rotate-45 shadow-sm">
                    Default
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                <div className="flex items-start gap-6">
                  <div className={cn(
                    "w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-colors border",
                    address.isDefault ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-slate-50 text-slate-400 border-slate-100 group-hover:bg-slate-100"
                  )}>
                    {address.type === 'home' ? <Home className="w-7 h-7" /> : address.type === 'work' ? <Building className="w-7 h-7" /> : <MapPin className="w-7 h-7" />}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-black text-slate-900 text-xl tracking-tight uppercase">{address.name}</h3>
                    <div className="space-y-1">
                      <p className="font-black text-slate-800 flex items-center gap-2">
                        {address.recipient} 
                        <span className="w-1 h-1 bg-slate-300 rounded-full" /> 
                        <span className="text-slate-500 font-bold">{address.phone}</span>
                      </p>
                      <p className="text-sm text-slate-400 font-bold leading-relaxed max-w-lg">{address.address}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex md:flex-col gap-2 w-full md:w-auto self-end md:self-start">
                  <button onClick={() => handleEditAddress(address)} className="flex-1 p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-xs">
                    <Edit className="w-4 h-4" /> แก้ไข
                  </button>
                  <button onClick={() => handleDeleteAddress(address.id)} className="flex-1 p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-xs">
                    <Trash2 className="w-4 h-4" /> ลบ
                  </button>
                </div>
              </div>

              {!address.isDefault && (
                <div className="mt-8 pt-6 border-t border-slate-50 flex justify-end">
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-4 py-2 rounded-lg transition-all"
                  >
                    Set as default address
                  </button>
                </div>
              )}
            </motion.div>
          ))}

          {addressList.length === 0 && !showAddForm && (
            <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-100 p-20 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                <MapPin className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">คุณยังไม่มีที่อยู่สำหรับจัดส่ง</h3>
              <p className="text-slate-400 font-bold mb-10 max-w-xs mx-auto text-lg leading-relaxed">เพิ่มที่อยู่ตอนนี้เพื่อให้การสั่งซื้อครั้งหน้าของคุณรวดเร็วยิ่งขึ้น</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-10 py-5 bg-[#0F172A] text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 inline-flex items-center gap-3"
              >
                <Plus className="w-5 h-5" /> เพิ่มที่อยู่ใหม่
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};