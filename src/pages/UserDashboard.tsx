import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, Package, Heart, TrendingUp, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { cn } from '@/src/lib/utils';
import { DashboardLayout } from '../components/laout/DashboardLayout'; // ใช้ Layout หลัก

// ส่วนประกอบของ Card สถิติ - คงไว้เหมือนเดิม
const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className={cn("p-4 rounded-2xl", color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex items-center gap-1 text-emerald-500 font-black text-xs">
        {change} <TrendingUp className="w-3 h-3" />
      </div>
    </div>
    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</h4>
    <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
  </div>
);

// คอมโพเนนต์ ChevronRight - คงไว้เหมือนเดิม
const ChevronRight = ({ className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);

export const UserDashboard = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header ส่วนเนื้อหาหลัก */}
        <header>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">ยินดีต้อนรับกลับมา!</h2>
            <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-[0.2em]">ภาพรวมบัญชีและกิจกรรมล่าสุดของคุณ</p>
          </motion.div>
        </header>

        {/* สถิติ (Stats Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard 
            title="คำสั่งซื้อทั้งหมด" 
            value="12 รายการ" 
            change="+20%" 
            icon={Package} 
            color="bg-blue-600" 
          />
          <StatCard 
            title="สินค้าที่ถูกใจ" 
            value="24 ชิ้น" 
            change="+5%" 
            icon={Heart} 
            color="bg-rose-500" 
          />
        </div>

        {/* กิจกรรมล่าสุด (Recent Activity) */}
        <section className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-600" /> กิจกรรมล่าสุด
            </h3>
            <Link to="/orders" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
              ดูทั้งหมด
            </Link>
          </div>
          
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <motion.div 
                key={i} 
                whileHover={{ x: 5 }}
                className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-transparent hover:border-blue-100 hover:bg-white transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <ShoppingBag className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm">คำสั่งซื้อ #ORD-202{i}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">กำลังจัดส่ง • {i * 2} ชั่วโมงที่แล้ว</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-all" />
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};