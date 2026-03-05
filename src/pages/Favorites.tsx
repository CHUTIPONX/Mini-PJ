import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '../components/laout/DashboardLayout';
import { useFavorites } from '../context/FavoriteContext';
import { useCart } from '../context/CartContext'; // เพิ่มการดึง CartContext
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Favorites = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart(); // ดึงฟังก์ชันเพิ่มของลงตะกร้า

  const handleAddToCart = (item: any) => {
    addToCart(item);
    toast.success(`เพิ่ม ${item.name} ลงตะกร้าแล้ว!`, {
      icon: '🛒',
      style: {
        borderRadius: '20px',
        background: '#0F172A',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <header>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">สิ่งที่ชอบ</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">
              {favorites.length} ITEMS SELECTED
            </p>
          </motion.div>
        </header>

        <AnimatePresence mode="popLayout">
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {favorites.map((item: any) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm flex gap-6 items-center group relative overflow-hidden transition-shadow hover:shadow-xl hover:shadow-slate-100"
                >
                  <div className="w-28 h-28 bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight leading-tight line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-blue-600 font-black text-base">฿{item.price.toLocaleString()}</p>
                    
                    <div className="flex gap-2 pt-3">
                      {/* เชื่อมต่อปุ่มใส่ตะกร้าให้ใช้งานได้จริง */}
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 py-3.5 bg-[#0F172A] text-white text-[10px] font-black rounded-2xl hover:bg-blue-600 transition-all uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-slate-100 active:scale-95"
                      >
                        <ShoppingBag className="w-3 h-3" /> ใส่ตะกร้า
                      </button>
                      
                      <button 
                        onClick={() => toggleFavorite(item)}
                        className="p-3.5 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100 flex flex-col items-center"
            >
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-12 h-12 text-slate-200" />
              </div>
              <h3 className="font-black text-slate-900 text-xl uppercase mb-2">ยังไม่มีสิ่งที่ชอบ</h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-10">
                เริ่มสำรวจสินค้าและกดรูปหัวใจเพื่อบันทึกไว้ที่นี่
              </p>
              <Link 
                to="/shop" 
                className="inline-flex items-center gap-3 px-12 py-5 bg-[#0F172A] text-white text-[10px] font-black rounded-[1.8rem] hover:bg-blue-600 transition-all uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 active:scale-95"
              >
                ไปหน้าช้อปปิ้ง <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};