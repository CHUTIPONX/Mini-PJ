import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, Search, Menu, X, LogOut 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { useCart } from '@/src/context/CartContext';
import { useAuth } from '@/src/context/AuthContext';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const { getTotalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  const dashboardHref = user?.role === 'admin' ? '/admin' : '/dashboard';

  // ข้อมูล Navigation ที่จะไปปรากฏบน Header
  const navLinks = [
    { name: 'หน้าแรก', href: '/' },
    { name: 'ร้านค้า', href: '/shop' },
    { name: 'บัญชีของคุณ', href: dashboardHref },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 1. Logo Section */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-0 transition-transform duration-500 rotate-3">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">
                CHUTIPHON<span className="text-indigo-600">.</span>
              </span>
            </Link>
          </div>

          {/* 2. Center Navigation Links (ตามรูปภาพ) */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "text-[13px] font-black uppercase tracking-widest transition-all relative py-2",
                    isActive 
                      ? "text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600" 
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right Section: Search, Cart, User Info */}
          <div className="flex items-center gap-2">
            
            {/* Search Bar */}
            <div className="hidden md:flex items-center relative group mr-2">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="ค้นหาสินค้าที่สนใจ..."
                className="pl-10 pr-4 py-2 bg-slate-100/50 border-none rounded-2xl text-xs w-48 focus:w-64 focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all outline-none font-bold"
              />
            </div>

            {/* Cart Button */}
            <Link to="/checkout" className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl relative group">
              <ShoppingCart className="w-5 h-5 group-hover:text-indigo-600 transition-colors" />
              {getTotalItems() > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] bg-indigo-600 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            <div className="hidden sm:block w-px h-6 bg-slate-200 mx-2" />

            {/* User Info & Logout */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4 pl-2">
                <div className="text-right hidden md:block">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Member</p>
                  <p className="text-[13px] font-black text-slate-900 leading-none">{user?.name}</p>
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
                className="px-5 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all"
              >
                เข้าสู่ระบบ
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button className="lg:hidden p-2.5 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-white border-b border-slate-100 p-6 flex flex-col gap-4"
        >
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href} 
              className="text-sm font-black uppercase tracking-widest text-slate-600 hover:text-indigo-600"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </motion.div>
      )}
    </header>
  );
};