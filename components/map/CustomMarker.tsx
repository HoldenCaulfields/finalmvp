// @/components/map/CustomMarker.tsx
import L from "leaflet";
import { Marker } from "react-leaflet";

interface CustomMarkerProps {
  position: [number, number];
  title: string;
  iconType: string;
  isSubMarker?: boolean;
  rating?: number;
  onClick: () => void;
}

export default function CustomMarker({ position, title, iconType, rating, isSubMarker = false, onClick }: CustomMarkerProps) {
  // Lấy hàm tạo icon tương ứng. Nếu là subMarker hoặc không tìm thấy hàm riêng, dùng hàm default.
  const iconFactory = isSubMarker
    ? createSubMarkerIcon
    : (MAIN_ICON_FACTORIES[iconType] || createDefaultMainIcon);

  return (
    <Marker
      position={position}
      icon={iconFactory(title, iconType, rating)}
      zIndexOffset={iconType === "market" ? 200 : (isSubMarker ? 50 : 100)}
      eventHandlers={{ click: onClick }}
    />
  );
}

// ==========================================
// 1. FACTORY MAP - QUẢN LÝ CÁC HÀM TẠO ICON CHÍNH
// ==========================================
const MAIN_ICON_FACTORIES: Record<string, (title: string) => L.DivIcon> = {
  market: createMarketIcon,
  startup: createStartupIcon,
  jobs: createJobsIcon,
  cinema: createCinemaIcon,
  driver: createDriverIcon,
  caodangnghe: createCDNIcon,
  langnghe: createLangNgheIcon,
};

// ==========================================
// 2. CÁC HÀM TẠO ICON RIÊNG BIỆT CHO MAIN MARKERS
// ==========================================

