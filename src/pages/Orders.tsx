import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Clock, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/laout/DashboardLayout';
import { cn } from '@/src/lib/utils';

// --- Interfaces ---
interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: 'Pending' | 'Processing' | 'Delivering' | 'Completed' | 'Cancelled';
  items?: any[];
}

export const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. Sync Data กับ LocalStorage ---
  useEffect(() => {
    const syncOrders = () => {
      const localData = localStorage.getItem('mock_orders');
      if (localData) {
        const parsedOrders = JSON.parse(localData);
        // เรียงลำดับใหม่ล่าสุดขึ้นก่อน
        const sorted = parsedOrders.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setOrders(sorted);
      }
      setLoading(false);
    };

    syncOrders();
    // ดักฟังการเปลี่ยนแปลงจากหน้าอื่นๆ
    window.addEventListener('storage', syncOrders);
    return () => window.removeEventListener('storage', syncOrders);
  }, []);

  // --- 2. ฟังก์ชันจัดการการคลิก (Link ไปหน้า Tracking) ---
  const handleOrderClick = (id: string, status: string) => {
    // ถ้ากำลังส่ง หรือรอดำเนินการ ให้ไปหน้าแผนที่ Tracking
    if (['Pending', 'Processing', 'Delivering'].includes(status)) {
      navigate(`/tracking/${id}`);
    } else {
      // ถ้าสำเร็จหรือยกเลิก ให้ไปหน้าดูรายละเอียด (หรือหน้าเดิมถ้ายังไม่ได้ทำ)
      navigate(`/orders/${id}`);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-10 py-4 font-sans">
        
        {/* --- Header --- */}
        <header>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
              คำสั่งซื้อของคุณ
            </h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
              ติดตามสถานะและประวัติการสั่งซื้อทั้งหมด
            </p>
          </motion.div>
        </header>

        {/* --- List Section --- */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="p-20 text-center bg-slate-50 rounded-[3.5rem] border border-dashed border-slate-200">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">ไม่มีประวัติการสั่งซื้อ</p>
              <button 
                onClick={() => navigate('/shop')}
                className="mt-4 text-indigo-600 font-black text-[10px] uppercase underline underline-offset-4"
              >
                ไปหน้าสินค้า
              </button>
            </div>
          ) : (
            orders.map((order, index) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 8 }}
                onClick={() => handleOrderClick(order.id, order.status)}
                className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-indigo-100 transition-all cursor-pointer"
              >
                {/* ฝั่งซ้าย: ข้อมูลออเดอร์ */}
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500",
                    ['Pending', 'Processing', 'Delivering'].includes(order.status)
                      ? "bg-emerald-50 border-emerald-100 text-emerald-500 shadow-lg shadow-emerald-100/50" 
                      : "bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                  )}>
                    <Package className={cn("w-6 h-6", order.status === 'Delivering' && "animate-pulse")} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 uppercase tracking-tight text-lg">#{order.id}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase mt-1">
                      <Clock className="w-3 h-3" /> {new Date(order.created_at).toLocaleDateString('th-TH')} • {order.items?.length || 1} รายการ
                    </div>
                  </div>
                </div>

                {/* ฝั่งขวา: ราคาและสถานะ */}
                <div className="flex items-center justify-between md:justify-end gap-10">
                  <div className="text-right">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">ยอดสุทธิ</p>
                    <p className="text-xl font-black text-slate-900 tracking-tighter">
                      ฿{order.total_amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={order.status} />
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border border-slate-100 transition-all",
                      ['Pending', 'Processing', 'Delivering'].includes(order.status)
                        ? "bg-emerald-500 border-emerald-500 text-white" 
                        : "group-hover:bg-indigo-600 group-hover:border-indigo-600 text-slate-300 group-hover:text-white"
                    )}>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

// --- คอมโพเนนต์ย่อยสำหรับ Badge สถานะ ---
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Delivering: "bg-emerald-100 text-emerald-600",
    Completed: "bg-slate-100 text-slate-500",
    Cancelled: "bg-rose-100 text-rose-600",
    Processing: "bg-indigo-100 text-indigo-600",
    Pending: "bg-amber-100 text-amber-600",
  };

  const labels: Record<string, string> = {
    Delivering: "กำลังจัดส่ง",
    Completed: "สำเร็จแล้ว",
    Cancelled: "ยกเลิกแล้ว",
    Processing: "กำลังเตรียมพัสดุ",
    Pending: "รอดำเนินการ",
  };

  return (
    <span className={cn(
      "px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm min-w-[120px] text-center",
      styles[status] || "bg-slate-100 text-slate-400"
    )}>
      {labels[status] || status}
    </span>
  );
};