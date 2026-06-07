import { useState } from "react";
import { Cpu, BookOpen, Volume2, RotateCcw, Check, Sparkles, Languages, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Resistor Colors definition
interface ResistorColor {
  name: string;
  colorClass: string; // Tailwind class
  hex: string;
  value: number;
}

const DIGIT_COLORS: ResistorColor[] = [
  { name: "Đen (Black)", colorClass: "bg-black", hex: "#000000", value: 0 },
  { name: "Nâu (Brown)", colorClass: "bg-amber-900", hex: "#8B4513", value: 1 },
  { name: "Đỏ (Red)", colorClass: "bg-red-600", hex: "#DC2626", value: 2 },
  { name: "Cam (Orange)", colorClass: "bg-orange-500", hex: "#F97316", value: 3 },
  { name: "Vàng (Yellow)", colorClass: "bg-yellow-400", hex: "#FACC15", value: 4 },
  { name: "Lục (Green)", colorClass: "bg-green-600", hex: "#16A34A", value: 5 },
  { name: "Lam (Blue)", colorClass: "bg-blue-600", hex: "#2563EB", value: 6 },
  { name: "Tím (Violet)", colorClass: "bg-purple-600", hex: "#9333EA", value: 7 },
  { name: "Xám (Gray)", colorClass: "bg-neutral-400", hex: "#9CA3AF", value: 8 },
  { name: "Trắng (White)", colorClass: "bg-white border border-neutral-300", hex: "#FFFFFF", value: 9 },
];

const MULTIPLIER_COLORS = [
  { name: "Đen (x1 Ω)", colorClass: "bg-black", hex: "#000000", value: 1 },
  { name: "Nâu (x10 Ω)", colorClass: "bg-amber-900", hex: "#8B4513", value: 10 },
  { name: "Đỏ (x100 Ω)", colorClass: "bg-red-600", hex: "#DC2626", value: 100 },
  { name: "Cam (x1k Ω)", colorClass: "bg-orange-500", hex: "#F97316", value: 1000 },
  { name: "Vàng (x10k Ω)", colorClass: "bg-yellow-400", hex: "#FACC15", value: 10000 },
  { name: "Lục (x100k Ω)", colorClass: "bg-green-600", hex: "#16A34A", value: 100000 },
  { name: "Lam (x1M Ω)", colorClass: "bg-blue-600", hex: "#2563EB", value: 1000000 },
  { name: "Tím (x10M Ω)", colorClass: "bg-purple-600", hex: "#9333EA", value: 10000000 },
  { name: "Nhũ Vàng (x0.1 Ω)", colorClass: "bg-amber-400", hex: "#FBBF24", value: 0.1 },
  { name: "Nhũ Bạc (x0.01 Ω)", colorClass: "bg-stone-300", hex: "#D1D5DB", value: 0.01 },
];

const TOLERANCE_COLORS = [
  { name: "Nâu (±1%)", colorClass: "bg-amber-900", hex: "#8B4513", text: "±1%" },
  { name: "Đỏ (±2%)", colorClass: "bg-red-600", hex: "#DC2626", text: "±2%" },
  { name: "Lục (±0.5%)", colorClass: "bg-green-600", hex: "#16A34A", text: "±0.5%" },
  { name: "Lam (±0.25%)", colorClass: "bg-blue-600", hex: "#2563EB", text: "±0.25%" },
  { name: "Tím (±0.1%)", colorClass: "bg-purple-600", hex: "#9333EA", text: "±0.1%" },
  { name: "Nhũ Vàng (±5%)", colorClass: "bg-amber-400", hex: "#FBBF24", text: "±5%" },
  { name: "Nhũ Bạc (±10%)", colorClass: "bg-stone-300", hex: "#D1D5DB", text: "±10%" },
];

// Electronic Components guide
interface ComponentItem {
  id: string;
  name: string;
  englishName: string;
  symbol: string;
  icon: string;
  desc: string;
  functionText: string;
  fact: string;
  application: string;
}

const ELECTRONIC_COMPONENTS: ComponentItem[] = [
  {
    id: "resistor",
    name: "Điện trở",
    englishName: "Resistor",
    symbol: "R",
    icon: "🔌",
    desc: "Linh kiện điện tử thụ động dùng để cản trở dòng điện đi qua mạch điện, tạo ra một sự sụt áp giữa hai đầu của nó.",
    functionText: "Phân dòng, hạn chế cường độ dòng điện đi qua tải, phân chia điện áp (cầu phân áp) hoặc phối hợp trở kháng.",
    fact: "Thường chế tạo từ hợp chất carbon hoặc kim loại mỏng cuộn quanh lõi gốm.",
    application: "Mạch cản dòng định thiên cho transistor, hạn dòng cấp cho đèn LED báo hiệu để không cháy bóng."
  },
  {
    id: "capacitor",
    name: "Tụ điện",
    englishName: "Capacitor",
    symbol: "C",
    icon: "🔋",
    desc: "Linh kiện tích lũy năng lượng dưới dạng điện trường bằng cách lưu trữ điện tích trái dấu trên hai bề mặt dẫn điện ngăn cách bởi điện môi.",
    functionText: "Chặn dòng điện một chiều (DC) và cho dòng xoay chiều (AC) đi qua; lọc nguồn bằng cách làm phẳng điện áp gợn sóng.",
    fact: "Điện dung đo bằng đơn vị Farad (F). Trong mạch thực tế hay dùng microFarad (μF) hoặc nanoFarad (nF).",
    application: "Tụ điện lọc nguồn trong các Adapter điện thoại, mạch ghép tín hiệu âm thanh giữa các tầng khuếch đại."
  },
  {
    id: "transistor",
    name: "Transistor (Bóng bán dẫn)",
    englishName: "Bipolar Junction Transistor",
    symbol: "Q / T",
    icon: "🖲️",
    desc: "Linh kiện bán dẫn có 3 cực: Base (B), Collector (C), và Emitter (E). Có hai cấu trúc phổ biến là NPN và PNP.",
    functionText: "Dùng để khuếch đại dòng điện xoay chiều/một chiều nhỏ thành lớn hơn, hoặc đóng vai trò như một công tắc điện tử đóng ngắt mạch tốc độ cao.",
    fact: "Là nền tảng cốt lõi của toàn bộ cuộc cách mạng máy tính hiện đại. Có hàng tỷ transistor trong một con IC CPU điện thoại.",
    application: "Mạch tự kích bật đèn ngủ khi trời tối (dùng kết hợp quang điện trở và transistor), hoặc đóng cắt cuộn dây rơ-le."
  },
  {
    id: "ic-555",
    name: "IC Tạo Xung NE555",
    englishName: "555 Timer IC",
    symbol: "U / IC",
    icon: "👾",
    desc: "Mạch tích hợp (IC) định thời huyền thoại dạng 8 chân, hoạt động ổn định và cực kỳ dễ sử dụng.",
    functionText: "Tạo ra các xung vuông dao động liên tục (chế độ Astable), tạo độ trễ thời gian đóng ngắt (chế độ Monostable).",
    fact: "NE555 được thiết kế vào năm 1971 bởi Hans Camenzind và đến nay vẫn là một trong những IC bán chạy nhất mọi thời đại.",
    application: "Mạch đèn xi-nhan nhấp nháy liên tục, còi cảnh sát phát tiếng hú kêu, bộ phát tín hiệu điều khiển hồng ngoại cơ bản."
  },
  {
    id: "ic-lm7805",
    name: "IC Ổn Áp L7805 / LM7805",
    englishName: "5V Linear Regulator IC",
    symbol: "REG / U",
    icon: "🎛️",
    desc: "Mạch tích hợp ổn định mức điện áp ngõ ra một chiều cố định là 5V dương từ nguồn điện vào ngắt quãng có mức từ 7V đến 25V.",
    functionText: "Giảm áp và giữ điện áp đầu ra luôn chính xác 5V ổn định, bảo vệ các linh kiện vi xử lý nhạy cảm phía sau.",
    fact: "Sinh nhiệt khá lớn trong quá trình hạ áp tuyến tính, cần gắn thêm lá tản nhiệt nhôm nếu dòng tải ngõ ra lớn hơn 100mA.",
    application: "Khối ổn áp trung tâm cấp nguồn ổn định 5V cho vi điều khiển Arduino hoặc mạch sạc pin khẩn cấp từ pin 9V."
  }
];

// English topics & cards
interface CommunicationPhrase {
  en: string;
  vi: string;
  context: string;
}

const ENGLISH_CHANNELS: { [key: string]: CommunicationPhrase[] } = {
  workshop: [
    { en: "Please read the electrical schematic diagram first.", vi: "Vui lòng đọc kỹ sơ đồ mạch điện trước đã.", context: "Tại xưởng thực hành Điện - Điện tử" },
    { en: "Solder this resistor onto the circuit board carefully.", vi: "Hãy hàn chiếc điện trở này lên bo mạch thật cẩn thận.", context: "Khoa Điện tử viễn thông" },
    { en: "Be careful! The soldering iron is extremely hot.", vi: "Cẩn thận! Chiếc mỏ hàn đang cực kỳ nóng đấy.", context: "An toàn lao động tại xưởng" },
    { en: "Use a digital multimeter to measure the output voltage.", vi: "Sử dụng đồng hồ vạn năng số để đo điện áp đầu ra nhé.", context: "Kỹ năng đo đạc" },
    { en: "Safety first! Make sure the main power switch is turned off.", vi: "An toàn là trên hết! Hãy chắc chắn rằng aptomat tổng đã được tắt.", context: "Quy chuẩn an toàn điện" }
  ],
  classroom: [
    { en: "Can you explain how this transistor operates in a circuit?", vi: "Thầy/bạn có thể giải thích cách transistor này hoạt động trong mạch không?", context: "Sinh hoạt lớp kỹ thuật" },
    { en: "We need to finish our technical project by this Friday.", vi: "Chúng mình cần hoàn thành đồ án kỹ thuật trước thứ Sáu tuần này.", context: "Bài tập nhóm và tiểu luận" },
    { en: "Is there any spare soldering lead left in the drawer?", vi: "Còn cuộn chì hàn dự phòng nào trong ngăn kéo không bạn?", context: "Mượn dụng cụ học tập" },
    { en: "Let's work together to figure out the troubleshooting process.", vi: "Hãy cùng hợp tác để tìm ra quy trình xử lý sự cố/sửa lỗi nhé.", context: "Làm bài thực tập tốt nghiệp" }
  ],
  interview: [
    { en: "I am confident in my troubleshooting and hardware assembly skills.", vi: "Tôi rất tự tin vào kỹ năng chẩn đoán lỗi mạch và lắp ráp phần cứng của mình.", context: "Phỏng vấn ứng tuyển kỹ sư/kỹ thuật viên" },
    { en: "I had a great internship experience at Nha Trang Power Station.", vi: "Tôi đã có một kỳ thực tập tuyệt vời tại Trạm Điện Nha Trang.", context: "Giới thiệu kinh nghiệm làm việc" },
    { en: "I am highly motivated to learn new automated control systems.", vi: "Tôi có động lực rất cao để tiếp thu các hệ thống điều khiển tự động mới.", context: "Nêu tinh thần cầu tiến" },
    { en: "I perform well in high-pressure engineering environments.", vi: "Tôi làm việc tốt trong môi trường kỹ thuật áp lực cao.", context: "Trả lời câu hỏi tình huống" }
  ]
};

interface EnglishWordCard {
  en: string;
  pronounce: string;
  partOfSpeech: string;
  vi: string;
  example: string;
}

const ENGLISH_WORDS: EnglishWordCard[] = [
  { en: "Resistance", pronounce: "/rɪˈzɪs.təns/", partOfSpeech: "noun", vi: "Điện trở / Đại lượng cản trở dòng điện (đo bằng Ohm Ω)", example: "The copper wire has very low resistance." },
  { en: "Capacitance", pronounce: "/kəˈpæs.ɪ.təns/", partOfSpeech: "noun", vi: "Điện dung / Khả năng lưu trữ năng lượng điện tích", example: "Check the capacitance of that electrolytic capacitor." },
  { en: "Amplifier", pronounce: "/ˈæm.plɪ.faɪ.ər/", partOfSpeech: "noun", vi: "Bộ khuếch đại điện tử (làm tín hiệu to hơn)", example: "We designed a low-noise transistor amplifier." },
  { en: "Short Circuit", pronounce: "/ˌʃɔːt ˈsɜː.kɪt/", partOfSpeech: "noun", vi: "Hiện tượng đoản mạch / Chập mạch (gây nguy cơ cháy nổ)", example: "A loose wire caused a serious short circuit in the converter." },
  { en: "Multimeter", pronounce: "/ˈmʌl.ti.miː.tər/", partOfSpeech: "noun", vi: "Đồng hồ vạn năng (đo điện áp, dòng điện, điện trở)", example: "Set the digital multimeter to voltage measurement mode." },
  { en: "Troubleshoot", pronounce: "/ˈtrʌb.əl.ʃuːt/", partOfSpeech: "verb", vi: "Chẩn đoán, khắc phục sự cố kỹ thuật", example: "Engineers are trying to troubleshoot the system outage." },
  { en: "Voltage Regulator", pronounce: "/ˈvəʊl.tɪdʒ ˈreɡ.jə.leɪ.tər/", partOfSpeech: "noun", vi: "Mạch/IC ổn áp (giữ điện áp ra không đổi)", example: "The LM7805 is a reliable 5V voltage regulator." },
  { en: "Voltage", pronounce: "/ˈvəʊl.tɪdʒ/", partOfSpeech: "noun", vi: "Điện áp / Hiệu điện thế (đo bằng Volt - V)", example: "High voltage warning labels are placed on the door." }
];

export default function StudyHub() {
  const [subTab, setSubTab] = useState<"electronics" | "english">("electronics");

  // State for Resistor Color Decoder
  const [resistorB1, setResistorB1] = useState<ResistorColor>(DIGIT_COLORS[2]); // Default Red = 2
  const [resistorB2, setResistorB2] = useState<ResistorColor>(DIGIT_COLORS[2]); // Default Red = 2
  const [resistorMul, setResistorMul] = useState(MULTIPLIER_COLORS[1]); // Default Brown = x10
  const [resistorTol, setResistorTol] = useState(TOLERANCE_COLORS[5]); // Default Gold = 5%

  // Active Electronic Component card selection
  const [selectedComp, setSelectedComp] = useState<ComponentItem | null>(ELECTRONIC_COMPONENTS[0]);

  // English state
  const [activePhraseTab, setActivePhraseTab] = useState<"workshop" | "classroom" | "interview">("workshop");
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<number[]>([]);

  // Calculation for Resistor Ω Value
  const rawValue = (resistorB1.value * 10 + resistorB2.value) * resistorMul.value;
  
  // Format Value nicely
  const formatResistance = (value: number) => {
    if (value >= 1000000) {
      const formatted = (value / 1000000).toFixed(2);
      return `${formatted.endsWith(".00") ? formatted.slice(0, -3) : formatted} MΩ`;
    }
    if (value >= 1000) {
      const formatted = (value / 1000).toFixed(2);
      return `${formatted.endsWith(".00") ? formatted.slice(0, -3) : formatted} kΩ`;
    }
    const formatted = value.toFixed(2);
    return `${formatted.endsWith(".00") ? formatted.slice(0, -3) : formatted} Ω`;
  };

  // Web Speech API call for Pronunciation
  const playSound = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Trình duyệt không hỗ trợ tổng hợp giọng nói.");
    }
  };

  const handleNextCard = () => {
    setCardFlipped(false);
    setTimeout(() => {
      setFlashcardIndex((prev) => (prev + 1) % ENGLISH_WORDS.length);
    }, 150);
  };

  const handlePrevCard = () => {
    setCardFlipped(false);
    setTimeout(() => {
      setFlashcardIndex((prev) => (prev - 1 + ENGLISH_WORDS.length) % ENGLISH_WORDS.length);
    }, 150);
  };

  const handleToggleMastered = (idx: number) => {
    if (masteredCards.includes(idx)) {
      setMasteredCards((prev) => prev.filter((id) => id !== idx));
    } else {
      setMasteredCards((prev) => [...prev, idx]);
    }
  };

  const resetFlashcards = () => {
    setMasteredCards([]);
    setFlashcardIndex(0);
    setCardFlipped(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-6 animate-fade-in space-y-8 min-h-[70vh]">
      
      {/* ── INTERNAL SUB TABS HEADER ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-neutral-200/50 pb-4 gap-4">
        <div>
          <h2 className="font-sans font-black text-xl text-neutral-900 flex items-center gap-2">
            <span>🎓</span> Góc Học Tập & Nghiên Cứu Khoa Học
          </h2>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            Phòng thí nghiệm điện tử ảo & Góc huấn luyện từ vựng tiếng Anh chuyên ngành CDN
          </p>
        </div>

        {/* Sub-navigation buttons */}
        <div className="flex bg-neutral-100 p-1 rounded-2xl border border-neutral-200/50 w-full sm:w-auto">
          <button
            onClick={() => setSubTab("electronics")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === "electronics"
                ? "bg-white text-rose-800 shadow-sm font-extrabold"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <Cpu size={14} />
            <span>Mạch & Linh kiện Điện tử</span>
          </button>
          
          <button
            onClick={() => setSubTab("english")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === "english"
                ? "bg-white text-rose-800 shadow-sm font-extrabold"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <Languages size={14} />
            <span>Bàn Học Tiếng Anh</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {subTab === "electronics" ? (
          /* ── SUB TAB ELECTRONICS ── */
          <motion.div
            key="electronics"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* 4-Band Resistor Color Identifier (Calculations sidebar/box) */}
            <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-neutral-200/50 shadow-sm space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1 px-2 rounded-md bg-rose-50 border border-rose-100 text-[10px] text-rose-700 font-extrabold uppercase">
                    Lab ảo điện tử
                  </span>
                  <h3 className="font-sans font-extrabold text-sm text-neutral-900">
                    Ứng dụng giải mã điện trở 4 vòng màu
                  </h3>
                </div>
                <p className="text-xs text-neutral-400 font-light leading-relaxed mb-6">
                  Chọn mã màu chính xác cho từng vòng để máy tự động tính giá trị điện dung trở kháng của điện trở thực hành!
                </p>

                {/* VISUAL LAYOUT OF RESISTOR DRAWN WITH CSS */}
                <div className="py-12 bg-neutral-50/70 rounded-2xl border border-neutral-100 flex items-center justify-center min-h-[160px] relative overflow-hidden select-none mb-8">
                  
                  {/* Resistor body line wire left */}
                  <div className="absolute left-6 right-6 h-1.5 bg-gradient-to-r from-neutral-300 via-neutral-400 to-neutral-300 rounded" />
                  
                  {/* Ceramic resistance body */}
                  <div className="relative w-64 h-16 bg-amber-100 hover:bg-amber-100/90 rounded-3xl border border-amber-200 shadow-md flex justify-between items-center px-8 z-10 transition-colors">
                    {/* Metal cap left */}
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-neutral-300/80 rounded-l-3xl border-r border-neutral-300/40" />
                    
                    {/* Color Band 1 */}
                    <div 
                      className="w-3.5 h-full transition-all" 
                      title={`Vòng 1: ${resistorB1.name}`}
                      style={{ 
                        backgroundColor: resistorB1.hex,
                        borderLeft: '1px solid rgba(0,0,0,0.15)', 
                        borderRight: '1px solid rgba(0,0,0,0.15)' 
                      }}
                    />
                    
                    {/* Color Band 2 */}
                    <div 
                      className="w-3.5 h-full transition-all ml-1" 
                      title={`Vòng 2: ${resistorB2.name}`}
                      style={{ 
                        backgroundColor: resistorB2.hex,
                        borderLeft: '1px solid rgba(0,0,0,0.15)', 
                        borderRight: '1px solid rgba(0,0,0,0.15)' 
                      }}
                    />
                    
                    {/* Color Band 3 (Multiplier) */}
                    <div 
                      className="w-3.5 h-full transition-all ml-1" 
                      title={`Vòng 3 (Nhân hệ số): ${resistorMul.name}`}
                      style={{ 
                        backgroundColor: resistorMul.hex,
                        borderLeft: '1px solid rgba(0,0,0,0.15)', 
                        borderRight: '1px solid rgba(0,0,0,0.15)' 
                      }}
                    />
                    
                    {/* Spacing inside resistor for 4th band */}
                    <div className="w-12" />
                    
                    {/* Color Band 4 (Tolerance) */}
                    <div 
                      className="w-3.5 h-full transition-all mr-2" 
                      title={`Vòng 4 (Sai số): ${resistorTol.name}`}
                      style={{ 
                        backgroundColor: resistorTol.hex,
                        borderLeft: '1px solid rgba(0,0,0,0.15)', 
                        borderRight: '1px solid rgba(0,0,0,0.15)' 
                      }}
                    />

                    {/* Metal cap right */}
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-neutral-300/80 rounded-r-3xl border-l border-neutral-300/40" />
                  </div>
                </div>

                {/* THE RESULT VALUE CARD PANEL */}
                <div className="bg-rose-950 p-5 rounded-2xl text-white flex justify-between items-center shadow-lg select-all">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-rose-300 tracking-wider">Trở kháng đo được:</span>
                    <h4 className="font-mono text-2xl font-black mt-1">
                      {formatResistance(rawValue)}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-rose-300 tracking-wider">Mức sai số:</span>
                    <p className="font-sans text-sm font-extrabold uppercase mt-1 text-rose-100">
                      {resistorTol.text}
                    </p>
                  </div>
                </div>
              </div>

              {/* Band selection drop downs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-neutral-100 select-none">
                {/* Band 1 dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wide block">Vòng 1 (Số 1)</label>
                  <div className="relative">
                    <select
                      value={resistorB1.value}
                      onChange={(e) => {
                        const targetVal = Number(e.target.value);
                        const match = DIGIT_COLORS.find(c => c.value === targetVal);
                        if (match) setResistorB1(match);
                      }}
                      className="w-full text-xs font-bold border border-neutral-200 bg-white rounded-xl py-2 pl-3.5 pr-2 outline-none focus:border-rose-600 transition-colors cursor-pointer"
                    >
                      {DIGIT_COLORS.map(c => (
                        <option key={`b1-${c.value}`} value={c.value}>{c.name}</option>
                      ))}
                    </select>
                    <span className="absolute right-3.5 top-3 w-3 h-3 rounded-full border border-neutral-200" style={{ backgroundColor: resistorB1.hex }} />
                  </div>
                </div>

                {/* Band 2 dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wide block">Vòng 2 (Số 2)</label>
                  <div className="relative">
                    <select
                      value={resistorB2.value}
                      onChange={(e) => {
                        const targetVal = Number(e.target.value);
                        const match = DIGIT_COLORS.find(c => c.value === targetVal);
                        if (match) setResistorB2(match);
                      }}
                      className="w-full text-xs font-bold border border-neutral-200 bg-white rounded-xl py-2 pl-3.5 pr-2 outline-none focus:border-rose-600 transition-colors cursor-pointer"
                    >
                      {DIGIT_COLORS.map(c => (
                        <option key={`b2-${c.value}`} value={c.value}>{c.name}</option>
                      ))}
                    </select>
                    <span className="absolute right-3.5 top-3 w-3 h-3 rounded-full border border-neutral-200" style={{ backgroundColor: resistorB2.hex }} />
                  </div>
                </div>

                {/* Band 3 (Multiplier) dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wide block">Vòng 3 (Hệ số)</label>
                  <div className="relative">
                    <select
                      value={resistorMul.value}
                      onChange={(e) => {
                        const targetVal = Number(e.target.value);
                        const match = MULTIPLIER_COLORS.find(c => c.value === targetVal);
                        if (match) setResistorMul(match);
                      }}
                      className="w-full text-xs font-bold border border-neutral-200 bg-white rounded-xl py-2 pl-3.5 pr-2 outline-none focus:border-rose-600 transition-colors cursor-pointer"
                    >
                      {MULTIPLIER_COLORS.map(c => (
                        <option key={`mul-${c.value}`} value={c.value}>{c.name}</option>
                      ))}
                    </select>
                    <span className="absolute right-3.5 top-3 w-3 h-3 rounded-full border border-neutral-200" style={{ backgroundColor: resistorMul.hex }} />
                  </div>
                </div>

                {/* Band 4 (Tolerance) dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wide block">Vòng 4 (Sai số)</label>
                  <div className="relative">
                    <select
                      value={resistorTol.text}
                      onChange={(e) => {
                        const targetText = e.target.value;
                        const match = TOLERANCE_COLORS.find(c => c.text === targetText);
                        if (match) setResistorTol(match);
                      }}
                      className="w-full text-xs font-bold border border-neutral-200 bg-white rounded-xl py-2 pl-3.5 pr-2 outline-none focus:border-rose-600 transition-colors cursor-pointer"
                    >
                      {TOLERANCE_COLORS.map(c => (
                        <option key={`tol-${c.text}`} value={c.text}>{c.name}</option>
                      ))}
                    </select>
                    <span className="absolute right-3.5 top-3 w-3 h-3 rounded-full border border-neutral-200" style={{ backgroundColor: resistorTol.hex }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Electronic Components introduction directory */}
            <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-neutral-200/50 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="p-1 px-2 rounded-md bg-neutral-100 border border-neutral-200 text-[10px] text-neutral-700 font-extrabold uppercase">
                    Thư viện mạch cơ bản
                  </span>
                  <h3 className="font-sans font-extrabold text-sm text-neutral-900">
                    Linh kiện điện tử bán dẫn & IC
                  </h3>
                </div>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  Bấm chọn linh kiện bên dưới để tìm hiểu nhanh biểu tượng sơ đồ nguyên lý, chức năng, cấu tạo, và ứng dụng thực hành:
                </p>

                {/* Components circular choice grid */}
                <div className="grid grid-cols-2 gap-2 select-none">
                  {ELECTRONIC_COMPONENTS.map((comp) => {
                    const isSelected = selectedComp?.id === comp.id;
                    return (
                      <button
                        key={comp.id}
                        onClick={() => setSelectedComp(comp)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 truncate ${
                          isSelected
                            ? "border-rose-950 bg-rose-50/20 text-rose-950 font-extrabold shadow-inner"
                            : "border-neutral-200 bg-neutral-50/20 hover:bg-neutral-50/60 text-neutral-700 font-medium"
                        }`}
                      >
                        <span className="text-base">{comp.icon}</span>
                        <div className="min-w-0">
                          <p className="text-xs truncate">{comp.name}</p>
                          <p className="text-[9px] text-neutral-400 truncate tracking-wide">{comp.englishName}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Informative description block about active component */}
              <div className="mt-6 pt-5 border-t border-neutral-100 min-h-[170px] animate-fade-in text-xs space-y-3.5 select-text">
                {selectedComp ? (
                  <>
                    <div className="flex justify-between items-center bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                      <div>
                        <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-1">
                          <span>{selectedComp.icon}</span>
                          <span>{selectedComp.name}</span>
                          <span className="text-neutral-400 font-normal">({selectedComp.englishName})</span>
                        </h4>
                      </div>
                      <span className="font-mono font-black text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded text-[10px]">
                        Ký hiệu: {selectedComp.symbol}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider">Cấu tạo & Định nghĩa:</p>
                      <p className="text-neutral-600 font-light leading-relaxed">{selectedComp.desc}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider">Chức năng chính:</p>
                      <p className="text-neutral-600 font-light leading-relaxed">{selectedComp.functionText}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 pt-1.5 text-[10px] leading-relaxed select-none">
                      <div className="bg-amber-50/60 border border-amber-100 p-2.5 rounded-xl">
                        <strong className="text-amber-800 block mb-0.5">💡 Bạn có biết?</strong>
                        <span className="text-amber-900 font-light">{selectedComp.fact}</span>
                      </div>
                      <div className="bg-emerald-50/60 border border-emerald-100 p-2.5 rounded-xl">
                        <strong className="text-emerald-800 block mb-0.5">🛠️ Ứng dụng tự chế:</strong>
                        <span className="text-emerald-900 font-light">{selectedComp.application}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-neutral-400">
                    Chọn một linh kiện điện tử để xem chi tiết thông tin
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── SUB TAB ENGLISH BOOK ── */
          <motion.div
            key="english"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Communication phrase panel with TTS audio */}
            <div className="lg:col-span-6 bg-white p-6 md:p-8 rounded-3xl border border-neutral-200/50 shadow-sm space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1 px-2 rounded-md bg-rose-50 border border-rose-100 text-[10px] text-rose-700 font-extrabold uppercase">
                    Kỹ năng giao tiếp
                  </span>
                  <h3 className="font-sans font-extrabold text-sm text-neutral-900">
                    Mẫu câu tiếng Anh giao tiếp chuyên sâu
                  </h3>
                </div>
                <p className="text-xs text-neutral-400 font-light leading-relaxed mb-6">
                  Được thiết kế chuyên biệt cho sinh viên khối kỹ thuật trường nghề khi làm việc tại xưởng hoặc chuẩn bị đi phỏng vấn. Nhấp loa để nghe phát âm giọng Mỹ!
                </p>

                {/* Channels selection buttons */}
                <div className="flex bg-neutral-100 p-1 rounded-2xl border border-neutral-200/50 mb-6 w-full select-none">
                  {(Object.keys(ENGLISH_CHANNELS) as Array<keyof typeof ENGLISH_CHANNELS>).map((channel) => {
                    const label = channel === "workshop" ? "🏭 Tại Xưởng" : channel === "classroom" ? "🏫 Lớp Học" : "📑 Phỏng Vấn";
                    return (
                      <button
                        key={channel}
                        onClick={() => setActivePhraseTab(channel as any)}
                        className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                          activePhraseTab === channel
                            ? "bg-white text-rose-800 shadow-sm font-extrabold"
                            : "text-neutral-500 hover:text-neutral-800"
                        }`}
                      >
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Phrase layout rows */}
                <div className="space-y-3.5 select-text">
                  {ENGLISH_CHANNELS[activePhraseTab].map((p, pIdx) => (
                    <div 
                      key={`phrase-${pIdx}`}
                      className="group p-3.5 bg-neutral-50/50 hover:bg-rose-50/10 rounded-2xl border border-neutral-100 flex justify-between items-center gap-4 transition-all"
                    >
                      <div className="space-y-1">
                        <span className="text-[8px] bg-neutral-200/60 text-neutral-500 px-1.5 py-0.2 rounded font-bold uppercase tracking-wide select-none">
                          {p.context}
                        </span>
                        <p className="font-sans font-black text-neutral-950 text-xs tracking-tight group-hover:text-rose-900 transition-colors">
                          {p.en}
                        </p>
                        <p className="font-sans font-light text-neutral-500 text-[11px] leading-relaxed">
                          {p.vi}
                        </p>
                      </div>

                      {/* Clickable TTS audio button */}
                      <button
                        onClick={() => playSound(p.en)}
                        className="w-9 h-9 rounded-full bg-white group-hover:bg-rose-600 group-hover:text-white border border-neutral-200/80 shadow-sm flex items-center justify-center text-neutral-400 cursor-pointer transition-all active:scale-90"
                        title="Nghe phát âm"
                      >
                        <Volume2 size={14} className="group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notice indicator */}
              <div className="text-[10px] text-neutral-400 text-center font-light mt-6 flex items-center justify-center gap-1 bg-neutral-50 p-2 rounded-xl border border-neutral-100 select-none">
                <HelpCircle size={11} />
                <span>Mẹo: Luyện nghe 15 phút mỗi ngày tại xưởng giúp nâng cao kỹ năng làm việc tự động!</span>
              </div>
            </div>

            {/* Flashcard deks interactive tool */}
            <div className="lg:col-span-6 bg-white p-6 md:p-8 rounded-3xl border border-neutral-200/50 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1 px-2 rounded-md bg-neutral-100 border border-neutral-200 text-[10px] text-neutral-700 font-extrabold uppercase">
                    Phương pháp Flashcards
                  </span>
                  <h3 className="font-sans font-extrabold text-sm text-neutral-900">
                    Flashcard từ vựng kỹ thuật & nghề nghiệp 💡
                  </h3>
                </div>
                <p className="text-xs text-neutral-400 font-light leading-relaxed mb-6">
                  Ôn tập từ vựng then chốt liên quan đến Điện tử, Cơ khí, Ô tô, và Công nghệ. Nhấp vào thẻ học tập để lật và xem nghĩa tiếng Việt!
                </p>

                {/* Progress calculation */}
                <div className="space-y-1.5 select-none mb-6">
                  <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    <span>Tiến độ thuộc bài:</span>
                    <span className="font-black text-rose-700">{masteredCards.length} / {ENGLISH_WORDS.length} từ</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-rose-600 transition-all duration-300"
                      style={{ width: `${(masteredCards.length / ENGLISH_WORDS.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* THE FLIP CARD CONTAINER */}
                <div 
                  onClick={() => setCardFlipped(!cardFlipped)}
                  className="relative aspect-[3/2] w-full max-w-sm mx-auto cursor-pointer select-none group perspective-1000 mb-6"
                >
                  <div 
                    className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                      cardFlipped ? "rotate-y-180" : ""
                    }`}
                  >
                    {/* Front of Card */}
                    <div className="absolute inset-0 bg-neutral-950 text-white rounded-3xl p-6 flex flex-col justify-between border border-neutral-800 shadow-xl backface-hidden">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-extrabold bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded uppercase tracking-wider">
                          Mặt trước: Từ mới
                        </span>
                        <Volume2 
                          size={14} 
                          className="text-neutral-400 hover:text-white cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            playSound(ENGLISH_WORDS[flashcardIndex].en);
                          }}
                        />
                      </div>
                      
                      <div className="text-center py-4">
                        <h4 className="font-sans font-black text-2xl tracking-tight mb-1">
                          {ENGLISH_WORDS[flashcardIndex].en}
                        </h4>
                        <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-neutral-400">
                          <span>{ENGLISH_WORDS[flashcardIndex].pronounce}</span>
                          <span>•</span>
                          <span className="italic">({ENGLISH_WORDS[flashcardIndex].partOfSpeech})</span>
                        </div>
                      </div>

                      <div className="text-center text-[10px] text-neutral-500 font-light italic">
                        "Nhấp chuột để xem giải nghĩa"
                      </div>
                    </div>

                    {/* Back of Card */}
                    <div className="absolute inset-0 bg-white text-neutral-900 rounded-3xl p-6 flex flex-col justify-between border border-rose-900/20 shadow-xl backface-hidden rotate-y-180">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-extrabold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-100 uppercase tracking-wider">
                          Mặt sau: Nghĩa từ
                        </span>
                        <span className="text-[9px] font-mono text-neutral-400">
                          Index {flashcardIndex + 1}
                        </span>
                      </div>

                      <div className="text-center py-2 space-y-1">
                        <p className="font-sans font-black text-rose-950 text-base leading-tight">
                          {ENGLISH_WORDS[flashcardIndex].vi}
                        </p>
                        <p className="text-[10px] text-neutral-400 font-light italic leading-relaxed pt-1.5 max-w-xs mx-auto">
                          Ví dụ: "{ENGLISH_WORDS[flashcardIndex].example}"
                        </p>
                      </div>

                      <div className="text-center text-[10px] text-rose-500 font-semibold flex items-center justify-center gap-1">
                        <Sparkles size={11} /> Nhấp để úp lại thẻ
                      </div>
                    </div>
                  </div>
                </div>

                {/* Handled controls underneath card */}
                <div className="flex justify-center items-center gap-4 select-none">
                  <button
                    onClick={handlePrevCard}
                    className="p-2 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 border border-neutral-200/70 cursor-pointer flex items-center justify-center transition-all active:scale-95"
                    title="Từ trước đó"
                  >
                    ◀
                  </button>
                  
                  <button
                    onClick={() => handleToggleMastered(flashcardIndex)}
                    className={`px-4.5 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      masteredCards.includes(flashcardIndex)
                        ? "bg-green-600 border-green-600 text-white shadow-md shadow-green-600/15"
                        : "bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200"
                    }`}
                  >
                    <Check size={13} />
                    <span>{masteredCards.includes(flashcardIndex) ? "Đã thuộc rực rỡ!" : "Đánh dấu đã thuộc"}</span>
                  </button>

                  <button
                    onClick={handleNextCard}
                    className="p-2 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 border border-neutral-200/70 cursor-pointer flex items-center justify-center transition-all active:scale-95"
                    title="Từ kế tiếp"
                  >
                    ▶
                  </button>
                </div>
              </div>

              {/* Reset flashcards index and collections */}
              <div className="flex justify-between items-center pt-5 mt-6 border-t border-neutral-100 select-none">
                <button
                  onClick={resetFlashcards}
                  className="flex items-center gap-1 hover:text-rose-700 text-neutral-400 font-bold text-[10px] bg-transparent border-none cursor-pointer"
                >
                  <RotateCcw size={11} /> <span>Học lại từ đầu</span>
                </button>
                <span className="text-[10px] text-neutral-400 italic">
                  Tổng sổ bài học: {ENGLISH_WORDS.length} thẻ
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
