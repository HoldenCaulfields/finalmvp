import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  Code, 
  MapPin, 
  DollarSign, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  User, 
  Mail, 
  Sparkles, 
  Compass, 
  Globe, 
  Send,
  Loader2
} from "lucide-react";
import DirectoryTabs from "../DirectoryTabs";

interface JobPost {
  id: string;
  role: string;
  company: string;
  level: "intern" | "junior" | "senior" | "freelance";
  stack: string[];
  salary: string;
  location: string;
  type: string;
  desc: string;
}

const NATIVE_JOBS: JobPost[] = [
  {
    id: "job_1",
    role: "Full-Stack React & Node.js Developer",
    company: "LovelyNet TechSolutions LLC",
    level: "senior",
    stack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    salary: "18M - 26M VND",
    location: "Trụ sở chính, Phan Rang-Th Tháp Chàm (Hoặc Remote)",
    type: "Toàn thời gian (Full-time)",
    desc: "Chịu trách nhiệm thiết kế, tối ưu hóa toàn bộ cổng thông tin bản đồ tỉnh & cộng đồng kết nối văn hóa du lịch LovelyNet."
  },
  {
    id: "job_2",
    role: "Lập trình viên Flutter (Mobile Apps Developer)",
    company: "Ninh Thuan Digital Hub",
    level: "junior",
    stack: ["Flutter", "Dart", "Firebase", "RESTful API"],
    salary: "12M - 16M VND",
    location: "Văn phòng StartHub, Phan Rang",
    type: "Toàn thời gian (Full-time)",
    desc: "Xây dựng các sản phẩm ứng dụng di động cho thị trường nông nghiệp sạch, gọi xe, đặt tour du lịch bản địa."
  },
  {
    id: "job_3",
    role: "UI/UX Designer & Brand Specialist",
    company: "CinaLabs Sáng Tạo Việt",
    level: "junior",
    stack: ["Figma", "Photoshop", "Illustrator", "Prototyping"],
    salary: "9M - 14M VND",
    location: "Phố Đi Bộ Phan Rang",
    type: "Linh hoạt (Hybrid)",
    desc: "Thiết kế các bộ nhận diện thương hiệu cho gốm cổ cát, vải dệt thủ công thổ cẩm mỹ nghệ Chăm và các sản phẩm vang vương quốc."
  },
  {
    id: "job_4",
    role: "Senior Laravel & MySQL Backend Engineer",
    company: "South Coast Booking Agency",
    level: "senior",
    stack: ["PHP", "Laravel", "MySQL", "Docker", "AWS"],
    salary: "22M - 30M VND",
    location: "Làm việc từ xa (Remote 100%)",
    type: "Hợp đồng (Contract)",
    desc: "Vận hành hạ tầng máy chủ cho website đặt phòng khách sạn, resort nghỉ dưỡng cao cấp xung quanh vịnh Vĩnh Hy."
  }
];

interface Applicant {
  id: string;
  name: string;
  email: string;
  roleApplied: string;
  portfolio: string;
  status: "pending" | "approved";
  time: string;
}

