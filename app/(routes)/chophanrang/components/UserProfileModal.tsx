import React, { useState, useEffect } from 'react';
import { X, User, ShoppingBag, Calendar, Sparkles, MapPin, Phone, AlertCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { Order, OrderItem } from '../types';
import { useStore } from '../store/useStore';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, logout, isSimulated, simulateLogin } = useAuth();
  const { cloudinaryConfig, setCloudinaryConfig } = useStore();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  // Quick demo login input state
  const [demoName, setDemoName] = useState('');
  const [demoEmail, setDemoEmail] = useState('');

  // Cloudinary settings state
  const [cloudNameInput, setCloudNameInput] = useState(cloudinaryConfig.cloudName);
  const [presetInput, setPresetInput] = useState(cloudinaryConfig.preset);

  // Sync inputs with state modifications
  useEffect(() => {
    setCloudNameInput(cloudinaryConfig.cloudName);
    setPresetInput(cloudinaryConfig.preset);
  }, [cloudinaryConfig]);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }

    setLoadingOrders(true);
    const ordersRef = collection(db, 'orders');
    // Enforce list checking logic securely
    const q = query(ordersRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedOrders: Order[] = [];
      snapshot.forEach((docSnap) => {
        loadedOrders.push(docSnap.data() as Order);
      });
      // Sort by date descending
      loadedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setOrders(loadedOrders);
      setLoadingOrders(false);
    }, (err) => {
      console.error("Error drawing order history securely:", err);
      setLoadingOrders(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (!isOpen) return null;

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    simulateLogin(demoName.trim() || "Thực Khách Phan Rang", demoEmail.trim() || "thuckhach@ninhthuan.vn");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative bg-white max-w-2xl w-full rounded-3xl shadow-2xl p-6 sm:p-8 animate-scale-up z-10 max-h-[85vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 text-gray-400 hover:text-rose-brand hover:bg-rose-brand-light rounded-full transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {user ? (
          /* USER SIGNED IN CONTAINER */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 border-b border-rose-100 pb-6">
              <img
                referrerPolicy="no-referrer"
                src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`}
                alt={user.displayName || "User"}
                className="w-20 h-20 rounded-full border-2 border-rose-brand shadow-md object-cover"
              />
              <div className="text-center sm:text-left space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-xl font-extrabold text-charcoal">{user.displayName}</h3>
                  <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded uppercase ${isSimulated ? 'bg-rose-brand-light text-rose-brand border border-rose-200' : 'bg-charcoal text-white'}`}>
                    {isSimulated ? 'Tài khoản Demo' : 'Google Auth'}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-400">{user.email}</p>
                <p className="text-[10px] text-gray-300 font-mono">ID Người Dùng: {user.uid.slice(0, 16)}...</p>
              </div>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Account stats */}
              <div className="md:col-span-4 space-y-4">
                <div className="p-4 rounded-2xl bg-gray-soft border border-gray-100 space-y-3">
                  <h4 className="text-xs font-extrabold text-charcoal tracking-wide uppercase">Thống kê mua sắm</h4>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-semibold">Tổng lượt đặt</span>
                    <span className="font-extrabold text-charcoal font-mono">{orders.length} đơn</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-semibold">Tích lũy chi tiêu</span>
                    <span className="font-black text-rose-brand">
                      {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>

                {/* Cloudinary Config Block */}
                <div className="p-4 rounded-3xl bg-amber-50/40 border border-amber-200/50 space-y-2.5 shadow-xs">
                  <h4 className="text-xs font-black text-amber-800 tracking-wide uppercase flex items-center gap-1.5">
                    ☁️ Cấu hình Cloudinary
                  </h4>
                  <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                    Nhập thông tin Cloudinary Unsigned Preset để bắt đầu đăng ảnh gian hàng và món ăn thật 100%.
                  </p>
                  
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-[9px] font-black text-gray-400 block uppercase">Cloud Name</span>
                      <input
                        type="text"
                        value={cloudNameInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCloudNameInput(val);
                          setCloudinaryConfig(val, presetInput);
                        }}
                        placeholder="chophanrang"
                        className="w-full text-xs font-mono px-2.5 py-1.5 bg-white border border-rose-100 rounded-xl focus:outline-none focus:border-rose-300"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-gray-400 block uppercase">Unsigned Preset</span>
                      <input
                        type="text"
                        value={presetInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPresetInput(val);
                          setCloudinaryConfig(cloudNameInput, val);
                        }}
                        placeholder="pr_unsigned_preset"
                        className="w-full text-xs font-mono px-2.5 py-1.5 bg-white border border-rose-100 rounded-xl focus:outline-none focus:border-rose-300"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="w-full py-2.5 bg-rose-50 text-rose-brand hover:bg-rose-brand hover:text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-rose-100 shadow-xs"
                >
                  <LogOut className="w-3.5 h-3.5" /> Đăng xuất tài khoản
                </button>
              </div>

              {/* Order Histories */}
              <div className="md:col-span-8 space-y-4">
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="w-4.5 h-4.5 text-rose-brand" />
                  <h4 className="text-sm font-black text-charcoal">Đơn hàng Ninh Thuận đã đặt</h4>
                </div>

                {loadingOrders ? (
                  <div className="text-center py-8 text-xs text-gray-400 animate-pulse">
                    Đang tìm vết hóa đơn đặt hàng...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-10 px-4 border border-dashed border-rose-100 rounded-2xl bg-gray-soft/50 text-gray-400 text-xs leading-relaxed">
                    Bạn chưa đặt món trực tuyến nào tại Chợ Phan Rang cả.<br/>Đặt một đĩa cơm gà lừng lẫy hoặc bánh căn nóng rẫy nhé!
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {orders.map((ord) => {
                      let itemsArr: OrderItem[] = [];
                      try {
                        itemsArr = JSON.parse(ord.items);
                      } catch (err) {
                        console.error(err);
                      }

                      return (
                        <div 
                          key={ord.id} 
                          className="p-4 rounded-2xl border border-rose-100 bg-white shadow-xs hover:border-rose-200 transition-colors"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <p className="text-[10px] text-rose-brand font-extrabold uppercase tracking-wide">Mã đơn: {ord.id}</p>
                              <span className="text-[10px] text-gray-400 font-mono">
                                {new Date(ord.createdAt).toLocaleString('vi-VN')}
                              </span>
                            </div>

                            <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-rose-brand-light text-rose-brand border border-rose-100 uppercase">
                              {ord.status === 'pending' ? 'Chờ chế biến' : ord.status === 'preparing' ? 'Đang chuẩn bị' : ord.status === 'delivering' ? 'Đang giao' : 'Hoàn thành'}
                            </span>
                          </div>

                          {/* List of ordered items brief */}
                          <div className="mt-3 space-y-1.5 border-t border-b border-gray-soft py-2.5">
                            {itemsArr.map((itm, i) => (
                              <div key={i} className="flex justify-between text-xs font-semibold text-charcoal">
                                <span className="truncate max-w-[180px]">
                                  {itm.dishName} <span className="text-[10px] text-gray-400">x{itm.quantity}</span>
                                </span>
                                <span className="font-mono text-[11px] font-bold text-gray-500">
                                  {(itm.price * itm.quantity).toLocaleString('vi-VN')}₫
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 flex justify-between items-center">
                            <div className="text-[10px] text-gray-400 leading-tight space-y-0.5 pr-2 truncate">
                              <p className="truncate">📞 {ord.phone}</p>
                              <p className="truncate">📍 {ord.address}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[10px] font-bold text-gray-400">Tổng tiền thanh toán</p>
                              <p className="text-sm font-black text-rose-brand font-mono">
                                {ord.total.toLocaleString('vi-VN')}₫
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        ) : (
          /* NO ACCOUNT YET barrier -> LOGIN PANEL */
          <div className="space-y-6 max-w-sm mx-auto py-4">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-rose-brand-light text-rose-brand rounded-full flex items-center justify-center mx-auto shadow">
                <User className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-charcoal tracking-tight">Đăng Nhập Chợ Phan Rang</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Đăng nhập để theo dõi hóa đơn, đánh giá quán hàng, xếp hạng món cá cơm, đùi cừu tươi và chia sẻ cảm hứng ẩm thực!
              </p>
            </div>

            {/* Direct Google Mock authentication container to allow bypass if needed */}
            <div className="space-y-4">
              {/* Simulator Login Form */}
              <form onSubmit={handleDemoSubmit} className="space-y-3 p-4 bg-gray-soft rounded-2xl border border-gray-100">
                <h4 className="text-xs font-extrabold text-charcoal uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-rose-brand" /> Thử nghiệm nhanh (Demo)
                </h4>
                <div>
                  <input
                    type="text"
                    required
                    value={demoName}
                    onChange={(e) => setDemoName(e.target.value)}
                    placeholder="Nhập tên của bạn"
                    className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 focus:outline-none focus:border-rose-brand rounded-xl"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    value={demoEmail}
                    onChange={(e) => setDemoEmail(e.target.value)}
                    placeholder="email.nhapnhanh@ninhthuan.vn"
                    className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 focus:outline-none focus:border-rose-brand rounded-xl"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-charcoal text-white hover:bg-rose-brand text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  Xác nhận vào chợ bằng Demo
                </button>
              </form>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-3 text-[10px] text-gray-400 font-extrabold uppercase">Hoặc dùng Google</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Real Google auth buttons if redirect rules allowed */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    useAuth().loginWithGoogle().then(() => onClose());
                  }}
                  className="w-full py-3 bg-white hover:bg-rose-brand-light text-rose-brand border-2 border-rose-100 hover:border-rose-200 font-bold text-xs rounded-full shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22l.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  Đăng nhập bằng tài khoản Google
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
