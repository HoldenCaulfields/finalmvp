
import React, { useState, useRef } from 'react';
import { CheckIn } from '../types';
import { Camera, Heart, MapPin, Upload, Sparkles, Trash2, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '../lib/cloudinary';

interface CheckInTabProps {
  checkins: CheckIn[];
  onAddCheckIn: (newCheckIn: Omit<CheckIn, 'id' | 'likes' | 'createdAt'>) => Promise<void>;
  onLikeCheckIn: (id: string) => Promise<void>;
}

// Preset photos for visitors who want to test right away without uploading files
const PRESET_PHOTOS = [
  {
    id: 'p1',
    name: 'Múa Quạt',
    url: 'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?auto=format&fit=crop&w=600&q=80',
    desc: 'Điệu múa quạt Chăm rực rỡ'
  },
  {
    id: 'p2',
    name: 'Làng Gốm',
    url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    desc: 'Bàn tay nghệ nhân làm gốm'
  },
  {
    id: 'p3',
    name: 'Khung Cửi',
    url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=600&q=80',
    desc: 'Sợi tơ thổ cẩm rạng ngời'
  },
  {
    id: 'p4',
    name: 'Nha Trang',
    url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80',
    desc: 'Bãi biển Nha Trang lộng gió'
  }
];

const LOCATIONS = [
  "Sân khấu chính Quảng trường 2/4",
  "Gian hàng dệt Mỹ Nghiệp - Làng nghề",
  "Khu ẩm thực Chăm Lễ Hội",
  "Khu triển lãm gốm cổ Bàu Trúc",
  "Đền Tháp Bà Po Nagar",
  "Trung tâm Hội nghị tỉnh Khánh Hòa",
  "Khu thi đấu Thể thao bãi biển"
];

export default function CheckInTab({ checkins, onAddCheckIn, onLikeCheckIn }: CheckInTabProps) {
  const [name, setName] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [selectedPhoto, setSelectedPhoto] = useState(PRESET_PHOTOS[0].url);
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to handle file selection and conversion to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Kích thước ảnh tối đa là 8MB để đảm bảo tải nhanh.');
      return;
    }
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setCustomImageBase64(base64String);
      setSelectedPhoto(base64String);
      setErrorMsg('');
    };
    reader.onerror = () => {
      setErrorMsg('Có lỗi xảy ra khi đọc file ảnh này.');
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop support
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const clearCustomImage = () => {
    setCustomImageBase64(null);
    setSelectedFile(null);
    setSelectedPhoto(PRESET_PHOTOS[0].url);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập tên của bạn hoặc biệt danh.');
      return;
    }
    if (!caption.trim()) {
      setErrorMsg('Hãy viết vài dòng cảm nhận / lời chúc ý nghĩa cho Lễ hội nhé!');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      let finalImageUrl = selectedPhoto;
      if (selectedFile) {
        finalImageUrl = await uploadImage(selectedFile);
      }

      // Use the chosen image (either preset URL or uploaded Cloudinary URL)
      await onAddCheckIn({
        name: name.trim(),
        caption: caption.trim(),
        location,
        image: finalImageUrl,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?auto=format&fit=crop&w=100&q=80`
      });

      // Clear inputs upon success
      setName('');
      setCaption('');
      clearCustomImage();
      setSuccessMsg('Đăng bức ảnh kỷ niệm thành công! Cảm ơn bạn đã đồng hành cùng cộng đồng Chăm.');
      setTimeout(() => setSuccessMsg(''), 6000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi gửi check-in, vui lòng kiểm tra lại kích cỡ ảnh hoặc đường truyền.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Vừa xong';
    }
  };

  return (
    <div className="space-y-12 animate-fade-in pb-16">
      {/* Intro section */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-semibold border border-rose-100">
          <Camera className="w-3.5 h-3.5 text-rose-600" />
          <span>KHOẢNH KHẮC NGÀY HỘI</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-serif">
          Ghi Lại Kỷ Niệm & Gửi Gắm Tình Thân
        </h2>
        <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
          Đăng ảnh check-in thực tế của bạn tại Tháp Bà, bãi biển hay các gian hàng thổ cẩm để kết nối người Chăm với hàng nghìn du khách muôn phương.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left column: Posting Form */}
        <section className="lg:col-span-5 bg-white rounded-3xl border border-rose-100/60 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-zinc-900 font-serif flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-rose-500" /> Gửi Check-In Của Bạn
            </h3>
            <p className="text-xs text-zinc-500">
              Điền cảm nhận và đính kèm hình ảnh kỷ niệm tại ngày hội.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="uploader-name" className="text-xs font-bold text-zinc-700 uppercase tracking-wider block">
                Tên của bạn / Biệt danh <span className="text-rose-500">*</span>
              </label>
              <input
                id="uploader-name"
                type="text"
                placeholder="Ví dụ: Hồng Nhung Chăm, Nam Khánh..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm outline-none transition-all"
                required
              />
            </div>

            {/* Location Selector */}
            <div className="space-y-1.5">
              <label htmlFor="location-select" className="text-xs font-bold text-zinc-700 uppercase tracking-wider block">
                Địa điểm check-in <span className="text-rose-500">*</span>
              </label>
              <select
                id="location-select"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm bg-white outline-none transition-all cursor-pointer"
              >
                {LOCATIONS.map((loc, idx) => (
                  <option key={idx} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Caption Input */}
            <div className="space-y-1.5">
              <label htmlFor="caption-text" className="text-xs font-bold text-zinc-700 uppercase tracking-wider block">
                Cảm nhận của bạn <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="caption-text"
                rows={3}
                placeholder="Ấn tượng của bạn về lễ hội, một lời chúc gửi đồng bào Chăm hoặc giới thiệu gian hàng của gia đình..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm outline-none transition-all resize-none"
                required
              ></textarea>
            </div>

            {/* Photo Picker Options */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider block">
                Đính kèm hình ảnh kỷ niệm <span className="text-rose-500">*</span>
              </span>

              {/* Upload area or File Input with preview */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-36 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 cursor-pointer transition-all relative overflow-hidden group ${
                  customImageBase64 ? 'border-rose-500 bg-rose-50/25' : 'border-zinc-300 hover:border-rose-400 hover:bg-rose-50/10'
                } ${isDragActive ? 'border-rose-600 bg-rose-50/40 scale-[1.02]' : ''}`}
              >
                {customImageBase64 ? (
                  <>
                    <img
                      src={customImageBase64}
                      alt="Xem trước hình"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover filter brightness-75 group-hover:brightness-50 transition-all"
                    />
                    <div className="relative z-10 flex flex-col items-center justify-center text-white">
                      <Camera className="w-6 h-6 mb-1 filter drop-shadow-md" />
                      <span className="text-xs font-semibold filter drop-shadow-md">Chọn ảnh khác</span>
                    </div>
                    {/* Clear button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearCustomImage();
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-rose-600 cursor-pointer transition-colors z-20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="text-center space-y-1.5 text-zinc-500">
                    <Upload className="w-7 h-7 mx-auto text-zinc-400 group-hover:text-rose-500 transition-colors" />
                    <p className="text-xs font-bold text-zinc-700">Kéo thả ảnh hoặc click để chọn từ thiết bị</p>
                    <p className="text-[10px] text-zinc-400">Chấp nhận JPG, PNG lên tới 8MB</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Preset selection - if they don't have an image ready */}
              {!customImageBase64 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-zinc-400 font-bold tracking-wide block uppercase">
                    Hoặc chọn nhanh 1 hình nền lễ hội mẫu:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_PHOTOS.map((photo) => {
                      const isSelected = selectedPhoto === photo.url;
                      return (
                        <button
                          key={photo.id}
                          type="button"
                          onClick={() => {
                            setSelectedPhoto(photo.url);
                            setErrorMsg('');
                          }}
                          className={`relative h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                            isSelected ? 'border-rose-600 scale-[1.04] ring-2 ring-rose-200' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                          title={photo.desc}
                        >
                          <img
                            src={photo.url}
                            alt={photo.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                            <span className="text-[9px] font-extrabold text-white select-none">{photo.name}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Error & Success Alerts */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl font-medium">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-xl font-medium">
                {successMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white font-bold rounded-xl transition-all active:scale-98 cursor-pointer shadow-md shadow-rose-100"
            >
              {isSubmitting ? 'Đang gửi thông tin...' : 'Đăng Check-In Ngay'}
            </button>
          </form>
        </section>

        {/* Right column: Photo Wall Grid */}
        <section className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center border-b border-rose-100 pb-3">
            <h3 className="text-lg font-extrabold text-zinc-950 font-serif">
              Tường Ảnh Kỷ Niệm ({checkins.length})
            </h3>
            <span className="text-xs text-rose-600 font-bold font-display bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
              Cập nhật trực tiếp
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {checkins.map((chk) => (
              <div
                key={chk.id}
                id={`checkin-card-${chk.id}`}
                className="bg-white rounded-2xl border border-rose-100/60 overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col group"
              >
                {/* Photo with Overlay Location */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-zinc-100">
                  <img
                    src={chk.image}
                    alt={chk.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0" />
                    <span className="truncate font-semibold">{chk.location}</span>
                  </div>
                </div>

                {/* Body details */}
                <div className="p-4 flex flex-col flex-1 space-y-3">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={chk.avatar}
                      alt={chk.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-rose-100"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-zinc-900 truncate">{chk.name}</h4>
                      <span className="text-[9px] text-zinc-400 font-semibold">{formatTime(chk.createdAt)}</span>
                    </div>
                  </div>

                  <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed flex-1 italic">
                    "{chk.caption}"
                  </p>

                  {/* Footer actions */}
                  <div className="pt-2.5 border-t border-zinc-100 flex justify-between items-center">
                    <button
                      onClick={() => onLikeCheckIn(chk.id)}
                      className="inline-flex items-center space-x-1 text-zinc-500 hover:text-rose-600 group/like transition-colors cursor-pointer text-xs"
                    >
                      <span className="p-1.5 rounded-full group-hover/like:bg-rose-50 transition-colors">
                        <Heart className="w-3.5 h-3.5 fill-transparent group-hover/like:fill-rose-600 transition-colors group-active/like:scale-125" />
                      </span>
                      <span className="font-semibold group-hover/like:text-rose-600">{chk.likes} Thích</span>
                    </button>

                    <span className="text-[10px] text-zinc-400 font-mono">
                      #{chk.id.split('-')[1]?.slice(-4) || '2026'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {checkins.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-zinc-200 text-zinc-500 space-y-2">
              <ImageIcon className="w-10 h-10 mx-auto text-zinc-300" />
              <p className="text-sm font-bold">Chưa có ảnh check-in nào được đăng.</p>
              <p className="text-xs text-zinc-400">Hãy là người đầu tiên đăng tải bức hình kỷ niệm của bạn!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
