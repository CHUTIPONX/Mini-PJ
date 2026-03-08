import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, Heart, TrendingUp, Clock, CreditCard, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { cn } from '@/src/lib/utils';
import { DashboardLayout } from '../components/laout/DashboardLayout';

// --- คอมโพเนนต์ย่อยสำหรับการแสดงสถิติ (Stat Cards) ---
const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group"
  >
    <div className="flex justify-between items-start mb-6">
      <div className={cn("p-4 rounded-2xl shadow-lg shadow-current/5", color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex items-center gap-1 text-emerald-500 font-black text-[10px] bg-emerald-50 px-2.5 py-1 rounded-full">
        {change} <TrendingUp className="w-3 h-3" />
      </div>
    </div>
    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</h4>
    <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
  </motion.div>
);

const ChevronRight = ({ className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);

export const UserDashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <div className="space-y-10 py-4">
        
        {/* --- Header Section: Welcome Message --- */}
        <header className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">
              ยินดีต้อนรับ, <span className="text-indigo-600">{user?.name || 'Guest'}</span>
            </h2>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                Verified Account
              </span>
              <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest">
                {user?.email}
              </p>
            </div>
          </motion.div>
        </header>

        {/* --- Stats Grid Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="คำสั่งซื้อสะสม" 
            value="12 รายการ" 
            change="+2%" 
            icon={Package} 
            color="bg-indigo-600" 
          />
          <StatCard 
            title="สินค้าที่ถูกใจ" 
            value="24 ชิ้น" 
            change="+12%" 
            icon={Heart} 
            color="bg-rose-500" 
          />
          <StatCard 
            title="คะแนนสะสม" 
            value="1,250 P" 
            change="+150" 
            icon={CreditCard} 
            color="bg-amber-500" 
          />
        </div>

        {/* --- Recent Activity Section --- */}
        <section className="bg-white rounded-[3.5rem] p-8 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden">
          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/30 blur-[100px] -z-10" />
          
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                <Clock className="w-7 h-7 text-indigo-600" /> กิจกรรมล่าสุด
              </h3>
              <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">ติดตามสถานะการสั่งซื้อล่าสุดของคุณ</p>
            </div>
            <Link to="/orders" className="px-6 py-3 bg-slate-50 hover:bg-indigo-600 hover:text-white text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] rounded-2xl transition-all duration-300">
              ดูประวัติทั้งหมด
            </Link>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 10 }}
                className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[2.5rem] border border-transparent hover:border-indigo-100 hover:bg-white transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-sm group-hover:shadow-indigo-100 group-hover:shadow-xl transition-all duration-500">
                    <ShoppingBag className="w-7 h-7 text-slate-300 group-hover:text-indigo-600 group-hover:scale-110 transition-all" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-black text-slate-900 text-base">#ORD-2026-00{i}</p>
                      <span className={cn(
                        "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                        i === 1 ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-500"
                      )}>
                        {i === 1 ? 'Processing' : 'Completed'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">
                      สั่งซื้อเมื่อ: {i + 5} มีนาคม 2026 • 1{i}:20 น.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">ยอดสุทธิ</p>
                    <p className="text-lg font-black text-slate-900 tracking-tighter">฿{(2490 * i).toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-100 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-300">
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-white transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- Quick Shortcuts --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/addresses" className="flex items-center gap-4 p-8 bg-slate-900 rounded-[2.5rem] hover:bg-indigo-600 transition-all group">
             <div className="p-3 bg-white/10 rounded-xl">
               <MapPin className="w-6 h-6 text-white" />
             </div>
             <div>
               <p className="text-white font-black text-lg tracking-tight">จัดการที่อยู่จัดส่ง</p>
               <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">เพิ่มหรือแก้ไขสถานที่รับสินค้า</p>
             </div>
          </Link>
          <Link to="/settings" className="flex items-center gap-4 p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:border-indigo-600 transition-all group">
             <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-indigo-50">
               <CreditCard className="w-6 h-6 text-slate-900 group-hover:text-indigo-600" />
             </div>
             <div>
               <p className="text-slate-900 font-black text-lg tracking-tight">การชำระเงิน</p>
               <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">ตั้งค่าบัตรและช่องทางชำระเงิน</p>
             </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};