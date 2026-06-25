
import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Sparkles, Award, Map, CheckCircle2, ChevronRight, X, ChevronLeft, Camera, Heart, MapPin } from 'lucide-react';
import { CheckIn } from '../types';

interface HomeTabProps {
  setActiveTab: (tab: string) => void;
  checkins: CheckIn[];
}

const slideImages = [
    'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?auto=format&fit=crop&w=1200&q=80', // Apsara/Dancing/Festival style
    'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=1200&q=80', // Weaving/Thổ cẩm
    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80', // Pottery/Gốm Bàu Trúc
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Nha Trang beach
    'https://images.unsplash.com/photo-1621886292650-520f76c747d6?auto=format&fit=crop&w=1200&q=80', // Po Nagar Cham towers
  ];

export default function HomeTab({ setActiveTab, checkins }: HomeTabProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideImages.length) % slideImages.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideImages.length);
  };

  const culturalTopics = [
    {
      id: 'pottery',
      title: 'Nghệ Thuật Gốm Cổ Bàu Trúc',
      subtitle: 'Hồn Đất Nung nung qua Lửa và Gió',
      shortDesc: 'Làng gốm cổ nhất Đông Nam Á với kỹ thuật làm gốm bằng tay độc nhất vô nhị: "tay quay mông chạy" không dùng bàn xoay.',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      tag: 'Di sản phi vật thể UNESCO',
      content: {
        intro: 'Gốm Bàu Trúc (thị trấn Phước Dân, Ninh Thuận) được xem là một trong những làng gốm cổ nhất Đông Nam Á còn tồn tại và giữ nguyên vẹn kỹ thuật làm gốm thủ công mộc mạc.',
        details: [
          {
            title: 'Kỹ Thuật Tạo Hình "Tay Quay Mông Chạy"',
            desc: 'Không sử dụng bàn xoay cơ học, người phụ nữ Chăm đi giật lùi xung quanh bục đá, đôi tay uyển chuyển nhào nặn đất sét mịn pha cát tạo dáng sản phẩm một cách chuẩn xác đầy diệu kỳ.'
          },
          {
            title: 'Đất Sét Sông Quao Độc Nhất',
            desc: 'Đất sét làm gốm được lấy từ vùng bồi sông Quao. Đất có độ mịn cao, độ dẻo tự nhiên cực tốt, khi nung không bị nứt và tạo nên màu đỏ ấm rất riêng.'
          },
          {
            title: 'Hỏa Biến Lộ Thiên',
            desc: 'Gốm không được nung trong lò kín mà xếp lộ thiên, phủ rơm rạ, trấu, củi khô rồi nung trong vòng 5-8 tiếng dưới gió biển lộng. Quá trình này tạo nên những vệt khói xám đen ngẫu nhiên cực nghệ thuật.'
          }
        ]
      }
    },
    {
      id: 'weaving',
      title: 'Thổ Cẩm Mỹ Nghiệp Sắc Hồng',
      subtitle: 'Sợi Chỉ Dệt Nên Sắc Màu Bản Địa',
      shortDesc: 'Từng sợi chỉ bông tự nhiên được dệt tay thủ công tỉ mỉ với họa tiết mang tính biểu tượng cổ xưa như hoa văn Tháp Bà, mắt rồng Chăm.',
      image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=800&q=80',
      tag: 'Tinh Hoa Làng Nghề Chăm',
      content: {
        intro: 'Nằm lặng lẽ giữa vùng đất Ninh Thuận, làng dệt thổ cẩm Chăm Mỹ Nghiệp là nơi lưu giữ nghề dệt sợi bông thêu tay truyền thống được bảo tồn qua hàng trăm thế hệ.',
        details: [
          {
            title: 'Nhân Nhuộm Màu Tự Nhiên',
            desc: 'Người thợ dệt nhuộm sợi bằng nguyên liệu cỏ cây hoa lá hoang dã dồi dào: màu vàng từ củ nghệ, màu đỏ từ hạt điều rừng, màu đen từ vỏ cây rừng rừng nhuộm bùn sông.'
          },
          {
            title: 'Mẫu Hoa Văn Cổ Kính',
            desc: 'Mỗi dải hoa văn thổ cẩm là một câu chuyện. Hoa văn "mắt rồng" mang ý nghĩa bảo hộ hộ mạng; hoa văn "quả trám" biểu trưng cho cuộc sống ấm no; hoa văn "tháp" đại diện cho tâm linh.'
          },
          {
            title: 'Sắc Hồng - Rose Hiện Đại',
            desc: 'Ngày nay các nghệ nhân đã tinh tế phối hợp các sắc màu truyền thống với gam màu hồng rose thanh lịch, tạo nên các bộ khăn choàng, ví, túi cực kỳ thời trang và cao cấp.'
          }
        ]
      }
    },
    {
      id: 'festival',
      title: 'Âm Nhạc & Vũ Điệu Katê',
      subtitle: 'Thăng Hoa Giữa Nhịp Trống Paranưng',
      shortDesc: 'Hòa mình vào không khí thiêng liêng rộn rã với âm sắc kèn Saranai réo rắt và vũ điệu múa quạt, múa lu uyển chuyển quyến rũ.',
      image: 'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?auto=format&fit=crop&w=800&q=80',
      tag: 'Lễ Hội Truyền Thống',
      content: {
        intro: 'Văn hóa nghệ thuật biểu diễn Chăm là một kho báu sống động đầy cảm xúc, nơi tâm linh giao hòa hoàn hảo với đời sống nông nghiệp thường ngày.',
        details: [
          {
            title: 'Ba Nhạc Cụ Trụ Cột',
            desc: 'Một dàn nhạc hội tụ đủ kèn Saranai (đại diện cho phần đầu/trí tuệ), trống Baranưng (đại diện cho ngực/tâm hồn), và trống Ghi-năng (đại diện cho đôi chân/nhịp sinh học).'
          },
          {
            title: 'Điệu Múa Lu Duyên Dáng',
            desc: 'Phụ nữ Chăm múa lu thể hiện sự khéo léo lấy nước từ nguồn giếng cổ về sinh hoạt. Những chiếc lu đất thăng bằng trên đầu khi di chuyển nhịp nhàng tạo ra một vẻ đẹp thoát tục.'
          },
          {
            title: 'Múa Quạt Rực Rỡ Sắc Màu',
            desc: 'Múa quạt Chăm là lời chào đón khách quý và dâng lời cầu khẩn thần linh ban mùa màng thuận hòa, vạn vật hanh thông.'
          }
        ]
      }
    }
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-16">
      {/* Dynamic Hero Banner with Background Slideshow */}
      <section className="relative overflow-hidden rounded-3xl bg-zinc-950 text-white shadow-2xl min-h-[420px] sm:min-h-[480px] flex flex-col justify-between">
        
        {/* Background Images with Fade Transition */}
        <div className="absolute inset-0">
          {slideImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                currentSlide === index ? 'opacity-50 scale-100 visible' : 'opacity-0 scale-95 invisible'
              }`}
              style={{ backgroundImage: `url('${image}')` }}
            ></div>
          ))}
        </div>

        {/* Content Container */}
        <div className="relative max-w-4xl w-full mx-auto px-6 py-12 sm:px-12 sm:py-16 md:py-20 text-left z-10 flex-1 flex flex-col justify-center">
          <div className="inline-flex items-center space-x-2 bg-rose-600/95 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-rose-400 self-start">
            <Sparkles className="w-3.5 h-3.5" /> <span>ĐANG DIỄN RA TRONG TUẦN NÀY</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif leading-tight text-white mb-4">
            Chào Mừng Đến Với <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-200">
              Ngày Hội Văn Hóa Chăm VI
            </span>
          </h2>
          
          <p className="text-zinc-200 text-sm sm:text-base md:text-lg mb-8 max-w-xl leading-relaxed">
            Hòa mình vào không khí rộn rã của Lễ hội tại Nha Trang - Khánh Hòa từ <span className="font-bold text-rose-300">26/06 đến 28/06/2026</span>. Đồng hành, sẻ chia và kết nối cùng đồng bào Chăm bản địa.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <button
              onClick={() => setActiveTab('checkin')}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-rose-900/30"
            >
              Check-in Đăng Hình <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('stalls')}
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-zinc-700"
            >
              Ghé Thăm Gian Hàng Online
            </button>
          </div>
        </div>

        {/* Slideshow Manual Controls (Prev/Next Arrows) & Dot Indicators */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col space-y-3 z-20">
          <button
            onClick={handlePrevSlide}
            className="p-2 rounded-full bg-zinc-900/60 hover:bg-rose-600/80 text-white border border-zinc-700 hover:border-rose-400 transition-all cursor-pointer"
            aria-label="Slide trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextSlide}
            className="p-2 rounded-full bg-zinc-900/60 hover:bg-rose-600/80 text-white border border-zinc-700 hover:border-rose-400 transition-all cursor-pointer"
            aria-label="Slide sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="absolute bottom-16 sm:bottom-20 left-6 sm:left-12 flex space-x-1.5 z-20">
          {slideImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? 'w-6 bg-rose-500' : 'w-2 bg-zinc-500 hover:bg-zinc-400'
              }`}
              aria-label={`Đi tới slide ${idx + 1}`}
            ></button>
          ))}
        </div>

        {/* Live Event Stats Ribbon */}
        <div className="relative border-t border-zinc-800 bg-zinc-950/95 py-4 px-6 sm:px-12 flex flex-wrap justify-between items-center gap-4 z-10">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="text-xs text-zinc-300 font-medium">Lễ hội khởi động: 26/06 - 28/06/2026</span>
          </div>
          <div className="flex items-center space-x-6 text-xs text-zinc-400">
            <div>
              <span className="text-white font-bold">1000+</span> du khách
            </div>
            <div>
              <span className="text-white font-bold">25+</span> gian hàng Chăm
            </div>
            <div>
              <span className="text-white font-bold">12+</span> nghệ nhân xuất sắc
            </div>
          </div>
        </div>
      </section>

      {/* Traditional Culture Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold tracking-widest text-rose-600 uppercase font-display">TÌM HIỂU TRUYỀN THỐNG</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-serif">Di Sản Ngàn Năm Của Người Chăm</h3>
          <p className="text-zinc-500 text-sm sm:text-base">
            Khám phá những nét mộc mạc, gần gũi trong đời sống sinh hoạt, dệt thổ cẩm Mỹ Nghiệp rực rỡ sắc màu, hay làm gốm nung lộ thiên độc đáo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {culturalTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white rounded-2xl border border-rose-100/60 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={topic.image}
                  alt={topic.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/95 text-rose-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs border border-rose-100">
                  {topic.tag}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1 space-y-3">
                <div className="space-y-1">
                  <span className="text-xs text-rose-600 font-medium font-display">{topic.subtitle}</span>
                  <h4 className="text-lg font-bold text-zinc-950 font-serif leading-snug">{topic.title}</h4>
                </div>
                <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed flex-1">
                  {topic.shortDesc}
                </p>
                <button
                  onClick={() => setSelectedTopic(topic.id)}
                  className="pt-2 text-xs font-bold text-zinc-900 hover:text-rose-600 flex items-center gap-1 group/btn cursor-pointer transition-colors"
                >
                  Khám phá chi tiết <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Visitor Photo Feed */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-rose-100 pb-3">
          <div className="space-y-1 text-left">
            <span className="text-xs font-extrabold tracking-widest text-rose-600 uppercase font-display">Giao Lưu & Chia Sẻ</span>
            <h3 className="text-2xl font-extrabold text-zinc-900 font-serif">Khoảnh Khắc Lễ Hội Từ Du Khách</h3>
            <p className="text-zinc-500 text-xs sm:text-sm">
              Xem ảnh đẹp từ các du khách khác đăng tải. Đăng ảnh ngay để giao lưu cùng mọi người nhé!
            </p>
          </div>
          <button
            onClick={() => setActiveTab('checkin')}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-rose-100/60 self-start sm:self-auto"
          >
            <Camera className="w-4 h-4 text-rose-600" /> Đăng Ảnh Check-In
          </button>
        </div>

        {checkins && checkins.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {checkins.slice(0, 10).map((chk) => (
              <div
                key={chk.id}
                className="bg-white rounded-xl border border-zinc-200/60 overflow-hidden shadow-3xs hover:shadow-xs transition-all group flex flex-col cursor-pointer"
                onClick={() => setActiveTab('checkin')}
              >
                <div className="relative aspect-square overflow-hidden bg-zinc-100">
                  <img
                    src={chk.image}
                    alt={chk.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2 text-white text-left">
                    <p className="text-[10px] font-bold truncate">{chk.name}</p>
                    <p className="text-[8px] text-zinc-300 truncate flex items-center gap-0.5">
                      <MapPin className="w-2 h-2 text-rose-400" /> {chk.location}
                    </p>
                  </div>
                </div>
                <div className="p-2.5 text-left flex flex-col flex-1 justify-between bg-zinc-50/40">
                  <p className="text-[10px] text-zinc-600 line-clamp-2 leading-relaxed italic">
                    "{chk.caption}"
                  </p>
                  <div className="flex items-center justify-between pt-2 text-[9px] text-zinc-400 font-medium">
                    <span>{new Date(chk.createdAt).toLocaleDateString('vi-VN')}</span>
                    <span className="flex items-center gap-0.5 text-rose-600 font-bold">
                      <Heart className="w-2.5 h-2.5 fill-rose-600 text-rose-600" /> {chk.likes}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-zinc-200 text-zinc-400">
            <Camera className="w-8 h-8 mx-auto text-zinc-300 mb-1" />
            <p className="text-xs">Chưa có ảnh check-in nào được đăng tải. Hãy là người đầu tiên!</p>
          </div>
        )}
      </section>

      {/* Community leverage section */}
      <section className="bg-rose-50/60 rounded-3xl border border-rose-100/50 p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center space-x-1 bg-white text-rose-600 px-3 py-1 rounded-full text-xs font-bold border border-rose-100 shadow-3xs">
            <Award className="w-3.5 h-3.5 text-rose-600" /> <span>Tôi là người Chăm đồng hành</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 font-serif">
            Hỗ Trợ Đồng Bào Chăm Kết Nối Toàn Cầu
          </h3>
          <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
            Chào quý vị! Tôi cũng là một người con của đồng bào Chăm. Tôi xây dựng ứng dụng này nhằm lưu giữ khoảnh khắc tuyệt vời của mọi du khách ghé thăm ngày hội lớn lần này, và đặc biệt là mở ra các gian hàng trực tuyến để các hộ gia đình Chăm, các nghệ nhân dệt thổ cẩm, nặn gốm tại làng quê có cơ hội giới thiệu sản phẩm trực tiếp đến khách tham quan gần xa.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-zinc-700 font-medium">Bản đồ số hóa các nghệ nhân Chăm</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-zinc-700 font-medium">Chợ nông thổ sản sạch từ làng nghề Chăm</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-zinc-700 font-medium">Nâng tầm tiếp cận du lịch văn hóa</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-zinc-700 font-medium">Lưu trữ hình ảnh check-in trực tuyến</span>
            </div>
          </div>
        </div>
        <div className="w-full md:w-80 bg-white p-6 rounded-2xl border border-rose-100 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto border border-rose-100">
            <Map className="w-8 h-8 text-rose-600" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-zinc-950 font-display">BẠN LÀ DU KHÁCH HỘI NGHỊ?</h4>
            <p className="text-xs text-zinc-500">Hãy đăng ký ngay bức ảnh chụp kỷ niệm tại Nha Trang trong 3 ngày này để cùng lan tỏa văn hóa Chăm!</p>
          </div>
          <button
            onClick={() => setActiveTab('checkin')}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
          >
            Đăng Ảnh Kỷ Niệm Ngay
          </button>
        </div>
      </section>

      {/* Cultural Detail Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-rose-100 animate-slide-up">
            {/* Modal Header */}
            {(() => {
              const topic = culturalTopics.find(t => t.id === selectedTopic);
              if (!topic) return null;
              return (
                <>
                  <div className="relative h-60 w-full">
                    <img
                      src={topic.image}
                      alt={topic.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <button
                      onClick={() => setSelectedTopic(null)}
                      className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 cursor-pointer transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-6 text-white pr-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-rose-600 px-2 py-1 rounded-md">
                        {topic.tag}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold font-serif mt-2">{topic.title}</h3>
                      <p className="text-zinc-200 text-xs mt-1">{topic.subtitle}</p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    <p className="text-zinc-700 text-sm sm:text-base leading-relaxed italic border-l-4 border-rose-600 pl-4 bg-rose-50/50 py-3 rounded-r-xl">
                      "{topic.content.intro}"
                    </p>

                    <div className="space-y-4">
                      <h4 className="text-sm font-extrabold text-zinc-900 tracking-wider uppercase font-display">
                        Điểm Đặc Sắc & Kỹ Thuật Truyền Thống
                      </h4>
                      <div className="space-y-4">
                        {topic.content.details.map((detail, idx) => (
                          <div key={idx} className="p-4 bg-zinc-50 border border-zinc-200/50 rounded-xl space-y-1">
                            <h5 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                              <span className="w-5 h-5 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center text-xs font-bold font-display">
                                {idx + 1}
                              </span>
                              {detail.title}
                            </h5>
                            <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed pl-7">
                              {detail.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row gap-3 justify-end">
                      <button
                        onClick={() => setSelectedTopic(null)}
                        className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                      >
                        Đóng lại
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTopic(null);
                          if (topic.id === 'weaving') {
                            setActiveTab('stalls');
                          } else if (topic.id === 'pottery') {
                            setActiveTab('stalls');
                          } else {
                            setActiveTab('schedule');
                          }
                        }}
                        className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                      >
                        {topic.id === 'weaving' || topic.id === 'pottery' ? 'Xem Sản Phẩm Ngay' : 'Xem Lịch Trình Liên Quan'}
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
