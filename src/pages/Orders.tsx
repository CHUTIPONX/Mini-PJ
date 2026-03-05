import React from 'react';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Clock } from 'lucide-react';
import { DashboardLayout } from '../components/laout/DashboardLayout';

const mockOrders = [
  { id: 'ORD-9921', date: '24 Feb 2026', total: 1880, status: 'กำลังจัดส่ง', items: 3 },
  { id: 'ORD-8842', date: '12 Jan 2026', total: 590, status: 'สำเร็จแล้ว', items: 1 },
];

export const Orders = () => {
  return (
    <DashboardLayout>
      <div className="space-y-10">
        <header>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">คำสั่งซื้อของคุณ</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">ติดตามสถานะและประวัติการสั่งซื้อ</p>
          </motion.div>
        </header>

        <div className="space-y-4">
          {mockOrders.map((order) => (
            <motion.div 
              key={order.id}
              whileHover={{ x: 5 }}
              className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-blue-100 transition-colors"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 transition-colors">
                  <Package className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase tracking-tight">{order.id}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase mt-1">
                    <Clock className="w-3 h-3" /> {order.date} • {order.items} รายการ
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-10">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">ยอดสุทธิ</p>
                  <p className="text-lg font-black text-slate-900">฿{order.total.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    order.status === 'สำเร็จแล้ว' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {order.status}
                  </span>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};