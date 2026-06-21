import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Compass, HelpCircle, MapPin } from "lucide-react";
import { useViewStore } from "../../stores/useViewStore";

export default function TipLocationBar() {
  const isSelectingLocation = useViewStore((s) => s.isSelectingLocation);
  const draftLatLng = useViewStore((s) => s.draftLatLng);
  const confirmLocationSelection = useViewStore((s) => s.confirmLocationSelection);
  const cancelSelection = useViewStore((s) => s.cancelSelection);

  return (
    <AnimatePresence>
      {isSelectingLocation && (
        <motion.div
          initial={{ y: 80, x: "-50%", opacity: 0 }}
          animate={{ y: 0, x: "-50%", opacity: 1 }}
          exit={{ y: 80, x: "-50%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="fixed bottom-24 left-1/2 z-[1100] w-full max-w-xl px-4 pointer-events-none"
        >
          <div className="pointer-events-auto bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 text-white shadow-2xl rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Info label */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/30 relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-rose-500/10 animate-pulse" />
                <Compass className="w-5 h-5 text-rose-500 animate-spin" style={{ animationDuration: "8s" }} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-rose-500 flex items-center gap-1.5">
                  Đang chọn vị trí
                </h4>
                <p className="text-[11px] font-medium text-zinc-300 mt-0.5">
                  {draftLatLng ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-mono">
                      <MapPin className="w-3 h-3 animate-bounce" />
                      Ghim: {draftLatLng[0].toFixed(5)}, {draftLatLng[1].toFixed(5)}
                    </span>
                  ) : (
                    "Hãy click vào bất kỳ đâu trên bản đồ hoặc kéo ghim..."
                  )}
                </p>
              </div>
            </div>

            {/* Actions buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={cancelSelection}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-all cursor-pointer active:scale-95"
              >
                <X className="w-3.5 h-3.5" /> Hủy
              </button>
              
              <button
                onClick={confirmLocationSelection}
                disabled={!draftLatLng}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-lg
                  ${draftLatLng 
                    ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50" 
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"}`}
              >
                <Check className="w-3.5 h-3.5" /> Xác nhận
              </button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
