import {
  Factory, HardDrive, Calendar, Briefcase, UserCheck, TrendingUp,
  Film, Video, Award, BookOpen, GraduationCap, Users,
  ShoppingBag, Truck, MessageSquare, Search, ClipboardList, 
  Tv, Sparkles, Compass, MapPin, LucideIcon
} from "lucide-react";

export interface ThemeConfig {
  tagline: string;
  title: string;
  shortName: string;
  baseRoute: string;
  themeClasses: {
    badgeBg: string;
    badgeText: string;
    badgePulse: string;
    borderAccent: string;
    hoverBorder: string;
    hoverText: string;
    avatarBg: string;
    iconBoxBg: string;
    iconBoxText: string;
    primaryBtnBg: string;
    primaryBtnHover: string;
    pulseColor: string;
  };
  stats: Array<{ id: string; label: string; value: string; icon: LucideIcon }>;
  quickServices: Array<{ id: string; title: string; icon: LucideIcon; color: string; path: string }>;
}

export const THEME_CONFIGS: Record<string, ThemeConfig> = {
  market: {
    tagline: "Chợ Phan Rang",
    title: "Tạo Quán Ăn - Tìm Tài Xế",
    shortName: "PR",
    baseRoute: "/chophanrang",
    themeClasses: {
      badgeBg: "bg-rose-500",
      badgeText: "text-rose-500",
      badgePulse: "bg-rose-500",
      borderAccent: "border-rose-100",
      hoverBorder: "hover:border-rose-400",
      hoverText: "group-hover:text-rose-600",
      avatarBg: "bg-rose-600",
      iconBoxBg: "bg-rose-50",
      iconBoxText: "text-rose-500",
      primaryBtnBg: "bg-slate-900",
      primaryBtnHover: "hover:bg-rose-600",
      pulseColor: "text-rose-400",
    },
    stats: [
      { id: "stores", label: "Quán ăn", value: "850+", icon: Factory },
      { id: "drivers", label: "Tài xế", value: "35+", icon: HardDrive },
      { id: "orders", label: "Đơn hàng", value: "1.2k+", icon: Calendar },
    ],
    quickServices: [
      { id: "food", title: "Đặt Đồ Ăn", icon: ShoppingBag, color: "bg-rose-500", path: "/caodangnghe/food" },
      { id: "driver", title: "Tìm Tài Xế", icon: Truck, color: "bg-slate-900", path: "/caodangnghe/drivers" },
      { id: "market", title: "Chợ Mua Bán", icon: MessageSquare, color: "bg-rose-600", path: "/caodangnghe/market" }
    ]
  },
  jobs: {
    tagline: "Trung tâm Việc Làm",
    title: "Tuyển Dụng Cấp Tốc - Tìm Việc",
    shortName: "JB",
    baseRoute: "/jobs",
    themeClasses: {
      badgeBg: "bg-blue-500",
      badgeText: "text-blue-500",
      badgePulse: "bg-blue-500",
      borderAccent: "border-blue-100",
      hoverBorder: "hover:border-blue-400",
      hoverText: "group-hover:text-blue-600",
      avatarBg: "bg-blue-600",
      iconBoxBg: "bg-blue-50",
      iconBoxText: "text-blue-500",
      primaryBtnBg: "bg-slate-900",
      primaryBtnHover: "hover:bg-blue-600",
      pulseColor: "text-blue-400",
    },
    stats: [
      { id: "jobs", label: "Việc làm mới", value: "120+", icon: Briefcase },
      { id: "applied", label: "Ứng tuyển", value: "450+", icon: UserCheck },
      { id: "growth", label: "Công ty", value: "45+", icon: TrendingUp },
    ],
    quickServices: [
      { id: "find-job", title: "Tìm Việc Làm", icon: Search, color: "bg-blue-500", path: "/jobs/explore" },
      { id: "post-job", title: "Tuyển Nhân Viên", icon: ClipboardList, color: "bg-slate-900", path: "/jobs/post" },
      { id: "cv", title: "Tạo Hồ Sơ", icon: UserCheck, color: "bg-blue-600", path: "/jobs/cv" }
    ]
  },
  cinema: {
    tagline: "Studio & Cinema",
    title: "Phim Ảnh - Thuê Thiết Bị - Ê-kíp",
    shortName: "CM",
    baseRoute: "/cimanet",
    themeClasses: {
      badgeBg: "bg-amber-500",
      badgeText: "text-amber-500",
      badgePulse: "bg-amber-500",
      borderAccent: "border-amber-100",
      hoverBorder: "hover:border-amber-400",
      hoverText: "group-hover:text-amber-600",
      avatarBg: "bg-amber-500",
      iconBoxBg: "bg-amber-50",
      iconBoxText: "text-amber-600",
      primaryBtnBg: "bg-slate-900",
      primaryBtnHover: "hover:bg-amber-500",
      pulseColor: "text-amber-400",
    },
    stats: [
      { id: "movies", label: "Dự án phim", value: "18+", icon: Film },
      { id: "studios", label: "Phòng studio", value: "12+", icon: Video },
      { id: "creators", label: "Creator", value: "85+", icon: Award },
    ],
    quickServices: [
      { id: "projects", title: "Dự Án Mới", icon: Tv, color: "bg-amber-500", path: "/cinema/projects" },
      { id: "equip", title: "Thuê Thiết Bị", icon: Sparkles, color: "bg-slate-900", path: "/cinema/rent" },
      { id: "creators", title: "Tìm Ê-kíp", icon: Compass, color: "bg-amber-600", path: "/cinema/creators" }
    ]
  },
  study: {
    tagline: "Cộng Đồng Học Tập",
    title: "Góc Học Tập - Trao Đổi Kiến Thức",
    shortName: "ST",
    baseRoute: "/caodangnghe",
    themeClasses: {
      badgeBg: "bg-emerald-500",
      badgeText: "text-emerald-500",
      badgePulse: "bg-emerald-500",
      borderAccent: "border-emerald-100",
      hoverBorder: "hover:border-emerald-400",
      hoverText: "group-hover:text-emerald-600",
      avatarBg: "bg-emerald-600",
      iconBoxBg: "bg-emerald-50",
      iconBoxText: "text-emerald-500",
      primaryBtnBg: "bg-slate-900",
      primaryBtnHover: "hover:bg-emerald-600",
      pulseColor: "text-emerald-400",
    },
    stats: [
      { id: "documents", label: "Tài liệu", value: "3.4k+", icon: BookOpen },
      { id: "rooms", label: "Phòng tự học", value: "28+", icon: GraduationCap },
      { id: "mentors", label: "Trợ giảng", value: "50+", icon: Users },
    ],
    quickServices: [
      { id: "docs", title: "Tải Tài Liệu", icon: BookOpen, color: "bg-emerald-500", path: "/study/docs" },
      { id: "team", title: "Học Nhóm", icon: Users, color: "bg-slate-900", path: "/study/groups" },
      { id: "location", title: "Địa Điểm Học", icon: MapPin, color: "bg-emerald-600", path: "/study/places" }
    ]
  },
  startup: {
    tagline: "Tuổi Trẻ & Khởi Nghiệp",
    title: "Kết Nối Startup - Tìm Mentor - Gọi Vốn",
    shortName: "SU",
    baseRoute: "/startup",
    themeClasses: {
      badgeBg: "bg-orange-500",
      badgeText: "text-orange-500",
      badgePulse: "bg-orange-500",
      borderAccent: "border-orange-100",
      hoverBorder: "hover:border-orange-400",
      hoverText: "group-hover:text-orange-600",
      avatarBg: "bg-orange-500",
      iconBoxBg: "bg-orange-50",
      iconBoxText: "text-orange-500",
      primaryBtnBg: "bg-slate-900",
      primaryBtnHover: "hover:bg-orange-500",
      pulseColor: "text-orange-400",
    },
    stats: [
      { id: "ideas", label: "Ý tưởng", value: "3.4k+", icon: BookOpen },
      { id: "teams", label: "Đội ngũ", value: "28+", icon: GraduationCap },
      { id: "launched", label: "Startup đã ra mắt", value: "50+", icon: Users },
    ],
    quickServices: [
      { id: "docs", title: "Tải Tài Liệu", icon: BookOpen, color: "bg-orange-500", path: "/startup/docs" },
      { id: "team", title: "Học Nhóm", icon: Users, color: "bg-slate-900", path: "/startup/groups" },
      { id: "location", title: "Địa Điểm Học", icon: MapPin, color: "bg-orange-600", path: "/startup/places" }
    ]
  }
};