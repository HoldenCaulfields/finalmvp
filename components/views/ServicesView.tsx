import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Coffee, 
  UtensilsCrossed, 
  Sparkles, 
  Heart, 
  Share2, 
  SlidersHorizontal,
  Compass,
  ArrowRight,
  Bookmark
} from "lucide-react";
import { useViewStore } from "../../stores/useViewStore";
import DirectoryTabs from "../DirectoryTabs";

interface ServiceItem {
  id: string;
  name: string;
  category: "culinary" | "craft" | "nature" | "hub";
  desc: string;
  phone: string;
  hours: string;
  rate: number;
  reviews: number;
  location: string;
  coords: [number, number];
  tag: string;
  image: string;
  priceRange?: string;
  specialty?: string;
}

const NATIVE_SERVICES: ServiceItem[] = [
  {
    id: "ser_1",
    name: "HTX Gốm Mỹ Nghệ Bàu Trúc",
    category: "craft",
    desc: "Làng gốm cổ nhất Đông Nam Á của người Chăm. Trải nghiệm tự tay làm gốm nguyên bản thủ công mộc mạc, không dùng bàn xoay độc đáo.",
    phone: "0945.333.129",
    hours: "07:00 - 18:00 hàng ngày",
    rate: 4.9,
    reviews: 148,
    location: "Trại gốm trung tâm, Thị trấn Phước Dân, Ninh Phước",
    coords: [11.523420, 108.968210],
    tag: "Di sản phi vật thể",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
    specialty: "Nghệ nhân đập gốm bằng đôi bàn tay chuyển động xoay quanh tượng đất sét"
  },
  {
    id: "ser_2",
    name: "HTX Thổ Cẩm Mỹ Nghiệp (Inrahani)",
    category: "craft",
    desc: "Thưởng ngoạn các hoa văn thổ cẩm cổ truyền dệt tay hoàn toàn tự nhiên từ tơ tằm, sợi bông Chăm độc bản.",
    phone: "0918.455.122",
    hours: "07:30 - 17:30 hằng ngày",
    rate: 4.8,
    reviews: 95,
    location: "Làng Mỹ Nghiệp, Thị trấn Phước Dân",
    coords: [11.518600, 108.974550],
    tag: "Thổ cẩm dệt tay",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
    specialty: "Trải nghiệm dệt trực tiếp cùng nghệ nhân cao tuổi"
  },
  {
    id: "ser_3",
    name: "Bánh Căn Quê Nhà Phan Rang",
    category: "culinary",
    desc: "Thưởng thức bánh căn nóng hổi đổ khuôn đất sét nướng than hồng, ăn kèm nước đậu phộng bùi béo hoặc mắm nêm đậm đà.",
    phone: "0393.125.772",
    hours: "15:00 - 22:30",
    rate: 4.9,
    reviews: 312,
    location: "Góc ngã tư Yên Ninh - Phan Đăng Lưu",
    coords: [11.571400, 109.006800],
    tag: "Được yêu thích nhất",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
    priceRange: "30.000đ - 65.000đ/phần"
  },
  {
    id: "ser_4",
    name: "Cơm Gà Khánh Kỳ Phan Rang",
    category: "culinary",
    desc: "Cơm chiên gà thả vườn ráo mỡ thơm ngon trứ danh. Thịt gà săn chắc ngọt vị hòa quyện nước mắm gừng chua ngọt sánh quyện.",
    phone: "0259.382.4355",
    hours: "09:00 - 21:00",
    rate: 4.6,
    reviews: 580,
    location: "61 Trần Quang Diệu, Phan Rang - Tháp Chàm",
    coords: [11.564200, 109.014310],
    tag: "Đặc sản lâu đời",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80",
    priceRange: "40.000đ - 120.000đ"
  },
  {
    id: "ser_5",
    name: "Vườn Nho Sạch & Rượu Vang Ba Mọi Lừng Danh",
    category: "nature",
    desc: "Tham quan vườn nho sai trĩu quả chín mọng nổi tiếng, lắng nghe cụ Ba Mọi chia sẻ bí quyết làm rượu vang đặc trưng.",
    phone: "0259.396.3377",
    hours: "08:00 - 17:00",
    rate: 4.7,
    reviews: 215,
    location: "Xã Phước Thuận, Ninh Phước",
    coords: [11.554310, 108.954210],
    tag: "Sinh thái tự nhiên",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80",
    specialty: "Nếm thử nho sấy lạnh & tẩm vang miễn phí"
  },
  {
    id: "ser_6",
    name: "Bún Sứa Phan Rang - Sứa Cát Biển Sâu",
    category: "culinary",
    desc: "Nước dùng nóng thanh từ cá thu tươi, sứa cát giòn sần sật mọng nước ngon ngọt kết hợp chả cá thu dẹt độc trưng Ninh Thuận.",
    phone: "0908.204.119",
    hours: "06:00 - 11:30 sáng",
    rate: 4.8,
    reviews: 194,
    location: "Khu Bún sứa đêm Ngô Gia Tự",
    coords: [11.567800, 109.010400],
    tag: "Điểm ăn sáng ngon",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80",
    priceRange: "35.000đ - 50.000đ"
  }
];