export default function JobsView() {
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Local state for CV Submit Form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [appliedRole, setAppliedRole] = useState(NATIVE_JOBS[0].role);
  const [portfolioLink, setPortfolioLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Core applicants list
  const [applicants, setApplicants] = useState<Applicant[]>([
    {
      id: "app_1",
      name: "Trần Tuấn Tú",
      email: "tuantu.dev@gmail.com",
      roleApplied: "Full-Stack React & Node.js Developer",
      portfolio: "github.com/tuantudev",
      status: "approved",
      time: "10 phút trước"
    },
    {
      id: "app_2",
      name: "Lâm Thị Bích Đào",
      email: "bichdao.arts@outloo.com",
      roleApplied: "UI/UX Designer & Brand Specialist",
      portfolio: "behance.net/daoart_pr",
      status: "pending",
      time: "2 giờ trước"
    }
  ]);

  const filteredJobs = NATIVE_JOBS.filter(job => {
    const matchesLevel = selectedLevel === "all" || job.level === selectedLevel;
    const matchesSearch = 
      job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.stack.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  const handleApplyCV = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newApplicant: Applicant = {
        id: `app_${Date.now()}`,
        name: fullName,
        email,
        roleApplied: appliedRole,
        portfolio: portfolioLink || "Chưa cung cấp",
        status: "pending",
        time: "Vừa xong"
      };

      setApplicants([newApplicant, ...applicants]);
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset fields
      setFullName("");
      setEmail("");
      setPortfolioLink("");

      setTimeout(() => setShowSuccess(false), 2500);
    }, 1800);
  };

  return (
    <div className="pt-20 lg:pt-28 pb-32 lg:pb-24 px-3 md:px-6 w-full max-w-7xl mx-auto overflow-y-auto h-full max-h-[100vh]">
      
      {/* Mobile-friendly Sub-bar switcher */}
      <div className="lg:hidden">
        <DirectoryTabs />
      </div>

      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-[10px] font-black tracking-[0.25em] text-indigo-600 uppercase flex items-center justify-center gap-2 mb-2">
          <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "10s" }} />
          Kết nối Dev/IT
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight uppercase">
          Cổng Cơ Hội Việc Làm IT & Dev
        </h2>
        <p className="text-xs md:text-sm text-zinc-500 font-medium mt-2">
          Haizz, thật sự ý tưởng của tôi là kết nối dân devs lại kiểu như Grab/ Xanh SM cho dân IT để kiếm tiền, kiếm việc làm, đưa sản phẩm công nghệ thành hiện thực chứ không còn là bản nháp nữa, ý tưởng là thế còn thực tế thì haizz kéo dài.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-6xl mx-auto">
        
        {/* LEFT COLUMN: APPLICATION CV SUBMIT ZONE (Lg: 4cols) */}
        <div className="lg:col-span-4 bg-white border border-zinc-200/80 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-black text-zinc-950 uppercase tracking-tight">Nộp CV Tốc Hành</span>
          </div>

          <form onSubmit={handleApplyCV} className="space-y-4">
            <div>
              <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block mb-1.5">
                Họ và tên của bạn *
              </label>
              <div className="flex items-center gap-2 p-2 px-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus-within:bg-white focus-within:border-zinc-900 transition-colors">
                <User className="w-4 h-4 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-transparent border-none text-xs outline-none py-1.5 focus:ring-0 text-zinc-850 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block mb-1.5">
                Hộp thư điện tử (Email) *
              </label>
              <div className="flex items-center gap-2 p-2 px-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus-within:bg-white focus-within:border-zinc-900 transition-colors">
                <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-none text-xs outline-none py-1.5 focus:ring-0 text-zinc-850 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block mb-1.5">
                Ứng tuyển vị trí nào?
              </label>
              <select
                value={appliedRole}
                onChange={(e) => setAppliedRole(e.target.value)}
                className="w-full appearance-none p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-black text-zinc-800 outline-none focus:border-zinc-900 focus:bg-white"
              >
                {NATIVE_JOBS.map(job => (
                  <option key={job.id} value={job.role}>{job.role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block mb-1.5">
                Đường dẫn Portfolio / LinkedIn / GitHub (Nếu có)
              </label>
              <input
                type="text"
                placeholder="github.com/yourusername"
                value={portfolioLink}
                onChange={(e) => setPortfolioLink(e.target.value)}
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
                  Đã ghi nhận ứng tuyển của bạn!
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
                      <span>Đang nén truyền hồ sơ...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi CV Tốc Hành</span>
                    </>
                  )}
                </button>
              )}
            </AnimatePresence>

          </form>

          {/* Guidelines */}
          <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 text-[10px] text-zinc-400 font-semibold leading-relaxed">
            💡 LovelyNet là cầu nối công nghệ phi chính phủ toàn phần. Bản quyền dữ liệu CV cam kết bảo mật 100%, tự động kết nối trực tiếp đến zalo/email nhà tuyển dụng.
          </div>
        </div>

        {/* RIGHT COLUMN: RECRUITMENT WALL (Lg: 8cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Filters Bar */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 p-1.5 px-3 bg-zinc-50 border border-zinc-100 rounded-xl w-full sm:max-w-xs">
              <Code className="w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Tìm kỹ năng: Figma, React..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-[11px] outline-none py-0.5 text-zinc-850 font-bold"
              />
            </div>

            <div className="flex gap-1">
              {[
                { id: "all", label: "Tất cả" },
                { id: "intern", label: "🌱 Thực tập" },
                { id: "junior", label: "💻 Junior" },
                { id: "senior", label: "🚀 Senior" }
              ].map(level => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer whitespace-nowrap ${
                    selectedLevel === level.id
                      ? "bg-zinc-950 text-white shadow-sm"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200/50"
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {filteredJobs.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08, type: "spring" }}
                className="bg-white border border-zinc-200/80 hover:border-zinc-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider">
                      🏢 {job.company}
                    </span>
                    <h3 className="text-sm md:text-base font-black text-zinc-900 leading-snug">
                      {job.role}
                    </h3>
                    <p className="text-xs text-zinc-500 font-semibold leading-relaxed">
                      {job.desc}
                    </p>
                  </div>

                  <span className="text-[11px] font-black text-rose-500 bg-rose-50 border border-rose-100 px-3 py-1 rounded-xl self-start whitespace-nowrap">
                    💰 {job.salary}
                  </span>
                </div>

                {/* Stacks */}
                <div className="flex flex-wrap gap-1.5">
                  {job.stack.map((item, key) => (
                    <span 
                      key={key} 
                      className="px-2.5 py-1 bg-zinc-50 border border-zinc-100 rounded-lg text-[9px] font-mono font-bold text-zinc-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Footer details */}
                <div className="border-t border-zinc-100 pt-3 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-zinc-400 gap-2 font-bold uppercase tracking-wide">
                  <div className="flex flex-wrap gap-4">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-rose-500" /> {job.location}</span>
                    <span className="text-zinc-600 font-black">⚙️ {job.type}</span>
                  </div>
                  
                  <button
                    onClick={() => {
                      setAppliedRole(job.role);
                      const applyForm = document.querySelector("form");
                      applyForm?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-zinc-900 hover:text-rose-600 flex items-center gap-1 cursor-pointer self-end sm:self-auto shrink-0"
                  >
                    Ứng tuyển ngay <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ACTIVE RECENT APPLICANTS FEED (Dữ liệu phản hồi trạng thái ứng tuyển) */}
          <div className="space-y-3 bg-white border border-zinc-200/80 rounded-3xl p-5 shadow-sm">
            <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider">
              👥 Người Ứng Tuyển Gần Đây (Trực Tuyến)
            </h4>
            
            <div className="space-y-2.5">
              {applicants.map((app) => (
                <div 
                  key={app.id}
                  className="p-3 bg-zinc-50 border border-zinc-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-zinc-200 rounded-full flex items-center justify-center text-zinc-600 font-bold text-xs">
                      {app.name.charAt(0)}
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-zinc-800 leading-none">{app.name}</h5>
                      <span className="text-[10px] text-zinc-400 font-medium">{app.email}</span>
                      <p className="text-[9px] font-extrabold text-zinc-500 mt-1">
                        Ứng tuyển: <span className="text-indigo-600 font-black">{app.roleApplied}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <span className="text-[9px] text-zinc-400 font-mono">{app.time}</span>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md
                      ${app.status === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"}`}
                    >
                      {app.status === "approved" ? "✓ Đã duyệt hồ sơ" : "⏳ Chờ duyệt"}
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
