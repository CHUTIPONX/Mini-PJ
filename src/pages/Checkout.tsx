import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  CreditCard, 
  QrCode, 
  Truck,
  AlertCircle,
  CheckCircle,
  Trash2,
  Plus,
  Minus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/src/context/CartContext';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  province: string;
  postcode: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  province?: string;
  postcode?: string;
}

export const Checkout = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = React.useState('qr');
  const [isOrderComplete, setIsOrderComplete] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    province: 'กรุงเทพมหานคร',
    postcode: '',
  });
  const [errors, setErrors] = React.useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'กรุณากรอกชื่อ';
    if (!formData.lastName.trim()) newErrors.lastName = 'กรุณากรอกนามสกุล';
    if (!formData.phone.trim()) {
      newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    } else if (!/^[0-9]{8,10}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'เบอร์โทรศัพท์ไม่ถูกต้อง (8-10 หลัก)';
    }
    if (!formData.address.trim()) newErrors.address = 'กรุณากรอกที่อยู่';
    if (!formData.postcode.trim()) {
      newErrors.postcode = 'กรุณากรอกรหัสไปรษณีย์';
    } else if (!/^[0-9]{5}$/.test(formData.postcode.replace(/[-\s]/g, ''))) {
      newErrors.postcode = 'รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmitOrder = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsOrderComplete(true);
      setIsSubmitting(false);
      setTimeout(() => clearCart(), 1000);
    }
  };

  const totalPrice = getTotalPrice();

  if (isOrderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-20 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 max-w-md w-full">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="flex justify-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">เรียบร้อย!</h1>
            <p className="text-gray-600">ขอบคุณที่เลือกช้อปกับ CHUTIPHON</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-green-100 shadow-xl space-y-4">
            <div className="text-left space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">ผู้รับ:</span>
                <span className="font-bold">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">วิธีชำระเงิน:</span>
                <span className="font-bold text-blue-600 uppercase">{paymentMethod}</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-gray-500">ยอดรวมทั้งสิ้น:</span>
                <span className="text-xl font-bold text-green-600">฿{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <Link to="/shop" className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-200">ช้อปต่อเลย</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900">ตะกร้ายังว่างอยู่เลย</h1>
          <Link to="/shop" className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">ไปเลือกสินค้ากัน</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-100 h-16 flex items-center px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CHUTIPHON</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold">1</div>
                <h2 className="text-xl font-bold text-gray-900">ที่อยู่จัดส่ง</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">ชื่อ</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="ชื่อ" className={`w-full px-5 py-3.5 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.firstName ? 'border-red-500' : 'border-gray-100'}`} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">นามสกุล</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="นามสกุล" className={`w-full px-5 py-3.5 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.lastName ? 'border-red-500' : 'border-gray-100'}`} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">เบอร์โทรศัพท์</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="08X-XXX-XXXX" className={`w-full px-5 py-3.5 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-gray-100'}`} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">ที่อยู่โดยละเอียด</label>
                  <textarea rows={3} name="address" value={formData.address} onChange={handleInputChange} placeholder="เลขที่บ้าน, ซอย, ถนน..." className={`w-full px-5 py-3.5 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none ${errors.address ? 'border-red-500' : 'border-gray-100'}`} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">รหัสไปรษณีย์</label>
                  <input type="text" name="postcode" value={formData.postcode} onChange={handleInputChange} placeholder="XXXXX" className={`w-full px-5 py-3.5 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.postcode ? 'border-red-500' : 'border-gray-100'}`} />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold">2</div>
                <h2 className="text-xl font-bold text-gray-900">การชำระเงิน</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'qr', icon: QrCode, label: 'Thai QR' },
                  { id: 'card', icon: CreditCard, label: 'บัตรเครดิต' },
                  { id: 'cod', icon: Truck, label: 'ปลายทาง' }
                ].map((method) => (
                  <button key={method.id} onClick={() => setPaymentMethod(method.id)} className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${paymentMethod === method.id ? 'border-blue-600 bg-blue-50/50' : 'border-gray-50 hover:border-blue-100'}`}>
                    <div className={`p-3 rounded-2xl ${paymentMethod === method.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-400 shadow-sm'}`}>
                      <method.icon className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-bold ${paymentMethod === method.id ? 'text-blue-600' : 'text-gray-500'}`}>{method.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl sticky top-24 space-y-6">
              <h2 className="text-xl font-bold text-gray-900">สรุปคำสั่งซื้อ</h2>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item.id} 
                      className="group bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3"
                    >
                      <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                          <p className="text-sm text-blue-600 font-bold">฿{item.price.toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
                        <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 hover:bg-gray-50 rounded text-gray-500"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-bold text-gray-700">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-50 rounded text-gray-500"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-sm font-black text-gray-900">
                          ฿{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">ค่าจัดส่ง</span>
                  <span className="font-bold text-green-500">ฟรี</span>
                </div>
                <div className="pt-4 flex justify-between items-end">
                  <span className="text-sm font-bold text-gray-900">ยอดสุทธิ</span>
                  <span className="text-3xl font-black text-blue-600 tracking-tight">฿{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handleSubmitOrder} 
                disabled={isSubmitting}
                className="w-full py-5 bg-blue-600 text-white font-black text-lg rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "ชำระเงินตอนนี้"
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};