export default function ServicesView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectCategory = useViewStore(s => s.selectCategory);
  const setActiveRoute = useViewStore(s => s.setActiveRoute);

  const filteredServices = useMemo(() => {
    return NATIVE_SERVICES.filter(item => {
      const matchSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCat === "all" || item.category === selectedCat;
      return matchSearch && matchCat;
    });
  }, [searchTerm, selectedCat]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleCopyPhone = (id: string, phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const locateOnMap = (coords: [number, number], categoryIdToFocus: string) => {
    // Focus category and fly back to Map Route
    selectCategory(categoryIdToFocus);
    setActiveRoute("map");
  };

  return (
    <div className="pt-20 lg:pt-28 pb-32 lg:pb-24 px-3 md:px-6 w-full max-w-7xl mx-auto overflow-y-auto h-full max-h-[100vh]">
      
      {/* Mobile-friendly Sub-bar switcher */}
      <div className="lg:hidden">
        <DirectoryTabs />
      </div>

      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-[10px] font-black tracking-[0.25em] text-rose-600 uppercase flex items-center justify-center gap-2 mb-2">
          <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} />
          LovelyNet Community Hub
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight uppercase">
          Các dịch vụ của LovelyNet
        </h2>
        <p className="text-xs md:text-sm text-zinc-500 font-medium mt-2">
          Thật ra tôi cũng chưa có định nghĩa rõ ràng LovelyNet này là gì :)) Tôi nghĩ là nó dành cho những người có ý tưởng và kết nối những người ở đâu đó trên thế giới này tìm đến LovelyNet.
        </p>
      </div>

      {/* Services Grid layout */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-20 bg-white border border-zinc-100 rounded-3xl p-6 max-w-xl mx-auto">
          <Coffee className="w-12 h-12 text-zinc-300 mx-auto animate-bounce mb-3" />
          <h4 className="text-sm font-black text-zinc-700">Không tìm thấy dịch vụ nào phù hợp</h4>
          <p className="text-xs text-zinc-400 mt-1">Vui lòng thay đổi từ khóa hoặc bộ lọc của bạn.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((item, index) => {
            const isFaved = favorites.includes(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, type: "spring", stiffness: 260, damping: 25 }}
                className="bg-white border border-zinc-200/80 hover:border-zinc-300 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group relative"
              >
                {/* Image & Ribbon Banner */}
                <div className="h-44 relative overflow-hidden bg-zinc-200 shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-[0.9]"
                  />
                  
                  {/* Top floating badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5 items-center">
                    <span className="text-[9px] font-black uppercase tracking-wider bg-zinc-950/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg">
                      {item.tag}
                    </span>
                  </div>

                  <button
                    onClick={(e) => toggleFavorite(item.id, e)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm text-zinc-700 hover:text-rose-600 transition flex items-center justify-center cursor-pointer shadow-md"
                  >
                    <Heart size={14} className={isFaved ? "fill-rose-500 text-rose-500 animate-pulse" : ""} />
                  </button>

                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                    <Star size={11} className="text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
                    <span className="text-[10px] font-black text-zinc-900">{item.rate}</span>
                    <span className="text-[9px] text-zinc-400 font-bold">({item.reviews} đánh giá)</span>
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <h3 className="text-sm md:text-base font-black text-zinc-900 leading-snug group-hover:text-rose-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed font-semibold">
                      {item.desc}
                    </p>
                  </div>

                  {/* Operational stats list */}
                  <div className="border-t border-zinc-100 mt-4 pt-3.5 space-y-2 text-[11px] text-zinc-500 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-zinc-400 shrink-0" />
                      <span>{item.hours}</span>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <MapPin size={12} className="text-rose-500 shrink-0" />
                      <span className="truncate" title={item.location}>{item.location}</span>
                    </div>

                    {item.priceRange && (
                      <div className="text-[10px] font-black text-zinc-800 bg-rose-50 border border-rose-100 inline-block px-2.5 py-1 rounded-lg">
                        💰 Khoảng giá: {item.priceRange}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="grid grid-cols-2 gap-2 mt-5 border-t border-zinc-100/60 pt-3">
                    <button
                      onClick={(e) => handleCopyPhone(item.id, item.phone, e)}
                      className="py-2 px-3 border border-zinc-200 hover:border-zinc-300 rounded-xl text-xs font-extrabold text-zinc-700 flex items-center justify-center gap-1.5 cursor-pointer bg-white active:scale-95 transition-all"
                    >
                      <Phone size={12} />
                      <span>{copiedId === item.id ? "Đã lưu" : "Liên hệ"}</span>
                    </button>

                    <button
                      onClick={() => locateOnMap(item.coords, item.category === "craft" ? "langnghe" : "market")}
                      className="py-2 px-3 bg-zinc-950 hover:bg-zinc-900 rounded-xl text-xs font-black text-white flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
                    >
                      <span>Xem bản đồ</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Suggest banner */}
      <div className="mt-14 p-6 bg-gradient-to-r from-zinc-900 to-zinc-950 text-white rounded-3xl border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[9px] font-black uppercase tracking-widest text-rose-500">LovelyNet Map Co-Creator</span>
          <h4 className="text-md font-black">Khám phá vị trí đặc sắc nào chưa có trên Bản đồ?</h4>
          <p className="text-xs text-zinc-400 font-medium max-w-lg mt-1">
            Mở Bản đồ chính, click chọn ghim tọa độ mong muốn, hoàn thiện biểu mẫu gửi Ban điều hành để lập vùng mới tức thì.
          </p>
        </div>
        <button
          onClick={() => setActiveRoute("map")}
          className="px-5 py-3 rounded-2xl bg-white text-zinc-950 hover:bg-zinc-100 active:scale-95 font-black text-xs transition-all uppercase tracking-widest cursor-pointer whitespace-nowrap shrink-0 border border-transparent shadow-md"
        >
          📍 Đi đến Bản Đồ
        </button>
      </div>

    </div>
  );
}
