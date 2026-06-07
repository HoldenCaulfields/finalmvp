import PromoSlider from './PromoSlider';

export default function PreviewCard() {
    return (
        <aside className="hidden lg:flex w-[24rem] flex-col gap-6 p-6 pt-30 border-l border-zinc-200 bg-white/40 backdrop-blur-md z-[20] overflow-y-auto scrollbar-hide no-scrollbar">
            <div className="flex-1">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="font-display font-black text-2xl text-zinc-900 tracking-tighter italic">Vị trí đã ghim</h2>
                    <button className="px-4 py-2 bg-white/80 border border-zinc-200/80 rounded-xl text-xs font-bold text-zinc-700 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50 transition-all shadow-sm active:scale-95">
                        Xem tất cả
                    </button>
                </div>

                <div className="h-64 mb-10 shadow-xl shadow-zinc-200/50">
                    <PromoSlider />
                </div>

                <div className="space-y-5">
                    <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">Tin nổi bật</h3>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="group p-5 rounded-2xl border border-transparent hover:border-zinc-200 hover:bg-white hover:shadow-xl hover:shadow-zinc-900/5 transition-all cursor-pointer">
                            <div className="flex items-center gap-2 mb-2.5">
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                                <p className="text-[10px] font-black text-rose-600 tracking-widest uppercase">XU HƯỚNG {i}</p>
                            </div>
                            <p className="text-sm font-bold text-zinc-900 group-hover:text-rose-600 transition-colors line-clamp-2 leading-snug">
                                {i % 2 === 0
                                    ? "Tuyển tài xế khu vực Phan Rang Tháp Chàm - Nhận ngay Voucher 50% phí dịch vụ"
                                    : "Cộng đồng Developer ra mắt Hub công nghệ mới"}
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                                <div className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200" />
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">2 giờ trước • LovelyNet</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-auto pt-8 border-t border-zinc-100 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                © 2026 LovelyNet Platform • Made with ❤️
            </div>
            <div className="mt-auto border-t border-zinc-100 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                Liên hệ: sdt 0793784133, fb: , zalo, github: Holdencaufields
            </div>
        </aside>
    );
}