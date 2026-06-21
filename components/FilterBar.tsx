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
  { id: "startup", label: "Khởi nghiệp", icon: "🚀" },
];

interface FilterBarProps {
  onChange?: (id: string) => void;
}

export default function FilterBar({ onChange }: FilterBarProps) {
  const { selectedCategoryId, selectedFilterId, setSelectedFilterId, activeRoute } = useViewStore();

  if (selectedCategoryId !== null || activeRoute !== 'map') return null;

  const handleSelect = (id: string) => {
    setSelectedFilterId(id);

    if (onChange) {
      onChange(id);
    }
  };

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-fit px-4 pointer-events-none transition-all duration-300">
      <div className="pointer-events-auto flex items-center gap-1.5 p-1 bg-white/95 backdrop-blur-xl border border-zinc-200/80 shadow-2xl shadow-zinc-900/10 rounded-2xl md:rounded-full overflow-x-auto no-scrollbar scroll-smooth">
        {filterItems.map((item) => {
          const isActive = item.id === selectedFilterId;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={cn(
                "relative group flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-full transition-all flex-shrink-0 outline-none cursor-pointer",
                isActive ? "text-white font-bold" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
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
