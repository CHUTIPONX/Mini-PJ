import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, Package, Heart, TrendingUp, 
  Clock, CreditCard, MapPin 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { cn } from '@/src/lib/utils';
import { DashboardLayout } from '../components/laout/DashboardLayout';

// --- Interfaces ---
interface Order {
  id: string;
  created_at: string;
  status: 'Pending' | 'Processing' | 'Delivering' | 'Completed' | 'Cancelled';
  total_amount: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ElementType;
  color: string;
}

interface ShortcutCardProps {
  to: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  dark?: boolean;
}

// --- Helper Components ---
const ChevronRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);

const StatusBadge = ({ status }: { status: Order['status'] }) => {
  const styles = {
    Delivering: "bg-emerald-100 text-emerald-600",
    Processing: "bg-indigo-100 text-indigo-600",
    Pending: "bg-amber-100 text-amber-600",
    Completed: "bg-slate-200 text-slate-500",
    Cancelled: "bg-rose-100 text-rose-500",
  };
  const labels = {
    Delivering: "กำลังจัดส่ง",
    Processing: "กำลังเตรียม",
    Pending: "รอดำเนินการ",
    Completed: "สำเร็จแล้ว",
    Cancelled: "ยกเลิกแล้ว",
  };
  return (
    <span className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md", styles[status])}>
      {labels[status]}
    </span>
  );
};

const StatCard = ({ title, value, change, icon: Icon, color }: StatCardProps) => (
  <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className={cn("p-4 rounded-2xl shadow-lg", color)}>
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

const ShortcutCard = ({ to, title, desc, icon: Icon, dark }: ShortcutCardProps) => (
  <Link to={to} className={cn(
    "flex items-center gap-4 p-8 rounded-[2.5rem] transition-all group",
    dark ? "bg-slate-900 hover:bg-indigo-600" : "bg-white border border-slate-100 hover:border-indigo-600"
  )}>
    <div className={cn("p-3 rounded-xl", dark ? "bg-white/10" : "bg-slate-100 group-hover:bg-indigo-50")}>
      <Icon className={cn("w-6 h-6", dark ? "text-white" : "text-slate-900 group-hover:text-indigo-600")} />
    </div>
    <div>
      <p className={cn("font-black text-xl tracking-tight", dark ? "text-white" : "text-slate-900")}>{title}</p>
      <p className={cn("text-[10px] font-bold uppercase tracking-widest", dark ? "text-white/50" : "text-slate-400")}>{desc}</p>
    </div>
  </Link>
);

const OrderRow = ({ order, onClick }: { order: Order, onClick: () => void }) => (
  <motion.div 
    whileHover={{ x: 10 }}
    onClick={onClick}
    className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[2.5rem] border border-transparent hover:border-indigo-100 hover:bg-white transition-all group cursor-pointer"
  >
    <div className="flex items-center gap-6">
      <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-sm group-hover:shadow-indigo-100 group-hover:shadow-xl transition-all duration-500 text-slate-300 group-hover:text-indigo-600">
        <ShoppingBag className={cn(
          "w-7 h-7 transition-all",
          order.status === 'Delivering' && "text-emerald-500 animate-pulse"
        )} />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <p className="font-black text-slate-900 text-base font-sans">#{order.id}</p>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">
          วันที่สั่ง: {new Date(order.created_at).toLocaleDateString('th-TH')}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-6">
      <div className="text-right hidden sm:block">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">ยอดสุทธิ</p>
        <p className="text-lg font-black text-slate-900 tracking-tighter">฿{order.total_amount.toLocaleString()}</p>
      </div>
      <div className={cn(
        "w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-100 transition-all duration-300",
        ['Pending', 'Processing', 'Delivering'].includes(order.status) ? "bg-emerald-500 border-emerald-500 text-white" : "group-hover:bg-indigo-600 group-hover:border-indigo-600 text-slate-300 group-hover:text-white"
      )}>
        <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  </motion.div>
);

// --- Main Page ---
export const UserDashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const syncWithLocalStorage = () => {
      setFetching(true);
      const localData = localStorage.getItem('mock_orders');
      
      if (localData) {
        const parsedOrders = JSON.parse(localData);
        // เรียงจากใหม่ไปเก่า (ล่าสุดอยู่บน)
        const sortedOrders = parsedOrders.sort((a: Order, b: Order) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setOrders(sortedOrders);
      } else {
        // ไม่มีข้อมูลเลย ให้เป็น Array ว่าง
        setOrders([]);
      }
      setTimeout(() => setFetching(false), 600);
    };

    syncWithLocalStorage();
    window.addEventListener('storage', syncWithLocalStorage);
    return () => window.removeEventListener('storage', syncWithLocalStorage);
  }, []);

  if (authLoading || fetching) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 animate-pulse">กำลังตรวจสอบข้อมูล...</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-10 py-4 font-sans">
        <header>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">
              ยินดีต้อนรับ, <span className="text-indigo-600">{user?.firstName || 'User'}</span>
            </h2>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-slate-200">
                Verified Account
              </span>
              <p className="text-slate-400 font-bold text-[11px] tracking-widest uppercase">{user?.email || 'user@example.com'}</p>
            </div>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="รายการสั่งซื้อ" value={orders.length} change="+ล่าสุด" icon={Package} color="bg-indigo-600" />
          <StatCard title="สินค้าที่ชอบ" value="12" change="+2" icon={Heart} color="bg-rose-500" />
          <StatCard title="คะแนนสะสม" value="450" change="+50" icon={CreditCard} color="bg-amber-500" />
        </div>

        <section className="bg-white rounded-[3.5rem] p-8 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/40 blur-3xl -z-10 rounded-full" />
          
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
              <Clock className="w-7 h-7 text-indigo-600" /> กิจกรรมล่าสุด
            </h3>
            <Link to="/orders" className="text-[10px] font-black uppercase tracking-widest underline underline-offset-4 hover:text-indigo-600 transition-colors">
              ดูทั้งหมด
            </Link>
          </div>
          
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="p-20 text-center bg-slate-50 rounded-[3.5rem] border border-dashed border-slate-200">
                <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">ยังไม่มีประวัติการสั่งซื้อ</p>
                <Link to="/shop" className="inline-block mt-4 text-indigo-600 text-[10px] font-black uppercase tracking-widest bg-white px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all">ไปช้อปปิ้งเลย</Link>
              </div>
            ) : (
              orders.slice(0, 5).map((order) => (
                <OrderRow 
                  key={order.id} 
                  order={order} 
                  onClick={() => {
                    // ถ้ากำลังส่ง หรือรอดำเนินการ ให้เด้งไปหน้า Tracking ทันที
                    if (['Pending', 'Processing', 'Delivering'].includes(order.status)) {
                      navigate(`/tracking/${order.id}`);
                    } else {
                      navigate(`/orders/${order.id}`);
                    }
                  }}
                />
              ))
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ShortcutCard to="/addresses" title="ที่อยู่จัดส่ง" desc="แก้ไขสถานที่รับพัสดุ" icon={MapPin} dark />
          <ShortcutCard to="/settings" title="บัญชีผู้ใช้" desc="ตั้งค่าความเป็นส่วนตัว" icon={CreditCard} />
        </div>
      </div>
    </DashboardLayout>
  );
};