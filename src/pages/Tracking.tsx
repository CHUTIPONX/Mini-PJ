import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import polyline from '@mapbox/polyline';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  ChevronRight, 
  Clock,
  ArrowLeft
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const greenRadarIcon = L.divIcon({
  className: "custom-radar-container",
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-12 h-12 bg-emerald-500/40 rounded-full animate-ping"></div>
      <div class="absolute w-20 h-20 bg-emerald-400/20 rounded-full animate-[ping_3s_linear_infinite]"></div>
      <div class="relative bg-white p-3 rounded-2xl shadow-2xl border-2 border-emerald-500 z-10">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="#10b981" stroke-width="2.5" fill="none">
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
      </div>
    </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const homeIcon = L.divIcon({
  className: "home-marker",
  html: `<div class="text-rose-600 drop-shadow-2xl">
          <svg viewBox="0 0 24 24" width="45" height="45" stroke="currentColor" stroke-width="2.5" fill="rgba(225, 29, 72, 0.2)">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
         </div>`,
  iconSize: [45, 45],
  iconAnchor: [22, 45],
});

const DeliveryMap = ({ status, destination }: { status: string, destination: [number, number] }) => {
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  
  const startPos: [number, number] = [13.7563, 100.5018]; 
  const truckPos: [number, number] = [
    startPos[0] + (destination[0] - startPos[0]) * 0.6, 
    startPos[1] + (destination[1] - startPos[1]) * 0.6
  ];

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${startPos[1]},${startPos[0]};${truckPos[1]},${truckPos[0]};${destination[1]},${destination[0]}?overview=full&geometries=polyline`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.routes && data.routes[0]) {
          const decodedPoints = polyline.decode(data.routes[0].geometry) as [number, number][];
          setRoutePoints(decodedPoints);
        }
      } catch (error) {
        console.error("Routing error:", error);
      }
    };
    fetchRoute();
  }, [destination]);

  return (
    <div className="relative w-full aspect-[3/4] md:aspect-[21/9] bg-slate-100 rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl z-0 font-sans">
      {/* การใส่ key={destination.join(',')} จะบังคับให้ Map โหลดใหม่ทุกครั้งที่ปลายทางเปลี่ยน */}
      <MapContainer 
        key={destination.join(',')}
        center={truckPos} 
        zoom={11} 
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {routePoints.length > 0 && (
          <Polyline 
            positions={routePoints} 
            color="#10b981" 
            weight={6} 
            opacity={0.8}
            lineJoin="round"
          />
        )}

        <Marker position={truckPos} icon={greenRadarIcon} />
        <Marker position={destination} icon={homeIcon} />
      </MapContainer>

      <div className="absolute top-8 left-8 z-[1000] pointer-events-none font-sans">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-emerald-100 flex items-center gap-3">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-widest">Live Satellite</span>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-[1000] pointer-events-none font-sans">
        <div className="bg-slate-950/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center gap-5">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
              <Clock className="text-emerald-400" size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest text-left">เวลาโดยประมาณ</p>
              <p className="text-xl font-extrabold text-white leading-none">
                {status === 'Completed' ? 'ส่งสำเร็จแล้ว' : '25-30 นาที'}
              </p>
            </div>
        </div>
      </div>
    </div>
  );
}

export const Tracking = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const syncData = () => {
      const orderData = localStorage.getItem('mock_orders');
      if (orderData) {
        const orders = JSON.parse(orderData);
        const foundOrder = orders.find((o: any) => o.id === id);
        setOrder(foundOrder);
      }
    };
    syncData();
    window.addEventListener('storage', syncData);
    return () => window.removeEventListener('storage', syncData);
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-black text-slate-300 uppercase tracking-[0.3em] animate-pulse">กำลังดึงข้อมูลพัสดุ...</p>
      </div>
    );
  }

  // Debug: เช็คค่าที่ออกมาจาก order.shipping_address
  const rawLat = order.shipping_address?.lat;
  const rawLng = order.shipping_address?.lng;
  
  const destCoords: [number, number] = (rawLat && rawLng) 
    ? [Number(rawLat), Number(rawLng)] 
    : [13.9130, 100.5520]; 

  const orderSteps = [
    { id: 'Pending', title: 'รับคำสั่งซื้อ', desc: 'รอยืนยันการชำระเงิน', icon: CheckCircle2 },
    { id: 'Processing', title: 'กำลังจัดเตรียม', desc: 'สินค้ากำลังถูกแพ็ค', icon: Package },
    { id: 'Delivering', title: 'อยู่ระหว่างจัดส่ง', desc: 'พัสดุออกจากคลังสินค้าแล้ว', icon: Truck },
    { id: 'Completed', title: 'จัดส่งสำเร็จ', desc: 'ได้รับสินค้าเรียบร้อย', icon: MapPin },
  ];

  const currentIdx = orderSteps.findIndex(s => s.id === order.status);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-12 flex items-center justify-between font-sans">
        <Link to="/orders" className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-all font-extrabold uppercase text-[11px] tracking-widest">
          <ArrowLeft size={18} /> Back to My Orders
        </Link>
        <div className="bg-white px-6 py-2.5 rounded-full shadow-sm border border-slate-200">
          <span className="text-[10px] font-extrabold text-slate-300 uppercase mr-3">Tracking No.</span>
          <span className="text-sm font-black font-mono text-slate-700">{order.id}</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 space-y-12">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-900 font-sans text-left">
          สถานะ<span className="text-emerald-500">พัสดุ</span>
        </h1>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
          <DeliveryMap status={order.status} destination={destCoords} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 font-sans">
          <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-12 shadow-xl border border-slate-100 text-left">
            <div className="flex flex-col space-y-12">
              {orderSteps.map((step, idx) => {
                const isComplete = idx < currentIdx || order.status === 'Completed';
                const isCurrent = idx === currentIdx && order.status !== 'Completed';
                const isUpcoming = idx > currentIdx;

                return (
                  <div key={step.id} className="flex gap-8 relative">
                    {idx !== orderSteps.length - 1 && (
                      <div className={`absolute left-[27px] top-[64px] w-[3px] h-[calc(100%-16px)] ${
                        isComplete ? 'bg-emerald-500' : 'bg-slate-100'
                      }`} />
                    )}
                    <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center z-10 transition-all duration-500 ${
                      isComplete || (idx === currentIdx && order.status === 'Completed') ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-100' :
                      isCurrent ? 'bg-white text-emerald-600 border-2 border-emerald-500 shadow-2xl' :
                      'bg-slate-50 text-slate-300'
                    }`}>
                      <step.icon size={26} strokeWidth={2.5} className={isCurrent ? 'animate-pulse' : ''} />
                    </div>
                    <div className="pt-1">
                      <h3 className={`text-2xl font-extrabold tracking-tight ${isUpcoming ? 'text-slate-300' : 'text-slate-900'}`}>{step.title}</h3>
                      <p className="text-slate-500 font-medium text-lg mt-1">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 text-white p-12 rounded-[3.5rem] shadow-2xl shadow-emerald-200/40 relative overflow-hidden transition-all hover:scale-[1.03] border border-white/20 group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all" />
                
                <div className="relative z-10 text-left">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-white/15 backdrop-blur-xl rounded-2xl border border-white/20 shadow-inner">
                      <MapPin size={32} className="text-emerald-300" />
                    </div>
                    <div>
                      <p className="text-[12px] font-black text-emerald-200 uppercase tracking-[0.25em] leading-none mb-1">Shipping To</p>
                      <div className="h-1 w-8 bg-emerald-400 rounded-full" />
                    </div>
                  </div>

                  <div className="space-y-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-emerald-300/60 uppercase tracking-widest">Province</p>
                        <h4 className="text-5xl font-black tracking-tighter drop-shadow-lg uppercase italic leading-none">
                          {order.shipping_address?.province || 'BKK'}
                        </h4>
                      </div>
                      
                      <div className="space-y-2 pt-4 border-t border-white/10">
                        <p className="text-2xl font-extrabold text-white leading-tight">
                          {order.shipping_address?.district || 'เขต'}, 
                          <span className="text-emerald-200 ml-2">{order.shipping_address?.subdistrict || 'แขวง'}</span>
                        </p>
                        <p className="text-lg font-medium text-emerald-50/70 leading-relaxed max-w-[280px]">
                          {order.shipping_address?.full_address || 'ที่อยู่จัดส่ง'}
                        </p>
                      </div>
                  </div>
                </div>
            </div>
            
            <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl transition-all hover:scale-[1.02] border border-slate-800 relative overflow-hidden text-left">
                <Truck size={36} className="text-emerald-400 mb-8" />
                <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 font-sans">พนักงานขับรถ</p>
                <h4 className="text-2xl font-extrabold mb-8">คุณสมศักดิ์ พรหมดี</h4>
                
                <button className="w-full flex items-center justify-between p-5 bg-white/5 rounded-[1.8rem] border border-white/5 cursor-pointer hover:bg-emerald-500 hover:text-white transition-all group overflow-hidden relative">
                  <span className="text-sm font-black uppercase tracking-widest z-10">โทรติดต่อพนักงาน</span>
                  <ChevronRight className="text-emerald-500 group-hover:text-white group-hover:translate-x-2 transition-all z-10" />
                </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};