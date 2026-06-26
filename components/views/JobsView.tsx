import React, { useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Code,
  MapPin,
  FileText,
  CheckCircle2,
  ChevronRight,
  User,
  Mail,
  Sparkles,
  Compass,
  Globe,
  Send,
  Loader2,
  Phone,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import DirectoryTabs from "../DirectoryTabs";

interface DevProject {
  id: string;
  name: string;
  role: string;
  location: string;
  specialty: string;
  stack: string[];
  description: string;
  projectTitle: string;
  projectUrl: string;
  services: string[];
  priceRange: string;
  contacts: Array<{
    label: string;
    value: string;
    type: "facebook" | "x" | "github" | "zalo" | "phone";
  }>;
}

interface Inquiry {
  id: string;
  name: string;
  projectIdea: string;
  contact: string;
  devName: string;
  time: string;
}

const DEV_SHOWCASES: DevProject[] = [
  {
    id: "dev_1",
    name: "Minh Quân",
    role: "Full-stack Developer",
    location: "Phan Rang, Ninh Thuận",
    specialty: "App + landing page + web app",
    stack: ["Next.js", "TypeScript", "Node.js", "Supabase"],
    description: "Tập trung làm sản phẩm có thiết kế đẹp, tốc độ nhanh và dễ quản trị cho doanh nghiệp nhỏ và cộng đồng.",
    projectTitle: "LovelyNet Community Map",
    projectUrl: "https://github.com/holdencaulfields/finalmvp",
    services: ["Landing page", "Web app", "Dashboard"],
    priceRange: "Từ 8 triệu",
    contacts: [
      { label: "FB", value: "https://facebook.com", type: "facebook" },
      { label: "GitHub", value: "https://github.com", type: "github" },
      { label: "Zalo", value: "https://zalo.me/0900000000", type: "zalo" },
      { label: "SĐT", value: "tel:+84900000000", type: "phone" },
    ],
  },
  {
    id: "dev_2",
    name: "Lâm Hải",
    role: "UI/UX & Front-end",
    location: "Remote",
    specialty: "Thiết kế trải nghiệm và giao diện",
    stack: ["React", "Tailwind", "Framer Motion", "Figma"],
    description: "Rất giỏi biến ý tưởng thành landing page mượt, hiện đại và phù hợp với thương hiệu.",
    projectTitle: "Brand Story Landing Page",
    projectUrl: "https://example.com",
    services: ["Landing page", "UI kit", "Brand site"],
    priceRange: "Từ 5 triệu",
    contacts: [
      { label: "X", value: "https://x.com", type: "x" },
      { label: "GitHub", value: "https://github.com", type: "github" },
      { label: "SĐT", value: "tel:+84911111111", type: "phone" },
    ],
  },
  {
    id: "dev_3",
    name: "Đức An",
    role: "Mobile & Backend",
    location: "Đà Nẵng",
    specialty: "App mobile và hệ thống nội bộ",
    stack: ["Flutter", "Firebase", "Node.js", "MongoDB"],
    description: "Có kinh nghiệm làm app cho đặt hàng, quản lý nội bộ và nền tảng cộng đồng nhỏ.",
    projectTitle: "Cộng đồng đặt dịch vụ",
    projectUrl: "https://github.com",
    services: ["Mobile app", "Admin panel", "API"],
    priceRange: "Từ 12 triệu",
    contacts: [
      { label: "FB", value: "https://facebook.com", type: "facebook" },
      { label: "GitHub", value: "https://github.com", type: "github" },
      { label: "Zalo", value: "https://zalo.me/0902222222", type: "zalo" },
    ],
  },
];

const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: "inq_1",
    name: "Hạnh",
    projectIdea: "Cần làm landing page cho quán cafe mới mở",
    contact: "zalo.me/0903333333",
    devName: "Lâm Hải",
    time: "10 phút trước",
  },
  {
    id: "inq_2",
    name: "Tùng",
    projectIdea: "Muốn thuê dev làm web app quản lý đơn hàng",
    contact: "0904444444",
    devName: "Minh Quân",
    time: "45 phút trước",
  },
];

