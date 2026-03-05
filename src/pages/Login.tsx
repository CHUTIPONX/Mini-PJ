import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, User, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  
  const [isLogin, setIsLogin] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [formData, setFormData] = React.useState({ email: '', password: '', name: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const result = isLogin 
        ? await login(formData.email, formData.password)
        : await register(formData.email, formData.password, formData.name);

      if (result.success) {
        setSuccess(result.message);
        
        // --- ส่วนที่แก้ไข: แยกเส้นทาง Admin และ User ---
        setTimeout(() => {
          if (result.user?.role === 'admin') {
            // แอดมินเด้งไปหน้า Dashboard หลังบ้านหน้าเดียวจบ
            navigate('/admin', { replace: true });
          } else {
            // ยูสเซอร์ทั่วไปเด้งไปหน้าแรก (Home)
            navigate('/', { replace: true });
          }
        }, 1500);
        // -------------------------------------------

      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณลองใหม่อีกครั้ง');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1100px] min-h-[700px] bg-white rounded-[3rem] shadow-2xl shadow-slate-200 overflow-hidden flex flex-col md:flex-row border border-slate-100"
      >
        
        {/* ฝั่งซ้าย (Branding) */}
        <div className="hidden md:flex md:w-[40%] bg-[#0F172A] p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <Link to="/" className="flex items-center gap-3 relative z-10 group">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40 transition-transform group-hover:scale-110">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase">CHUTIPHON</span>
          </Link>

          <div className="relative z-10 space-y-4">
            <h2 className="text-5xl font-black text-white leading-tight tracking-tight">
              เริ่มต้น <br />
              <span className="text-blue-500">ประสบการณ์ใหม่.</span>
            </h2>
            <p className="text-slate-400 font-bold text-lg">จัดการทุกบริการและสิทธิพิเศษสำหรับสมาชิก</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shadow-lg">P</div>
              <div>
                <p className="text-sm font-black text-white uppercase tracking-wide">Pet Cremation</p>
                <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">พาร์ทเนอร์ที่ผ่านการรับรอง</p>
              </div>
            </div>
          </div>
        </div>

        {/* ฝั่งขวา (ฟอร์มกรอกข้อมูล) */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full space-y-8">
            
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              <button 
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${isLogin ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400'}`}
              >
                เข้าสู่ระบบ
              </button>
              <button 
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${!isLogin ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400'}`}
              >
                สมัครสมาชิก
              </button>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                {isLogin ? 'ยินดีต้อนรับกลับมา' : 'สร้างบัญชีใหม่'}
              </h1>
              <p className="text-slate-500 font-bold mt-1">จัดการทุกอย่างได้ง่ายๆ ในที่เดียว</p>
            </div>

            <AnimatePresence mode="wait">
              {(error || success) && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${error ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}
                >
                  {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                  {error || success}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">ชื่อ-นามสกุล</span>
                  <input 
                    name="name" type="text" placeholder="ระบุชื่อจริงของคุณ" 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 outline-none font-bold text-slate-900 transition-all shadow-sm"
                  />
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">อีเมล</span>
                <input 
                  name="email" type="email" placeholder="example@gmail.com"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 outline-none font-bold text-slate-900 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center px-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">รหัสผ่าน</span>
                  {isLogin && <button type="button" className="text-[10px] font-black text-blue-600 hover:underline uppercase">ลืมรหัสผ่าน?</button>}
                </div>
                <div className="relative">
                  <input 
                    name="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 outline-none font-bold text-slate-900 transition-all shadow-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 p-2 hover:text-slate-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" disabled={isLoading}
                className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-3 mt-4 text-lg"
              >
                {isLoading ? (
                   <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> 
                ) : (
                   isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'
                )}
                {!isLoading && <ArrowRight size={20} />}
              </button>
            </form>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[10px] font-black text-slate-400 uppercase bg-white px-4 tracking-widest">หรือดำเนินการด้วย</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all font-black text-slate-600 text-xs shadow-sm">
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="google" /> GOOGLE
              </button>
              <button className="flex items-center justify-center gap-3 py-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all font-black text-slate-600 text-xs shadow-sm">
                <img src="https://www.facebook.com/favicon.ico" className="w-4 h-4" alt="facebook" /> FACEBOOK
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};