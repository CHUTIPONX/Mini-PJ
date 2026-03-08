import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  CreditCard, 
  QrCode, 
  Truck,
  CheckCircle,
  Trash2,
  MapPin,
  ExternalLink,
  AlertCircle,
  User,
  Phone,
  Home
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/src/context/CartContext';
import { useAuth } from '@/src/context/AuthContext';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  province: string;
  postcode: string;
}

export const Checkout = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = React.useState('qr');
  const [isOrderComplete, setIsOrderComplete] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [finalSummary, setFinalSummary] = React.useState({
    total: 0,
    customerName: ''
  });

  const [formData, setFormData] = React.useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    province: 'กรุงเทพมหานคร',
    postcode: '',
  });

  // --- ส่วนดึงข้อมูลจาก Profile และ Address ---
  React.useEffect(() => {
    const syncData = () => {
      if (!isAuthenticated) return;
      const savedAddresses = localStorage.getItem('user_addresses');
      const addressList = savedAddresses ? JSON.parse(savedAddresses) : [];
      const defaultAddr = addressList.find((addr: any) => addr.isDefault) || addressList[0];
      const nameParts = user?.name ? user.name.split(' ') : ['', ''];

      setFormData({
        firstName: user?.firstName || nameParts[0] || defaultAddr?.recipient?.split(' ')[0] || '',
        lastName: user?.lastName || nameParts[1] || defaultAddr?.recipient?.split(' ')[1] || '',
        phone: user?.phone || defaultAddr?.phone || '',
        address: defaultAddr?.address || '',
        province: defaultAddr?.province || 'กรุงเทพมหานคร',
        postcode: defaultAddr?.postcode || '',
      });
    };

    syncData();
    window.addEventListener('storage', syncData);
    return () => window.removeEventListener('storage', syncData);
  }, [isAuthenticated, user]);

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    setFinalSummary({
      total: getTotalPrice(),
      customerName: `${formData.firstName} ${formData.lastName}`
    });
    // จำลองการเชื่อมต่อ API
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsOrderComplete(true);
    setIsSubmitting(false);
    clearCart();
  };

  const totalPrice = getTotalPrice();

  // --- หน้าจอสั่งซื้อสำเร็จ (ลบไอคอนรถออกแล้ว) ---
  if (isOrderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-20 px-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="text-center space-y-8 max-w-md w-full"
        >
          <div className="flex justify-center items-center">
            <motion.div 
              initial={{ scale: 0, rotate: -20 }} 
              animate={{ scale: 1, rotate: 0 }} 
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-200"
            >
              <CheckCircle className="w-14 h-14 text-white" />
            </motion.div>
          </div>

          <div className="space-y-3">
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">สั่งซื้อสำเร็จ!</h1>
            <p className="text-xl text-gray-600 font-medium">คำสั่งซื้อของคุณได้รับการยืนยันแล้ว</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-green-100 shadow-2xl text-left space-y-4">
             <div className="flex justify-between items-center">
                <span className="text-gray-500 text-lg">ผู้รับ:</span>
                <span className="font-bold text-gray-900 text-xl">{finalSummary.customerName}</span>
             </div>
             <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                <span className="text-gray-500 text-lg">ยอดชำระทั้งสิ้น:</span>
                <span className="font-black text-green-600 text-3xl">฿{finalSummary.total.toLocaleString()}</span>
             </div>
          </div>

          <Link 
            to="/shop" 
            className="block w-full py-5 bg-green-600 text-white text-xl font-black rounded-3xl shadow-xl shadow-green-200 transition-transform hover:scale-[1.02]"
          >
            กลับหน้าหลัก
          </Link>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center space-y-8">
          <div className="bg-white p-10 rounded-full w-40 h-40 flex items-center justify-center mx-auto shadow-sm">
            <ShoppingBag className="w-20 h-20 text-gray-200" />
          </div>
          <h1 className="text-3xl font-black text-gray-900">ตะกร้ายังว่างอยู่เลย</h1>
          <Link to="/shop" className="inline-block px-12 py-5 bg-blue-600 text-white text-xl font-black rounded-3xl shadow-lg shadow-blue-100 transition-all hover:bg-blue-700">ไปเลือกสินค้ากัน</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans antialiased text-gray-900">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 h-20 flex items-center px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">CHUTIPHON</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-8">
            {/* ส่วนที่ 1: ข้อมูลผู้รับ */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-blue-100">1</div>
                  <h2 className="text-2xl font-black tracking-tight">ข้อมูลการจัดส่ง</h2>
                </div>
                <Link to="/profile" className="flex items-center gap-2 text-base font-bold text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-2xl transition-all">
                  <User size={20} />
                  แก้ไขโปรไฟล์
                  <ExternalLink size={16} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">ชื่อ-นามสกุล</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                    <div className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-xl font-bold text-gray-800 shadow-inner">
                      {formData.firstName} {formData.lastName}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">เบอร์โทรศัพท์ติดต่อ</label>
                  <div className="relative group">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                    <div className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-xl font-bold text-gray-800 shadow-inner">
                      {formData.phone || 'ไม่ระบุ'}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">ที่อยู่สำหรับจัดส่งสินค้า</label>
                  <div className="relative group">
                    <Home className="absolute left-5 top-6 text-gray-400" size={22} />
                    <div className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-lg font-bold text-gray-700 leading-relaxed min-h-[120px]">
                      {formData.address} {formData.province} {formData.postcode}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl flex items-start gap-4">
                <AlertCircle size={24} className="text-blue-600 mt-0.5" />
                <p className="text-base font-bold text-blue-800 leading-relaxed">
                  ข้อมูลนี้ดึงมาจากโปรไฟล์ของคุณโดยอัตโนมัติ หากต้องการเปลี่ยนแปลงโปรดแก้ไขในหน้าตั้งค่า
                </p>
              </div>
            </motion.div>

            {/* ส่วนที่ 2: การชำระเงิน */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-blue-100">2</div>
                  <h2 className="text-2xl font-black tracking-tight">ช่องทางการชำระเงิน</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { id: 'qr', icon: QrCode, label: 'Thai QR Pay' },
                    { id: 'card', icon: CreditCard, label: 'Credit Card' },
                    { id: 'cod', icon: Truck, label: 'ปลายทาง' }
                  ].map((method) => (
                    <button 
                      key={method.id} 
                      onClick={() => setPaymentMethod(method.id)} 
                      className={`p-8 rounded-[2rem] border-2 flex flex-col items-center gap-4 transition-all duration-300 ${
                        paymentMethod === method.id 
                        ? 'border-blue-600 bg-blue-50/30 text-blue-600 shadow-lg shadow-blue-50' 
                        : 'border-gray-50 text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      <method.icon size={32} strokeWidth={2.5} />
                      <span className="text-sm font-black uppercase tracking-widest">{method.label}</span>
                    </button>
                  ))}
                </div>
            </motion.div>
          </div>

          {/* ฝั่งขวา: สรุปราคาสินค้า */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl sticky top-24 space-y-8">
              <h2 className="text-2xl font-black tracking-tight text-gray-900 border-b border-gray-50 pb-5">สรุปคำสั่งซื้อ</h2>
              
              <div className="space-y-5 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={item.id} className="flex gap-5 items-center bg-gray-50/80 p-5 rounded-[1.5rem] group border border-transparent hover:border-blue-100 transition-all">
                      <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-gray-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-bold text-gray-900 truncate">{item.name}</p>
                        <p className="text-base text-blue-600 font-black mt-1">
                          ฿{item.price.toLocaleString()} <span className="text-gray-400 text-sm font-bold">x{item.quantity}</span>
                        </p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-sm">
                        <Trash2 size={20} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              <div className="pt-8 border-t border-gray-100 space-y-6">
                <div className="space-y-2">
                  <span className="text-sm font-black text-gray-400 uppercase tracking-widest">ยอดรวมทั้งสิ้น</span>
                  <div className="text-5xl font-black text-blue-600 tracking-tighter">
                    ฿{totalPrice.toLocaleString()}
                  </div>
                </div>

                <button 
                  onClick={handleSubmitOrder} 
                  disabled={isSubmitting} 
                  className="w-full py-6 bg-blue-600 text-white text-xl font-black rounded-[2rem] hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-4"
                >
                  {isSubmitting ? (
                    <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CreditCard size={24} />
                      <span>ชำระเงินตอนนี้</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};