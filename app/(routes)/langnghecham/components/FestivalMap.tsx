import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CheckIn } from '../types';
import { MapPin, Maximize2, Minimize2, Heart, Hand, Sparkles, Users, Eye, X, Camera } from 'lucide-react';
import { getCheckInCoordinates } from '../lib/checkinFlow';

interface FestivalMapProps {
    checkins: CheckIn[];
    onAddCheckIn?: (newCheckIn: Omit<CheckIn, 'id' | 'likes' | 'createdAt'> & { lat?: number, lng?: number }) => Promise<void>;
    onLikeCheckIn?: (id: string) => Promise<void>;
    onRequestCheckIn?: (locationLabel?: string, coords?: { lat: number; lng: number }) => void;
}

// Component to handle map pan-to on marker selection
function MapController({ center, isFullscreen }: { center: [number, number] | null; isFullscreen: boolean }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 16, { animate: true, duration: 1 });
        }
    }, [center, map]);

    useEffect(() => {
        // Invalidate map size on fullscreen changes to prevent gray or misplaced canvas tiles
        map.invalidateSize();
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);
        const timer2 = setTimeout(() => {
            map.invalidateSize();
        }, 400);
        return () => {
            clearTimeout(timer);
            clearTimeout(timer2);
        };
    }, [isFullscreen, map]);

    return null;
}

interface FloatingReaction {
    id: string;
    type: 'wave' | 'heart' | 'firework';
    emoji: string;
    left: number; // percentage
    xOffset: number; // random offset for drift
}

interface Spark {
    id: string;
    x: number;
    y: number;
    color: string;
    tx: number;
    ty: number;
}

