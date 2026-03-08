import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react'; 
import { 
  LayoutDashboard, ShoppingBag, Users, Package, TrendingUp, Bell, Settings, LogOut,
  Plus, Trash2, Pencil, ArrowUpRight, ArrowDownRight, Calendar, Watch, Shirt,
  Footprints, Briefcase, Menu, X 
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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

const recentOrders = [
  { id: '#ORD-7742', customer: 'สมชาย ใจดี', date: '24 พ.ค. 2567', status: 'สำเร็จแล้ว', amount: '฿2,450.00', statusColor: 'bg-emerald-50 text-emerald-600' },
  { id: '#ORD-7741', customer: 'พรพิมล รุ่งเรือง', date: '23 พ.ค. 2567', status: 'กำลังส่ง', amount: '฿1,120.00', statusColor: 'bg-blue-50 text-blue-600' },
  { id: '#ORD-7740', customer: 'วิชัย สุขสันต์', date: '23 พ.ค. 2567', status: 'รอดำเนินการ', amount: '฿850.00', statusColor: 'bg-amber-50 text-amber-600' },
];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

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
    createdAt: ""
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
  };

  const handleSubmit = () => {
    if (!form.name || !form.price) return;
    let newProducts = [...products];

    if (editIndex !== null) {
      newProducts[editIndex] = form;
      setEditIndex(null);
    } else {
      newProducts.push({
        ...form,
        createdAt: new Date().toISOString()
      });
    }

    saveProducts(newProducts);
    setForm({ name: "", price: "", stock: "", createdAt: "" });
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

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
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">ระบบจัดการ</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 mt-2">Main Menu</p>
          {[
            { id: "dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
            { id: "orders", label: "รายการสั่งซื้อ", icon: ShoppingBag },
            { id: "products", label: "สินค้า", icon: Package },
            { id: "customers", label: "ลูกค้า", icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setMenu(item.id); setIsSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium w-full transition-all duration-200 ${menu === item.id ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100">
          <button
            onClick={() => { localStorage.removeItem("user"); navigate("/login"); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-2xl font-semibold transition-colors"
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
              <span className="text-sm font-bold text-slate-800">
                {currentTime.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="text-[11px] font-bold text-blue-600 tabular-nums">
                เวลา: {currentTime.toLocaleTimeString('th-TH')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right mr-2 hidden md:block">
              <p className="text-sm font-bold text-slate-800">{user.name}</p>
              <p className="text-[11px] text-slate-500 uppercase font-medium">Administrator</p>
            </div>
            <button className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
          {menu === "dashboard" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">ภาพรวมระบบ</h1>
                  <p className="text-slate-500 text-sm">ข้อมูลสรุปสต็อกและยอดขายประจำวันที่เลือก</p>
                </div>
                <div className="relative group">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-slate-600 hover:border-blue-400 transition-colors">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <input 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-transparent outline-none cursor-pointer font-bold text-slate-700"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex justify-between items-start relative z-10">
                      <div className={`p-4 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {stat.change}
                      </div>
                    </div>
                    <div className="mt-5 relative z-10">
                      <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                      <p className="text-3xl font-black text-slate-800 mt-1">{stat.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[400px]">
                  <h3 className="font-bold text-lg mb-8">แนวโน้มยอดขาย</h3>
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
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} hide={window.innerWidth < 640} />
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
                  <h3 className="font-bold text-lg mb-2">สัดส่วนสินค้า</h3>
                  <div className="h-[200px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={categoryData} innerRadius={65} outerRadius={85} paddingAngle={10} dataKey="value" stroke="none">
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-black text-slate-800">1,140</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Items</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-8">
                    {categoryData.map((cat, i) => (
                      <div key={i} className="p-3 rounded-2xl border border-slate-50 bg-slate-50/30">
                        <div className="flex items-center gap-2 mb-1">
                          <cat.icon className="w-3.5 h-3.5" style={{color: cat.color}} />
                          <span className="text-[11px] font-bold text-slate-500 uppercase truncate">{cat.name}</span>
                        </div>
                        <span className="text-lg font-black text-slate-800">{cat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-50">
                  <h3 className="font-bold text-lg">รายการสั่งซื้อล่าสุด</h3>
                  <button onClick={() => setMenu("orders")} className="text-blue-600 text-sm font-bold hover:underline">ดูทั้งหมด</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[600px]">
                    <thead>
                      <tr className="text-slate-400 font-medium text-left">
                        <th className="px-8 py-4">Order ID</th>
                        <th className="py-4">ลูกค้า</th>
                        <th className="py-4">วันที่</th>
                        <th className="py-4">สถานะ</th>
                        <th className="px-8 py-4 text-right">ยอดเงิน</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700">
                      {recentOrders.map((order, i) => (
                        <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-4 font-bold text-blue-600">{order.id}</td>
                          <td className="py-4 font-medium">{order.customer}</td>
                          <td className="py-4 text-slate-500">{order.date}</td>
                          <td className="py-4">
                            <span className={`px-3 py-1.5 rounded-xl text-[11px] font-bold ${order.statusColor}`}>{order.status}</span>
                          </td>
                          <td className="px-8 py-4 text-right font-black text-slate-800">{order.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {menu === "orders" && (
            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-slate-100 overflow-hidden">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">รายการสั่งซื้อทั้งหมด</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead className="text-slate-400 border-b">
                    <tr className="text-left">
                      <th className="py-4">Order ID</th>
                      <th className="py-4">ลูกค้า</th>
                      <th className="py-4">วันที่</th>
                      <th className="py-4">สถานะ</th>
                      <th className="py-4 text-right">ยอดเงิน</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentOrders.map((order, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-4 font-bold">{order.id}</td>
                        <td className="py-4">{order.customer}</td>
                        <td className="py-4 text-slate-500">{order.date}</td>
                        <td className="py-4 text-xs font-bold">
                          <span className={`px-3 py-1 rounded-lg ${order.statusColor}`}>{order.status}</span>
                        </td>
                        <td className="py-4 text-right font-bold">{order.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {menu === "products" && (
            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-slate-100 overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">จัดการคลังสินค้า</h2>
                  <p className="text-slate-500 text-sm mt-1">จำนวนสินค้าทั้งหมด {products.length} รายการ</p>
                </div>
                <button 
                  onClick={() => setShowModal(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg"
                >
                  <Plus size={18} /> เพิ่มสินค้า
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead className="text-slate-400 border-b">
                    <tr className="text-left">
                      <th className="py-4">ชื่อสินค้า</th>
                      <th className="py-4">วันที่เพิ่ม</th>
                      <th className="py-4">ราคา</th>
                      <th className="py-4">สต็อก</th>
                      <th className="py-4 text-right">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {products.map((p, index) => (
                      <tr key={index} className="hover:bg-slate-50 group">
                        <td className="py-4 font-bold text-slate-700">{p.name}</td>
                        <td className="py-4 text-slate-400">
                          {p.createdAt ? new Date(p.createdAt).toLocaleDateString('th-TH') : '-'}
                        </td>
                        <td className="py-4 text-blue-600 font-bold">฿{Number(p.price).toLocaleString()}</td>
                        <td className="py-4">{p.stock} ชิ้น</td>
                        <td className="py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => editProduct(index)} className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Pencil size={16} /></button>
                            <button onClick={() => deleteProduct(index)} className="p-2 bg-rose-50 text-rose-600 rounded-xl"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {menu === "customers" && (
            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-slate-100">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">ฐานข้อมูลลูกค้า</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "สมชาย ใจดี", email: "somchai@gmail.com", status: "ลูกค้าปกติ", spend: "฿12,400" },
                  { name: "พรพิมล รุ่งเรือง", email: "pornpimon@gmail.com", status: "ลูกค้า VIP", spend: "฿45,200" }
                ].map((cust, i) => (
                  <div key={i} className="flex items-center justify-between p-5 border border-slate-100 rounded-[2rem] hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center font-black text-blue-600">{cust.name[0]}</div>
                      <div>
                        <p className="font-bold text-slate-800">{cust.name}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[100px]">{cust.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{cust.status}</span>
                      <p className="text-base font-black text-slate-800 mt-1">{cust.spend}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 md:p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-black text-slate-800">
              {editIndex !== null ? "แก้ไขข้อมูลสินค้า" : "เพิ่มสินค้าใหม่"}
            </h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 ml-1 uppercase">ชื่อสินค้า</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 border-none p-4 rounded-2xl outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 ml-1 uppercase">ราคา</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-slate-50 border-none p-4 rounded-2xl outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 ml-1 uppercase">สต็อก</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full bg-slate-50 border-none p-4 rounded-2xl outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold">ยกเลิก</button>
              <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg">บันทึก</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};