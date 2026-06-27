import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  MapPin,
  Phone,
  Star,
  Zap,
  Calculator,
  Play,
  Loader2,
  CheckCircle,
  HelpCircle,
  Navigation,
  DollarSign,
  User,
  ShieldCheck,
  Compass
} from "lucide-react";
import DirectoryTabs from "../DirectoryTabs";

interface Driver {
  id: string;
  name: string;
  carModel: string;
  plate: string;
  rate: number;
  trips: number;
  phone: string;
  status: "idle" | "busy";
  avatar: string;
}

const VERIFIED_DRIVERS: Driver[] = [
  {
    id: "drv_1",
    name: "Nguyễn Minh Hải",
    carModel: "Toyota Vios 2023 (4 Chỗ)",
    plate: "85A-122.94",
    rate: 4.9,
    trips: 50,
    phone: "0793784133",
    status: "idle",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MinhHai"
  },
  {
    id: "drv_2",
    name: "Phan Đình Luật",
    carModel: "Hyundai Accent 2022 (4 Chỗ)",
    plate: "85A-098.11",
    rate: 4.8,
    trips: 40,
    phone: "0793784133",
    status: "idle",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DinhLuat"
  },
  {
    id: "drv_3",
    name: "Vũ Hoàng Lâm",
    carModel: "Mitsubishi Xpander 2023 (7 Chỗ)",
    plate: "85B-014.55",
    rate: 4.9,
    trips: 60,
    phone: "0793784133",
    status: "busy",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=HoangLam"
  },
  {
    id: "drv_4",
    name: "Trần Quốc Huy",
    carModel: "VinFast VF8 (Xe Điện)",
    plate: "85A-301.22",
    rate: 5.0,
    trips: 30,
    phone: "0793784133",
    status: "idle",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=QuocHuy"
  }
];

const PRESET_PLACES = [
  // --- GỐC & TRUNG TÂM / CÔNG CỘNG (ĐÔNG NGƯỜI) ---
  { id: "center", name: "Trung tâm Phan Rang (Bến xe tỉnh)", lat: 11.5672, lng: 109.0062 },
  { id: "quangtruong164", name: "Quảng trường 16/4 (Trung tâm sự kiện/Check-in)", lat: 11.5695, lng: 109.0015 },
  { id: "congvien164", name: "Công viên 16/4", lat: 11.5682, lng: 108.9995 },
  { id: "chophanrang", name: "Chợ Phan Rang (Khu mua sắm sầm uất ngày/đêm)", lat: 11.5632, lng: 109.0031 },
  { id: "vincomphanrang", name: "Vincom Plaza Phan Rang", lat: 11.5684, lng: 109.0072 },
  { id: "ganhathapcham", name: "Ga Tháp Chàm", lat: 11.5647, lng: 108.9431 },

  // --- KINH ĐÔ ĂN UỐNG & CAFE / PHỐ ĐI BỘ CHỢ ĐÊM ---
  { id: "chodem_thongnhat", name: "Chợ đêm Ninh Thuận (Đường Thống Nhất - 16/4)", lat: 11.5678, lng: 109.0008 },
  { id: "khu_k1", name: "Khu đô thị K1 (Thiên đường Cafe, Ăn vặt, Nhậu đêm)", lat: 11.5725, lng: 109.0055 },
  { id: "banhcan_leloi", name: "Khu Bánh căn - Bánh xèo Lập Là (Đường Lê Lợi)", lat: 11.5642, lng: 109.0118 },
  { id: "banhcanh_nhon", name: "Bánh canh Chả cá Nhơn (Khu ăn uống Ngô Gia Tự)", lat: 11.5688, lng: 108.9922 },
  { id: "comga_khanhky", name: "Cơm gà Khánh Kỳ (Trần Quang Diệu)", lat: 11.5711, lng: 109.0080 },

  // --- DU LỊCH & BIỂN (TẬP TRUNG ĐÔNG NGƯỜI VỀ CHIỀU/TỐI) ---
  { id: "ninhchu", name: "Bãi biển Ninh Chữ (Khu bãi tắm chính)", lat: 11.5830, lng: 109.0345 },
  { id: "congvien_binhson", name: "Công viên Biển Bình Sơn (Nơi tập trung đông người về đêm)", lat: 11.5675, lng: 109.0272 },
  { id: "thapcham_porome", name: "Tháp Po Klong Garai", lat: 11.5942, lng: 108.9458 },
  { id: "trungsonco_tu", name: "Thiền viện Trúc Lâm Tự Hải / Trùng Sơn Cổ Tự (Núi Đá Chồng)", lat: 11.5912, lng: 109.0235 },

  // --- LÀNG NGHỀ TRUYỀN THỐNG ---
  { id: "bautruc", name: "Làng gốm Bàu Trúc", lat: 11.5234, lng: 108.9682 },
  { id: "mynghiep", name: "Làng dệt Mỹ Nghiệp", lat: 11.5186, lng: 108.9745 },
  { id: "bamoifarm", name: "Vườn nho Ba Mọi", lat: 11.5543, lng: 108.9542 }
];

