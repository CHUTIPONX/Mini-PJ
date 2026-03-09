import React from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  ShieldCheck, 
  Headphones, 
  CreditCard, 
  Heart, 
  ShoppingCart as CartIcon, 
  ChevronRight, 
  Plus, 
  Minus, 
  ArrowRight 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useCart } from '@/src/context/CartContext';
import { useFavorites } from '@/src/context/FavoriteContext';
import { useAuth } from '@/src/context/AuthContext';
import { products } from '@/src/data/products';

const features = [
  { icon: Truck, title: 'ส่งฟรีทั่วไทย', desc: 'เมื่อช้อปครบ 999.-', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { icon: ShieldCheck, title: 'ของแท้ 100%', desc: 'รับประกันคืนเงิน', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: Headphones, title: 'บริการ 24 ชม.', desc: 'ช่วยเหลือทุกปัญหา', color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: CreditCard, title: 'ผ่อนชำระ 0%', desc: 'นานสูงสุด 10 เดือน', color: 'text-rose-600', bg: 'bg-rose-50' },
];

export const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const [quantities, setQuantities] = React.useState<Record<number, number>>({});

  const getQuantity = (productId: number) => quantities[productId] || 0;
  
  const updateQuantity = (productId: number, value: number) => {
    if (value < 0) return;
    setQuantities(prev => ({ ...prev, [productId]: value }));
  };

  const checkAuthAndAction = (action: () => void) => {
    if (!isAuthenticated) {
      toast.error('กรุณาเข้าสู่ระบบก่อนดำเนินการ', {
        style: { fontWeight: 'normal' }
      });
      navigate('/login');
      return;
    }
    action();
  };

  const handleAddWithQuantity = (product: any) => {
    const qty = getQuantity(product.id);
    if (qty > 0) {
      checkAuthAndAction(() => {
        addToCart({ ...product, quantity: qty });
        setQuantities(prev => ({ ...prev, [product.id]: 0 }));
        toast.success(`เพิ่ม ${product.name} ลงตะกร้าแล้ว`, {
          style: { fontWeight: 'normal' }
        });
      });
    }
  };

  const handleToggleFavorite = (product: any) => {
    checkAuthAndAction(() => {
      toggleFavorite(product);
    });
  };

  const isFavorite = (productId: number) => {
    return favorites.some((fav: any) => fav.id === productId);
  };

  return (
    <div className="space-y-24 pb-32 bg-white font-sans">
      <section className="relative px-4 pt-6">
        <div className="max-w-7xl mx-auto relative group overflow-hidden rounded-[2.5rem] min-h-[600px] flex items-center shadow-2xl shadow-slate-200">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent" />

          <div className="relative z-10 px-8 md:px-20 max-w-2xl space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-widest uppercase"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              New Collection 2026
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-black text-white leading-[1.1]"
            >
              ยกระดับ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-200">สไตล์ในแบบคุณ</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-slate-300 font-medium max-w-lg leading-relaxed"
            >
              สัมผัสประสบการณ์การช้อปปิ้งที่เหนือระดับ ด้วยสินค้าคัดสรรพิเศษเพื่อคุณภาพชีวิตที่ดีกว่าเดิม
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/shop"
                className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-indigo-600 hover:text-white transition-all duration-500 shadow-2xl"
              >
                เริ่มช้อปเลย 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col items-center text-center space-y-4 transition-all duration-500"
            >
              <div className={`p-5 rounded-3xl ${item.bg} ${item.color} shadow-sm`}>
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="font-black text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.3em]">Our Selection</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">สินค้าแนะนำ</h2>
          </div>
          <Link to="/shop" className="group flex items-center gap-3 font-black text-slate-900 hover:text-indigo-600 transition-all">
            ดูทั้งหมด 
            <div className="p-3 rounded-2xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-12">
              <ChevronRight className="w-5 h-5" />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-[2.5rem] p-4 border border-slate-100 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500"
            >
              <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-slate-100">
                <Link to={`/product/${product.id}`}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                </Link>
                <button 
                  onClick={() => handleToggleFavorite(product)}
                  className="absolute top-5 right-5 p-3 bg-white/90 backdrop-blur-md rounded-2xl text-slate-400 hover:text-red-500 transition-all shadow-sm active:scale-90"
                >
                  <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

              <div className="p-5 space-y-5">
                <h3 className="font-bold text-slate-800 text-lg line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center justify-between gap-2">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    ฿{product.price.toLocaleString()}
                  </span>
                  <div className="flex items-center bg-slate-50 rounded-2xl p-1.5 border border-slate-100 shadow-inner">
                    <button 
                      onClick={() => updateQuantity(product.id, getQuantity(product.id) - 1)} 
                      className="p-1.5 hover:bg-white hover:text-indigo-600 hover:shadow-sm rounded-xl transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-black text-slate-700">{getQuantity(product.id)}</span>
                    <button 
                      onClick={() => updateQuantity(product.id, getQuantity(product.id) + 1)} 
                      className="p-1.5 hover:bg-white hover:text-indigo-600 hover:shadow-sm rounded-xl transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleAddWithQuantity(product)}
                  disabled={getQuantity(product.id) === 0}
                  className="w-full py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-all duration-300 disabled:opacity-20 flex items-center justify-center gap-3 shadow-lg shadow-slate-200"
                >
                  <CartIcon className="w-4 h-4" /> เพิ่มลงตะกร้า
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden bg-slate-900 rounded-[4rem] p-12 md:p-24 shadow-2xl shadow-indigo-100">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -ml-48 -mb-48" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="text-center lg:text-left space-y-6">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                รับสิทธิพิเศษ <br />
                <span className="text-indigo-400 font-medium italic">ก่อนใคร</span>
              </h2>
              <p className="text-slate-400 text-xl font-medium">สมัครรับข่าวสารเพื่อรับส่วนลด 10% สำหรับการช้อปครั้งแรก</p>
            </div>
            
            <div className="w-full max-w-lg">
              <form 
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col sm:flex-row p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] gap-2"
              >
                <input 
                  type="email" 
                  placeholder="กรอกอีเมลของคุณ"
                  className="flex-1 px-8 py-4 bg-transparent text-white placeholder:text-slate-500 border-none focus:ring-0 outline-none font-medium"
                />
                <button className="px-10 py-4 bg-white text-slate-900 font-black rounded-[1.8rem] hover:bg-indigo-500 hover:text-white transition-all duration-500 shadow-xl active:scale-95">
                  ติดตาม
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};