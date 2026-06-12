import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, CreditCard, ShoppingBag, Truck, CheckCircle2 } from 'lucide-react';
import { OrderItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: OrderItem[];
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onRemoveItem: (dishId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const { user } = useAuth();
  const [fullname, setFullname] = useState(user?.displayName || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!fullname || !phone || !address) {
      setErrorMsg('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ giao hàng tại Phan Rang!');
      return;
    }
    if (!user) {
      setErrorMsg('Bạn cần đăng nhập trước khi tiến hành đặt hàng trực tuyến!');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const orderId = `order_${Date.now()}`;
    const orderData = {
      id: orderId,
      userId: user.uid,
      customerName: fullname,
      phone: phone,
      address: address,
      items: JSON.stringify(cartItems),
      total: total,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'orders', orderId), orderData);
      setOrderSuccessId(orderId);
      onClearCart();
      // Keep static details populated
    } catch (err: any) {
      console.error("Order submission failure:", err);
      // Systematic capture
      try {
        handleFirestoreError(err, OperationType.WRITE, `orders/${orderId}`);
      } catch (fErr: any) {
        setErrorMsg(`Lỗi đặt hàng: ${fErr.message.includes('permission') ? 'Chưa có quyền ghi dữ liệu. kiểm tra đăng nhập!' : fErr.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccesClose = () => {
    setOrderSuccessId(null);
    setFullname(user?.displayName || '');
    setPhone('');
    setAddress('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background shadow overlay */}
      <div 
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white flex flex-col shadow-2xl animate-slide-in">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-rose-100 flex items-center justify-between bg-rose-brand-light">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5.5 h-5.5 text-rose-brand" />
              <h2 className="text-lg font-extrabold text-charcoal">Giỏ hàng của bạn ({cartItems.length})</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 px-1.5 text-charcoal hover:text-rose-brand rounded-full hover:bg-white transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart View body */}
          {orderSuccessId ? (
            /* SUCCESS CONFIRMATION STATE */
            <div className="flex-1 overflow-y-auto px-6 py-10 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-rose-brand-light text-rose-brand rounded-full flex items-center justify-center mb-6 shadow-md shadow-rose-200 animate-pulse">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black text-charcoal tracking-tight">Đặt Hàng Thành Công!</h3>
              <p className="text-sm font-semibold text-rose-brand uppercase tracking-wider mt-1">{orderSuccessId}</p>
              
              <div className="mt-6 p-4 rounded-2xl border border-rose-100 bg-rose-brand-light max-w-xs text-xs text-charcoal space-y-2 leading-relaxed text-left shadow-sm">
                <p>📍 <strong>Giao hàng đến:</strong> {fullname}</p>
                <p>📞 <strong>Số điện thoại:</strong> {phone}</p>
                <p>🏠 <strong>Địa chỉ giao:</strong> {address}</p>
                <p>🚲 <strong>Trạng thái:</strong> Đang chuẩn bị món ăn tại Chợ Phan Rang...</p>
              </div>

              <p className="text-gray-400 text-xs mt-6 leading-relaxed max-w-sm px-4">
                Các đầu bếp đang bắt tay vào chế biến nguyên liệu tươi sạch Ninh Thuận của bạn. Shipper của chợ sẽ giao đến tay bạn trong ít phút nữa!
              </p>

              <button
                onClick={handleSuccesClose}
                className="mt-8 px-6 py-3 bg-charcoal text-white hover:bg-rose-brand font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                Tiếp tục khám phá chợ
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {cartItems.length === 0 ? (
                /* EMPTY STATE */
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 text-gray-300 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-md font-bold text-gray-500">Giỏ hàng rỗng</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
                    Bạn chưa chọn món nào trong chợ đâu. Hãy tham quan các gian hàng bên ngoài và kẹp đầy chiếc giỏ xinh xắn nhé!
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-5 px-5 py-2.5 bg-rose-brand text-white font-bold text-xs rounded-full shadow hover:bg-rose-brand-dark transition-all"
                  >
                    Xem Gian Hàng
                  </button>
                </div>
              ) : (
                /* ARTICLES LIST IN SHOPPING CART */
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {cartItems.map((item) => (
                      <div 
                        key={item.dishId} 
                        className="flex items-center gap-3 p-3 rounded-2xl border border-rose-100/60 bg-white/70 shadow-xs hover:shadow-md transition-shadow"
                      >
                        <img
                          src={item.image}
                          alt={item.dishName}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-rose-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-rose-brand font-bold uppercase tracking-wider">{item.stallName}</p>
                          <h4 className="text-sm font-bold text-charcoal truncate">{item.dishName}</h4>
                          <p className="text-xs text-charcoal font-black mt-0.5">
                            {item.price.toLocaleString('vi-VN')}₫
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => onRemoveItem(item.dishId)}
                            className="text-gray-300 hover:text-rose-500 transition-colors p-1 rounded-lg"
                            title="Xóa món"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                          <div className="flex items-center gap-2 bg-gray-soft border border-gray-100 rounded-lg p-0.5">
                            <button
                              onClick={() => onUpdateQuantity(item.dishId, -1)}
                              className="p-1 hover:bg-white text-charcoal hover:text-rose-brand rounded-md transition-all cursor-pointer"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-black min-w-[20px] text-center text-charcoal">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.dishId, 1)}
                              className="p-1 hover:bg-white text-charcoal hover:text-rose-brand rounded-md transition-all cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary & Checkout Form */}
                  <div className="border-t border-rose-100 bg-rose-brand-light/40 p-6 space-y-4 shadow-sm shrink-0">
                    <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-rose-100">
                      <span className="text-sm font-bold text-gray-500">Tổng tiền đặt món</span>
                      <span className="text-lg font-black text-rose-brand">
                        {total.toLocaleString('vi-VN')}₫
                      </span>
                    </div>

                    {/* Check out form fields directly embedded */}
                    <form onSubmit={handleSubmitOrder} className="space-y-3">
                      <h4 className="text-xs font-bold text-rose-brand uppercase tracking-widest flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" /> Thông tin giao hàng Phan Rang
                      </h4>

                      <div>
                        <input
                          type="text"
                          required
                          value={fullname}
                          onChange={(e) => setFullname(e.target.value)}
                          placeholder="Họ và tên của bạn"
                          className="w-full text-xs font-semibold px-3 py-2.5 bg-white border border-rose-100 focus:outline-none focus:border-rose-brand rounded-xl"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Số điện thoại giao"
                          className="w-full text-xs font-semibold px-3 py-2.5 bg-white border border-rose-100 focus:outline-none focus:border-rose-brand rounded-xl"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Đồ ăn ship đến địa chỉ nào ở Phan Rang?"
                          className="w-full text-xs font-semibold px-3 py-2.5 bg-white border border-rose-100 focus:outline-none focus:border-rose-brand rounded-xl"
                        />
                      </div>

                      {errorMsg && (
                        <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold">
                          {errorMsg}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-rose-brand text-white hover:bg-rose-brand-dark hover:shadow-lg rounded-full font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer transition-transform active:scale-95 disabled:opacity-75"
                      >
                        <CreditCard className="w-4.5 h-4.5" />
                        {isSubmitting ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN ĐẶT HÀNG NGAY'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
