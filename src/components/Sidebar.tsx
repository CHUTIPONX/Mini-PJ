import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Package, Heart, MapPin, CreditCard, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';

const menuItems = [
  { icon: User, label: 'แดชบอร์ด', href: '/dashboard' },
  { icon: Package, label: 'คำสั่งซื้อ', href: '/orders' },
  { icon: Heart, label: 'สินค้าที่ชอบ', href: '/favorites' },
  { icon: MapPin, label: 'ที่อยู่จัดส่ง', href: '/addresses' },
  { icon: CreditCard, label: 'การชำระเงิน', href: '/payment-methods' },
  { icon: Settings, label: 'ตั้งค่า', href: '/settings' },
];

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm space-y-8">
      {/* Mini Profile */}
      <div className="flex items-center gap-3 px-2 border-b border-slate-50 pb-6">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-100">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="overflow-hidden">
          <p className="font-extrabold text-slate-900 truncate">{user?.name || 'Guest'}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium Member</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 translate-x-1' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button 
        onClick={logout}
        className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm"
      >
        <LogOut className="w-5 h-5" />
        ออกจากระบบ
      </button>
    </div>
  );
};