export default function JobsView() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);

  const [developerName, setDeveloperName] = useState("");
  const [email, setEmail] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [serviceType, setServiceType] = useState("Landing page");
  const [contactLink, setContactLink] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);

  const filteredDevelopers = useMemo(() => {
    return DEV_SHOWCASES.filter((dev) => {
      const matchesSpecialty = selectedSpecialty === "all" || dev.services.some((service) => service.toLowerCase().includes(selectedSpecialty.toLowerCase()));
      const matchesSearch =
        dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.stack.some((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSpecialty && matchesSearch;
    });
  }, [searchQuery, selectedSpecialty]);

  const handleSubmitProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!developerName || !email || !projectTitle) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newInquiry: Inquiry = {
        id: `inq_${Date.now()}`,
        name: developerName,
        projectIdea: projectTitle,
        contact: contactLink || email,
        devName: "Bạn",
        time: "Vừa xong",
      };

      setInquiries([newInquiry, ...inquiries]);
      setIsSubmitting(false);
      setShowSuccess(true);
      setDeveloperName("");
      setEmail("");
      setProjectTitle("");
      setProjectUrl("");
      setContactLink("");
      setNote("");
      setServiceType("Landing page");
      setTimeout(() => setShowSuccess(false), 2500);
    }, 1200);
  };

  const getContactHref = (contact: DevProject["contacts"][number]) => {
    if (contact.type === "phone") return contact.value;
    if (contact.type === "zalo") return contact.value;
    return contact.value;
  };

  return (
    <div className="pt-20 lg:pt-28 pb-32 lg:pb-24 px-3 md:px-6 w-full max-w-7xl mx-auto overflow-y-auto h-full max-h-[100vh]">
      <div className="lg:hidden">
        <DirectoryTabs />
      </div>

      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-[10px] font-black tracking-[0.25em] text-indigo-600 uppercase flex items-center justify-center gap-2 mb-2">
          <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "10s" }} />
          Developer Showcase
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight uppercase">
          Nơi dev show dự án & users thuê làm app
        </h2>
        <p className="text-xs md:text-sm text-zinc-500 font-medium mt-2">
          Mỗi developer có thể giới thiệu bản thân, dự án đã làm, link demo và cách liên hệ. Nếu bạn cần landing page, web app hay app mobile, chỉ cần chọn một dev và nhắn trực tiếp qua FB, X, GitHub, Zalo hoặc số điện thoại.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-6xl mx-auto">
        <div className="lg:col-span-4 bg-white border border-zinc-200/80 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-black text-zinc-950 uppercase tracking-tight">Đăng dự án của bạn</span>
          </div>

          <form ref={formRef} onSubmit={handleSubmitProject} className="space-y-4">
            <div>
              <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block mb-1.5">
                Tên bạn / tên dev *
              </label>
              <div className="flex items-center gap-2 p-2 px-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus-within:bg-white focus-within:border-zinc-900 transition-colors">
                <User className="w-4 h-4 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={developerName}
                  onChange={(e) => setDeveloperName(e.target.value)}
                  className="w-full bg-transparent border-none text-xs outline-none py-1.5 focus:ring-0 text-zinc-850 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block mb-1.5">
                Email / Zalo / contact *
              </label>
              <div className="flex items-center gap-2 p-2 px-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus-within:bg-white focus-within:border-zinc-900 transition-colors">
                <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="name@example.com hoặc zalo/090..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-none text-xs outline-none py-1.5 focus:ring-0 text-zinc-850 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block mb-1.5">
                Tên dự án / sản phẩm
              </label>
              <input
                type="text"
                placeholder="Ví dụ: App đặt lịch spa"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-bold text-zinc-800 outline-none focus:border-zinc-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block mb-1.5">
                Link demo / repo / portfolio
              </label>
              <input
                type="text"
                placeholder="https://github.com/yourname"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                className="w-full p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-bold text-zinc-800 outline-none focus:border-zinc-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block mb-1.5">
                Loại dịch vụ
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full appearance-none p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-black text-zinc-800 outline-none focus:border-zinc-900 focus:bg-white"
              >
                <option>Landing page</option>
                <option>Web app</option>
                <option>Mobile app</option>
                <option>Dashboard / admin</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block mb-1.5">
                Link social / số điện thoại
              </label>
              <input
                type="text"
                placeholder="fb.com/yourname hoặc 090..."
                value={contactLink}
                onChange={(e) => setContactLink(e.target.value)}
                className="w-full p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-bold text-zinc-800 outline-none focus:border-zinc-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block mb-1.5">
                Ghi chú ngắn
              </label>
              <textarea
                rows={3}
                placeholder="Mô tả ngắn về dự án hoặc nhu cầu thuê dev"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-bold text-zinc-800 outline-none focus:border-zinc-900 focus:bg-white"
              />
            </div>

            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-emerald-500 text-white rounded-2xl p-3 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 animate-bounce" />
                  Đã đăng dự án / nhu cầu thành công!
                </motion.div>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang đăng...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Đăng ngay</span>
                    </>
                  )}
                </button>
              )}
            </AnimatePresence>
          </form>

          <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 text-[10px] text-zinc-400 font-semibold leading-relaxed">
            💡 Người dùng có thể xem dự án, nhấn vào link demo và liên hệ trực tiếp qua các kênh social hoặc số điện thoại. Đây là nền tảng nối dev và khách hàng một cách nhẹ nhàng.
          </div>
        </div>

        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 p-1.5 px-3 bg-zinc-50 border border-zinc-100 rounded-xl w-full sm:max-w-xs">
              <Code className="w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Tìm tên dev, stack, dự án..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-[11px] outline-none py-0.5 text-zinc-850 font-bold"
              />
            </div>

            <div className="flex gap-1 flex-wrap">
              {[
                { id: "all", label: "Tất cả" },
                { id: "landing", label: "🌐 Landing" },
                { id: "app", label: "📱 App" },
                { id: "web", label: "🧩 Web app" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedSpecialty(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer whitespace-nowrap ${
                    selectedSpecialty === item.id
                      ? "bg-zinc-950 text-white shadow-sm"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200/50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredDevelopers.map((dev, index) => (
              <motion.div
                key={dev.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, type: "spring" }}
                className="bg-white border border-zinc-200/80 hover:border-zinc-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider">
                      <Briefcase className="w-3 h-3 inline mr-1" /> {dev.role}
                    </span>
                    <h3 className="text-sm md:text-base font-black text-zinc-900 leading-snug">
                      {dev.name} · {dev.specialty}
                    </h3>
                    <p className="text-xs text-zinc-500 font-semibold leading-relaxed">
                      {dev.description}
                    </p>
                  </div>

                  <span className="text-[11px] font-black text-rose-500 bg-rose-50 border border-rose-100 px-3 py-1 rounded-xl self-start whitespace-nowrap">
                    {dev.priceRange}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {dev.stack.map((item, key) => (
                    <span key={key} className="px-2.5 py-1 bg-zinc-50 border border-zinc-100 rounded-lg text-[9px] font-mono font-bold text-zinc-600">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-3 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-black text-zinc-800">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{dev.projectTitle}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {dev.services.map((service) => (
                      <span key={service} className="text-[10px] font-bold text-zinc-600 bg-white border border-zinc-200 px-2.5 py-1 rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-zinc-100 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] text-zinc-400 font-bold uppercase tracking-wide">
                  <div className="flex flex-wrap gap-4">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-rose-500" /> {dev.location}</span>
                    <span className="text-zinc-600 font-black">⚙️ Có thể làm dự án thực tế</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <a
                      href={dev.projectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-900 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                    >
                      Xem demo <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {dev.contacts.map((contact) => (
                    <a
                      key={`${dev.id}-${contact.label}`}
                      href={getContactHref(contact)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-1.5 text-[10px] font-black text-zinc-700 hover:border-indigo-300 hover:text-indigo-600 transition-all"
                    >
                      {contact.type === "phone" ? <Phone className="w-3 h-3" /> : contact.type === "zalo" ? <MessageCircle className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                      <span>{contact.label}</span>
                    </a>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-3 bg-white border border-zinc-200/80 rounded-3xl p-5 shadow-sm">
            <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider">
              📬 Yêu cầu thuê dev gần đây
            </h4>

            <div className="space-y-2.5">
              {inquiries.map((item) => (
                <div key={item.id} className="p-3 bg-zinc-50 border border-zinc-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-black text-zinc-800 leading-none">{item.name}</h5>
                    <p className="text-[10px] text-zinc-500 font-medium mt-1">
                      {item.projectIdea}
                    </p>
                    <span className="text-[9px] font-extrabold text-zinc-500 mt-1 block">
                      Liên hệ: {item.contact}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <span className="text-[9px] text-zinc-400 font-mono">{item.time}</span>
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      {item.devName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
