import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Bell, Shield, Save, Eye, 
  EyeOff, Lock, Trash2, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { cn } from '@/src/lib/utils';
import { DashboardLayout } from '../components/laout/DashboardLayout';

export const SettingsPage = () => {
  const { logout } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      orderUpdates: true,
      promotions: false,
      newProducts: true,
      emailNotifications: true
    }
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({
    current: false, new: false, confirm: false
  });

  const handleToggle = (category: string, setting: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: { 
        ...prev[category as keyof typeof prev], 
        [setting]: !prev[category as keyof typeof prev][setting as any] 
      }
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header */}
        <header>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">การตั้งค่า</h2>
            <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-widest">การจัดการบัญชีและระบบ</p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 gap-10">
          
          {/* ส่วนการแจ้งเตือน */}
          <section className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-14 h-14 bg-amber-50 rounded-[1.5rem] flex items-center justify-center border border-amber-100 shadow-inner">
                <Bell className="w-7 h-7 text-amber-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">การแจ้งเตือน</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">จัดการการแจ้งเตือนจากระบบ</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { id: 'orderUpdates', label: 'สถานะคำสั่งซื้อแบบเรียลไทม์', desc: 'ติดตามสถานะการจัดส่งสินค้าและยืนยันคำสั่งซื้อ' },
                { id: 'promotions', label: 'โปรโมชั่นและสิทธิพิเศษ', desc: 'รับข้อมูล Flash Sales และคูปองส่วนลดสำหรับคุณ' },
                { id: 'emailNotifications', label: 'สรุปใบเสร็จทางอีเมล', desc: 'รับใบเสร็จรับเงินอิเล็กทรอนิกส์ผ่านทางอีเมลโดยอัตโนมัติ' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] hover:bg-slate-100/50 transition-colors border border-transparent hover:border-slate-100 group">
                  <div className="space-y-1">
                    <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight group-hover:text-blue-600 transition-colors">{item.label}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('notifications', item.id)}
                    className={cn(
                      "w-14 h-8 rounded-full transition-all relative",
                      settings.notifications[item.id as keyof typeof settings.notifications] ? 'bg-blue-600' : 'bg-slate-200'
                    )}
                  >
                    <motion.div 
                      animate={{ x: settings.notifications[item.id as keyof typeof settings.notifications] ? 24 : 4 }}
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md" 
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ส่วนความปลอดภัย */}
          <section className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-50 rounded-[1.5rem] flex items-center justify-center border border-blue-100 shadow-inner">
                  <Lock className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">ความปลอดภัย</h2>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">จัดการรหัสผ่านและความปลอดภัยบัญชี</p>
                </div>
              </div>
              {!showPasswordForm && (
                <button 
                  onClick={() => setShowPasswordForm(true)}
                  className="px-8 py-4 bg-[#0F172A] text-white text-[10px] font-black rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-[0.2em] shadow-xl shadow-slate-200"
                >
                  เปลี่ยนรหัสผ่าน
                </button>
              )}
            </div>

            <AnimatePresence>
              {showPasswordForm && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-6 overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['รหัสผ่านปัจจุบัน', 'รหัสผ่านใหม่', 'ยืนยันรหัสผ่านใหม่'].map((label, idx) => {
                      const fields = ['current', 'new', 'confirm'];
                      const field = fields[idx];
                      return (
                        <div key={field} className={cn("space-y-3", field === 'confirm' ? "md:col-span-2" : "")}>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">
                            {label}
                          </label>
                          <div className="relative">
                            <input
                              type={visiblePasswords[field as keyof typeof visiblePasswords] ? 'text' : 'password'}
                              className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.8rem] font-black text-sm text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                              placeholder="••••••••"
                            />
                            <button 
                              type="button"
                              onClick={() => setVisiblePasswords(prev => ({ ...prev, [field]: !prev[field as keyof typeof visiblePasswords] }))}
                              className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors"
                            >
                              {visiblePasswords[field as keyof typeof visiblePasswords] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button className="flex-1 py-5 bg-blue-600 text-white font-black rounded-[1.8rem] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all uppercase text-xs tracking-[0.2em]">
                      อัปเดตรหัสผ่าน
                    </button>
                    <button onClick={() => setShowPasswordForm(false)} className="px-10 py-5 bg-slate-100 text-slate-500 font-black rounded-[1.8rem] hover:bg-slate-200 transition-all uppercase text-xs tracking-widest">
                      ยกเลิก
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* ส่วนอันตราย */}
          <section className="bg-rose-50/50 rounded-[3rem] border border-rose-100 p-10 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-xl font-black text-rose-600 uppercase tracking-tighter">โซนอันตราย</h3>
                <p className="text-[10px] text-rose-400 font-black uppercase tracking-widest leading-relaxed">การลบบัญชีจะทำให้ข้อมูลคำสั่งซื้อและสิทธิประโยชน์ทั้งหมดหายไปถาวร</p>
              </div>
              <button className="flex items-center gap-3 px-8 py-4 bg-white border border-rose-200 text-rose-500 text-[10px] font-black rounded-2xl hover:bg-rose-600 hover:text-white transition-all uppercase tracking-[0.2em] group-hover:shadow-xl group-hover:shadow-rose-100">
                <Trash2 className="w-4 h-4" /> ลบบัญชีผู้ใช้
              </button>
            </div>
          </section>

          {/* ปุ่มบันทึกหลัก */}
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-6 bg-[#0F172A] text-white font-black rounded-[2.5rem] shadow-2xl shadow-slate-200 flex items-center justify-center gap-4 transition-all uppercase text-sm tracking-[0.3em] group"
          >
            <Save className="w-5 h-5 text-blue-400 group-hover:rotate-12 transition-transform" />
            บันทึกการตั้งค่าทั้งหมด
          </motion.button>

        </div>
      </div>
    </DashboardLayout>
  );
};