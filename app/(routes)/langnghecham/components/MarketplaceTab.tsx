

import React, { useState } from 'react';
import { Stall, Product } from '../types';
import { ShoppingBag, Phone, MapPin, Sparkles, Tag, Plus, X, Heart, MessageSquare, Check, Store, ShoppingCart } from 'lucide-react';

interface MarketplaceTabProps {
  stalls: Stall[];
  onAddStall: (newStall: Omit<Stall, 'id' | 'products'>) => Promise<void>;
  onAddProduct: (stallId: string, newProduct: Omit<Product, 'id'>) => Promise<void>;
  onAddToCart: (product: Product, stall: Stall) => void;
  onOpenCart: () => void;
  cartCount: number;
}

// Preset stall banners
const PRESET_BANNERS = [
  { id: 'b1', name: 'Vải dệt Chăm', url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=600&q=80' },
  { id: 'b2', name: 'Đất nung Bàu Trúc', url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80' },
  { id: 'b3', name: 'Khô dê Thảo mộc', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80' },
  { id: 'b4', name: 'Hạt giống sen Chăm', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80' }
];

export default function MarketplaceTab({ stalls, onAddStall, onAddProduct, onAddToCart, onOpenCart, cartCount }: MarketplaceTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'weaving' | 'pottery' | 'cuisine' | 'agriculture' | 'other'>('all');

  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  
  // Modals / forms state
  const [showStallForm, setShowStallForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  // New Stall Form
  const [newStallName, setNewStallName] = useState('');
  const [newStallOwner, setNewStallOwner] = useState('');
  const [newStallCategory, setNewStallCategory] = useState<'weaving' | 'pottery' | 'cuisine' | 'agriculture' | 'other'>('weaving');
  const [newStallPhone, setNewStallPhone] = useState('');
  const [newStallAddress, setNewStallAddress] = useState('');
  const [newStallDesc, setNewStallDesc] = useState('');
  const [newStallBanner, setNewStallBanner] = useState(PRESET_BANNERS[0].url);

  // New Product Form
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80');

  // Contact Message Form
  const [contactName, setContactName] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Error/Success
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [prodErrorMsg, setProdErrorMsg] = useState('');

  const handleRegisterStall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStallName.trim() || !newStallOwner.trim() || !newStallPhone.trim() || !newStallDesc.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ các trường thông tin bắt buộc.');
      return;
    }

    try {
      await onAddStall({
        name: newStallName.trim(),
        owner: newStallOwner.trim(),
        ownerTitle: "Nghệ nhân / Chủ hộ Chăm",
        description: newStallDesc.trim(),
        category: newStallCategory,
        phone: newStallPhone.trim(),
        address: newStallAddress.trim() || "Khu gian hàng Ngày hội Chăm Nha Trang",
        banner: newStallBanner,
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
      });

      // Clear state
      setNewStallName('');
      setNewStallOwner('');
      setNewStallPhone('');
      setNewStallAddress('');
      setNewStallDesc('');
      setErrorMsg('');
      setSuccessMsg('Đăng ký gian hàng online thành công! Gian hàng của bạn đã sẵn sàng bán hàng.');
      setShowStallForm(false);
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi đăng ký gian hàng.');
    }
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStall) return;
    if (!newProdName.trim() || !newProdPrice.trim()) {
      setProdErrorMsg('Vui lòng điền tên và giá bán sản phẩm.');
      return;
    }

    try {
      await onAddProduct(selectedStall.id, {
        name: newProdName.trim(),
        price: newProdPrice.trim() + 'đ',
        description: newProdDesc.trim(),
        image: newProdImage
      });

      // Refresh product view
      const updatedStall = stalls.find(s => s.id === selectedStall.id);
      if (updatedStall) {
        setSelectedStall(updatedStall);
      }

      setNewProdName('');
      setNewProdPrice('');
      setNewProdDesc('');
      setProdErrorMsg('');
      setShowProductForm(false);
    } catch (err: any) {
      setProdErrorMsg(err.message || 'Lỗi thêm sản phẩm.');
    }
  };

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMessage.trim()) return;
    
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setShowContactForm(false);
      setContactName('');
      setContactMessage('');
    }, 3000);
  };

  // Filter Stalls
  const filteredStalls = stalls.filter((stall) => {
    return selectedCategory === 'all' || stall.category === selectedCategory;
  });

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'weaving': return 'Dệt Thổ Cẩm';
      case 'pottery': return 'Gốm Bàu Trúc';
      case 'cuisine': return 'Ẩm Thực Chăm';
      case 'agriculture': return 'Nông Sản Sạch';
      default: return 'Khác';
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      {/* Intro section */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-semibold border border-rose-100">
          <ShoppingBag className="w-3.5 h-3.5 text-rose-600" />
          <span>CHỢ ONLINE GIAN HÀNG CHĂM</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
          Ghé Gian Hàng Online - Trải Nghiệm Sản Phẩm Chăm
        </h2>
        <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
          Tạo đòn bẩy kinh tế cho đồng bào người Chăm bằng cách kết nối trực tiếp khách tham quan lễ hội với các nghệ nhân nặn gốm, dệt vải thổ cẩm thủ công.
        </p>
      </section>

      {/* Control Buttons & Filter Categories */}
      <section className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 max-w-6xl mx-auto border-b border-rose-100 pb-4">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'weaving', 'pottery', 'cuisine', 'agriculture'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-rose-50 hover:text-rose-600'
              }`}
            >
              {cat === 'all' ? 'Tất Cả' : getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Register Button & Cart Button */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={onOpenCart}
            className="relative px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-rose-100 shadow-3xs"
          >
            <ShoppingCart className="w-4 h-4 text-rose-600" /> Giỏ Hàng
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setErrorMsg('');
              setSuccessMsg('');
              setShowStallForm(true);
            }}
            className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Store className="w-4 h-4 text-rose-400" /> Đăng Ký Gian Hàng Mới
          </button>
        </div>
      </section>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-xl font-medium max-w-2xl mx-auto">
          {successMsg}
        </div>
      )}

      {/* Stalls Grid */}
      <section className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredStalls.map((stall) => (
            <div
              key={stall.id}
              id={`stall-card-${stall.id}`}
              className="bg-white rounded-2xl border border-rose-100/60 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              {/* Banner */}
              <div className="relative h-32 bg-zinc-100">
                <img
                  src={stall.banner}
                  alt={stall.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-2 left-2 bg-white/95 text-rose-600 text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
                  {getCategoryLabel(stall.category)}
                </div>
              </div>

              {/* Header and Info */}
              <div className="p-5 space-y-4 flex flex-col flex-1">
                {/* Stall Identity */}
                <div className="flex items-start space-x-3">
                  <img
                    src={stall.avatar}
                    alt={stall.owner}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full border border-white -mt-7 relative z-10 shadow-sm bg-white"
                  />
                  <div>
                    <h3 className="text-base font-extrabold text-zinc-950 leading-tight truncate group-hover:text-rose-600 transition-colors">
                      {stall.name}
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-semibold">
                      {stall.owner} {stall.ownerTitle ? `(${stall.ownerTitle})` : ''}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-zinc-600 text-xs leading-relaxed flex-1">
                  {stall.description}
                </p>

                {/* Location & Contact Info lines */}
                <div className="space-y-1.5 text-[11px] text-zinc-500 pt-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <span className="truncate">{stall.address}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono font-medium">
                    <Phone className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                    <span>SĐT: {stall.phone}</span>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-rose-600 font-extrabold text-xs flex items-center gap-1 font-display">
                    <Tag className="w-3.5 h-3.5" /> {(stall.products || []).length} Sản phẩm
                  </span>

                  <button
                    onClick={() => setSelectedStall(stall)}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors"
                  >
                    Vào Gian Hàng
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredStalls.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-dashed border-zinc-200 text-zinc-500 space-y-2">
              <Store className="w-10 h-10 mx-auto text-zinc-300" />
              <p className="text-sm font-bold">Chưa có gian hàng online nào thuộc phân mục này.</p>
              <p className="text-xs text-zinc-400">Bạn là người kinh doanh Chăm? Hãy đăng ký gian hàng miễn phí ngay nhé!</p>
            </div>
          )}
        </div>
      </section>

      {/* Selected Stall Detail Modal */}
      {selectedStall && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center py-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-rose-100 flex flex-col animate-slide-up">
            {/* Banner top */}
            <div className="relative h-44 sm:h-52 w-full flex-shrink-0">
              <img
                src={selectedStall.banner}
                alt={selectedStall.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <button
                onClick={() => setSelectedStall(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 text-white pr-4">
                <span className="text-[9px] font-extrabold uppercase tracking-wider bg-rose-600 px-2 py-0.5 rounded-md">
                  {getCategoryLabel(selectedStall.category)}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">{selectedStall.name}</h3>
                <p className="text-zinc-200 text-xs mt-0.5">Người đại diện: {selectedStall.owner} ({selectedStall.ownerTitle})</p>
              </div>
            </div>

            {/* Inner Content scrollable */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Left: Stall Info */}
                <div className="md:col-span-4 space-y-4 bg-zinc-50 border border-zinc-200/50 p-4 rounded-2xl">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-display">Thông tin gian hàng</h4>
                    <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed">{selectedStall.description}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-200/60 text-xs text-zinc-600">
                    <div className="flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 mt-0.5 flex-shrink-0" />
                      <span>{selectedStall.address}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                      <span className="font-mono font-medium">{selectedStall.phone}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-200/60 flex flex-col gap-2">
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Gửi Lời Nhắn Cho Chủ
                    </button>
                    
                    <button
                      onClick={() => {
                        setProdErrorMsg('');
                        setShowProductForm(true);
                      }}
                      className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm Sản Phẩm Mới
                    </button>
                  </div>
                </div>

                {/* Right: Products List */}
                <div className="md:col-span-8 space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                    <h4 className="text-sm font-extrabold text-zinc-950">Danh Sách Sản Phẩm Đăng Bán</h4>
                    <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">
                      Chính chủ đồng bào đăng
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(selectedStall.products || []).map((prod) => (
                      <div key={prod.id} className="bg-white rounded-xl border border-zinc-200/60 overflow-hidden flex flex-col shadow-3xs hover:border-rose-200/80 transition-colors">
                        <div className="h-32 bg-zinc-100 relative">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-3xs">
                            {prod.price}
                          </div>
                        </div>
                        <div className="p-3 flex flex-col flex-1 space-y-2 text-left">
                          <h5 className="text-xs font-extrabold text-zinc-900 leading-tight">{prod.name}</h5>
                          <p className="text-[10px] text-zinc-500 flex-1 leading-relaxed line-clamp-2">{prod.description}</p>
                          
                          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-1 mt-auto">
                            <a
                              href={`tel:${selectedStall.phone}`}
                              className="text-[10px] font-bold text-zinc-500 hover:text-rose-600 flex items-center gap-0.5"
                              title="Gọi điện trao đổi trực tiếp"
                            >
                              <Phone className="w-3 h-3 text-rose-500" /> Gọi điện
                            </a>
                            <button
                              onClick={() => onAddToCart(prod, selectedStall)}
                              className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] rounded-lg cursor-pointer transition-all flex items-center gap-0.5 shadow-3xs"
                            >
                              <ShoppingCart className="w-3 h-3" /> Thêm giỏ hàng
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {(selectedStall.products || []).length === 0 && (
                    <div className="text-center py-10 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 text-zinc-500 space-y-1">
                      <ShoppingBag className="w-8 h-8 mx-auto text-zinc-300" />
                      <p className="text-xs font-bold">Gian hàng chưa đăng bán sản phẩm nào.</p>
                      <button
                        onClick={() => setShowProductForm(true)}
                        className="text-xs text-rose-600 font-bold hover:underline"
                      >
                        Click vào đây để thêm sản phẩm đầu tiên!
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Stall Modal Form */}
      {showStallForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-rose-100 p-6 sm:p-8 animate-slide-up space-y-5 text-left">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
              <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 flex items-center gap-1">
                <Store className="w-5 h-5 text-rose-600" /> Đăng Ký Gian Hàng Mới
              </h3>
              <button
                onClick={() => setShowStallForm(false)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterStall} className="space-y-4">
              {/* Stall name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 block uppercase">Tên gian hàng / Hộ kinh doanh Chăm <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="Ví dụ: Gốm Bàu Trúc Thảo Trang, Đặc sản Khô Chăm..."
                  value={newStallName}
                  onChange={(e) => setNewStallName(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs sm:text-sm"
                  required
                />
              </div>

              {/* Owner name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 block uppercase">Tên chủ gian hàng / Người liên hệ <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="Ví dụ: Đàng Văn Hòa, Sakay Linh..."
                  value={newStallOwner}
                  onChange={(e) => setNewStallOwner(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs sm:text-sm"
                  required
                />
              </div>

              {/* Phone and address row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block uppercase">Số điện thoại liên hệ <span className="text-rose-500">*</span></label>
                  <input
                    type="tel"
                    placeholder="Ví dụ: 0912345678"
                    value={newStallPhone}
                    onChange={(e) => setNewStallPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs sm:text-sm"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block uppercase">Phân mục sản phẩm</label>
                  <select
                    value={newStallCategory}
                    onChange={(e: any) => setNewStallCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs sm:text-sm bg-white"
                  >
                    <option value="weaving">Dệt Thổ Cẩm Chăm</option>
                    <option value="pottery">Gốm Bàu Trúc</option>
                    <option value="cuisine">Ẩm Thực Đặc Sản</option>
                    <option value="agriculture">Nông Sản Sạch</option>
                    <option value="other">Thương mại khác</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 block uppercase">Địa chỉ gian trưng bày tại Lễ hội</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Gian số 25, Quảng trường 2/4 Nha Trang"
                  value={newStallAddress}
                  onChange={(e) => setNewStallAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 block uppercase">Mô tả sản phẩm, văn hóa gia tộc <span className="text-rose-500">*</span></label>
                <textarea
                  rows={2}
                  placeholder="Giới thiệu về tinh hoa nghệ thuật, chất liệu sản xuất, xuất xứ làng nghề của gia tộc Chăm của bạn..."
                  value={newStallDesc}
                  onChange={(e) => setNewStallDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs sm:text-sm resize-none"
                  required
                ></textarea>
              </div>

              {/* Banner Preset */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 block uppercase">Chọn ảnh nền gian hàng:</label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_BANNERS.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setNewStallBanner(b.url)}
                      className={`relative h-12 rounded overflow-hidden border-2 transition-all cursor-pointer ${
                        newStallBanner === b.url ? 'border-rose-600 scale-[1.03] ring-2 ring-rose-200' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={b.url} alt={b.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded">{errorMsg}</p>
              )}

              {/* Submit and close buttons */}
              <div className="pt-2 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowStallForm(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Bỏ qua
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm shadow-rose-100"
                >
                  Đăng Ký Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Product Modal Form */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-rose-100 p-6 sm:p-8 animate-slide-up space-y-5 text-left z-60">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
              <h3 className="text-base font-extrabold text-zinc-900">
                Thêm Sản Phẩm Mới (vào: {selectedStall?.name})
              </h3>
              <button
                onClick={() => setShowProductForm(false)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 block uppercase">Tên sản phẩm dệt / gốm / ẩm thực <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="Ví dụ: Tượng thần Siva đất nung, Khăn rằn Chăm hoa vân..."
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs sm:text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block uppercase">Giá bán (bằng VNĐ) <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 150.000, 290.000"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs sm:text-sm"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block uppercase">Chọn mẫu ảnh nền sản phẩm</label>
                  <select
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs sm:text-sm bg-white"
                  >
                    <option value="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80">Gốm nung mộc mạc</option>
                    <option value="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80">Khăn dệt thổ cẩm</option>
                    <option value="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80">Túi đeo thổ cẩm</option>
                    <option value="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80">Bánh gừng cổ truyền</option>
                    <option value="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80">Khô dê thảo mộc rừng</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 block uppercase">Mô tả ngắn sản phẩm</label>
                <textarea
                  rows={2}
                  placeholder="Kích cỡ, chất liệu, tính năng vượt trội và quy trình làm tay..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs sm:text-sm resize-none"
                ></textarea>
              </div>

              {prodErrorMsg && (
                <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded">{prodErrorMsg}</p>
              )}

              <div className="pt-2 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Thêm Vào Bán
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Contact Modal Form */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl border border-rose-100 animate-slide-up text-left space-y-5">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
              <h3 className="text-base font-extrabold text-zinc-950">
                Gửi Lời Nhắn Cho Chủ Gian
              </h3>
              <button onClick={() => setShowContactForm(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {contactSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-950">Gửi lời nhắn thành công!</h4>
                  <p className="text-xs text-zinc-500 mt-1">Chủ gian hàng ({selectedStall?.owner}) sẽ liên hệ lại qua SĐT ngay lập tức.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendContact} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block uppercase">Tên của bạn / Số điện thoại</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Hoàng Anh - 0905123456"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs sm:text-sm"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block uppercase">Lời nhắn mua sản phẩm</label>
                  <textarea
                    rows={3}
                    placeholder="Ví dụ: Em muốn đặt mua 1 chiếc Khăn choàng hoa văn cổ kính giao về Khách sạn ở Nha Trang chiều nay nhé ạ..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs sm:text-sm resize-none"
                    required
                  ></textarea>
                </div>

                <div className="pt-2 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="px-4 py-2 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Bỏ qua
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Gửi Lời Nhắn
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
