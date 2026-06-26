'use client';

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Coffee,
  Heart,
  Compass,
  ArrowRight,
} from "lucide-react";
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
  route: string;
  priceRange?: string;
  specialty?: string;
}

const ROUTE_SERVICES: ServiceItem[] = [
  {
    id: "route_caodangnghe",
    name: "Hội Sinh Viên Cao đẳng nghề",
    category: "hub",
    desc: "Đi thẳng tới khu vực đào tạo nghề và cộng đồng sáng tạo của ứng dụng.",
    phone: "/caodangnghe",
    hours: "Route app",
    rate: 4.9,
    reviews: 128,
    location: "/caodangnghe",
    coords: [11.573200, 108.993100],
    tag: "Route chính",
    image: "/mdt.jpg",
    route: "/caodangnghe"
  },
  {
    id: "route_chophanrang",
    name: "Chợ Phan Rang",
    category: "hub",
    desc: "Mở giao diện gian hàng và món ăn trong route /chophanrang, bao gồm dữ liệu stalls.",
    phone: "/chophanrang",
    hours: "stalls",
    rate: 4.8,
    reviews: 214,
    location: "Gian hàng stalls",
    coords: [11.564200, 109.014310],
    tag: "stalls",
    image: "/phanrang.jpg",
    route: "/chophanrang"
  },
  {
    id: "route_cimanet",
    name: "Cimanet",
    category: "hub",
    desc: "Truy cập không gian yêu phim ảnh, tìm người làm phim.",
    phone: "/cimanet",
    hours: "Route app",
    rate: 4.7,
    reviews: 96,
    location: "/cimanet",
    coords: [11.558500, 108.998100],
    tag: "Innovation",
    image: "https://blog.coccoc.com/wp-content/uploads/2025/04/1-dinh-nghia-absolute-cinema.jpg",
    route: "/cimanet"
  },
  {
    id: "route_langnghecham",
    name: "Làng nghề Chăm",
    category: "hub",
    desc: "Mở giao diện gian hàng Chăm trong route /langnghecham, dùng bộ dữ liệu stalls-cham.",
    phone: "/langnghecham",
    hours: "stalls-cham",
    rate: 4.9,
    reviews: 183,
    location: "Gian hàng stalls-cham",
    coords: [11.523400, 108.968200],
    tag: "stalls-cham",
    image: "/vanhoacham.jpg",
    route: "/langnghecham"
  }
];

export default function ServicesView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const router = useRouter();

  const filteredServices = useMemo(() => {
    return ROUTE_SERVICES.filter(item => {
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

  const handleOpenRoute = (route: string) => {
    router.push(route);
  };

  const handleCopyRoute = (id: string, route: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(route);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
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
          Các route chính trong ứng dụng
        </h2>
        <p className="text-xs md:text-sm text-zinc-500 font-medium mt-2">
          Chuyển thẳng đến các trang chính của app như Sinh Viên Cao đẳng nghề, Chợ Phan Rang, Cimanet và Làng nghề Chăm. Các card Chợ Phan Rang và Làng nghề Chăm đã được nối tới các gian hàng tương ứng là stalls và stalls-cham.
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
                <div
                  className="p-5 flex-1 flex flex-col justify-between cursor-pointer"
                  onClick={() => handleOpenRoute(item.route)}
                >
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
                      onClick={(e) => handleCopyRoute(item.id, item.route, e)}
                      className="py-2 px-3 border border-zinc-200 hover:border-zinc-300 rounded-xl text-xs font-extrabold text-zinc-700 flex items-center justify-center gap-1.5 cursor-pointer bg-white active:scale-95 transition-all"
                    >
                      <Phone size={12} />
                      <span>{copiedId === item.id ? "Đã sao chép" : "Sao chép link"}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenRoute(item.route);
                      }}
                      className="py-2 px-3 bg-zinc-950 hover:bg-zinc-900 rounded-xl text-xs font-black text-white flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
                    >
                      <span>Mở route</span>
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
          onClick={() => handleOpenRoute("/map")}
          className="px-5 py-3 rounded-2xl bg-white text-zinc-950 hover:bg-zinc-100 active:scale-95 font-black text-xs transition-all uppercase tracking-widest cursor-pointer whitespace-nowrap shrink-0 border border-transparent shadow-md"
        >
          📍 Đi đến Bản Đồ
        </button>
      </div>

    </div>
  );
}
