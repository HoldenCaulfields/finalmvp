import { motion } from 'framer-motion';
import PromoSlider from './PromoSlider';
import { ChevronLeft, Compass, Sparkles } from 'lucide-react';

const MOCK_MARKERS = [
    { 
        id: 1, 
        pos: [11.56, 109.00], 
        title: "Lovely Hub Phan Thiết", 
        type: "Văn phòng", 
        members: 12, 
        rating: 4.8,
        gallery: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800"
        ]
    },
    { 
        id: 2, 
        pos: [11.52, 108.95], 
        title: "Hải Sản Tươi Sống", 
        type: "Nhà hàng", 
        members: 48, 
        rating: 4.9,
        gallery: [
            "https://images.unsplash.com/photo-1551739440-5dd934d3a94a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?auto=format&fit=crop&q=80&w=800"
        ]
    },
    { 
        id: 3, 
        pos: [11.48, 109.05], 
        title: "Phê La Café", 
        type: "Quán cà phê", 
        members: 25, 
        rating: 4.7,
        gallery: [
            "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800"
        ]
    },
];

export default function FeedView({ onBack, onSelectMarker }: { onBack: () => void, onSelectMarker: (m: any) => void }) {
  return (
    <div className="min-h-full bg-white pb-32">
      {/* Floating Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="group flex items-center gap-2 p-2 px-3 rounded-xl bg-zinc-100 text-zinc-900 hover:bg-rose-600 hover:text-white transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Trở về</span>
            </button>
            <h1 className="text-2xl font-display font-black tracking-tighter italic italic">Bảng tin LovelyNet</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-lg bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3" />
                Live Feed
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-12">
        <div className="flex items-center gap-3 px-2">
            <Compass className="w-5 h-5 text-rose-600 animate-spin-slow" />
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Các địa điểm nổi bật quanh bạn</p>
        </div>

        {MOCK_MARKERS.map((marker, idx) => (
          <motion.div 
            key={marker.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-end justify-between px-2">
              <div onClick={() => onSelectMarker(marker)} className="cursor-pointer group">
                <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">{marker.type}</p>
                <h2 className="text-2xl font-black text-zinc-900 group-hover:text-rose-600 transition-colors tracking-tight italic italic">{marker.title}</h2>
              </div>
              <p className="text-xs font-bold text-zinc-400">{marker.members} thành viên</p>
            </div>
            
            <div className="h-[280px] lg:h-[400px] shadow-2xl shadow-zinc-200/40 rounded-[2.5rem] overflow-hidden">
                <PromoSlider /* context={marker} onClick={() => onSelectMarker(marker)} */ />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
