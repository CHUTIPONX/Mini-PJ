import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, User, ArrowRight, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';

interface FormErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export const Login = () => {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  
  const [isLogin, setIsLogin] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [formErrors, setFormErrors] = React.useState<FormErrors>({});
  
  const [formData, setFormData] = React.useState({ 
    email: '', 
    password: '', 
    firstName: '',
    lastName: '',
    phone: ''
  });

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.email) {
      errors.email = 'กรุณากรอกอีเมล';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }

    if (!formData.password) {
      errors.password = 'กรุณากรอกรหัสผ่าน';
    } else if (formData.password.length < 6) {
      errors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    }

    if (!isLogin) {
      if (!formData.firstName.trim()) errors.firstName = 'กรุณากรอกชื่อ';
      if (!formData.lastName.trim()) errors.lastName = 'กรุณากรอกนามสกุล';
      if (!formData.phone) {
        errors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
      } else if (!phoneRegex.test(formData.phone)) {
        errors.phone = 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    try {
      const result = isLogin 
        ? await login(formData.email, formData.password)
        : await register(
            formData.email, 
            formData.password, 
            `${formData.firstName} ${formData.lastName}`, // รวมชื่อส่งไป API
            formData.phone
          );

      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          navigate(result.user?.role === 'admin' ? '/admin' : '/', { replace: true });
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors({ ...formErrors, [name]: undefined });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1150px] min-h-[700px] bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200 overflow-hidden flex flex-col md:flex-row border border-slate-100"
      >
        {/* Left Side (Branding) */}
        <div className="hidden md:flex md:w-[35%] bg-[#0F172A] p-12 flex-col justify-between relative">
          <Link to="/" className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase font-sans">CHUTIPHON</span>
          </Link>
          <div className="relative z-10 space-y-4">
            <h2 className="text-5xl font-black text-white leading-tight">
              {isLogin ? "Welcome Back." : "Create Account."}
            </h2>
            <p className="text-slate-400 font-bold">เริ่มจัดการระบบโลจิสติกส์ของคุณให้ง่ายขึ้น</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 relative z-10">
              <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em]">Secure Data Management</p>
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white overflow-y-auto">
          <div className="max-w-xl mx-auto w-full space-y-8 py-8">
            {/* Tab Switcher */}
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              <button type="button" onClick={() => { setIsLogin(true); setFormErrors({}); }} className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${isLogin ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400'}`}>เข้าสู่ระบบ</button>
              <button type="button" onClick={() => { setIsLogin(false); setFormErrors({}); }} className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${!isLogin ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400'}`}>สมัครสมาชิก</button>
            </div>

            <AnimatePresence mode="wait">
              {(error || success) && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${error ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                  {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                  {error || success}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                    {/* ชื่อ - นามสกุล */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">ชื่อจริง</span>
                        <div className="relative">
                          <User className={`absolute left-5 top-1/2 -translate-y-1/2 ${formErrors.firstName ? 'text-red-400' : 'text-slate-400'}`} size={16} />
                          <input name="firstName" value={formData.firstName} type="text" placeholder="สมชาย" onChange={handleInputChange} className={`w-full pl-12 pr-6 py-4 bg-slate-50 border rounded-2xl focus:bg-white outline-none font-bold text-slate-900 transition-all ${formErrors.firstName ? 'border-red-400 ring-1 ring-red-100' : 'border-slate-100 focus:border-blue-500'}`} />
                        </div>
                        {formErrors.firstName && <p className="text-[9px] text-red-500 font-bold ml-2">{formErrors.firstName}</p>}
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">นามสกุล</span>
                        <input name="lastName" value={formData.lastName} type="text" placeholder="ใจดี" onChange={handleInputChange} className={`w-full px-6 py-4 bg-slate-50 border rounded-2xl focus:bg-white outline-none font-bold text-slate-900 transition-all ${formErrors.lastName ? 'border-red-400 ring-1 ring-red-100' : 'border-slate-100 focus:border-blue-500'}`} />
                        {formErrors.lastName && <p className="text-[9px] text-red-500 font-bold ml-2">{formErrors.lastName}</p>}
                      </div>
                    </div>

                    {/* เบอร์โทรศัพท์ */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">เบอร์โทรศัพท์</span>
                      <div className="relative">
                        <Phone className={`absolute left-5 top-1/2 -translate-y-1/2 ${formErrors.phone ? 'text-red-400' : 'text-slate-400'}`} size={16} />
                        <input name="phone" value={formData.phone} type="tel" placeholder="08xxxxxxxx" maxLength={10} onChange={handleInputChange} className={`w-full pl-12 pr-6 py-4 bg-slate-50 border rounded-2xl focus:bg-white outline-none font-bold text-slate-900 transition-all ${formErrors.phone ? 'border-red-400 ring-1 ring-red-100' : 'border-slate-100 focus:border-blue-500'}`} />
                      </div>
                      {formErrors.phone && <p className="text-[9px] text-red-500 font-bold ml-2">{formErrors.phone}</p>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* อีเมล */}
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">อีเมล</span>
                <div className="relative">
                  <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 ${formErrors.email ? 'text-red-400' : 'text-slate-400'}`} size={16} />
                  <input name="email" value={formData.email} type="email" placeholder="example@email.com" onChange={handleInputChange} className={`w-full pl-12 pr-6 py-4 bg-slate-50 border rounded-2xl focus:bg-white outline-none font-bold text-slate-900 transition-all ${formErrors.email ? 'border-red-400 ring-1 ring-red-100' : 'border-slate-100 focus:border-blue-500'}`} />
                </div>
                {formErrors.email && <p className="text-[9px] text-red-500 font-bold ml-2">{formErrors.email}</p>}
              </div>

              {/* รหัสผ่าน */}
              <div className="space-y-1">
                <div className="flex justify-between items-center px-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">รหัสผ่าน</span>
                  {isLogin && <button type="button" className="text-[10px] font-black text-blue-600 hover:underline uppercase">ลืมรหัสผ่าน?</button>}
                </div>
                <div className="relative">
                  <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 ${formErrors.password ? 'text-red-400' : 'text-slate-400'}`} size={16} />
                  <input name="password" value={formData.password} type={showPassword ? "text" : "password"} placeholder="••••••••" onChange={handleInputChange} className={`w-full pl-12 pr-14 py-4 bg-slate-50 border rounded-2xl focus:bg-white outline-none font-bold text-slate-900 transition-all ${formErrors.password ? 'border-red-400 ring-1 ring-red-100' : 'border-slate-100 focus:border-blue-500'}`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 p-2 hover:text-slate-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formErrors.password && <p className="text-[9px] text-red-500 font-bold ml-2">{formErrors.password}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="w-full py-5 bg-blue-600 text-white font-black rounded-[1.5rem] hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-100 transition-all flex items-center justify-center gap-3 mt-6 text-lg disabled:opacity-50 active:scale-[0.98]">
                {isLoading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : (isLogin ? 'เข้าสู่ระบบ' : 'เริ่มสร้างบัญชี')}
                {!isLoading && <ArrowRight size={20} />}
              </button>
            </form>

            {/* Social Login */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[10px] font-black text-slate-400 uppercase bg-white px-4 tracking-widest">Fast Access</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all font-black text-slate-600 text-[10px] shadow-sm uppercase tracking-tighter">
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="google" /> Google
              </button>
              <button className="flex items-center justify-center gap-3 py-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all font-black text-slate-600 text-[10px] shadow-sm uppercase tracking-tighter">
                <img src="https://www.facebook.com/favicon.ico" className="w-4 h-4" alt="facebook" /> Facebook
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};