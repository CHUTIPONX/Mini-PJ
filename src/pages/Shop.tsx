import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Plus, Minus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/src/context/CartContext';
import { useFavorites } from '@/src/context/FavoriteContext'; // 1. เพิ่ม FavoriteContext
import { products as allProducts } from '@/src/data/products';

const categories = ['ทั้งหมด', 'เสื้อผ้า', 'รองเท้า', 'กระเป๋า', 'อุปกรณ์เสริม'];

export const Shop = () => {
  const [activeCategory, setActiveCategory] = React.useState('ทั้งหมด');
  const [sortBy, setSortBy] = React.useState('newest');
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites(); // 2. ดึงฟังก์ชันหัวใจมาใช้
  const [quantities, setQuantities] = React.useState<Record<number, number>>({});

  // ลบ wishlist แบบเดิมที่เป็น useState ออก เพื่อไปใช้จาก Context แทน

  const getQuantity = (productId: number) => quantities[productId] || 0;
  
  const updateQuantity = (productId: number, value: number) => {
    if (value < 0) return;
    setQuantities(prev => ({ ...prev, [productId]: value }));
  };

  const handleAddToCart = (product: any) => {
    const qty = getQuantity(product.id);
    if (qty > 0) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: qty
      });
      setQuantities(prev => ({ ...prev, [product.id]: 0 }));
    }
  };

  // 3. ฟังก์ชันเช็คสถานะหัวใจ (สีแดง)
  const isFavorite = (productId: number) => {
    return favorites.some((fav: any) => fav.id === productId);
  };

  const filteredProducts = allProducts.filter(p => 
    activeCategory === 'ทั้งหมด' || p.category === activeCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans">
      <header className="relative py-20 overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[80%] bg-indigo-400 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[80%] bg-blue-300 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span className="text-indigo-600 font-semibold tracking-wider text-sm uppercase">Our Collection</span>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mt-4 mb-6 tracking-tight">
              ค้นพบสไตล์ <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">ที่เป็นคุณ</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              คัดสรรสินค้าคุณภาพระดับพรีเมียม เพื่อตอบโจทย์ทุกไลฟ์สไตล์การใช้ชีวิตของคุณ
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* ส่วน Filter และ Sort คงเดิม */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500 mr-2">
              Showing {sortedProducts.length} items
            </div>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-100 text-slate-700 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none cursor-pointer"
            >
              <option value="newest">ใหม่ล่าสุด</option>
              <option value="price-low">ราคา: ต่ำ - สูง</option>
              <option value="price-high">ราคา: สูง - ต่ำ</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {sortedProducts.map((product, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                key={product.id}
                className="group bg-white rounded-[2rem] p-3 border border-slate-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500"
              >
                <div className="relative aspect-[1/1.1] overflow-hidden rounded-[1.5rem] bg-slate-50">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </Link>
                  
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.tag && (
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-full text-white backdrop-blur-md ${
                        product.tag === 'HOT' ? 'bg-orange-500/90' : 'bg-emerald-500/90'
                      }`}>
                        {product.tag}
                      </span>
                    )}
                  </div>

                  {/* 4. แก้ไขปุ่มหัวใจให้เรียกใช้ Context */}
                  <button
                    onClick={() => toggleFavorite(product)}
                    className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-slate-400 hover:text-red-500 transition-colors active:scale-90"
                  >
                    <Heart 
                      className={`w-4 h-4 transition-colors ${
                        isFavorite(product.id) ? 'fill-red-500 text-red-500' : ''
                      }`} 
                    />
                  </button>
                </div>

                {/* ส่วนข้อมูลสินค้าคงเดิม */}
                <div className="p-4 space-y-4">
                  <div>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-slate-400 mt-1 line-clamp-1">{product.category}</p>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-medium">ราคา</span>
                      <span className="text-xl font-bold text-slate-900">฿{product.price.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                      <button 
                        onClick={() => updateQuantity(product.id, getQuantity(product.id) - 1)}
                        className="p-1 hover:bg-white rounded-lg transition-colors text-slate-500"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-sm font-bold text-slate-700">{getQuantity(product.id)}</span>
                      <button 
                        onClick={() => updateQuantity(product.id, getQuantity(product.id) + 1)}
                        className="p-1 hover:bg-white rounded-lg transition-colors text-slate-500"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={getQuantity(product.id) === 0}
                    className="w-full py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-indigo-600 shadow-lg shadow-slate-200 hover:shadow-indigo-200 transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    เพิ่มลงตะกร้า
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ส่วน No Results คงเดิม */}
        {sortedProducts.length === 0 && (
          <div className="py-24 text-center">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">ไม่พบสินค้าที่คุณต้องการ</h3>
            <p className="text-slate-500 mt-2">ลองเปลี่ยนหมวดหมู่หรือคำค้นหาใหม่อีกครั้ง</p>
          </div>
        )}
      </main>
    </div>
  );
};