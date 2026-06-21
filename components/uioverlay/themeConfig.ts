import {
  Factory, HardDrive, Calendar, Briefcase, UserCheck, TrendingUp,
  Film, Video, Award, BookOpen, GraduationCap, Users,
  ShoppingBag, Truck, MessageSquare, Search, ClipboardList,
  Tv, Sparkles, Compass, MapPin, Car, LucideIcon,
  PlusCircle, Heart, Phone, DollarSign
} from "lucide-react";

export interface HudAction {
  id: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  path: string;
  isPrimary?: boolean; // Nút nổi bật hơn
}

export interface ThemeConfig {
  tagline: string;
  title: string;
  shortName: string;
  baseRoute: string;
  phoneContact: string;
  donateInfo: string; // Thông tin hoặc route nhận bonus/ủng hộ
  stats: Array<{ id: string; label: string; value: string; icon: LucideIcon }>;
  actions: Array<HudAction>; // Các công cụ tương tác động thay đổi theo chủ đề
}

export const THEME_CONFIGS: Record<string, ThemeConfig> = {
  market: {
    tagline: "Chợ Phan Rang",
    title: "Ẩm Thực & Gian Hàng",
    shortName: "PR",
    baseRoute: "/chophanrang",
    phoneContact: "0901234567",
    donateInfo: "/chophanrang/donate",
    stats: [
      { id: "stores", label: "Quán ăn", value: "850+", icon: Factory },
      { id: "drivers", label: "Tài xế", value: "35+", icon: HardDrive },
      { id: "orders", label: "Đơn hàng", value: "1.2k+", icon: Calendar },
    ],
    actions: [
      { id: "add-store", title: "Mở Quán Ăn", subtitle: "Tạo gian hàng mới", icon: PlusCircle, path: "/chophanrang/create-store", isPrimary: true },
      { id: "reg-driver", title: "Đăng Ký Tài Xế", subtitle: "Chạy ship giao hàng", icon: Truck, path: "/chophanrang/register-driver" },
      { id: "food-service", title: "Khám Phá Dịch Vụ", subtitle: "Đặt món ăn siêu tốc", icon: ShoppingBag, path: "/chophanrang/services" }
    ]
  },
  jobs: {
    tagline: "Trung tâm Việc Làm",
    title: "Tuyển Dụng Cấp Tốc",
    shortName: "JB",
    baseRoute: "/jobs",
    phoneContact: "0907654321",
    donateInfo: "/jobs/premium",
    stats: [
      { id: "jobs", label: "Việc mới", value: "120+", icon: Briefcase },
      { id: "applied", label: "Ứng tuyển", value: "450+", icon: UserCheck },
      { id: "growth", label: "Công ty", value: "45+", icon: TrendingUp },
    ],
    actions: [
      { id: "post-job", title: "Tuyển Nhân Viên", subtitle: "Đăng tin tuyển nhanh", icon: PlusCircle, path: "/jobs/post", isPrimary: true },
      { id: "create-cv", title: "Tạo Hồ Sơ", subtitle: "Ứng tuyển việc ngay", icon: UserCheck, path: "/jobs/cv" },
      { id: "find-job", title: "Tìm Việc Làm", subtitle: "Khám phá cơ hội", icon: Search, path: "/jobs/explore" }
    ]
  },
  cinema: {
    tagline: "Studio & Cinema",
    title: "Cộng Đồng Làm Phim",
    shortName: "CM",
    baseRoute: "/cimanet",
    phoneContact: "0909999999",
    donateInfo: "/cinema/fund",
    stats: [
      { id: "movies", label: "Dự án phim", value: "18+", icon: Film },
      { id: "studios", label: "Phòng studio", value: "12+", icon: Video },
      { id: "creators", label: "Creator", value: "85+", icon: Award },
    ],
    actions: [
      { id: "add-project", title: "Thêm Dự Án", subtitle: "Đăng ký phim mới", icon: PlusCircle, path: "/cinema/create-project", isPrimary: true },
      { id: "rent-equip", title: "Thuê Thiết Bị", subtitle: "Máy quay, lens, đèn", icon: Sparkles, path: "/cinema/rent" },
      { id: "find-crew", title: "Tìm Ê-kíp", subtitle: "Kết nối talent & góc máy", icon: Compass, path: "/cinema/creators" }
    ]
  },
  study: {
    tagline: "Cộng Đồng Học Tập",
    title: "Góc Học Tập & Trao Đổi",
    shortName: "ST",
    baseRoute: "/caodangnghe",
    phoneContact: "0908888888",
    donateInfo: "/study/support",
    stats: [
      { id: "documents", label: "Tài liệu", value: "3.4k+", icon: BookOpen },
      { id: "rooms", label: "Phòng học", value: "28+", icon: GraduationCap },
      { id: "mentors", label: "Trợ giảng", value: "50+", icon: Users },
    ],
    actions: [
      { id: "share-doc", title: "Đóng Góp Tài Liệu", subtitle: "Tải lên giáo trình", icon: PlusCircle, path: "/study/upload", isPrimary: true },
      { id: "create-group", title: "Tạo Nhóm Tự Học", subtitle: "Tìm bạn đồng hành", icon: Users, path: "/study/groups/create" },
      { id: "find-place", title: "Địa Điểm Học", subtitle: "Thư viện, quán cà phê", icon: MapPin, path: "/study/places" }
    ]
  },
  startup: {
    tagline: "Tuổi Trẻ & Khởi Nghiệp",
    title: "Hệ Sinh Thái Gọi Vốn",
    shortName: "SU",
    baseRoute: "https://anothermvp.vercel.app",
    phoneContact: "0901112223",
    donateInfo: "/startup/invest",
    stats: [
      { id: "ideas", label: "Ý tưởng", value: "3.4k+", icon: BookOpen },
      { id: "teams", label: "Đội ngũ", value: "28+", icon: GraduationCap },
      { id: "launched", label: "Đã ra mắt", value: "50+", icon: Users },
    ],
    actions: [
      { id: "pitch-idea", title: "Nộp Ý Tưởng", subtitle: "Gọi vốn công nghệ", icon: PlusCircle, path: "/startup/pitch", isPrimary: true },
      { id: "find-co-founder", title: "Tìm Co-Founder", subtitle: "Ghép đội lập nghiệp", icon: Users, path: "/startup/teams" },
      { id: "book-mentor", title: "Gặp Mentor", subtitle: "Tư vấn chiến lược", icon: MapPin, path: "/startup/mentors" }
    ]
  },
  driver: {
    tagline: "Tài xế & Giao hàng",
    title: "Mạng Lưới Vận Chuyển",
    shortName: "DR",
    baseRoute: "/chophanrang",
    phoneContact: "0903334445",
    donateInfo: "/drivers/tip",
    stats: [
      { id: "drivers", label: "Tài xế", value: "3.4k+", icon: Car },
      { id: "orders", label: "Đơn hàng", value: "28+", icon: ClipboardList },
      { id: "deliveries", label: "Đối tác", value: "50+", icon: Users },
    ],
    actions: [
      { id: "create-order", title: "Tạo Đơn Ship", subtitle: "Giao hàng hỏa tốc", icon: PlusCircle, path: "/drivers/create", isPrimary: true },
      { id: "driver-chat", title: "Trạm Giao Lưu", subtitle: "Cộng đồng tài xế", icon: MessageSquare, path: "/drivers/hub" },
      { id: "find-station", title: "Trạm Tiếp Nhiên Liệu", subtitle: "Điểm dừng hỗ trợ", icon: MapPin, path: "/drivers/stations" }
    ]
  },
  langnghe: {
    tagline: "Văn hóa truyền thống",
    title: "Dệt thổ cẩm Chăm Mỹ Nghiệp",
    shortName: "LN",
    baseRoute: "/langnghe",
    phoneContact: "0905556667",
    donateInfo: "/langnghe/support",
    stats: [
      { id: "crafts", label: "Sản phẩm", value: "1.2k+", icon: Sparkles },
      { id: "artisans", label: "Nghệ nhân", value: "320+", icon: Users },
      { id: "villages", label: "Làng nghề", value: "12+", icon: Compass },
    ],
    actions: [
      {
        id: "add-product",
        title: "Đăng Sản Phẩm",
        subtitle: "Quảng bá thủ công",
        icon: PlusCircle,
        path: "/langnghe/create",
        isPrimary: true
      },
      {
        id: "visit-village",
        title: "Khám Phá Làng Nghề",
        subtitle: "Du lịch trải nghiệm",
        icon: MapPin,
        path: "/langnghe/explore"
      },
      {
        id: "connect-artisan",
        title: "Kết Nối Nghệ Nhân",
        subtitle: "Hợp tác sản xuất",
        icon: Users,
        path: "/langnghe/artisans"
      }
    ]
  }
};