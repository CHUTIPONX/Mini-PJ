import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const FavoriteContext = createContext<any>(null);

export const FavoriteProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);

  const storageKey = user?.email ? `fav_data_${user.email}` : 'guest_favs';

  useEffect(() => {
    if (isAuthenticated && storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setFavorites(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse favorites", e);
        }
      }
    } else if (!isAuthenticated) {
      setFavorites([]);
    }
  }, [isAuthenticated, storageKey]);

  useEffect(() => {
    if (isAuthenticated && storageKey !== 'guest_favs') {
      localStorage.setItem(storageKey, JSON.stringify(favorites));
    }
  }, [favorites, storageKey, isAuthenticated]);

  const toggleFavorite = (product: any) => {
    // 1. ล้างแจ้งเตือนเก่าทิ้งทันทีเพื่อให้เด้งอันใหม่แค่อันเดียว
    toast.dismiss();

    if (!isAuthenticated) {
      toast.error('กรุณาเข้าสู่ระบบเพื่อบันทึกสิ่งที่ชอบ', {
        id: 'auth-toast', // ใช้ ID เพื่อให้เด้งทับตำแหน่งเดิม
        style: {
          borderRadius: '16px',
          background: '#0F172A',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '500',
        },
      });
      return;
    }

    setFavorites((prev) => {
      const isExist = prev.some((item) => item.id === product.id);
      
      if (isExist) {
        // แจ้งเตือนเมื่อลบ
        toast('ลบออกจากรายการโปรดแล้ว', {
          id: 'fav-action',
          style: {
            borderRadius: '20px',
            background: '#0F172A',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'auto',
          },
        });
        return prev.filter((item) => item.id !== product.id);
      } else {
        // แจ้งเตือนเมื่อเพิ่ม (พร้อมชื่อสินค้า)
        toast.success(`เพิ่ม ${product.name} ในรายการที่ชอบแล้ว`, {
          id: 'fav-action',
          style: {
            borderRadius: '20px',
            background: '#0F172A',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'auto',
          },
        });
        return [product, ...prev];
      }
    });
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) return { favorites: [], toggleFavorite: () => {} };
  return context;
};