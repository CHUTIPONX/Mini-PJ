import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, Search, Menu, X, Facebook, Twitter, 
  Instagram, Mail, Phone, MapPin, LogOut 
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useCart } from '@/src/context/CartContext';
import { useAuth } from '@/src/context/AuthContext';

const useIsSpecialPage = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isDashboard = [
    '/dashboard', '/profile', '/orders', '/favorites', 
    '/addresses', '/payment-methods', '/settings'
  ].some(path => location.pathname.startsWith(path));
  
  return isAdmin || isDashboard;
};

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const isSpecialPage = useIsSpecialPage();
  const { getTotalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  if (isSpecialPage) return null;

  const dashboardHref = user?.role === 'admin' ? '/admin' : '/dashboard';

  const navLinks = [
    { name: 'หน้าแรก', href: '/' },
    { name: 'ร้านค้า', href: '/shop' },
    { name: 'บัญชีของคุณ', href: dashboardHref },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200 group-hover:scale-105 transition-transform duration-500 rotate-3 group-hover:rotate-0">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tighter">
                CHUTIPHON<span className="text-indigo-600">.</span>
              </span>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "text-sm font-bold transition-all py-2 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all hover:after:w-full",
                    location.pathname === link.href ? "text-indigo-600 after:w-full" : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4 flex-1 max-w-sm mx-10">
            <div className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="ค้นหาสินค้าที่สนใจ..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/checkout" className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all relative group">
              <ShoppingCart className="w-5 h-5 group-hover:text-indigo-600 transition-colors" />
              {getTotalItems() > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            <div className="hidden sm:block w-px h-6 bg-slate-200 mx-2" />

            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Member</p>
                  <p className="text-sm font-bold text-slate-900 leading-none">{user?.name}</p>
                </div>
                <button 
                  onClick={logout}
                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300"
              >
                เข้าสู่ระบบ
              </Link>
            )}
            
            <button 
              className="lg:hidden p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 py-8 px-6 space-y-8 shadow-2xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="px-4 py-4 text-lg font-bold text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export const Footer = () => {
  const isSpecialPage = useIsSpecialPage();

  if (isSpecialPage) return null;

  return (
    <footer className="relative bg-white border-t border-slate-100 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-50/50 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-50/50 blur-[100px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-100 rotate-3">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                CHUTIPHON<span className="text-indigo-600">.</span>
              </span>
            </Link>
            <p className="text-base text-slate-500 leading-relaxed font-medium max-w-sm">
              เราเชื่อในความเรียบง่ายแต่ทรงพลัง มอบประสบการณ์การช้อปปิ้งที่ตอบโจทย์ไลฟ์สไตล์คนรุ่นใหม่ ด้วยสินค้าที่คัดสรรมาเพื่อคุณโดยเฉพาะ
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, color: 'hover:bg-[#1877F2]' },
                { Icon: Twitter, color: 'hover:bg-[#1DA1F2]' },
                { Icon: Instagram, color: 'hover:bg-gradient-to-tr from-[#F58529] to-[#D62976]' },
                { Icon: Mail, color: 'hover:bg-indigo-600' }
              ].map((item, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  className={cn(
                    "w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 rounded-2xl transition-all duration-500 hover:text-white hover:shadow-lg hover:-translate-y-1",
                    item.color
                  )}
                >
                  <item.Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <div className="space-y-8">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em]">Explore</h3>
              <ul className="space-y-4">
                {['คอลเลกชันใหม่', 'สินค้าขายดี', 'โปรโมชั่น', 'หมวดหมู่ทั้งหมด'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-2 transition-all group">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-indigo-600 transition-all group-hover:scale-125" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-8">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em]">Support</h3>
              <ul className="space-y-4">
                {['เช็คสถานะสินค้า', 'การคืนสินค้า', 'ศูนย์ช่วยเหลือ', 'นโยบายร้านค้า'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-2 transition-all group">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-indigo-600 transition-all group-hover:scale-125" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em]">Contact Us</h3>
            <div className="space-y-6">
              <div className="group cursor-pointer">
                <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">ฝ่ายบริการลูกค้า</p>
                <p className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">02-123-4567</p>
              </div>
              <div className="group cursor-pointer">
                <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">อีเมลติดต่อ</p>
                <p className="text-base font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">hello@chutiphon.com</p>
              </div>
              <div className="pt-4 border-t border-slate-50">
                <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">
                  Bangkok, Thailand
                </p>
              </div>
            </div>
          </div>

        </div>
        
        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              © 2026 CHUTIPHON. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            </div>
          </div>
          
          <div className="flex items-center gap-4 grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-700">
             <div className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase">Visa</div>
             <div className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase">MasterCard</div>
             <div className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase">PromptPay</div>
          </div>
        </div>
      </div>
    </footer>
  );
};