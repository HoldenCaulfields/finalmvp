'use client';
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { useViewStore } from "@/stores/useViewStore";

interface FilterItem {
  id: string;
  label: string;
  icon: string;
}

const filterItems: FilterItem[] = [
  { id: "all", label: "Tất cả", icon: "✨" },
  { id: "market", label: "Ăn uống", icon: "🍲" },
  { id: "driver", label: "Di chuyển", icon: "🚗" },
  { id: "jobs", label: "Việc làm", icon: "💼" },
  { id: "cinema", label: "Cinema", icon: "🎬" },
  { id: "study", label: "Học tập", icon: "📚" },
  { id: "startup", label: "Khởi nghiệp", icon: "🚀" }
];

interface FilterBarProps {
  onChange?: (id: string) => void;
}

export default function FilterBar({ onChange }: FilterBarProps) {
  const [activeId, setActiveId] = useState<string>("all");
  const viewMode = useViewStore(s => s.viewMode);
  const setSelectedMarkerType = useViewStore(s => s.setSelectedMarkerType);
  const openMarker = useViewStore(s => s.openMarker);

  if (viewMode === 'members') return null;

  const handleSelect = (id: string) => {
    openMarker(id === 'all' ? null : id as any); // Open marker or reset to map view
    setActiveId(id);
    const markerType = id === 'all' ? null : id as any; // Convert to MarkerType or null
    setSelectedMarkerType(markerType);

    if (onChange) {
      onChange(id);
    }
  };

  return (
    <div className="fixed top-18 left-1/2 -translate-x-1/2 z-1000 w-full max-w-fit pointer-events-none transition-all duration-300">
      <div className="pointer-events-auto flex items-center gap-1 p-1 bg-white/95 backdrop-blur-xl border border-zinc-200/80 shadow-2xl shadow-zinc-900/10 rounded-2xl md:rounded-full overflow-x-auto no-scrollbar">
        {filterItems.map((item) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={cn(
                "relative group flex items-center gap-2.5 px-4 py-2 rounded-xl md:rounded-full transition-all flex-shrink-0 outline-none",
                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-rose-600 z-0 rounded-xl md:rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <span className={cn(
                "relative z-10 transition-transform duration-300", 
                isActive ? "scale-110" : "group-hover:scale-110"
              )}>
                {item.icon}
              </span>
              <span className="relative z-10 text-xs font-bold whitespace-nowrap tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
