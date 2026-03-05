import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ShieldCheck, X, CreditCard, Calendar, User, Save } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { DashboardLayout } from '../components/laout/DashboardLayout';
import toast from 'react-hot-toast';

const initialPaymentMethods = [
  {
    id: 1,
    cardNumber: '**** **** **** 1234',
    cardHolder: 'CHUTIPHON USER',
    expiryDate: '12/26',
    color: 'bg-[#0F172A]' 
  },
  {
    id: 2,
    cardNumber: '**** **** **** 5678',
    cardHolder: 'CHUTIPHON USER',
    expiryDate: '08/25',
    color: 'bg-gradient-to-br from-blue-600 to-indigo-800' 
  }
];

export const PaymentMethods = () => {
  const [paymentList, setPaymentList] = useState(initialPaymentMethods);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // State สำหรับฟอร์ม
  const [newCard, setNewCard] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: ''
  });

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Logic การบันทึกแบบจำลอง
    const cardData = {
      id: Date.now(),
      cardNumber: `**** **** **** ${newCard.number.slice(-4)}`,
      cardHolder: newCard.holder.toUpperCase(),
      expiryDate: newCard.expiry,
      color: 'bg-slate-800' // สีสำหรับบัตรใหม่
    };

    setPaymentList([cardData, ...paymentList]);
    setShowAddForm(false);
    setNewCard({ number: '', holder: '', expiry: '', cvv: '' });
    
    // เรียกใช้ Toast ที่เราเซ็ตไว้ใน App.tsx
    toast.success('เพิ่มบัตรใหม่เรียบร้อยแล้ว!');
  };

  const removeCard = (id: number) => {
    setPaymentList(prev => prev.filter(p => p.id !== id));
    toast.error('ลบบัตรออกแล้ว');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">วิธีการชำระเงิน</h2>
            <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-widest leading-none">Secure Payment Management</p>
          </motion.div>
          
          {!showAddForm && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddForm(true)}
              className="px-8 py-4 bg-[#0F172A] text-white text-[10px] font-black rounded-2xl shadow-xl shadow-slate-200 uppercase tracking-widest"
            >
              <Plus className="w-4 h-4 inline mr-2" /> เพิ่มบัตรใหม่
            </motion.button>
          )}
        </header>

        {/* ฟอร์มเพิ่มบัตรใหม่ (แก้ไขเพิ่มส่วนนี้) */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleAddCard}
              className="bg-white rounded-[3rem] p-10 border border-blue-100 shadow-2xl shadow-blue-50/50 space-y-8 relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">กรอกข้อมูลบัตร</h3>
                <button type="button" onClick={() => setShowAddForm(false)} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">หมายเลขบัตร</label>
                  <div className="relative">
                    <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                    <input 
                      required
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={newCard.number}
                      onChange={(e) => setNewCard({...newCard, number: e.target.value})}
                      className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.8rem] font-black text-sm focus:border-blue-600 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">ชื่อผู้ถือบัตร</label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                    <input 
                      required
                      placeholder="NAME SURNAME"
                      value={newCard.holder}
                      onChange={(e) => setNewCard({...newCard, holder: e.target.value})}
                      className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.8rem] font-black text-sm focus:border-blue-600 outline-none transition-all uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">วันหมดอายุ</label>
                    <input 
                      required
                      placeholder="MM/YY"
                      value={newCard.expiry}
                      onChange={(e) => setNewCard({...newCard, expiry: e.target.value})}
                      className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.8rem] font-black text-sm focus:border-blue-600 outline-none transition-all text-center"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">CVV</label>
                    <input 
                      required
                      placeholder="***"
                      maxLength={3}
                      value={newCard.cvv}
                      onChange={(e) => setNewCard({...newCard, cvv: e.target.value})}
                      className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.8rem] font-black text-sm focus:border-blue-600 outline-none transition-all text-center"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-6 bg-blue-600 text-white font-black rounded-[2rem] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3"
              >
                <Save className="w-5 h-5" /> ยืนยันการเพิ่มบัตร
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {paymentList.map((card) => (
              <motion.div
                layout
                key={card.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn("relative p-10 rounded-[3rem] text-white flex flex-col justify-between aspect-[1.6/1] shadow-2xl group overflow-hidden", card.color)}
              >
                <div className="flex justify-between items-start relative z-10">
                  <div className="w-14 h-9 bg-white/20 rounded-xl border border-white/30 backdrop-blur-md" />
                  <button 
                    onClick={() => removeCard(card.id)}
                    className="p-3 bg-rose-500/20 hover:bg-rose-500 text-white rounded-2xl transition-all backdrop-blur-md group-hover:scale-110"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="relative z-10">
                  <p className="text-2xl font-mono tracking-[0.25em] mb-8">{card.cardNumber}</p>
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Card Holder</p>
                      <p className="text-sm font-black tracking-tight">{card.cardHolder}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Expires</p>
                      <p className="text-sm font-black tracking-tight">{card.expiryDate}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="bg-slate-50 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 border border-slate-100">
          <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-blue-100">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">ความปลอดภัยระดับธนาคาร</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
              เราไม่เก็บข้อมูลเลขบัตรของคุณไว้ในเซิร์ฟเวอร์ ข้อมูลทั้งหมดจะถูกเข้ารหัสผ่าน PCI-DSS
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};