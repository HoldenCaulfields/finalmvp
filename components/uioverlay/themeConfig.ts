// themeConfig.ts
import {
  Factory, HardDrive, Calendar, Briefcase, UserCheck, TrendingUp,
  Film, Video, Award, BookOpen, GraduationCap, Users,
  ShoppingBag, Truck, MessageSquare, Search, ClipboardList,
  Sparkles, Compass, MapPin, Car, LucideIcon,
  PlusCircle, 
} from "lucide-react";

export interface HudAction {
  id: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  path: string;
  isPrimary?: boolean;
  badge?: string;
}

export interface ThemeConfig {
  tagline: string;
  title: string;
  subtitle?: string;
  shortName: string;
  baseRoute: string;
  phoneContact: string;
  donateInfo: string;
  stats: Array<{ id: string; label: string; value: string; icon: LucideIcon; trend?: string }>;
  actions: Array<HudAction>;
  fallbackImages?: string[];
}

export const THEME_CONFIGS: Record<string, ThemeConfig> = {
  market: {
    tagline: "Ẩm thực Phan Rang",
    title: "Chợ Phan Rang",
    subtitle: "Khám phá ẩm thực địa phương",
    shortName: "PR",
    baseRoute: "/chophanrang",
    phoneContact: "0793784133",
    donateInfo: "/chophanrang/donate",
    stats: [
      { id: "stores", label: "Quán ăn", value: "850+", icon: Factory, trend: "+12%" },
      { id: "drivers", label: "Tài xế", value: "35+", icon: Car, trend: "+5%" },
      { id: "orders", label: "Đơn hàng", value: "1.2k+", icon: Calendar, trend: "+23%" },
    ],
    actions: [
      { id: "add-store", title: "Mở Quán", subtitle: "Tạo gian hàng", icon: PlusCircle, path: "/chophanrang", isPrimary: true, badge: "Hot" },
      { id: "reg-driver", title: "Đăng Ký Tài Xế", subtitle: "Chạy ship", icon: Truck, path: "/chophanrang" },
      { id: "food-service", title: "Đặt Món", subtitle: "Giao tận nơi", icon: ShoppingBag, path: "/chophanrang" }
    ],
    fallbackImages: [
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  jobs: {
    tagline: "Cơ hội việc làm",
    title: "Trung tâm Việc Làm",
    subtitle: "Kết nối ứng viên - nhà tuyển dụng",
    shortName: "JB",
    baseRoute: "/jobs",
    phoneContact: "0793784133",
    donateInfo: "/jobs/premium",
    stats: [
      { id: "jobs", label: "Việc mới", value: "120+", icon: Briefcase, trend: "+8%" },
      { id: "applied", label: "Ứng tuyển", value: "450+", icon: UserCheck, trend: "+15%" },
      { id: "growth", label: "Công ty", value: "45+", icon: TrendingUp, trend: "+3%" },
    ],
    actions: [
      { id: "post-job", title: "Tuyển Dụng", subtitle: "Đăng tin tuyển", icon: PlusCircle, path: "/jobs", isPrimary: true, badge: "Urgent" },
      { id: "create-cv", title: "Tạo CV", subtitle: "Ứng tuyển ngay", icon: UserCheck, path: "/jobs" },
      { id: "find-job", title: "Tìm Việc", subtitle: "Khám phá cơ hội", icon: Search, path: "/jobs" }
    ],
    fallbackImages: [
      "https://images.unsplash.com/photo-1515162305284-9c0f4c3f8e7a?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  cinema: {
    tagline: "Studio & Cinema",
    title: "Cộng Đồng Làm Phim",
    subtitle: "Nơi hội tụ những người làm phim",
    shortName: "CM",
    baseRoute: "/cimanet",
    phoneContact: "0793784133",
    donateInfo: "/cinema/fund",
    stats: [
      { id: "movies", label: "Dự án", value: "18+", icon: Film, trend: "+4%" },
      { id: "studios", label: "Studio", value: "12+", icon: Video, trend: "+2%" },
      { id: "creators", label: "Creator", value: "85+", icon: Award, trend: "+10%" },
    ],
    actions: [
      { id: "add-project", title: "Thêm Dự Án", subtitle: "Đăng ký phim mới", icon: PlusCircle, path: "/cimanet", isPrimary: true, badge: "New" },
      { id: "rent-equip", title: "Thuê TB", subtitle: "Máy quay, đèn", icon: Sparkles, path: "/cimanet" },
      { id: "find-crew", title: "Tìm Ê-kíp", subtitle: "Kết nối talent", icon: Compass, path: "/cimanet" }
    ],
    fallbackImages: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  study: {
    tagline: "Học tập & Trao đổi",
    title: "Góc Học Tập",
    subtitle: "Cùng nhau tiến bộ",
    shortName: "ST",
    baseRoute: "/caodangnghe",
    phoneContact: "0793784133",
    donateInfo: "/study/support",
    stats: [
      { id: "documents", label: "Tài liệu", value: "3.4k+", icon: BookOpen, trend: "+20%" },
      { id: "rooms", label: "Phòng học", value: "28+", icon: GraduationCap, trend: "+5%" },
      { id: "mentors", label: "Trợ giảng", value: "50+", icon: Users, trend: "+8%" },
    ],
    actions: [
      { id: "share-doc", title: "Đóng Góp TL", subtitle: "Tải lên giáo trình", icon: PlusCircle, path: "/caodangnghe", isPrimary: true },
      { id: "create-group", title: "Tạo Nhóm", subtitle: "Bạn đồng hành", icon: Users, path: "/caodangnghe" },
      { id: "find-place", title: "Địa Điểm", subtitle: "Thư viện, quán", icon: MapPin, path: "/caodangnghe" }
    ],
    fallbackImages: [
      "https://images.unsplash.com/photo-1494949649100-ec6c31a70b2d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517430816045-df4b7de1f5f7?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  startup: {
    tagline: "Khởi nghiệp & Đổi mới",
    title: "Hệ Sinh Thái Gọi Vốn",
    subtitle: "Ươm mầm ý tưởng đột phá",
    shortName: "SU",
    baseRoute: "https://anothermvp.vercel.app",
    phoneContact: "0793784133",
    donateInfo: "/startup/invest",
    stats: [
      { id: "ideas", label: "Ý tưởng", value: "3.4k+", icon: BookOpen, trend: "+15%" },
      { id: "teams", label: "Đội ngũ", value: "28+", icon: Users, trend: "+7%" },
      { id: "launched", label: "Đã ra mắt", value: "50+", icon: Award, trend: "+10%" },
    ],
    actions: [
      { id: "pitch-idea", title: "Nộp Ý Tưởng", subtitle: "Gọi vốn", icon: PlusCircle, path: "https://anothermvp.vercel.app", isPrimary: true, badge: "Hot" },
      { id: "find-co-founder", title: "Tìm Co-Founder", subtitle: "Ghép đội", icon: Users, path: "https://anothermvp.vercel.app" },
      { id: "book-mentor", title: "Gặp Mentor", subtitle: "Tư vấn", icon: MapPin, path: "https://anothermvp.vercel.app" }
    ],
    fallbackImages: [
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1557425493-08153496af3a?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  driver: {
    tagline: "Vận tải & Giao hàng",
    title: "Mạng Lưới Vận Chuyển",
    subtitle: "Kết nối tài xế - đối tác",
    shortName: "DR",
    baseRoute: "/chophanrang",
    phoneContact: "0793784133",
    donateInfo: "/drivers/tip",
    stats: [
      { id: "drivers", label: "Tài xế", value: "3.4k+", icon: Car, trend: "+11%" },
      { id: "orders", label: "Đơn hàng", value: "28+", icon: ClipboardList, trend: "+9%" },
      { id: "deliveries", label: "Đối tác", value: "50+", icon: Users, trend: "+4%" },
    ],
    actions: [
      { id: "create-order", title: "Tạo Đơn", subtitle: "Giao hàng", icon: PlusCircle, path: "/chophanrang", isPrimary: true, badge: "Express" },
      { id: "driver-chat", title: "Trạm Giao Lưu", subtitle: "Cộng đồng", icon: MessageSquare, path: "/chophanrang" },
      { id: "find-station", title: "Trạm Nhiên Liệu", subtitle: "Điểm dừng", icon: MapPin, path: "/chophanrang" }
    ],
    fallbackImages: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  langnghe: {
    tagline: "Văn hóa truyền thống",
    title: "Dệt thổ cẩm Chăm",
    subtitle: "Giữ gìn bản sắc dân tộc",
    shortName: "LN",
    baseRoute: "/langnghecham",
    phoneContact: "0793784133",
    donateInfo: "/langnghecham/support",
    stats: [
      { id: "crafts", label: "Sản phẩm", value: "1.2k+", icon: Sparkles, trend: "+6%" },
      { id: "artisans", label: "Nghệ nhân", value: "320+", icon: Users, trend: "+8%" },
      { id: "villages", label: "Làng nghề", value: "12+", icon: Compass, trend: "+2%" },
    ],
    actions: [
      { id: "add-product", title: "Đăng Sản Phẩm", subtitle: "Quảng bá", icon: PlusCircle, path: "/langnghecham", isPrimary: true, badge: "New" },
      { id: "visit-village", title: "Khám Phá", subtitle: "Du lịch trải nghiệm", icon: MapPin, path: "/langnghecham" },
      { id: "connect-artisan", title: "Kết Nối", subtitle: "Hợp tác", icon: Users, path: "/langnghecham" }
    ],
    fallbackImages: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop"
    ]
  }
};