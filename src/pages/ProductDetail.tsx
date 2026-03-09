import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Minus, ShoppingBag, ArrowLeft, Star, ShieldCheck, Truck, Heart } from 'lucide-react';
import { useCart } from '@/src/context/CartContext';
import { useFavorites } from '@/src/context/FavoriteContext';
import { products } from '@/src/data/products';
import { cn } from '@/src/lib/utils';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isAdded, setIsAdded] = useState(false);

  const product = products.find((p) => p.id === Number(id));
  const sizes = ['S', 'M', 'L', 'XL'];

  const isFavorite = (productId: number) => {
    return favorites.some((fav: any) => fav.id === productId);
  };

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">ไม่พบสินค้านี้</h2>
          <p className="text-slate-500 mb-8 font-medium">สินค้าที่คุณกำลังตามหาอาจจะถูกถอดออกหรือลิงก์ไม่ถูกต้อง</p>
          <button
            onClick={() => navigate('/shop')}
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:shadow-xl transition-all"
          >
            กลับไปที่ร้านค้า
          </button>
        </motion.div>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      quantity: quantity,
      size: selectedSize
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <button
        onClick={() => navigate('/shop')}
        className="group flex items-center gap-2 text-slate-500 font-bold mb-10 hover:text-slate-900 transition-colors"
      >
        <div className="p-2 bg-white rounded-xl border border-slate-100 group-hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </div>
        กลับไปหน้าหลัก
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-slate-100 border border-slate-100 shadow-2xl shadow-slate-200/50"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div className="flex flex-col h-full py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest">
                Premium Collection
              </span>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-5xl font-black text-slate-900 leading-tight">
                  {product.name}
                </h1>
                <button
                  onClick={() => toggleFavorite(product)}
                  className="p-4 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-slate-400 hover:text-red-500 transition-colors active:scale-90 border border-slate-100 mt-2"
                >
                  <Heart 
                    className={cn("w-6 h-6 transition-colors", isFavorite(product.id) && "fill-red-500 text-red-500")} 
                  />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <span className="text-sm text-slate-400 font-bold">(4.8 / 5.0 Rating)</span>
              </div>
            </div>

            <div className="text-4xl font-black text-slate-900">
              ฿{product.price.toLocaleString()}
            </div>

            <div className="space-y-4">
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                {product.description}
              </p>
              
              {product.features && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.features.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {f}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Size</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "min-w-[64px] py-4 rounded-2xl font-black transition-all border-2 text-sm",
                      selectedSize === size
                        ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200"
                        : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 space-y-6">
              <div className="flex items-center gap-6">
                <span className="text-sm font-black text-slate-400 uppercase tracking-wider">จำนวนสินค้า</span>
                <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-blue-600 transition-all active:scale-90"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-black text-lg text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-blue-600 transition-all active:scale-90"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                disabled={isAdded}
                className={cn(
                  "w-full py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-2xl",
                  isAdded 
                  ? 'bg-emerald-500 text-white shadow-emerald-200' 
                  : 'bg-slate-900 text-white shadow-slate-200 hover:bg-slate-800'
                )}
              >
                {isAdded ? (
                  <>
                    <ShieldCheck className="w-6 h-6 animate-bounce" />
                    เพิ่มสำเร็จแล้ว!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-6 h-6" />
                    เพิ่มลงตะกร้า • ฿{(product.price * quantity).toLocaleString()}
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Truck className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-bold text-slate-600">จัดส่งฟรีทั่วประเทศ</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <ShieldCheck className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-bold text-slate-600">รับประกันคุณภาพ 7 วัน</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};