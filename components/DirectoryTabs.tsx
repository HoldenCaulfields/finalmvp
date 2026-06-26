import { Handshake, Car, Code } from "lucide-react";
import { cn } from "@/utils/cn";
import { useViewStore } from "@/stores/useViewStore";

export default function DirectoryTabs() {
  const activeRoute = useViewStore(s => s.activeRoute);
  const setActiveRoute = useViewStore(s => s.setActiveRoute);

  const tabs = [
    { id: "teams", label: "Dịch vụ", icon: <Handshake className="w-3.5 h-3.5" /> },
    { id: "launched", label: "Tài xế", icon: <Car className="w-3.5 h-3.5" /> },
    { id: "developer", label: "IT/Devs", icon: <Code className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="w-full flex items-center justify-center mb-6 pt-2 pointer-events-auto">
      <div className="flex bg-zinc-100 border border-zinc-200/50 p-1.5 rounded-2xl shadow-sm gap-1 max-w-md w-full">
        {tabs.map((tab) => {
          const isActive = activeRoute === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveRoute(tab.id);
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer",
                isActive
                  ? "bg-white text-zinc-950 shadow-sm border border-zinc-200/50 scale-102"
                  : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
              )}
            >
              <span className={cn("transition-colors", isActive ? "text-rose-600" : "text-zinc-400")}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
