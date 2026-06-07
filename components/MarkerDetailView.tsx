import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight,
  Share2, 
  Heart, 
  Users, 
  Star, 
  MessageSquare, 
  ShieldCheck,
  TrendingUp,
  Clock,
  ExternalLink,
  Info
} from 'lucide-react';
import PromoSlider from './PromoSlider';

interface MarkerDetailViewProps {
  marker: any;
  onBack: () => void;
}

const FEED_ITEMS = [
  { id: 1, title: "Sự kiện kết nối cuối tuần", author: "Admin", time: "10 phút trước", type: "Sự kiện", content: "Hãy cùng tham gia buổi offline giao lưu giữa các đội nhóm tại cơ sở chính." },
  { id: 2, title: "Ưu đãi dịch vụ mới", author: "Đối tác", time: "1 giờ trước", type: "Ưu đãi", content: "Giảm giá 30% cho khách hàng lần đầu sử dụng dịch vụ vận chuyển thông qua LovelyNet." },
  { id: 3, title: "Thông tin tuyển dụng", author: "IT Hub", time: "3 giờ trước", type: "Tuyển dụng", content: "Cần tuyển 5 bạn cộng tác viên hỗ trợ kỹ thuật khu vực Phan Thiết." },
];

const MOCK_PRODUCTS = [
    { name: "Đặc sản 01", price: "250.000đ", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300" },
    { name: "Combo Lovely", price: "450.000đ", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=300" },
    { name: "Dịch vụ VIP", price: "Khảo sát", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=300" },
    { name: "Thành viên Hub", price: "Miễn phí", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=300" },
];

export default function MarkerDetailView({ marker, onBack }: MarkerDetailViewProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Banner Area (YouTube Player style) */}
      <section className="relative w-full aspect-video md:aspect-[21/9] lg:h-[60vh] bg-black overflow-hidden group">
        <PromoSlider /* context={marker} */ />
        
        {/* Floating Controls Overlay */}
        <div className="absolute top-8 sm:top-10 left-6 right-6 flex items-center justify-between z-50">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-black/60 backdrop-blur-xl border border-white/30 text-white rounded-[1.5rem] hover:bg-rose-600 transition-all font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
            Trở về
          </button>
          
          <div className="flex items-center gap-2">
            <button className="p-3 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl text-white hover:bg-white hover:text-rose-600 transition-all shadow-2xl">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-3 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl text-white hover:bg-rose-600 transition-all shadow-2xl">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Badge Overlay on image */}
        <div className="absolute bottom-6 left-6 z-50">
           <div className="px-4 py-2 bg-rose-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
              Đang hoạt động trực tuyến
           </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-20">
          
          {/* Left Column: Primary Content */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-16">
            {/* Header Info */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                 <span className="px-3 py-1 rounded-lg bg-rose-50 text-rose-600 text-[10px] sm:text-[11px] font-black uppercase tracking-widest border border-rose-100/50">
                   {marker.type}
                 </span>
                 <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50/50 px-3 py-1 rounded-lg border border-amber-100/30">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs font-black">{marker.rating}</span>
                 </div>
                 <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50/50 px-3 py-1 rounded-lg border border-emerald-100/30">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                 </div>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-black text-zinc-900 tracking-tight italic italic leading-[1.1]">
                {marker.title}
              </h1>
              <p className="text-zinc-500 text-lg sm:text-xl leading-relaxed max-w-3xl font-medium">
                Khám phá cộng đồng thú vị tại {marker.title}. Nơi hội tụ những giá trị bản địa và tinh thần kết nối LovelyNet hiện đại, mang đến trải nghiệm độc bản tại địa phương.
              </p>
            </div>

            {/* Product/Items Grid */}
            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-900 uppercase tracking-tighter flex items-center gap-3 italic italic">
                  <div className="w-2 h-8 bg-rose-600 rounded-full" />
                  Sản phẩm & Menu
                </h2>
                <button className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] hover:text-rose-600 transition-all flex items-center gap-2 group">
                  Xem tất cả
                  <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {MOCK_PRODUCTS.map((prod, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -8 }}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-zinc-50 mb-4 relative shadow-sm group-hover:shadow-2xl group-hover:shadow-rose-900/10 transition-all duration-500">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                         <button className="w-full py-2 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-900">Đặt hàng ngay</button>
                      </div>
                    </div>
                    <p className="text-base font-black text-zinc-900 tracking-tight group-hover:text-rose-600 transition-colors leading-tight">{prod.name}</p>
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1">{prod.price}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Action Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { icon: <Users className="w-6 h-6 text-rose-500" />, label: "Thành viên", value: marker.members },
                { icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />, label: "Độ tin cậy", value: "98%" },
                { icon: <MessageSquare className="w-6 h-6 text-blue-500" />, label: "Thảo luận", value: "1.2k+" },
                { icon: <TrendingUp className="w-6 h-6 text-orange-500" />, label: "Tăng trưởng", value: "+12%" },
              ].map((stat, i) => (
                <div key={i} className="bg-zinc-50 p-8 rounded-[3rem] flex flex-col gap-4 hover:bg-white hover:shadow-2xl hover:shadow-zinc-200 transition-all border border-transparent hover:border-zinc-100 group">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">{stat.icon}</div>
                    <div>
                      <p className="text-3xl font-black text-zinc-900 leading-none mb-1 tracking-tighter">{stat.value}</p>
                      <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest leading-none">{stat.label}</p>
                    </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Secondary/Sidebar Content (YouTube Sidebar equivalent) */}
          <div className="lg:col-span-12 xl:col-span-4 space-y-12">
            {/* Quick Action Card */}
            <div className="bg-zinc-900 p-10 rounded-[4rem] text-white shadow-3xl shadow-rose-900/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-40 h-40 bg-rose-600 blur-[100px] opacity-25 group-hover:opacity-40 transition-opacity" />
               <h3 className="text-3xl font-black italic tracking-tighter mb-4 leading-tight">Tham gia<br/>Cộng đồng</h3>
               <p className="text-zinc-400 text-sm mb-8 leading-relaxed font-medium">Kết nối với mạng lưới địa phương và nhận đặc quyền dành riêng cho thành viên LovelyNet.</p>
               <div className="space-y-4">
                 <button className="w-full py-5 bg-rose-600 rounded-[2rem] text-xs font-black uppercase tracking-[0.25em] hover:bg-white hover:text-zinc-900 transition-all shadow-xl shadow-rose-900/30 active:scale-[0.98]">
                    Đăng ký thành viên
                 </button>
                 <button className="w-full py-5 bg-white/5 backdrop-blur-md text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.25em] border border-white/10 hover:bg-white/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                    <ExternalLink className="w-5 h-5" />
                    Chia sẻ địa điểm
                 </button>
               </div>
            </div>

            {/* Feeds Sidebar */}
            <section className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <h2 className="text-lg font-black text-zinc-900 uppercase tracking-tight flex items-center gap-2 italic">
                     <Clock className="w-5 h-5 text-rose-600" />
                     Bản tin hoạt động
                  </h2>
               </div>

               <div className="flex flex-col gap-6">
                  {FEED_ITEMS.map((item) => (
                    <div key={item.id} className="group cursor-pointer">
                       <div className="flex gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex-shrink-0 overflow-hidden">
                             <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${item.id}`} className="w-full h-full p-2" />
                          </div>
                          <div className="flex-1">
                             <h4 className="text-sm font-black text-zinc-900 line-clamp-2 leading-tight mb-1 group-hover:text-rose-600 transition-colors italic italic">
                                {item.title}
                             </h4>
                             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                {item.author} • {item.time}
                             </p>
                          </div>
                       </div>
                    </div>
                  ))}
                  <button className="w-full py-3 border border-zinc-100 rounded-2xl text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:bg-zinc-50 transition-colors">
                    Xem tất cả hoạt động
                  </button>
               </div>
            </section>
          </div>

        </div>

        {/* Footer Area */}
        <div className="pb-32 pt-24 text-center border-t border-zinc-100 mt-20">
           <div className="w-12 h-1 bg-zinc-200 rounded-full mx-auto mb-8" />
           <p className="text-[10px] text-zinc-300 font-extrabold uppercase tracking-[0.4em] mb-12">LovelyNet Experience © 2026</p>
           <button 
            onClick={onBack}
            className="group px-8 py-4 bg-zinc-100 text-zinc-900 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95 flex items-center gap-3 mx-auto"
           >
             <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
             Quay lại Bản đồ LovelyNet
           </button>
        </div>
      </div>
    </div>
  );
}

