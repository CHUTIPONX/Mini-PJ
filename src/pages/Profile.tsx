import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit3, Check, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { DashboardLayout } from '../components/laout/DashboardLayout';
import { fetchAddresses, Address } from '../services/addressService';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, isAuthenticated, isLoading, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }

    // ดึงที่อยู่เริ่มต้นเพื่อเอาข้อมูล ที่อยู่ และ เบอร์โทรศัพท์
    fetchAddresses().then(addresses => {
      const def = addresses.find(a => a.isDefault);
      setDefaultAddress(def || null);
    });
  }, [user]);

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (updateProfile) {
        await updateProfile(formData);
      }
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
    </div>
  );

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[3rem] border border-slate-100 p-10 md:p-14 shadow-xl shadow-slate-50/50"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">ข้อมูลส่วนตัว</h2>
            <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-[0.2em]">Profile Settings</p>
          </div>
          
          <AnimatePresence mode='wait'>
            {!isEditing ? (
              <motion.button
                key="edit"
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#0F172A] text-white text-xs font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl uppercase tracking-widest active:scale-95"
              >
                <Edit3 className="w-4 h-4" /> แก้ไขโปรไฟล์
              </motion.button>
            ) : (
              <motion.div key="actions" className="flex gap-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <button
                  disabled={isSaving}
                  onClick={handleSave}
                  className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white text-xs font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg uppercase tracking-widest active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  บันทึกข้อมูล
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-4 bg-slate-100 text-slate-500 text-xs font-black rounded-2xl uppercase tracking-widest"
                >
                  ยกเลิก
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ชื่อ-นามสกุล (Editable) */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">ชื่อ-นามสกุล</label>
            <div className="relative group">
              <User className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isEditing ? 'text-blue-600' : 'text-slate-300'}`} />
              <input
                disabled={!isEditing}
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* อีเมล (Always Locked) */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">อีเมล</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input disabled type="email" value={formData.email} className="w-full pl-14 pr-6 py-5 bg-slate-100/50 border border-slate-100 rounded-[1.5rem] font-bold text-slate-400 outline-none cursor-not-allowed" />
            </div>
          </div>

          {/* ข้อมูลการติดต่อและที่อยู่ (Read-only Section) */}
          <div className="md:col-span-2 mt-4 space-y-4">
            <div className="flex justify-between items-end ml-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ข้อมูลการจัดส่งเริ่มต้น</label>
              <button 
                onClick={() => navigate('/addresses')} 
                className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
              >
                จัดการที่อยู่และเบอร์โทร <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] relative overflow-hidden group">
              {defaultAddress ? (
                <div className="space-y-8">
                  {/* แสดงเบอร์โทรศัพท์ที่ล็อกไว้ตาม Address */}
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600 border border-slate-100">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">เบอร์โทรศัพท์ผู้รับ</p>
                      <p className="text-lg font-black text-slate-900">{defaultAddress.phone}</p>
                    </div>
                  </div>

                  {/* แสดงที่อยู่ */}
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600 border border-slate-100 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ที่อยู่จัดส่ง</p>
                      <h5 className="font-black text-slate-800 uppercase text-sm mb-1">{defaultAddress.name} ({defaultAddress.recipient})</h5>
                      <p className="text-xs text-slate-500 font-bold leading-relaxed max-w-xl">{defaultAddress.address}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-slate-400 text-sm font-bold italic">ยังไม่ได้เลือกที่อยู่และเบอร์โทรศัพท์เริ่มต้น</p>
                  <button 
                    onClick={() => navigate('/addresses')}
                    className="mt-4 px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-blue-600 shadow-sm"
                  >
                    ไปที่หน้าจัดการที่อยู่
                  </button>
                </div>
              )}
            </div>
            <p className="text-[9px] text-slate-400 font-bold italic ml-2">
              * ข้อมูลเบอร์โทรศัพท์และที่อยู่จะถูกดึงมาจากที่อยู่เริ่มต้นของคุณ หากต้องการแก้ไขโปรดไปที่หน้าจัดการที่อยู่
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-12 p-8 bg-blue-50/50 border border-blue-100 rounded-[2.5rem] flex items-center gap-6">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600 border border-blue-50">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">Verified Account</h4>
            <p className="text-sm text-slate-500 font-bold">ข้อมูลของคุณได้รับการปกป้องและจะถูกใช้เพื่อการจัดส่งเท่านั้น</p>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};