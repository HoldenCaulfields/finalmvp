
import React, { useState } from 'react';
import { Artisan } from '../types';
import { Heart, Phone, MapPin, Award, UserCheck, MessageSquare, ChevronRight, X, Sparkles, Send, Check } from 'lucide-react';

interface ArtisansTabProps {
  artisans: Artisan[];
}

export default function ArtisansTab({ artisans }: ArtisansTabProps) {
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  
  // Form input state
  const [visitorName, setVisitorName] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !message.trim()) return;

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowContactForm(false);
      setVisitorName('');
      setMessage('');
    }, 3000);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      {/* Intro section */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-semibold border border-rose-100">
          <Award className="w-3.5 h-3.5 text-rose-600" />
          <span>BẢO TỒN VĂN HÓA SỐNG</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-serif">
          Gặp Gỡ & Kết Nối Cùng Nghệ Nhân Chăm
        </h2>
        <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
          Tôn vinh những đôi bàn tay tài hoa lưu giữ hồn cốt Chăm pa. Hãy ghé thăm trực tiếp các nghệ nhân tại khu vực làng nghề trình diễn dệt vải, nặn gốm tại Nha Trang.
        </p>
      </section>

      {/* Artisans Grid List */}
      <section className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {artisans.map((artisan) => (
            <div
              key={artisan.id}
              id={`artisan-card-${artisan.id}`}
              className="bg-white rounded-3xl border border-rose-100/60 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              {/* Profile Image Banner with specialty tag */}
              <div className="relative h-44 bg-zinc-100 overflow-hidden">
                <img
                  src={artisan.avatar}
                  alt={artisan.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute top-3 left-3 bg-white/95 text-rose-600 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-2xs border border-rose-100">
                  {artisan.experience}
                </div>
              </div>

              {/* Artisan Summary details */}
              <div className="p-5 flex flex-col flex-1 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-extrabold text-zinc-950 font-serif group-hover:text-rose-600 transition-colors">
                    {artisan.name}
                  </h3>
                  <p className="text-xs text-rose-600 font-bold font-display flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" /> {artisan.title}
                  </p>
                </div>

                <div className="space-y-1 bg-rose-50/50 p-3 rounded-xl border border-rose-100/30">
                  <span className="text-[10px] text-rose-600 font-extrabold uppercase tracking-widest font-display block">Sở trường / Bí kíp nghề</span>
                  <p className="text-zinc-800 text-xs font-semibold leading-relaxed line-clamp-2">
                    {artisan.specialty}
                  </p>
                </div>

                <div className="text-[11px] text-zinc-500 space-y-1.5 flex-1">
                  <div className="flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 mt-0.5 flex-shrink-0" />
                    <span>Vị trí lễ hội: {artisan.location}</span>
                  </div>
                </div>

                {/* Card Button footer */}
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <a
                    href={`tel:${artisan.phone}`}
                    className="text-xs font-mono font-bold text-zinc-600 hover:text-rose-600 flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" /> Gọi kết nối
                  </a>

                  <button
                    onClick={() => {
                      setSelectedArtisan(artisan);
                      setShowContactForm(false);
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors"
                  >
                    Đọc Tiểu Sử Chăm
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Artisan Biography Detailed Modal */}
      {selectedArtisan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-rose-100 animate-slide-up flex flex-col text-left">
            <div className="relative h-56 flex-shrink-0">
              <img
                src={selectedArtisan.avatar}
                alt={selectedArtisan.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <button
                onClick={() => setSelectedArtisan(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 text-white pr-4">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-600 px-2.5 py-1 rounded">
                  {selectedArtisan.experience}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif mt-2">{selectedArtisan.name}</h3>
                <p className="text-rose-300 text-xs font-semibold">{selectedArtisan.title}</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-display">Tóm tắt quá trình cống hiến</h4>
                <p className="text-zinc-700 text-sm leading-relaxed whitespace-pre-line font-medium">
                  {selectedArtisan.bio}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
                <div className="space-y-1">
                  <span className="text-[10px] text-rose-600 font-extrabold uppercase tracking-widest font-display block">Sở trường nghệ thuật</span>
                  <p className="text-zinc-800 text-xs font-bold">{selectedArtisan.specialty}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-rose-600 font-extrabold uppercase tracking-widest font-display block">Nơi biểu diễn tại Nha Trang</span>
                  <p className="text-zinc-800 text-xs font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" /> {selectedArtisan.location}
                  </p>
                </div>
              </div>

              {/* Message to Artisan Block */}
              {showContactForm ? (
                <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h5 className="text-xs font-extrabold text-rose-700 uppercase tracking-wider font-display flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-rose-600" /> Gửi thư cảm ơn / Lời nhắn giao lưu
                    </h5>
                    <button onClick={() => setShowContactForm(false)} className="text-zinc-400 hover:text-zinc-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {success ? (
                    <div className="py-4 text-center space-y-2">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-zinc-950">Đã chuyển đi bức thư cảm ơn thành công!</p>
                      <p className="text-[11px] text-zinc-500">Cảm ơn tình cảm chân quý của bạn dành cho nghệ nhân.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSendMessage} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-600 block uppercase">Họ tên của bạn</label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Minh Tâm (Du khách TP.HCM)"
                          value={visitorName}
                          onChange={(e) => setVisitorName(e.target.value)}
                          className="w-full px-3 py-1.5 border border-zinc-200 rounded-xl text-xs bg-white"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-600 block uppercase">Lời tri ân / Câu hỏi của bạn</label>
                        <textarea
                          rows={2}
                          placeholder="Hãy nhắn gửi sự mến mộ của bạn về tay nghề nghệ nhân hoặc xin đăng ký học múa, dệt thổ cẩm..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full px-3 py-1.5 border border-zinc-200 rounded-xl text-xs bg-white resize-none"
                          required
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" /> Gửi Thư Tri Ân Nghệ Nhân
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-rose-600" /> Viết Thư Tri Ân Nghệ Nhân
                  </button>
                  <a
                    href={`tel:${selectedArtisan.phone}`}
                    className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-rose-400" /> Gọi Trực Tiếp Hẹn Gặp
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
