import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, User, Package, Heart, MapPin, 
  CreditCard, Settings, Camera 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const location = useLocation();

  // ตรวจสอบ Path ตรงนี้ให้ตรงกับใน App.tsx ทุกตัวอักษร
  const menuItems = [
    { icon: User, label: 'โปรไฟล์', path: '/profile' },
    { icon: Package, label: 'คำสั่งซื้อ', path: '/orders' },
    { icon: Heart, label: 'ที่ชอบ', path: '/favorites' },
    { icon: MapPin, label: 'ที่อยู่', path: '/addresses' },
    { icon: CreditCard, label: 'ชำระเงิน', path: '/payment-methods' }, // ต้องเป็น /payment-methods
    { icon: Settings, label: 'ตั้งค่า', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-100">
      <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-30 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#0F172A] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-slate-200">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">CHUTIPHON</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/checkout" className="relative p-2.5 text-slate-600 hover:bg-slate-50 rounded-2xl transition-all">
              <ShoppingBag className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            <button onClick={logout} className="px-5 py-2.5 bg-red-50 text-red-600 text-xs font-black rounded-xl hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest">
              ออกจากระบบ
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-[#0F172A]" />
              <div className="relative flex flex-col items-center text-center mt-10">
                <div className="relative mb-4">
                  <div className="w-32 h-32 bg-white p-1.5 rounded-[2.5rem] shadow-2xl shadow-slate-200">
                    <div className="w-full h-full bg-slate-50 rounded-[2rem] flex items-center justify-center overflow-hidden border border-slate-100 text-3xl font-black text-blue-600 uppercase">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <button className="absolute bottom-1 right-1 p-2.5 bg-blue-600 rounded-2xl shadow-lg border-4 border-white text-white">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-black text-slate-900 text-2xl tracking-tight leading-none mb-2">{user?.name || 'ยินดีต้อนรับ'}</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-8">{user?.role || 'Member'}</p>
              </div>

              <nav className="grid grid-cols-2 gap-3">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex flex-col items-center justify-center gap-2 p-5 rounded-[1.8rem] transition-all font-black text-[10px] uppercase tracking-widest ${
                      location.pathname === item.path
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
                      : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 border border-transparent'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          <div className="lg:col-span-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};