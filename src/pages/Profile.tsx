import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit3, Check } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { DashboardLayout } from '../components/laout/DashboardLayout';

export const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '081-234-5678',
    address: '123/45 หมู่บ้านตัวอย่าง ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-[3rem] border border-slate-100 p-10 md:p-14 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">ข้อมูลส่วนตัว</h2>
            <p className="text-slate-400 font-bold mt-1">จัดการข้อมูลการติดต่อและที่อยู่จัดส่งของคุณ</p>
          </div>
          
          <AnimatePresence mode='wait'>
            {!isEditing ? (
              <motion.button
                key="edit"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#0F172A] text-white text-sm font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                <Edit3 className="w-4 h-4" /> แก้ไขข้อมูล
              </motion.button>
            ) : (
              <motion.div key="actions" className="flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white text-sm font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                >
                  <Check className="w-4 h-4" /> บันทึก
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-4 bg-slate-100 text-slate-500 text-sm font-black rounded-2xl hover:bg-slate-200 transition-all"
                >
                  ยกเลิก
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">ชื่อ-นามสกุล</label>
            <div className="relative group">
              <User className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isEditing ? 'text-blue-600' : 'text-slate-300'}`} />
              <input
                disabled={!isEditing}
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">อีเมล (ไม่สามารถเปลี่ยนได้)</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input
                disabled={true}
                type="email"
                value={formData.email}
                className="w-full pl-14 pr-6 py-4.5 bg-slate-100/50 border border-slate-100 rounded-[1.5rem] font-bold text-slate-400 outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">เบอร์โทรศัพท์</label>
            <div className="relative group">
              <Phone className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isEditing ? 'text-blue-600' : 'text-slate-300'}`} />
              <input
                disabled={!isEditing}
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">ที่อยู่จัดส่งเริ่มต้น</label>
            <div className="relative group">
              <MapPin className={`absolute left-5 top-6 w-5 h-5 transition-colors ${isEditing ? 'text-blue-600' : 'text-slate-300'}`} />
              <textarea
                disabled={!isEditing}
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all disabled:opacity-60 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 bg-blue-50/50 border border-blue-100 rounded-[2.5rem] flex items-center gap-6">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600 border border-blue-50">
            <Check className="w-8 h-8 font-black" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-lg uppercase">บัญชีผ่านการตรวจสอบแล้ว</h4>
            <p className="text-sm text-slate-500 font-bold">ข้อมูลของคุณได้รับการปกป้องด้วยระบบรักษาความปลอดภัยสูงสุด</p>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};