// --- CHỢ PHAN RANG (Góc nhìn truyền thống, nổi bật) ---
function createMarketIcon(title: string) {
  return L.divIcon({
    className: "custom-leaflet-icon",
    html: `
       <div class="relative flex flex-col items-center justify-center" style="transform: translate(-50%, -50%);">
         
         <!-- Outer Energy Rings -->
         <div class="absolute w-32 h-32 border-2 border-dashed border-rose-500/30 rounded-full animate-spin"
              style="animation-duration: 20s;">
         </div>
         <div class="absolute w-28 h-28 border border-rose-400/40 rounded-full animate-spin"
              style="animation-duration: 15s; animation-direction: reverse;">
         </div>
         
         <!-- Main Marker Body -->
         <div class="relative w-16 h-16 rounded-full bg-linear-to-br from-rose-500 via-rose-600 to-rose-800 
                     shadow-[0_20px_50px_rgba(244,63,94,0.4)] flex items-center justify-center z-10 
                     transition-all duration-500 hover:scale-110 hover:rotate-6 group">
             
             <div class="absolute inset-1 rounded-full bg-white flex items-center justify-center
                         shadow-inner border border-white/50 overflow-hidden">
                 <img
                     src="/pricon.jpg"
                     class="w-full h-full object-cover transition-transform duration-700 scale-125"
                     alt="School logo"
                 />
             </div>
 
           <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-rose-600 rotate-45 z-[-1] shadow-sm"></div>
 
         </div>
         
         <!-- Creative Glass Label -->
         <div class="absolute top-full mt-2 pointer-events-none">
           <div class="relative px-4 py-1 bg-white border-2 border-rose-500 rounded-full shadow-2xl flex flex-col items-center backdrop-blur-md">
             <span class="text-[12px] font-bold text-rose-700 whitespace-nowrap tracking-wider">
               Chợ Phan Rang
             </span>
           </div>
         </div>
       </div>
     `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

// --- STARTUP / IDEALAB (Giao diện Cinematic White-Rose-Black, High-Contrast) ---
function createStartupIcon(title: string) {
  return L.divIcon({
    className: "startup-marker",
    html: `
        <div class="flex flex-col items-center" style="transform: translate(-50%, -80%);">
          <div class="relative w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 
                      p-[2px] shadow-[0_4px_12px_rgba(225,29,72,0.35)]
                      transition-all duration-300 ease-in-out
                      hover:scale-115 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(225,29,72,0.5)]
                      cursor-pointer
                      flex items-center justify-center">
            
            <div class="w-full h-full bg-white rounded-full p-[1.5px] flex items-center justify-center overflow-hidden">
              
              <div class="w-full h-full rounded-full bg-orange-600 flex items-center justify-center shadow-inner">
                  <span class="text-xl font-black tracking-tight text-white select-none">
                      🚀
                  </span>
              </div>
  
            </div>
  
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-orange-600 rotate-45 z-[-1] shadow-sm"></div>
          </div>
  
          <div class="mt-1.5">
            <div class="px-2.5 py-0.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-full shadow-md border border-slate-700/50 whitespace-nowrap">
              <p class="text-[11px] font-medium tracking-wide flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                Xưởng sản xuất ý tưởng
              </p>
            </div>
          </div>
  
        </div>
      `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

// --- KẾT NỐI VIỆC LÀM (Sạch sẽ, Chuyên nghiệp) ---
function createJobsIcon(title: string) {
  return L.divIcon({
    className: "jobs-marker",
    html: `
          <div class="flex flex-col items-center" style="transform: translate(-50%, -80%);">
            <div class="relative w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 
                        p-[2px] shadow-[0_4px_12px_rgba(225,29,72,0.35)]
                        transition-all duration-300 ease-in-out
                        hover:scale-115 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(225,29,72,0.5)]
                        cursor-pointer
                        flex items-center justify-center">
              
              <div class="w-full h-full bg-white rounded-full p-[1.5px] flex items-center justify-center overflow-hidden">
                
                <div class="w-full h-full rounded-full bg-blue-600 flex items-center justify-center shadow-inner">
                    <span class="text-xl font-black tracking-tight text-white select-none">
                        💼
                    </span>
                </div>
    
              </div>
    
              <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-blue-600 rotate-45 z-[-1] shadow-sm"></div>
            </div>
    
            <div class="mt-1.5">
              <div class="px-2.5 py-0.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-full shadow-md border border-slate-700/50 whitespace-nowrap">
                <p class="text-[11px] font-medium tracking-wide flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                  kết nối việc làm
                </p>
              </div>
            </div>
    
          </div>
        `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

// --- CINEMA NETWORK (Phong cách Hộp đèn điện ảnh) ---
function createCinemaIcon(title: string) {
  return L.divIcon({
    className: "custom-leaflet-icon",
    html: `
          <div class="flex flex-col items-center" style="transform: translate(-50%, -50%);">
            
            <!-- Glow nền -->
            <div class="absolute w-14 h-14 bg-amber-400/20 rounded-full blur-xl"></div>
    
            <!-- Icon chính -->
            <div class="relative w-12 h-12 rounded-full bg-black/70
                        flex items-center justify-center
                        text-xl
                        shadow-lg
                        transition-all duration-300
                        hover:scale-110 hover:shadow-[0_0_25px_rgba(251,191,36,0.5)]">
              🎬
            </div>
    
            <div class="absolute top-full mt-1">
              <div class="px-3 py-0.5 bg-black/80 backdrop-blur-sm rounded-md shadow-md border border-white/20">
                <p class="text-[11px] font-medium text-white whitespace-nowrap tracking-tight">
                  Hội yêu điện ảnh
                </p>
              </div>
            </div>
    
          </div>
        `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

// --- TÀI XẾ / VẬN CHUYỂN ---
function createDriverIcon(title: string) {
  return L.divIcon({
    className: "cho-phan-rang-leaflet-icon",
    html: `
          <div class="flex flex-col items-center" style="transform: translate(-50%, -85%);">
            <!-- Khung chứa chính: Hình tròn Badge cao cấp -->
            <div class="relative w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 
                        p-[3px] shadow-[0_8px_20px_rgba(16,185,129,0.4)]
                        transition-all duration-300 ease-in-out
                        hover:scale-115 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(16,185,129,0.6)]
                        cursor-pointer
                        flex items-center justify-center">
              
              <!-- Lớp nền phụ trắng bo tròn tạo khoảng đệm thẩm mỹ -->
              <div class="w-full h-full bg-emerald-500 rounded-full p-[2px] flex items-center justify-center overflow-hidden">
                
                <!-- Vùng chứa ảnh: Đảm bảo flexbox luôn CĂN GIỮA ảnh tuyệt đối -->
                <div class="w-full h-full text-4xl font-bold rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
                  🚗
                </div>
    
              </div>
    
              <!-- Mũi ghim tam giác định vị nhỏ nhắn, sắc nét nối liền từ vòng tròn cắm xuống bản đồ -->
              <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-teal-600 rotate-45 z-[-1] shadow-sm"></div>
            </div>
    
            <!-- Nhãn tên địa danh nằm gọn gàng ngay phía dưới Marker -->
            <div class="mt-2">
              <div class="px-3 py-1 bg-teal-100 text-teal-800 rounded-full shadow-md border border-teal-500 whitespace-nowrap">
                <p class="text-[12px] font-bold tracking-wide flex items-center gap-1.5">
                  Tài xế Phan Rang
                </p>
              </div>
            </div>
    
          </div>
        `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function createCDNIcon() {
  return L.divIcon({
    className: "sinh-vien-net",
    html: `
      <div class="flex flex-col items-center" style="transform: translate(-50%, -80%);">
        <div class="relative w-12 h-12 rounded-full bg-rose-500
                    p-1 shadow-[0_4px_12px_rgba(225,29,72,0.35)]
                    transition-all duration-300 ease-in-out
                    hover:scale-115 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(225,29,72,0.5)]
                    cursor-pointer
                    flex items-center justify-center">
          
          <div class="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
            <div class="absolute inset-0.5 rounded-full bg-white flex items-center justify-center
                        shadow-inner overflow-hidden">
                <img
                    src="/cdn.png"
                    class="w-full h-full object-cover transition-transform duration-700 scale-125"
                    alt="School logo"
                />
            </div>
          </div>

          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-rose-600 rotate-45 z-[-1] shadow-sm"></div>
        </div>

        <div class="mt-1.5">
          <div class="px-2.5 py-0.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-full shadow-md border border-slate-700/50 whitespace-nowrap">
            <p class="text-[11px] font-medium tracking-wide flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              Sinh Viên Cao Đẳng Nghề
            </p>
          </div>
        </div>

      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function createLangNgheIcon() {
  return L.divIcon({
    className: "custom-leaflet-icon",
    html: `
      <div class="relative flex flex-col items-center justify-center" style="transform: translate(-50%, -50%);">
        
        <!-- Decorative Pattern Rings (Thổ cẩm vibe) -->
        <div class="absolute w-24 h-24 rounded-full border-4 border-dotted border-amber-600/30"></div>
        <div class="absolute w-20 h-20 rounded-full border border-orange-500/40"></div>

        <!-- Main Marker -->
        <div class="relative w-14 h-14 rounded-full
                    bg-linear-to-br from-amber-500 via-orange-600 to-red-700
                    shadow-[0_15px_40px_rgba(234,88,12,0.4)]
                    flex items-center justify-center z-10
                    transition-all duration-500 hover:scale-110 group overflow-hidden">

            <!-- Pattern overlay -->
            <div class="absolute inset-0 opacity-30"
                 style="
                 background-image: repeating-linear-gradient(
                    45deg,
                    #fff 0px,
                    #fff 2px,
                    transparent 2px,
                    transparent 6px
                 );">
            </div>

            <!-- Inner Image -->
            <div class="absolute inset-1 rounded-full bg-white flex items-center justify-center
                        shadow-inner border border-white/50 overflow-hidden">
                <img
                    src="/langnghe.jpg"
                    class="w-full h-full object-cover scale-110"
                    alt="My Nghiep"
                />
            </div>

            <!-- Pin tail -->
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-700 rotate-45 z-[-1] shadow-sm"></div>
        </div>

        <!-- Label -->
        <div class="absolute top-full mt-2 pointer-events-none">
          <div class="relative px-4 py-1 bg-white border-2 border-orange-600 rounded-full shadow-xl backdrop-blur-md">
            <span class="text-[12px] font-bold text-orange-700 whitespace-nowrap tracking-wide">
              Làng Nghề Mỹ Nghiệp
            </span>
          </div>
        </div>

      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

// --- HÀM BACKUP NẾU KHÔNG TÌM THẤY TYPE ---
function createDefaultMainIcon(title: string) {
  return L.divIcon({
    html: `<div class="p-2 bg-zinc-800 text-white rounded shadow-md text-xs whitespace-nowrap">📍 ${title}</div>`,
    iconSize: [0, 0], iconAnchor: [0, 0]
  });
}

// ==========================================
// 3. HÀM TẠO ICON CHUNG CHO TOÀN BỘ SUB-MARKERS (QUÁN ĂN, CAFE...)
// ==========================================
function createSubMarkerIcon(title: string, iconType: string, rating?: number) {
  const config: Record<string, { emoji: string; color: string }> = {
    food: { emoji: '🍲', color: 'from-orange-400 to-red-500' },
    shop: { emoji: '🛍️', color: 'from-pink-500 to-rose-500' },
    office: { emoji: '🏢', color: 'from-blue-500 to-indigo-600' },

    tech: { emoji: '💻', color: 'from-cyan-500 to-blue-600' },
    finance: { emoji: '💰', color: 'from-emerald-500 to-green-600' },
    media: { emoji: '🎬', color: 'from-purple-500 to-indigo-500' },
    edu: { emoji: '🎓', color: 'from-yellow-400 to-orange-500' },

    studio: { emoji: '🎥', color: 'from-gray-700 to-gray-900' },
    cafe: { emoji: '☕', color: 'from-amber-500 to-orange-600' },
    team: { emoji: '👥', color: 'from-indigo-400 to-purple-500' },

    station: { emoji: '⛽', color: 'from-sky-500 to-blue-700' },

    gom: { emoji: '🏺', color: 'from-orange-600 to-amber-700' },
    craft: { emoji: '🧵', color: 'from-lime-500 to-green-600' },

    default: { emoji: '📍', color: 'from-rose-400 to-rose-600' },
  };

  const current = config[iconType] || config.default;

  const sizeClass = 'w-10 h-10';
  const textClass = 'text-xl';

  // format rating (4 -> 4.0)
  const ratingText = rating ? rating.toFixed(1) : null;

  return L.divIcon({
    className: "sub-marker-generic",
    html: `
      <div class="flex flex-col items-center" style="transform: translate(-50%, -90%);">
        
        <!-- ICON -->
        <div class="relative ${sizeClass} rounded-xl bg-gradient-to-br ${current.color} p-[2px] shadow-md transition-all duration-300 ease-in-out hover:scale-110 cursor-pointer flex items-center justify-center">
          <div class="w-full h-full rounded-full ${current.color} flex items-center justify-center shadow-inner">
            <span class="${textClass} font-black text-white select-none">${current.emoji}</span>
          </div>
        </div>

        <!-- RATING BADGE -->
        ${
          ratingText
            ? `
          <div class="mt-1 px-2 py-[2px] rounded-full bg-black/70 backdrop-blur text-white text-[10px] font-semibold shadow-sm flex items-center gap-1">
            <span>⭐</span>
            <span>${ratingText}</span>
          </div>
        `
            : ''
        }

      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}