import React, { useState } from 'react';
import { X, Bike, Check, Sparkles, MapPin, ShieldCheck, HeartHandshake, Phone, Car } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface RegisterDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VEHICLE_OPTIONS = [
  { value: 'motorbike', label: 'Xe máy xăng (Ship nhanh)' },
  { value: 'electric_bike', label: 'Xe máy điện bảo vệ môi trường 🍃' },
  { value: 'rickshaw', label: 'Xe điện kéo / Xe lôi Chợ Đêm 🛺' },
  { value: 'car', label: 'Ô tô 4-7 chỗ (Chở gia đình/Quốc tế)' },
];

export const RegisterDriverModal: React.FC<RegisterDriverModalProps> = ({ isOpen, onClose }) => {
  const { user, loginWithGoogle } = useAuth();

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('motorbike');
  const [licensePlate, setLicensePlate] = useState('');
  const [preferredZone, setPreferredZone] = useState('Tất cả TP. Phan Rang - Tháp Chàm');
  const [preferredShift, setPreferredShift] = useState('Ca tối & Chợ đêm (16h - 23h)');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status states
  const [isSaving, setIsSaving] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRegisterDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('Vui lòng đăng nhập để gửi đơn tuyển dụng tài xế.');
      return;
    }

    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg('Vui lòng cung cấp đầy đủ họ tên và số điện thoại liên lạc.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Bạn cần đồng ý với các cam kết vận hành an toàn & đúng giá.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    const driverId = `driver_${user.uid}_${Date.now()}`;
    const newDriver = {
      id: driverId,
      userId: user.uid,
      fullName: fullName.trim(),
      phone: phone.trim(),
      vehicleType,
      licensePlate: licensePlate.trim() || 'Không có / Xe công cộng',
      preferredZone,
      preferredShift,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'drivers', driverId), newDriver);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setFullName('');
        setPhone('');
        setLicensePlate('');
        onClose();
      }, 3000);
    } catch (err: any) {
      console.error("Firestore Driver registration error:", err);
      try {
        handleFirestoreError(err, OperationType.WRITE, `drivers/${driverId}`);
      } catch (fErr: any) {
        setErrorMsg(
          fErr.message.includes('permission') 
            ? 'Lỗi bảo mật: Bạn chưa có quyền gửi biểu mẫu hoặc đang offline.' 
            : fErr.message
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Box */}
      <div className="relative bg-white max-w-xl w-full rounded-3xl shadow-2xl p-6 sm:p-8 animate-scale-up z-10 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 text-gray-400 hover:text-rose-brand hover:bg-rose-brand-light rounded-full transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Badge */}
        <div className="flex items-start gap-3 border-b border-rose-100 pb-4 mb-5">
          <div className="p-3 bg-rose-brand-light text-rose-brand rounded-2xl">
            <Bike className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-charcoal">Hội Tài Xế Phan Rang</h3>
              <span className="hidden sm:inline px-2 py-0.5 text-[9px] font-black uppercase text-rose-brand bg-white border border-rose-300 rounded-full">
                Tăng thu nhập
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Tham gia giao hàng, đón khách trong khu vực Phan Rang</p>
          </div>
        </div>

        {/* Auth Barrier */}
        {!user ? (
          <div className="text-center py-8">
            <ShieldCheck className="w-12 h-12 text-rose-brand/30 mx-auto mb-4" />
            <p className="text-sm font-bold text-gray-500 leading-relaxed max-w-xs mx-auto mb-5">
              Để bảo mật thông tin liên lạc, vui lòng đăng nhập trước khi ứng tuyển tài xế!
            </p>
            <button
              onClick={() => loginWithGoogle()}
              className="px-6 py-2.5 bg-rose-brand hover:bg-rose-brand-dark text-white font-black text-xs rounded-full shadow-md hover:shadow-lg transition-all"
            >
              Đăng Nhập Hoặc Thử Demo
            </button>
          </div>
        ) : submitSuccess ? (
          /* SUCCESS STATE */
          <div className="text-center py-8 flex flex-col items-center justify-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg border-2 border-emerald-300">
              <Check className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-black text-charcoal">Đăng Ký Thành Công!</h4>
              <p className="text-xs text-emerald-600 font-bold mt-1">Đơn của bạn đang được Ban Quản Lý Chợ Xét Duyệt Lâm Thời</p>
            </div>
            
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-left text-xs text-gray-500 leading-relaxed space-y-2 max-w-md">
              <p className="font-extrabold text-charcoal flex items-center gap-1.5 text-[13px]">
                <Sparkles className="w-4 h-4 text-amber-500" /> Hướng dẫn sau ứng tuyển:
              </p>
              <p>1. 📞 Giữ liên lạc với số điện thoại <strong>{phone}</strong> vừa đăng ký. CSKH sẽ liên hệ trong 2h.</p>
              <p>2. 🪪 Chuẩn bị sẵn CCCD và Bằng lái xe (nếu chạy xe máy xăng hoặc ô tô).</p>
              <p>3. 🎒 Bạn sẽ được trang bị nón bảo hiểm và túi giữ nhiệt thương hiệu <strong>Chợ Phan Rang</strong> trong ca nhận việc đầu tiên.</p>
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterDriver} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-extrabold text-charcoal block mb-1">Họ và tên tài xế *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Hải..."
                  className="w-full text-xs font-semibold px-3 py-2.5 bg-gray-soft border border-gray-200 focus:outline-none focus:border-rose-brand rounded-xl placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-charcoal block mb-1">Số điện thoại liên hệ *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ví dụ: 0912xxxxxx"
                    className="w-full text-xs font-semibold pl-9 pr-3 py-2.5 bg-gray-soft border border-gray-200 focus:outline-none focus:border-rose-brand rounded-xl placeholder:text-gray-400"
                  />
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-extrabold text-charcoal block mb-1">Loại phương tiện đăng ký *</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full text-xs font-extrabold px-3 py-2.5 bg-gray-soft border border-gray-200 focus:outline-none focus:border-rose-brand rounded-xl"
                >
                  {VEHICLE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-charcoal block mb-1">Biển số xe (nếu chạy động cơ)</label>
                <input
                  type="text"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  placeholder="Ví dụ: 85-F1 123.45"
                  className="w-full text-xs font-semibold px-3 py-2.5 bg-gray-soft border border-gray-200 focus:outline-none focus:border-rose-brand rounded-xl placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-extrabold text-charcoal block mb-1">Khu vực hoạt động ưu tiên</label>
                <select
                  value={preferredZone}
                  onChange={(e) => setPreferredZone(e.target.value)}
                  className="w-full text-xs font-extrabold px-3 py-2.5 bg-gray-soft border border-gray-200 focus:outline-none focus:border-rose-brand rounded-xl"
                >
                  <option value="Tất cả TP. Phan Rang - Tháp Chàm">Tất cả TP. Phan Rang - Tháp Chàm</option>
                  <option value="Xung quanh Chợ Phan Rang (Bán kính 3km)">Xung quanh Chợ Phan Rang (Bán kính 3km)</option>
                  <option value="Trục ven biển Ninh Chử & Bình Sơn">Trục ven biển Ninh Chử & Bình Sơn</option>
                  <option value="Các huyện lân cận (Ninh Hải, Ninh Phước)">Các huyện lân cận (Ninh Hải, Ninh Phước)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-charcoal block mb-1">Khung ca muốn giao hàng</label>
                <select
                  value={preferredShift}
                  onChange={(e) => setPreferredShift(e.target.value)}
                  className="w-full text-xs font-extrabold px-3 py-2.5 bg-gray-soft border border-gray-200 focus:outline-none focus:border-rose-brand rounded-xl"
                >
                  <option value="Ca tối & Chợ đêm (16h - 23h)">Ca tối & Chợ đêm (16h - 23h)</option>
                  <option value="Ca sáng (7h - 13h)">Ca sáng (7h - 13h)</option>
                  <option value="Ca chiều (13h - 18h)">Ca chiều (13h - 18h)</option>
                  <option value="Linh hoạt bất cứ khi nào có đơn">Linh hoạt rảnh khi nào chạy khi đó</option>
                </select>
              </div>
            </div>

            <div className="bg-rose-brand-light/35 p-3.5 rounded-2xl border border-rose-100/50 space-y-2">
              <h4 className="text-[11px] font-black text-rose-brand uppercase tracking-wider flex items-center gap-1">
                <HeartHandshake className="w-4 h-4" /> Cam kết chất lượng vận chuyển
              </h4>
              <ul className="text-[10px] text-gray-500 leading-relaxed font-semibold list-disc list-inside space-y-1">
                <li>Giao đồ ăn trong túi giữ nhiệt chuyên biệt, bảo đảm cơm còn nóng hổi, sinh tố lạnh ngắt.</li>
                <li>Giao nhận lịch thiệp, không kì kèo phụ thu, không tăng giá tự phát mùa du lịch.</li>
                <li>Gia nhập Nghiệp Đoàn Chợ Phan Rang được bảo hộ & xét thưởng thi đua.</li>
              </ul>
            </div>

            <div className="flex items-start gap-2.5 pt-1.5">
              <input
                id="agreeTerms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded text-rose-brand focus:ring-rose-brand cursor-pointer"
              />
              <label htmlFor="agreeTerms" className="text-[11px] text-gray-400 font-semibold select-none cursor-pointer">
                Tôi cam kết có đủ điều kiện sức khỏe và phương tiện đạt chuẩn an toàn giao thông, sẵn sàng đóng góp nụ cười hiếu khách Phan Rang.
              </label>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-brand text-xs font-bold rounded-xl">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 bg-rose-brand text-white hover:bg-rose-brand-dark rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-transform active:scale-97 cursor-pointer hover:shadow-lg hover:shadow-rose-100 disabled:opacity-55"
            >
              <Bike className="w-4.5 h-4.5" />
              {isSaving ? 'ĐANG GỬI THÔNG TIN...' : 'ĐĂNG KÝ GIA NHẬP ĐỘI XE NGAY'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
