import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Sparkles, Award, Map, CheckCircle2, ChevronRight, ChevronLeft, Camera, Heart, MapPin, Play, ExternalLink, X } from 'lucide-react';
import { CheckIn } from '../types';

interface HomeTabProps {
  setActiveTab: (tab: string) => void;
  checkins: CheckIn[];
}

const slideImages = [
  '/chmnt.jpg',
  '/vanhoacham.jpg',
  '/cham_ninhthuan.jpg',
  '/thapcham.webp',
  '/gombautruc.jpg',
  '/vhoa-cham.jpg',
];

export default function HomeTab({ setActiveTab, checkins }: HomeTabProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideImages.length) % slideImages.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideImages.length);
  };

  // Danh sách video từ các Youtuber về văn hóa Chăm
  const youtubeVideos = [
    {
      id: 'UgRTMH1aJb8', // ID video thực tế
      title: 'Tổng duyệt sẵn sàng cho đêm khai mạc Ngày hội Văn hoá dân tộc Chăm lần thứ VI năm 2026',
      channel: 'Truyền Hình Khánh Hòa',
      subscribers: '50k Subscribers',
      duration: '03:15',
      thumbnail: 'https://img.youtube.com/vi/UgRTMH1aJb8/maxresdefault.jpg',
    },
    {
      id: '2M9VhZNO618',
      title: 'Lễ hội Katê - di sản văn hóa phi vật thể của người Chăm',
      channel: 'Dân tộc Chăm',
      subscribers: '40k Subscribers',
      duration: '8:40',
      thumbnail: 'https://img.youtube.com/vi/2M9VhZNO618/maxresdefault.jpg',
    },
    {
      id: 'TuC_yq8JpFM',
      title: 'Hành trình đến với Lễ Hội Kate',
      channel: 'Saigon Laca',
      subscribers: '20K Subscribers',
      duration: '08:15',
      thumbnail: 'https://img.youtube.com/vi/TuC_yq8JpFM/maxresdefault.jpg',
    }
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-20 mx-auto lg:px-8">

      {/* Dynamic Hero Banner with Background Slideshow */}
      <section className="relative overflow-hidden rounded-3xl bg-zinc-800 text-white shadow-xl min-h-[420px] max-h-120 md:max-h-140 flex flex-col justify-between group/hero">

        {/* Background Images with Fade Transition */}
        <div className="absolute inset-0 z-0">
          {slideImages.map((image, index) => (
            <div key={index} className="absolute inset-0">
              <img
                src={image}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out transform ${currentSlide === index ? 'opacity-90 scale-100 visible' : 'opacity-0 scale-105 invisible'
                  }`}
              />
              {/* Lớp phủ mờ tối sang trọng cô đọng dải màu Đen - Rose nhẹ */}
            </div>
          ))}
        </div>

        {/* Content Container */}
        <div className="relative max-w-2xl px-5 py-8 sm:px-10 sm:py-10 text-left z-10 flex-1 flex flex-col justify-center">
          <div className="inline-flex items-center space-x-2 bg-rose-600 text-white px-3 py-1 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-4 shadow-md shadow-rose-600/20 self-start animate-pulse">
            <Sparkles className="w-3 h-3" /> <span>ĐANG DIỄN RA</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight text-white mb-3 font-display tracking-tight">
            Chào Mừng Đến Với <br />
            <span className="text-rose-500">
              Ngày Hội Văn Hóa Dân Tộc Chăm 2026
            </span>
          </h2>

          <p className="text-zinc-300 text-xs sm:text-sm md:text-base mb-6 max-w-xl leading-relaxed font-normal">
            Hòa mình vào không khí rộn rã của Lễ hội tại Phan Rang - Khánh Hòa từ <span className="font-bold text-rose-400 underline decoration-rose-500/50 decoration-2 underline-offset-4">26/06 đến 28/06/2026</span>. Đồng hành và kết nối cùng đồng bào.
          </p>

          <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('checkin')}
              className="px-5 py-2.5 md:py-3 bg-rose-600 hover:bg-rose-500 active:scale-98 text-white text-xs md:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-rose-600/20 group/btn flex-1 sm:flex-initial"
            >
              Check-in Ngay <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => setActiveTab('stalls')}
              className="px-5 py-2.5 md:py-3 bg-zinc-900/90 hover:bg-zinc-800 active:scale-98 text-zinc-200 text-xs md:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-zinc-800 flex-1 sm:flex-initial"
            >
              Gian Hàng Online
            </button>
          </div>
        </div>

        {/* Slideshow Manual Controls (Ẩn trên mobile hoàn toàn để tinh gọn, hiện trên desktop khi hover) */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col space-y-2 z-20 opacity-0 group-hover/hero:opacity-100 transition-opacity duration-300">
          <button
            onClick={handlePrevSlide}
            className="p-2 rounded-lg bg-zinc-900/90 hover:bg-rose-600 text-white border border-zinc-800 transition-all cursor-pointer"
            aria-label="Slide trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextSlide}
            className="p-2 rounded-lg bg-zinc-900/90 hover:bg-rose-600 text-white border border-zinc-800 transition-all cursor-pointer"
            aria-label="Slide sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dots Indicator (Làm nhỏ gọn lại ăn nhập thanh Ribbon bên dưới) */}
        <div className="absolute bottom-16 left-5 sm:left-10 flex items-center space-x-1.5 z-20">
          {slideImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === idx ? 'w-5 bg-rose-500' : 'w-1.5 bg-zinc-700 hover:bg-zinc-600'
                }`}
              aria-label={`Đi tới slide ${idx + 1}`}
            ></button>
          ))}
        </div>

        {/* Live Event Stats Ribbon */}
        <div className="relative border-t border-zinc-900 bg-zinc-950/95 backdrop-blur-md py-3.5 px-5 sm:px-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 z-10 text-[11px] md:text-xs">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-zinc-400 font-medium">Khởi động: 26/06 - 28/06/2026</span>
          </div>
          <div className="flex items-center space-x-4 text-zinc-500 font-medium">
            <div><span className="text-white font-bold">1,000+</span> du khách</div>
            <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
            <div><span className="text-white font-bold">25+</span> gian hàng</div>
            <div className="w-1 h-1 bg-zinc-800 rounded-full hidden sm:block"></div>
            <div className="hidden sm:block"><span className="text-white font-bold">12+</span> nghệ nhân</div>
          </div>
        </div>
      </section>

      {/* Live Visitor Photo Feed */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-100 pb-5">
          <div className="space-y-2 text-left max-w-2xl">
            <span className="text-xs font-black tracking-widest text-rose-600 uppercase">Giao Lưu & Kết Nối</span>
            <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">Khoảnh Khắc Lễ Hội Từ Du Khách</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Những lăng kính chân thực nhất từ cộng đồng tham gia ngày hội. Đăng tải khoảnh khắc của riêng bạn để lan tỏa nét đẹp văn hóa bản địa!
            </p>
          </div>
          <button
            onClick={() => setActiveTab('checkin')}
            className="px-5 py-3 bg-rose-50 hover:bg-rose-100/80 active:scale-98 text-rose-700 text-sm font-bold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-rose-100 shadow-xs self-start md:self-auto group"
          >
            <Camera className="w-4 h-4 text-rose-600 group-hover:rotate-12 transition-transform" /> Đăng Ảnh Check-In Ngay
          </button>
        </div>

        {checkins && checkins.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {checkins.slice(0, 10).map((chk) => (
              <div
                key={chk.id}
                className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col cursor-pointer transform hover:-translate-y-1"
                onClick={() => setActiveTab('checkin')}
              >
                <div className="relative aspect-square overflow-hidden bg-zinc-50">
                  <img
                    src={chk.image}
                    alt={chk.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-900/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-white text-left">
                    <p className="text-xs font-bold truncate">{chk.name}</p>
                    <p className="text-[10px] text-zinc-300 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-amber-400" /> {chk.location}
                    </p>
                  </div>
                </div>
                <div className="p-4 text-left flex flex-col flex-1 justify-between bg-zinc-50/30">
                  <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed italic mb-3">
                    "{chk.caption}"
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[11px] text-zinc-400 font-medium">
                    <span>{new Date(chk.createdAt).toLocaleDateString('vi-VN')}</span>
                    <span className="flex items-center gap-1 text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
                      <Heart className="w-3 h-3 fill-rose-600 text-rose-600" /> {chk.likes}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-b from-zinc-50 to-white rounded-3xl border-2 border-dashed border-zinc-200 text-zinc-400 max-w-md mx-auto">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Camera className="w-6 h-6 text-zinc-400" />
            </div>
            <p className="text-sm font-semibold text-zinc-600 mb-1">Chưa có ảnh check-in nào</p>
            <p className="text-xs text-zinc-400 px-6">Hãy là người đầu tiên ghi lại dấu ấn tuyệt đẹp tại Ngày hội Văn hóa Chăm 2026!</p>
          </div>
        )}
      </section>

      {/* Traditional Culture Section (Media & Journalism) */}
      <section className="space-y-8 bg-zinc-50/50 rounded-3xl p-6 sm:p-10 border border-zinc-100">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black tracking-widest text-rose-600 uppercase">Truyền Thông Quốc Tế & Trong Nước</span>
          <h3 className="text-3xl font-black text-zinc-900 tracking-tight">Di Sản Ngàn Năm Trên Các Trang Báo Lớn 2026</h3>
          <p className="text-zinc-500 text-sm">
            Cập nhật nhanh những bài viết nổi bật đưa tin về tiến trình, quy mô và sức hấp dẫn rực rỡ của Ngày Hội Văn Hóa Dân Tộc Chăm diễn ra tại Phan Rang.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Bài báo 1 - Báo Văn Hóa */}
          <a
            href="https://baovanhoa.vn/van-hoa/khai-mac-cac-hoat-dong-van-hoa-the-thao-du-lich-ngay-hoi-van-hoa-dan-toc-cham-240375.html"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col transform hover:-translate-y-1"
          >
            <div className="relative h-52 overflow-hidden bg-zinc-100">
              <img
                src="https://baokhanhhoa.vn/file/e7837c02857c8ca30185a8c39b582c03/062026/img_8594_20260625223306.jpg"
                alt="Khai mạc các hoạt động ngày hội"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute top-4 left-4 bg-zinc-900/90 text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-md backdrop-blur-xs">
                Sự Kiện Tiêu Điểm
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1 space-y-4 text-left">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-rose-600">
                  <span>Báo Văn Hóa Điện Tử</span>
                  <span className="text-zinc-400 font-normal">26/06/2026</span>
                </div>
                <h4 className="text-lg font-bold text-zinc-900 leading-snug group-hover:text-rose-600 transition-colors line-clamp-2">
                  Khai Mạc Các Hoạt Động Văn Hóa, Thể Thao, Du Lịch Ngày Hội Văn Hóa Dân Tộc Chăm
                </h4>
              </div>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed flex-1 line-clamp-3">
                Sáng 26.6, tại Quảng trường 16 tháng 4, TP. Phan Rang đã chính thức diễn ra chuỗi hoạt động triển lãm, văn hóa quần chúng đặc sắc trong khuôn khổ Ngày hội toàn quốc lần thứ VI.
              </p>
              <div className="pt-2 border-t border-zinc-50 flex items-center justify-between text-xs font-bold text-zinc-800 group-hover:text-rose-600 transition-colors">
                <span className="inline-flex items-center gap-1">Đọc bài báo gốc <ExternalLink className="w-3.5 h-3.5" /></span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>

          {/* Bài báo 2 - Báo Khánh Hòa */}
          <a
            href="https://baokhanhhoa.vn/van-hoa/202606/tong-duyet-chuong-trinh-nghe-thuat-chao-mung-ngay-hoi-van-hoa-dan-toc-cham-lan-thu-vi-47e2a4f/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col transform hover:-translate-y-1"
          >
            <div className="relative h-52 overflow-hidden bg-zinc-100">
              <img
                src="https://baokhanhhoa.vn/file/e7837c02857c8ca30185a8c39b582c03/062026/img_8543_20260625223139.jpg"
                alt="Tổng duyệt Lung linh sắc màu văn hóa Chăm"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute top-4 left-4 bg-zinc-900/90 text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-md backdrop-blur-xs">
                Hậu Trường Nghệ Thuật
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1 space-y-4 text-left">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-rose-600">
                  <span>Báo Khánh Hòa</span>
                  <span className="text-zinc-400 font-normal">26/06/2026</span>
                </div>
                <h4 className="text-lg font-bold text-zinc-900 leading-snug group-hover:text-rose-600 transition-colors line-clamp-2">
                  Tổng Duyệt Chương Trình Nghệ Thuật Chào Mừng Ngày Hội: “Lung Linh Sắc Màu Văn Hóa Chăm”
                </h4>
              </div>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed flex-1 line-clamp-3">
                Chương trình nghệ thuật được kết cấu gồm 3 chương đồ sộ: Tái hiện từ huyền tích cội nguồn cổ xưa, tinh hoa nhạc cụ trống Paranưng đến sức sống người Chăm thời kỳ đổi mới.
              </p>
              <div className="pt-2 border-t border-zinc-50 flex items-center justify-between text-xs font-bold text-zinc-800 group-hover:text-rose-600 transition-colors">
                <span className="inline-flex items-center gap-1">Đọc bài báo gốc <ExternalLink className="w-3.5 h-3.5" /></span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>

          {/* Bài báo 3 - Báo Nhân Dân */}
          <a
            href="https://nhandan.vn/kham-pha-di-san-van-hoa-cham-tren-khong-gian-so-post971344.html"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col transform hover:-translate-y-1"
          >
            <div className="relative h-52 overflow-hidden bg-zinc-100">
              <img
                src="https://media.baovanhoa.vn/zoom/1000/uploaded/hoangxuanhuong/2026_06_26/1_qpun.jpg"
                alt="Không gian số hóa di sản Chăm"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute top-4 left-4 bg-zinc-900/90 text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-md backdrop-blur-xs">
                Công Nghệ & Di Sản
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1 space-y-4 text-left">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-rose-600">
                  <span>Báo Nhân Dân</span>
                  <span className="text-zinc-400 font-normal">25/06/2026</span>
                </div>
                <h4 className="text-lg font-bold text-zinc-900 leading-snug group-hover:text-rose-600 transition-colors line-clamp-2">
                  Khám Phá Di Sản Văn Hóa Chăm Trên Không Gian Số Tại Ngày Hội 2026
                </h4>
              </div>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed flex-1 line-clamp-3">
                Giải pháp đưa những giá trị truyền thống độc đáo như gốm Bàu Trúc, thổ cẩm Mỹ Nghiệp đến gần hơn với công chúng và du khách quốc tế trong kỷ nguyên số.
              </p>
              <div className="pt-2 border-t border-zinc-50 flex items-center justify-between text-xs font-bold text-zinc-800 group-hover:text-rose-600 transition-colors">
                <span className="inline-flex items-center gap-1">Đọc bài báo gốc <ExternalLink className="w-3.5 h-3.5" /></span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>

        </div>
      </section>

      {/* NEW: YouTuber Video Discovery Section */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black tracking-widest text-rose-600 uppercase">Góc Sáng Tạo Nội Dung</span>
          <h3 className="text-3xl font-black text-zinc-900 tracking-tight">Góc Nhìn Từ Người Làm Nội Dung</h3>
          <p className="text-zinc-500 text-sm">
            Thưởng thức những thước phim trải nghiệm văn hóa, ẩm thực và âm nhạc sống động. Click vào video để xem trực tiếp ngay tại đây!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {youtubeVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => setActiveVideoId(video.id)}
              className="bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-xs hover:shadow-lg transition-all duration-300 group text-left flex flex-col cursor-pointer transform hover:-translate-y-1"
            >
              <div className="relative aspect-video bg-zinc-900 overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-102 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-zinc-950/20 group-hover:bg-transparent transition-colors"></div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-xl group-hover:bg-rose-500 group-hover:scale-110 transition-all duration-300">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                <span className="absolute bottom-3 right-3 bg-zinc-950/80 text-white font-mono text-[11px] px-2 py-0.5 rounded-md">
                  {video.duration}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <h4 className="font-bold text-sm sm:text-base text-zinc-900 line-clamp-2 leading-snug group-hover:text-rose-600 transition-colors">
                  {video.title}
                </h4>
                <div className="flex items-center space-x-3 pt-2 border-t border-zinc-50">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-bold text-xs uppercase shadow-xs">
                    {video.channel.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-800">{video.channel}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{video.subscribers}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ====== POPUP VIDEO PLAYER MODEL ====== */}
        {activeVideoId && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-md p-4 animate-fade-in"
            onClick={() => setActiveVideoId(null)}
          >
            <div
              className="relative w-full max-w-4xl bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800"
              onClick={(e) => e.stopPropagation()} // Ngăn đóng khi click vào trong video
            >
              {/* Nút đóng góc trên bên phải */}
              <button
                onClick={() => setActiveVideoId(null)}
                className="absolute -top-12 right-0 md:top-4 md:right-4 bg-zinc-800/80 hover:bg-rose-600 text-white p-2.5 rounded-full transition-colors z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Tỉ lệ màn hình Video 16:9 chuẩn */}
              <div className="relative aspect-video w-full">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&modestbranding=1&rel=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Community Leverage Section */}
      <section className="bg-gradient-to-br from-rose-50/50 via-amber-50/30 to-orange-50/40 rounded-3xl border border-rose-100/70 p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center gap-10">
        <div className="flex-1 space-y-5 text-left">
          <div className="inline-flex items-center space-x-1.5 bg-white text-rose-600 px-4 py-1.5 rounded-full text-xs font-bold border border-rose-100 shadow-xs">
            <Award className="w-4 h-4 text-rose-600" /> <span>Tôi là người Chăm đồng hành</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            Đồng Bào Chăm Kết Nối Toàn Cầu
          </h3>
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-light">
            Chào quý vị! Tôi cũng là một người con của đồng bào Chăm. Tôi xây dựng nền tảng số hóa này nhằm lưu giữ những khoảnh khắc tuyệt vời của du khách ghé thăm ngày hội lớn 2026, và đặc biệt nâng tầm mở ra các gian hàng trực tuyến giúp các hộ gia đình, nghệ nhân dệt thổ cẩm, nặn gốm tại quê hương có cơ hội giới thiệu sản phẩm tinh hoa trực tiếp tới mọi người.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {[
              "Bản đồ số hóa định vị nghệ nhân Chăm",
              "Chợ nông thổ sản sạch từ chính làng nghề",
              "Nâng tầm trải nghiệm tiếp cận du lịch",
              "Không gian lưu trữ hình ảnh lễ hội trực tuyến"
            ].map((text, index) => (
              <div key={index} className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-zinc-700 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action Card */}
        <div className="w-full lg:w-96 bg-white p-8 rounded-2xl border border-rose-100/80 shadow-xl text-center space-y-5 transform transition-transform hover:scale-101">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl flex items-center justify-center mx-auto border border-rose-100/60 shadow-xs">
            <Map className="w-8 h-8 text-rose-600" />
          </div>
          <div className="space-y-2">
            <h4 className="text-base font-black text-zinc-900 tracking-tight uppercase">Bạn Là Du Khách Hội Nghị?</h4>
            <p className="text-xs text-zinc-500 leading-relaxed px-2">
              Hãy đăng tải ngay bức ảnh chụp kỷ niệm tại Phan Rang - Khánh Hòa trong 3 ngày này để cùng lan tỏa mạnh mẽ văn hóa Chăm!
            </p>
          </div>
          <button
            onClick={() => setActiveTab('checkin')}
            className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 active:scale-98 text-white text-sm font-bold rounded-xl cursor-pointer transition-all shadow-md shadow-rose-600/10"
          >
            Đăng Ảnh Kỷ Niệm Ngay
          </button>
        </div>
      </section>
    </div>
  );
}