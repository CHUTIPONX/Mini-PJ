import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react'; 
import { 
  LayoutDashboard, ShoppingBag, Users, Package, TrendingUp, Bell, Settings, LogOut,
  Plus, Trash2, Pencil, ArrowUpRight, ArrowDownRight, Calendar, Watch, Shirt,
  Footprints, Briefcase, Menu, X 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell 
} from 'recharts';

const salesData = [
  { name: 'จ.', sales: 4000, orders: 240 },
  { name: 'อ.', sales: 3000, orders: 198 },
  { name: 'พ.', sales: 2000, orders: 150 },
  { name: 'พฤ.', sales: 2780, orders: 210 },
  { name: 'ศ.', sales: 1890, orders: 120 },
  { name: 'ส.', sales: 2390, orders: 250 },
  { name: 'อา.', sales: 3490, orders: 310 },
];

const categoryData = [
  { name: 'เสื้อผ้า', value: 450, color: '#3b82f6', icon: Shirt },
  { name: 'รองเท้า', value: 320, color: '#10b981', icon: Footprints },
  { name: 'กระเป๋า', value: 210, color: '#f59e0b', icon: Briefcase },
  { name: 'นาฬิกา', value: 160, color: '#8b5cf6', icon: Watch },
];

const stats = [
  { label: 'จำนวนสินค้า', value: '1,240', change: '+5.2%', isUp: true, icon: Package, color: 'bg-blue-50 text-blue-600' },
  { label: 'จำนวนออเดอร์', value: '458', change: '+12.4%', isUp: true, icon: ShoppingBag, color: 'bg-amber-50 text-amber-600' },
  { label: 'รายได้รวม', value: '฿125,000', change: '-2.1%', isUp: false, icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const [menu, setMenu] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "เสื้อผ้า",
    description: "สัมผัสความนุ่มระดับพรีเมียมด้วยผ้า Cotton 100%",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800",
    rating: 4.8
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const data = localStorage.getItem("products");
    if (data) setProducts(JSON.parse(data));
  }, []);

  const saveProducts = (list: any) => {
    setProducts(list);
    localStorage.setItem("products", JSON.stringify(list));
    window.dispatchEvent(new Event('storage'));
  };

  const handleSubmit = () => {
    if (!form.name || !form.price) return;
    let newProducts = [...products];

    const productData = {
      ...form,
      id: editIndex !== null ? products[editIndex].id : Date.now(),
      price: Number(form.price),
      stock: Number(form.stock),
      createdAt: editIndex !== null ? products[editIndex].createdAt : new Date().toISOString()
    };

    if (editIndex !== null) {
      newProducts[editIndex] = productData;
      setEditIndex(null);
    } else {
      newProducts.push(productData);
    }

    saveProducts(newProducts);
    setForm({ 
      name: "", price: "", stock: "", category: "เสื้อผ้า", 
      description: "สัมผัสความนุ่มระดับพรีเมียมด้วยผ้า Cotton 100%", 
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800",
      rating: 4.8
    });
    setShowModal(false);
  };

  const deleteProduct = (index: number) => {
    let newProducts = [...products];
    newProducts.splice(index, 1);
    saveProducts(newProducts);
  };

  const editProduct = (index: number) => {
    setForm(products[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      if (user?.role !== 'admin') {
        navigate('/');
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-black text-slate-400">
        LOADING SYSTEM...
      </div>
    );
  }

  if (user?.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 overflow-x-hidden">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex items-center justify-between">
          <Link to="/AdminDashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800 uppercase">CHUTIPHON</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <p className="px-4 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 mt-2">Main Menu</p>
          {[
            { id: "dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
            { id: "orders", label: "รายการสั่งซื้อ", icon: ShoppingBag },
            { id: "products", label: "สินค้า", icon: Package },
            { id: "customers", label: "ลูกค้า", icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setMenu(item.id); setIsSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold w-full transition-all duration-200 ${menu === item.id ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100">
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-2xl font-black transition-colors"
          >
            <LogOut className="w-5 h-5" /> ออกจากระบบ
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-100 text-slate-600 rounded-xl lg:hidden">
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-black text-slate-800">
                {currentTime.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="text-[11px] font-bold text-blue-600 tabular-nums">
                SERVER TIME: {currentTime.toLocaleTimeString('th-TH')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right mr-2 hidden md:block">
              <p className="text-sm font-black text-slate-800">{user?.name || 'ADMIN'}</p>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-tighter">System Administrator</p>
            </div>
            <button className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
          {menu === "dashboard" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black text-slate-800 tracking-tight">OVERVIEW</h1>
                  <p className="text-slate-400 text-sm font-bold">ข้อมูลสรุปการทำงานของระบบ</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-slate-600">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 relative group"
                  >
                    <div className="flex justify-between items-start">
                      <div className={`p-4 rounded-2xl ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {stat.change}
                      </div>
                    </div>
                    <div className="mt-5">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-3xl font-black text-slate-800 mt-1">{stat.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 min-h-[400px]">
                  <h3 className="font-black text-lg mb-8 uppercase tracking-tight text-slate-800">Sales Trend</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesData}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} hide={window.innerWidth < 640} />
                        <Tooltip />
                        <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100">
                  <h3 className="font-black text-lg mb-2 uppercase tracking-tight text-slate-800">Categories</h3>
                  <div className="h-[200px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value" stroke="none">
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-black text-slate-800">1,140</span>
                      <span className="text-[9px] uppercase font-black text-slate-400 tracking-tighter">Items</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-8">
                    {categoryData.map((cat, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-slate-50/50 border border-slate-100">
                        <div className="flex items-center gap-2 mb-1">
                          <cat.icon className="w-3 h-3" style={{color: cat.color}} />
                          <span className="text-[10px] font-black text-slate-500 uppercase truncate">{cat.name}</span>
                        </div>
                        <span className="text-base font-black text-slate-800">{cat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {menu === "products" && (
            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Inventory</h2>
                  <p className="text-slate-400 text-sm font-bold">จัดการคลังสินค้าทั้งหมด {products.length} รายการ</p>
                </div>
                <button 
                  onClick={() => setShowModal(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black shadow-lg shadow-blue-100 hover:scale-105 transition-transform"
                >
                  <Plus size={20} /> ADD PRODUCT
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-slate-400 border-b text-[10px] font-black uppercase tracking-widest">
                    <tr className="text-left">
                      <th className="py-4 px-4">Product Name</th>
                      <th className="py-4 px-4">Price</th>
                      <th className="py-4 px-4">Stock</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {products.map((p, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 group">
                        <td className="py-5 px-4 font-black text-slate-700">{p.name}</td>
                        <td className="py-5 px-4 text-blue-600 font-black">฿{Number(p.price).toLocaleString()}</td>
                        <td className="py-5 px-4 font-bold text-slate-500">{p.stock} units</td>
                        <td className="py-5 px-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => editProduct(index)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-colors"><Pencil size={16} /></button>
                            <button onClick={() => deleteProduct(index)} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[60] p-4 overflow-y-auto">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 md:p-10 rounded-[3rem] w-full max-w-md shadow-2xl space-y-6 my-8"
          >
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">
                {editIndex !== null ? "Edit Item" : "New Item"}
              </h2>
              <p className="text-slate-400 text-sm font-bold">กรอกข้อมูลสินค้าแบบพรีเมียม</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="เช่น Premium Cotton Tee"
                  className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (฿)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                <select 
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold"
                >
                  {['เสื้อผ้า', 'รองเท้า', 'กระเป๋า', 'อุปกรณ์เสริม'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-50 p-4 rounded-2xl outline-none h-24 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-xs"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-100">Save Item</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};