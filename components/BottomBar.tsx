
import { Plus, X, MapPin, Users, Wifi, Heart } from "lucide-react";
import { cn } from "../utils/cn";
import { useViewStore } from "../stores/useViewStore";

export default function BottomBar() {
  const activeRoute = useViewStore(s => s.activeRoute);
  const setActiveRoute = useViewStore(s => s.setActiveRoute);

  const categories = useViewStore(s => s.categories);
  const selectedCategoryId = useViewStore(s => s.selectedCategoryId);
  const selectCategory = useViewStore(s => s.selectCategory);

  const { isSelectingLocation, startSelectingLocation, cancelSelection } = useViewStore();

  // Switch overlay active status: If selecting location, or if a category details is active on the map, don't show tabs overlay
  if (selectedCategoryId !== null && activeRoute === "map") return null;

  const totalMain = categories.length;
  const totalSub = categories.reduce((sum, cat) => sum + (cat.subMarkers?.length || 0), 0);

  // Geolocation trigger for "Ghim"
  const handleStartGhim = () => {
    if (isSelectingLocation) {
      cancelSelection();
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          startSelectingLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          // Fallback to default Center of Phan Rang
          startSelectingLocation();
        }
      );
    } else {
      startSelectingLocation();
    }
  };

  // Mobile Tabs definition
  interface TabItem {
    id: string;
    label: string;
    icon: string;
    route?: string;
    isAction?: boolean;
  }

  const tabs: TabItem[] = [
    { id: "map", label: "Bản đồ", icon: "🌍", route: "map" },
    { id: "home", label: "Đội nhóm", icon: "🏛️", route: "home" },
    { id: "create", label: "Ghim", icon: "+", isAction: true },
    { id: "teams", label: "Dịch vụ", icon: "🤝", route: "teams" },
    { id: "profile", label: "Cá nhân", icon: "👤", route: "profile" },
  ];

  const currentIndex = tabs.findIndex((item) => {
    if (item.isAction) return false;
    if (item.route === "teams") {
      return activeRoute === "teams" || activeRoute === "launched" || activeRoute === "developer";
    }
    return item.route === activeRoute;
  });

  return (
    <>
      {/* DESKTOP DESIRED VIEW: Original Stats Banner (hidden on mobile, visible on map screen) */}
      {activeRoute === "map" && (
        <div className="hidden md:block fixed bottom-4 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-4xl px-4 pointer-events-none">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-zinc-200/80 shadow-2xl rounded-2xl md:rounded-[2rem] px-5 py-3.5 flex items-center justify-between gap-3 text-zinc-600 transition-all">
            {/* Left Side: Status */}
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-[11px] font-extrabold text-zinc-900 uppercase tracking-tight flex items-center gap-1.5">
                Chào mừng đến với lovelynet
              </span>
              <div className="w-px h-3 bg-zinc-200" />
              <span className="text-xs font-medium text-zinc-500">SDT: 0793784133</span>
            </div>

            {/* Right Side: Quick Stats counters */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span className="font-bold text-zinc-800">{totalMain}</span>
                <span className="text-zinc-500">Khu vực chính</span>
              </div>
              <div className="w-px h-3 bg-zinc-200" />
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-bold text-zinc-800">{totalSub}</span>
                <span className="text-zinc-500">Điểm liên kết</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-px h-3 bg-zinc-200" />
                <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-zinc-500 flex items-center gap-1 font-semibold">
                  Hệ thống ổn định <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE RESPONSIVE NAVIGATION: Gorgeous Floating Translucent Tab Bar */}
      <nav className="fixed bottom-5 left-0 right-0 z-[2000] md:hidden w-full pointer-events-none">
        <div className="max-w-md mx-auto bg-white/90 backdrop-blur-2xl rounded-2xl flex items-center justify-between p-2 pointer-events-auto border border-zinc-200/50 shadow-[0_20px_50px_rgba(0,0,0,0.12)] relative">
          
          {/* Active indicator sliding background */}
          {currentIndex !== -1 && (
            <div
              className="absolute bg-rose-600 h-[75%] rounded-2xl z-0 transition-all duration-300 ease-out"
              style={{
                width: "18%",
                left: `${currentIndex * 20 + 1}%`,
              }}
            />
          )}

          {tabs.map((tab, idx) => {
            const isActive = !tab.isAction && (
              activeRoute === tab.route ||
              (tab.route === "teams" && (activeRoute === "teams" || activeRoute === "launched" || activeRoute === "developer"))
            );

            if (tab.isAction) {
              return (
                <div key={tab.id} className="relative px-2 group z-10">
                  <button
                    onClick={handleStartGhim}
                    className={cn(
                      "relative w-14 h-14 -mt-12 rounded-full flex items-center justify-center transition-all duration-300 ease-out border-4 border-white shadow-[0_10px_20px_rgba(225,29,72,0.25)] active:scale-95 cursor-pointer",
                      isSelectingLocation
                        ? "bg-zinc-900 text-rose-500 fill-none"
                        : "bg-slate-950 text-rose-500"
                    )}
                  >
                    {isSelectingLocation ? (
                      <X
                        size={24}
                        strokeWidth={3.5}
                        className="transition-transform duration-300 rotate-90"
                      />
                    ) : (
                      <Plus
                        size={26}
                        strokeWidth={3}
                        className="transition-transform duration-500 group-hover:rotate-90 text-white"
                      />
                    )}

                    {/* Aura accent overlay */}
                    <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.route) {
                    setActiveRoute(tab.route);
                    selectCategory(null); // Clear map search inputs
                  }
                }}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-300 z-10 cursor-pointer",
                  isActive ? "text-white scale-105" : "text-zinc-400 hover:text-zinc-600"
                )}
              >
                <div className="relative">
                  <span className="text-xl inline-block leading-none">{tab.icon}</span>
                </div>
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-wider",
                  isActive ? "text-white" : "text-zinc-500"
                )}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