export default function DriversView() {
  const [pickup, setPickup] = useState(PRESET_PLACES[0].id);
  const [dropoff, setDropoff] = useState(PRESET_PLACES[1].id);
  const [distanceKm, setDistanceKm] = useState<number>(8.5);

  // Dispatch simulator state
  const [activeDispatch, setActiveDispatch] = useState<{
    stage: "none" | "searching" | "success";
    selectedDriver: Driver | null;
  }>({
    stage: "none",
    selectedDriver: null
  });

  // Simple fare estimate calculator (VND)
  // Base fare: 15,000 VND. Per km: 12,000 VND.
  const estimatedFare = 15000 + distanceKm * 3000;

  const handleCalculate = (pId: string, dId: string) => {
    // Generate simulated distance in KM based on coordinates
    const p = PRESET_PLACES.find(item => item.id === pId);
    const d = PRESET_PLACES.find(item => item.id === dId);
    if (p && d) {
      const diffX = Math.abs(p.lat - d.lat);
      const diffY = Math.abs(p.lng - d.lng);
      const baseKm = Math.sqrt(diffX * diffX + diffY * diffY) * 110; // Simple approximation to KM
      setDistanceKm(parseFloat(baseKm.toFixed(1)) || 2.5);
    }
  };

  const handleStartDispatch = (driver?: Driver) => {
    setActiveDispatch({
      stage: "searching",
      selectedDriver: null
    });

    setTimeout(() => {
      // Pick specified driver or default random idle driver
      const candidates = VERIFIED_DRIVERS.filter(item => item.status === "idle");
      const matched = driver || candidates[Math.floor(Math.random() * candidates.length)] || VERIFIED_DRIVERS[0];

      setActiveDispatch({
        stage: "success",
        selectedDriver: matched
      });
    }, 2500);
  };

  const handleCancelDispatch = () => {
    setActiveDispatch({
      stage: "none",
      selectedDriver: null
    });
  };

  return (
    <div className="pt-20 lg:pt-28 pb-32 lg:pb-24 px-3 md:px-6 w-full max-w-7xl mx-auto overflow-y-auto h-full max-h-[100vh]">

      {/* Mobile-friendly Sub-bar switcher */}
      <div className="lg:hidden">
        <DirectoryTabs />
      </div>

      {/* Upper header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-[10px] font-black tracking-[0.25em] text-emerald-600 uppercase flex items-center justify-center gap-2 mb-2">
          <Navigation className="w-3.5 h-3.5 animate-bounce text-emerald-500" />
          Phan Rang Ride Services
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight uppercase">
          Tài Xế Phan Rang
        </h2>
        <p className="text-xs md:text-sm text-zinc-500 font-medium mt-2">
          Kết nối trực tiếp tới lực lượng taxi, xe ôm công nghệ bản địa. Đã qua đào tạo kỹ năng du lịch, phục vụ tận tâm túc trực đêm khuya 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-6xl mx-auto">

        <div className="lg:col-span-7 col-span-1 space-y-4">
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-xs font-black text-zinc-900 uppercase tracking-tight">Tài xế trực tuyến</span>
            </div>
            <span className="text-[10px] font-black px-2.5 py-1 bg-zinc-100 text-zinc-800 rounded-lg">
              HOTLINE: 0793784133
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VERIFIED_DRIVERS.map((driver) => (
              <div
                key={driver.id}
                className="bg-white border border-zinc-200/80 hover:border-zinc-300 rounded-3xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={driver.avatar}
                      alt={driver.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-100 object-cover"
                    />
                    <div>
                      <h4 className="text-xs md:text-sm font-black text-zinc-900 leading-none">
                        {driver.name}
                      </h4>
                      <p className="text-[10px] text-emerald-700 font-extrabold mt-1 uppercase tracking-wide">
                        {driver.carModel}
                      </p>
                      <span className="text-[9px] font-mono font-bold bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded mt-1.5 inline-block">
                        {driver.plate}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md
                    ${driver.status === "idle"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                      : "bg-zinc-100 text-zinc-500 border border-zinc-200"}`}
                  >
                    {driver.status === "idle" ? "🔥 Rảnh" : "🛞 Đang bận"}
                  </span>
                </div>

                <div className="border-t border-zinc-100 pt-3.5 flex items-center justify-between text-[11px] text-zinc-500 font-bold">
                  <div className="flex items-center gap-1">
                    <Star size={11} className="text-amber-500 fill-amber-500" />
                    <span className="text-zinc-900">{driver.rate}</span>
                    <span className="text-zinc-400">({driver.trips} chuyến)</span>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(driver.phone);
                      alert(`Đã sao chép SĐT: ${driver.phone}. Hệ thống đang kết nối trực tiếp cuộc điện thoại.`);
                    }}
                    className="text-zinc-600 hover:text-zinc-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Phone size={10} /> {driver.phone}
                  </button>
                </div>

                {driver.status === "idle" ? (
                  <button
                    onClick={() => handleStartGhimDriver(driver)}
                    className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-black rounded-2xl cursor-pointer transition-all active:scale-95"
                  >
                    🎯 Chọn điều phối xe này
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-2.5 bg-zinc-100 text-zinc-400 text-xs font-bold rounded-2xl cursor-not-allowed"
                  >
                    Đang trên hành trình
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 bg-white border border-zinc-200/80 rounded-3xl p-5 md:p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <Calculator className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-black text-zinc-950 uppercase tracking-tight">Tính Phí Hành Trình Để Lên Xe</span>
          </div>

          <div className="space-y-4">

            {/* Pickup */}
            <div>
              <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block mb-1.5">
                📍 1. Điểm đón bạn (Pickup)
              </label>
              <select
                value={pickup}
                onChange={(e) => {
                  setPickup(e.target.value);
                  handleCalculate(e.target.value, dropoff);
                }}
                className="w-full appearance-none p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-black text-zinc-800 outline-none focus:border-zinc-900 focus:bg-white"
              >
                {PRESET_PLACES.map(place => (
                  <option key={place.id} value={place.id}>{place.name}</option>
                ))}
              </select>
            </div>

            {/* Dropoff */}
            <div>
              <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block mb-1.5">
                🏁 2. Điểm đến mong muốn (Dropoff)
              </label>
              <select
                value={dropoff}
                onChange={(e) => {
                  setDropoff(e.target.value);
                  handleCalculate(pickup, e.target.value);
                }}
                className="w-full appearance-none p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-black text-zinc-800 outline-none focus:border-zinc-900 focus:bg-white"
              >
                {PRESET_PLACES.map(place => (
                  <option key={place.id} value={place.id}>{place.name}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Results Badge */}
          <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between text-xs text-zinc-600 font-bold">
              <span>Hành trình dự toán:</span>
              <span className="text-zinc-900 font-mono font-black text-sm">{distanceKm} KM</span>
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-600 font-bold border-t border-emerald-100/60 pt-2">
              <span>Đơn giá cơ sở:</span>
              <span className="text-zinc-600">3.000đ/KM</span>
            </div>

            <div className="border-t border-emerald-200 pt-2.5 flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wide">Giá cước ước tính:</span>
              <span className="text-base font-black text-emerald-600 font-mono">
                {estimatedFare.toLocaleString("vi-VN")} VND
              </span>
            </div>
          </div>

          <div className="p-3 bg-zinc-50 rounded-2xl text-[11px] font-medium text-zinc-500 flex gap-2.5 items-start">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Mức giá mang tính minh bạch, hỗ trợ khách du lịch không bị nói khống giá ở bến ngoài cơ sở chính thống.
            </span>
          </div>

          <button
            onClick={() => handleStartDispatch()}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-emerald-200 cursor-pointer"
          >
            🚀 Đặt xe tốc hành ngay
          </button>
        </div>
      </div>

      {/* DISPATCH SIMULATOR OVERLAY DIALOG */}
      <AnimatePresence>
        {activeDispatch.stage !== "none" && (
          <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm z-[2100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 shadow-2xl border border-zinc-200 max-w-sm w-full text-center space-y-6"
            >

              {activeDispatch.stage === "searching" ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto relative border border-emerald-100">
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                    <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-zinc-900 uppercase">Tìm kiếm tài xế lân cận...</h4>
                    <p className="text-[11px] text-zinc-500 font-semibold mt-1">
                      Hệ thống đang quét tọa độ xung quanh {distanceKm}KM điểm khởi hành của bạn.
                    </p>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-2xl text-[10px] font-bold text-zinc-500">
                    Ứng tuyển khả dụng • Trì hoãn 2-3 giây
                  </div>
                  <button
                    onClick={handleCancelDispatch}
                    className="py-2 px-4 rounded-xl border border-zinc-200 text-xs font-black text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                  >
                    Hủy Kế Nối
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto border border-emerald-200 text-emerald-600">
                    <CheckCircle className="w-8 h-8 animate-bounce" />
                  </div>

                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">
                      Tìm Thấy Tài Xế Gần Nhất!
                    </span>
                    <h4 className="text-md font-black text-zinc-900 mt-1">
                      {activeDispatch.selectedDriver?.name}
                    </h4>
                    <p className="text-xs text-zinc-500 font-medium">
                      Đang điều khiển xe điện <span className="font-extrabold text-emerald-600">{activeDispatch.selectedDriver?.carModel}</span>
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl flex flex-col gap-1.5 text-left">
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 font-semibold">
                      <span>Biển kiểm soát:</span>
                      <span className="font-mono font-black text-zinc-800">{activeDispatch.selectedDriver?.plate}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 font-semibold">
                      <span>Dự báo đón khách:</span>
                      <span className="font-black text-emerald-600">3 phút (280 mét)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCancelDispatch}
                      className="flex-1 py-3 rounded-xl bg-zinc-150 hover:bg-zinc-200 text-zinc-700 font-extrabold text-xs cursor-pointer border border-zinc-200"
                    >
                      Đóng Lại
                    </button>

                    <a
                      href={`tel:${activeDispatch.selectedDriver?.phone}`}
                      className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer block text-center shadow-md shadow-emerald-100"
                    >
                      Gọi Tài Xế Đón
                    </a>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );

  function handleStartGhimDriver(driver: Driver) {
    handleStartDispatch(driver);
  }
}
