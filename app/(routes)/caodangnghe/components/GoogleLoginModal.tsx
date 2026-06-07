import { X } from "lucide-react";
import { motion } from "framer-motion";

interface GoogleLoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function GoogleLoginModal({ onClose, onSuccess }: GoogleLoginModalProps) {
  const handleSuccessClick = () => {
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-hidden" id="login-dialog-overlay">
      
      {/* Blurred dark background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm"
      />

      {/* Dialog box wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl text-center select-none"
        id="login-dialog-box"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-all border-none cursor-pointer"
          title="Đóng bảng đăng nhập"
        >
          <X size={16} />
        </button>

        {/* Brand Accents */}
        <div className="w-14 h-14 bg-rose-50 border border-rose-100 text-rose-600 rounded-full flex items-center justify-center text-3xl mx-auto mt-2 mb-4 shadow-sm animate-bounce">
          🎓
        </div>

        <h3 className="font-sans font-extrabold text-sm text-neutral-900 uppercase tracking-wide mb-1.5">
          Yêu cầu đăng nhập 🔒
        </h3>
        <p className="text-neutral-400 text-xs mb-6 px-2 leading-relaxed font-light">
          Hãy kết nối tài khoàn Google của bạn để có thể thả tim, thảo luận bình chọn hoặc xuất tinh hoa kỷ niệm trường Cao đẳng cùng bè bạn.
        </p>

        {/* Google Authentication Trigger Button */}
        <button
          onClick={handleSuccessClick}
          className="w-full h-12 flex items-center justify-center gap-3 bg-neutral-950 hover:bg-rose-950 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md select-none transition-all active:scale-95"
          id="trigger-login-action"
        >
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.19-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Tiếp tục với Google SSO</span>
        </button>

        <p className="text-[10px] text-neutral-400 mt-4 leading-none font-light italic">
          Bảo mật thông tin & kết nối nhanh trong 1 giây.
        </p>

      </motion.div>
    </div>
  );
}