export default function FestivalMap({ checkins, onAddCheckIn, onLikeCheckIn, onRequestCheckIn }: FestivalMapProps) {
    const [selectedCheckIn, setSelectedCheckIn] = useState<CheckIn | null>(null);
    const [isFestivalInfoSelected, setIsFestivalInfoSelected] = useState<boolean>(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedCenter, setSelectedCenter] = useState<[number, number] | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'recent'>('all');
    const [reactions, setReactions] = useState<FloatingReaction[]>([]);
    const [sparks, setSparks] = useState<Spark[]>([]);
    const [onlineCount, setOnlineCount] = useState(24);
    const [activeVisitors, setActiveVisitors] = useState<{ name: string; action: string }[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);

    const handleRequestCheckInFromMap = () => {
        const fallbackCoords = { lat: 11.5679, lng: 108.9897 };

        if (!navigator.geolocation) {
            onRequestCheckIn?.('Sân khấu chính Quảng trường 16/4', fallbackCoords);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                onRequestCheckIn?.('Vị trí GPS của bạn', {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            () => {
                onRequestCheckIn?.('Sân khấu chính Quảng trường 16/4', fallbackCoords);
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    };

    // Generate random online counters to make the live map feel real and active
    useEffect(() => {
        const interval = setInterval(() => {
            setOnlineCount((prev) => {
                const delta = Math.floor(Math.random() * 5) - 2;
                return Math.max(15, Math.min(60, prev + delta));
            });
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Trigger window resize to force Leaflet container recalculation on fullscreen toggle
    useEffect(() => {
        const timer = setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 150);
        return () => clearTimeout(timer);
    }, [isFullscreen]);

    // Simulate other users interacting occasionally
    useEffect(() => {
        const NAMES = [
            'Du khách Sài Gòn',
            'Huyền My Nha Trang',
            'Minh Tuấn',
            'Nghệ nhân Chăm',
            'Alex từ Pháp',
            'Khánh Vy',
            'Đức Anh',
            'Yến Nhi'
        ];
        const ACTIONS = [
            'vừa thả tim bản đồ',
            'vừa vẫy tay chào mọi người',
            'vừa bắn pháo hoa lễ hội',
            'vừa xem hình ảnh dệt thổ cẩm',
            'vừa ghé gian hàng gốm'
        ];

        const interval = setInterval(() => {
            const name = NAMES[Math.floor(Math.random() * NAMES.length)];
            const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];

            setActiveVisitors((prev) => [{ name, action }, ...prev.slice(0, 4)]);

            // Auto trigger reaction visuals occasionally
            if (action.includes('tim')) triggerReaction('heart');
            else if (action.includes('chào')) triggerReaction('wave');
            else if (action.includes('pháo')) triggerReaction('firework');

        }, 6000);

        return () => clearInterval(interval);
    }, []);

    // Trigger floating reaction animation
    const triggerReaction = (type: 'wave' | 'heart' | 'firework') => {
        const emojis = { wave: '👋', heart: '❤️', firework: '✨' };
        const newReaction: FloatingReaction = {
            id: `react-${Date.now()}-${Math.random()}`,
            type,
            emoji: emojis[type],
            left: 15 + Math.random() * 70, // spread across map bottom width
            xOffset: (Math.random() * 80) - 40 // drift left or right
        };

        setReactions((prev) => [...prev, newReaction]);

        // Cleanup after animation completes
        setTimeout(() => {
            setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
        }, 2000);

        // Create explosion sparks if it is a firework
        if (type === 'firework') {
            const colors = ['#f43f5e', '#ec4899', '#fda4af', '#facc15', '#60a5fa', '#34d399'];
            const newSparks: Spark[] = Array.from({ length: 16 }).map((_, idx) => {
                const angle = (idx * 360) / 16;
                const rad = (angle * Math.PI) / 180;
                const distance = 40 + Math.random() * 60;
                return {
                    id: `spark-${Date.now()}-${idx}-${Math.random()}`,
                    x: 40 + Math.random() * 20, // relative center percent
                    y: 30 + Math.random() * 20,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    tx: Math.cos(rad) * distance,
                    ty: Math.sin(rad) * distance
                };
            });

            setSparks((prev) => [...prev, ...newSparks]);
            setTimeout(() => {
                setSparks((prev) => prev.filter((s) => !newSparks.some((ns) => ns.id === s.id)));
            }, 1200);
        }
    };

    const filteredCheckins = activeTab === 'recent'
        ? checkins.slice(0, 5)
        : checkins;

    return (
        <div
            ref={containerRef}
            id="live-festival-map"
            className={`bg-white border border-rose-100 rounded-3xl overflow-hidden shadow-sm transition-all duration-500 ease-in-out text-left ${isFullscreen ? 'fixed inset-0 z-3000 rounded-none w-full h-full' : 'relative z-[30] w-full h-[520px] md:h-[600px] my-6'
                }`}
        >
            {/* Background visual explosion/spark container */}
            <div className="absolute inset-0 pointer-events-none z-1000 overflow-hidden">
                {sparks.map((s) => (
                    <div
                        key={s.id}
                        className="absolute animate-spark rounded-full"
                        style={{
                            left: `${s.x}%`,
                            top: `${s.y}%`,
                            width: '8px',
                            height: '8px',
                            backgroundColor: s.color,
                            '--tx': `${s.tx}px`,
                            '--ty': `${s.ty}px`,
                            boxShadow: `0 0 10px ${s.color}`
                        } as React.CSSProperties}
                    />
                ))}

                {reactions.map((r) => (
                    <div
                        key={r.id}
                        className="absolute bottom-16 text-3xl select-none animate-float-reaction z-4000"
                        style={{
                            left: `${r.left}%`,
                            '--x-offset': `${r.xOffset}px`,
                        } as React.CSSProperties}
                    >
                        {r.emoji}
                    </div>
                ))}
            </div>

            {/* Map Header Panel */}
            <div className="absolute top-3 left-3 right-3 z-[1030] flex items-center justify-between gap-1.5 pointer-events-none">
                {/* Left Status indicator */}
                <div className="bg-white/95 backdrop-blur-md px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-md border border-rose-100/50 pointer-events-auto flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                    </div>
                    <div className="flex flex-col text-left leading-tight">
                        <span className="text-[8px] sm:text-[10px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-0.5">
                            <Users className="w-2.5 h-2.5 hidden xs:inline" /> Bản đồ Live
                        </span>
                        <span className="text-[10px] sm:text-xs font-extrabold text-zinc-900">
                            {onlineCount} <span className="hidden xs:inline">trực tuyến</span><span className="inline xs:hidden">online</span>
                        </span>
                    </div>
                </div>

                {/* Right Toggle Panel */}
                <div className="flex items-center gap-1 sm:gap-2 pointer-events-auto flex-nowrap justify-end shrink-0">
                    {/* Real-time GPS Check-In Button */}
                    <button
                        onClick={handleRequestCheckInFromMap}
                        className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-500 hover:from-rose-700 hover:to-amber-600 active:scale-95 text-white text-[10px] sm:text-[11px] font-extrabold rounded-xl shadow-md transition-all cursor-pointer animate-pulse shrink-0 border border-white/20"
                        style={{ animationDuration: '3s' }}
                        title="Định vị GPS và ghim dấu ấn kỷ niệm của bạn trực tiếp lên bản đồ!"
                    >
                        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-bounce" />
                        <span className="hidden xs:inline">Ghim Vị Trí 📍</span>
                        <span className="inline xs:hidden">Ghim 📍</span>
                    </button>

                    {/* Tab switches */}
                    <div className="bg-white/95 backdrop-blur-md p-0.5 sm:p-1 rounded-xl shadow-md border border-rose-100/50 flex gap-0.5 sm:gap-1 shrink-0">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-2 py-1 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all ${activeTab === 'all'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                                }`}
                        >
                            Tất cả
                        </button>
                        <button
                            onClick={() => setActiveTab('recent')}
                            className={`px-2 py-1 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all ${activeTab === 'recent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                                }`}
                        >
                            Mới nhất
                        </button>
                    </div>

                    {/* Fullscreen Button */}
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-1.5 sm:p-2.5 bg-white/95 backdrop-blur-md hover:bg-rose-50 text-zinc-700 hover:text-rose-600 rounded-xl shadow-md border border-rose-100/50 transition-all active:scale-95 cursor-pointer shrink-0"
                        title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
                    >
                        {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    </button>
                </div>
            </div>

            {/* Map Widget viewport */}
            <div className="w-full h-full z-0 bg-zinc-100">
                <MapContainer
                    center={[11.565734, 108.999483]}
                    zoom={15}
                    scrollWheelZoom={true}
                    className="w-full h-full"
                    zoomControl={!isFullscreen} // only show zoom buttons when fullscreen to avoid clutter
                >
                    {/* Beautiful modern Voyager tiles from CartoDB */}
                    <TileLayer
                        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />

                    <MapController center={selectedCenter} isFullscreen={isFullscreen} />

                    {/* SPÈCIAL LANDMARK MARKER: Ngày hội văn hóa dân tộc Chăm 2026 */}
                    <Marker
                        position={[11.565734, 108.999483]}
                        icon={L.divIcon({
                            className: 'festival-center-marker',
                            html: `
      <div class="relative w-20 h-20 flex items-center justify-center">
        <!-- 1. Hiệu ứng sóng lan tỏa LIVE (Sóng lớn) -->
        <div class="absolute inset-0 bg-rose-500/20 rounded-full animate-ping pointer-events-none" style="animation-duration: 2s;"></div>
        <div class="absolute inset-2 bg-amber-500/30 rounded-full animate-ping pointer-events-none" style="animation-duration: 1.5s; animation-delay: 0.4s;"></div>
        
        <!-- 2. Vòng hào quang neon chạy xung quanh -->
        <div class="absolute inset-3 bg-gradient-to-r from-amber-400 via-rose-500 to-red-600 rounded-full blur-sm opacity-80 animate-spin" style="animation-duration: 6s;"></div>

        <!-- 3. Khung chứa chính (Core Marker) -->
        <div class="relative w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 shadow-[0_0_20px_rgba(244,63,94,0.6)] flex items-center justify-center cursor-pointer transform hover:scale-115 transition-all duration-300 border-2 border-white/90">
          
          <!-- Icon Tháp Chăm cách điệu (Đường nét tinh tế, sang trọng) -->
          <svg viewBox="0 0 24 24" class="w-7 h-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] animate-bounce" style="animation-duration: 2.5s">
            <path fill="currentColor" d="M12,2L16,6H8L12,2M19,11H5V7H19V11M17,13H7V21H17V13M11,15H13V19H11V15Z" />
          </svg>

          <!-- 4. Badge "LIVE" mini nổi bật ở góc -->
          <div class="absolute -top-1 -right-2 bg-red-600 text-[9px] font-black text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider border border-white shadow-sm flex items-center gap-0.5 animate-pulse">
            <span class="w-1 h-1 bg-white rounded-full inline-block"></span>
            LIVE
          </div>
        </div>
      </div>
    `,
                            iconSize: [80, 80],
                            iconAnchor: [40, 40]
                        })}
                        eventHandlers={{
                            click: () => {
                                setSelectedCenter([11.565734, 108.999483]);
                                setIsFestivalInfoSelected(true);
                                setSelectedCheckIn(null);
                                triggerReaction('firework');
                            }
                        }}
                    />

                    {/* Render markers of Checkins with image thumbs */}
                    {filteredCheckins.map((item) => {
                        const coords = getCheckInCoordinates(item.location, item.id, item.lat, item.lng);

                        // Create a custom circular glowing marker containing the user's thumbnail image
                        const customIcon = L.divIcon({
                            className: 'custom-leaflet-marker',
                            html: `
                <div class="relative w-12 h-12 flex items-center justify-center">
                  <!-- Outer glowing ripple -->
                  <div class="absolute inset-0 bg-rose-500/30 rounded-full animate-ping opacity-60"></div>
                  <!-- Frame circle -->
                  <div class="relative w-10 h-10 rounded-full border-2 border-rose-500 bg-white shadow-md overflow-hidden map-marker-glow hover:scale-110 transition-transform">
                    <img 
                      src="${item.image}" 
                      alt="${item.name}" 
                      style="width: 100%; height: 100%; object-fit: cover;"
                      referrerpolicy="no-referrer"
                    />
                  </div>
                  <!-- Little marker triangle tail -->
                  <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-rose-500 rotate-45 border-r border-b border-rose-500"></div>
                </div>
              `,
                            iconSize: [48, 48],
                            iconAnchor: [24, 44]
                        });

                        return (
                            <Marker
                                key={item.id}
                                position={coords}
                                icon={customIcon}
                                eventHandlers={{
                                    click: () => {
                                        setSelectedCenter(coords);
                                        setSelectedCheckIn(item);
                                        setIsFestivalInfoSelected(false);
                                        triggerReaction('heart');
                                    }
                                }}
                            />
                        );
                    })}
                </MapContainer>
            </div>

            {/* Custom React Popup / Bottom Sheet - Beautiful, sleek, highly responsive overlay */}
            {(selectedCheckIn || isFestivalInfoSelected) && (
                <div className="absolute bottom-6 left-3 right-3 sm:bottom-20 sm:right-3 sm:left-auto sm:w-[360px] bg-white/95 backdrop-blur-md rounded-3xl border border-rose-100 shadow-2xl z-[1010] p-4 text-left animate-slide-up transition-all pointer-events-auto">
                    <button
                        onClick={() => {
                            setSelectedCheckIn(null);
                            setIsFestivalInfoSelected(false);
                        }}
                        className="absolute top-3.5 right-3.5 p-1.5 text-black hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all cursor-pointer z-10"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {isFestivalInfoSelected ? (
                        <div className="space-y-3">
                            <div className="bg-gradient-to-r from-rose-600 to-rose-500 p-3.5 rounded-2xl text-white relative overflow-hidden">
                                {/* Decorative background shape */}
                                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-2 translate-y-2">
                                    <svg viewBox="0 0 100 100" className="w-24 h-24 text-white fill-current">
                                        <path d="M50 12 L65 28 L65 82 L35 82 L35 28 Z" />
                                    </svg>
                                </div>

                                <h4 className="text-sm font-extrabold">Ngày Hội Văn Hóa Dân Tộc Chăm</h4>
                                <p className="text-[10px] text-rose-100 mt-1 flex items-center gap-1 font-display">
                                    <MapPin className="w-3 h-3 text-amber-300" /> Sân khấu chính Quảng trường 16/4
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 bg-rose-50/60 border border-rose-100/50 p-2.5 rounded-xl text-[10px] font-bold text-rose-700">
                                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
                                    <span>Chụp hình check-in tại lễ hội để chia sẻ khoảnh khắc!</span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    const checkInTabEl = document.getElementById('tab-checkin');
                                    if (checkInTabEl) {
                                        checkInTabEl.click();
                                    } else {
                                        const checkInSection = document.getElementById('checkin-form-box');
                                        if (checkInSection) {
                                            checkInSection.scrollIntoView({ behavior: 'smooth' });
                                        } else {
                                            window.scrollTo({ top: document.body.scrollHeight / 3, behavior: 'smooth' });
                                        }
                                    }
                                    setSelectedCheckIn(null);
                                    setIsFestivalInfoSelected(false);
                                }}
                                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer mt-1"
                            >
                                <Camera className="w-3.5 h-3.5" />
                                <span>Tham Gia Check-In Lễ Hội Ngay!</span>
                            </button>
                        </div>
                    ) : selectedCheckIn ? (
                        <div className="space-y-3">
                            {/* CheckIn info photo layout */}
                            <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-zinc-100 border border-rose-100/40 shadow-inner">
                                <img
                                    src={selectedCheckIn.image}
                                    alt={selectedCheckIn.caption}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute top-2.5 left-2.5 bg-black/65 backdrop-blur-md text-[9px] text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-rose-400" />
                                    <span>{selectedCheckIn.location}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={selectedCheckIn.avatar}
                                        alt={selectedCheckIn.name}
                                        className="w-7 h-7 rounded-full object-cover border border-rose-200"
                                        referrerPolicy="no-referrer"
                                    />
                                    <div>
                                        <h4 className="text-xs font-extrabold text-zinc-900 leading-tight">{selectedCheckIn.name}</h4>
                                        <p className="text-[9px] text-zinc-400">Đã đăng check-in trực tuyến</p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-zinc-400 font-mono">
                                    {new Date(selectedCheckIn.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            <div className="space-y-2.5">
                                <p className="text-xs text-zinc-600 leading-relaxed italic font-medium">
                                    "{selectedCheckIn.caption}"
                                </p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            triggerReaction('heart');
                                            if (onLikeCheckIn) {
                                                onLikeCheckIn(selectedCheckIn.id);
                                            }
                                            setSelectedCheckIn({ ...selectedCheckIn, likes: selectedCheckIn.likes + 1 });
                                        }}
                                        className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                                    >
                                        <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                                        <span>Thích ({selectedCheckIn.likes})</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            triggerReaction('wave');
                                        }}
                                        className="px-3 py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95"
                                        title="Vẫy tay chào bạn này"
                                    >
                                        <Hand className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
                                        <span>Chào 👋</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            )}


            {/* Real-time interactive actions console overlay - Only show when no item is selected to avoid overlaps */}
            {!(selectedCheckIn || isFestivalInfoSelected) && (
                <div className="absolute bottom-6 left-3 right-3 z-[1020] flex flex-col md:flex-row justify-between items-stretch md:items-end gap-3 pointer-events-none animate-fade-in">

                    {/* Active stream feed (Simulation) */}
                    <div className="bg-zinc-950/85 backdrop-blur-md py-2 px-3 rounded-2xl border border-white/10 pointer-events-auto max-w-xs text-left shadow-lg hidden sm:block">
                        <p className="text-[9px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                            <Eye className="w-3 h-3" /> Luồng hoạt động lễ hội
                        </p>
                        <div className="space-y-1 max-h-16 overflow-y-auto pr-1">
                            {activeVisitors.length === 0 ? (
                                <p className="text-[10px] text-zinc-400">Đang quét dòng sự kiện...</p>
                            ) : (
                                activeVisitors.map((vis, i) => (
                                    <div key={i} className="text-[10px] leading-tight text-zinc-200 truncate">
                                        <strong className="text-white font-medium">{vis.name}</strong> {vis.action}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Live Reaction buttons */}
                    <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-rose-100 pointer-events-auto flex items-center gap-1.5 justify-center md:justify-end">
                        <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider px-2 border-r border-zinc-100 hidden xs:inline">
                            Tương tác LIVE:
                        </span>

                        <button
                            onClick={() => triggerReaction('wave')}
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                        >
                            <span>Vẫy tay 👋</span>
                        </button>

                        <button
                            onClick={() => triggerReaction('heart')}
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                        >
                            <span>Thả tim ❤️</span>
                        </button>

                        <button
                            onClick={() => triggerReaction('firework')}
                            className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 active:scale-95 text-rose-300 text-xs font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                        >
                            <span>Pháo hoa 🎆</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
