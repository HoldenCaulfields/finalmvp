'use client';

import React, { useEffect, useState } from 'react';
import { useViewStore } from "@/stores/useViewStore";
import { Sparkles, Check, ShieldAlert, X, MapPin } from 'lucide-react';

export default function CreateMarkerModal() {
  const categories = useViewStore((s) => s.categories);
  const setCategories = useViewStore((s) => s.setCategories);
  const cancelSelection = useViewStore((s) => s.cancelSelection);
  const isCreateOpen = useViewStore((s) => s.isCreateOpen);
  const draftLatLng = useViewStore((s) => s.draftLatLng);

  const [creationType, setCreationType] = useState<'sub' | 'main'>('sub');
  const [title, setTitle] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [selectedParentId, setSelectedParentId] = useState('');
  const [subType, setSubType] = useState('food');
  const [mainIconType, setMainIconType] = useState('startup');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (categories.length > 0 && !selectedParentId) {
      setSelectedParentId(categories[0].id);
    }
  }, [categories, selectedParentId]);

  useEffect(() => {
    if (draftLatLng) {
      setLatitude(draftLatLng[0].toFixed(6));
      setLongitude(draftLatLng[1].toFixed(6));
    }
  }, [draftLatLng]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !latitude || !longitude) return;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (creationType === 'sub') {
      const updatedCategories = categories.map(cat => {
        if (cat.id === selectedParentId) {
          return {
            ...cat,
            subMarkers: [
              ...cat.subMarkers,
              {
                id: `sub_${Date.now()}`,
                position: [lat, lng] as [number, number],
                title,
                type: subType
              }
            ]
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
    } else {
      const newCategory = {
        id: `main_${Date.now()}`,
        title,
        position: [lat, lng] as [number, number],
        iconType: mainIconType as any,
        zoomLevel: 13,
        subMarkers: []
      };
      setCategories([...categories, newCategory]);
    }

    setIsSuccess(true);
    setTitle('');
    setTimeout(() => {
      setIsSuccess(false);
      cancelSelection();
    }, 2000);
  };

  if (!isCreateOpen) return null;

  return (
    <div className="fixed inset-x-0 top-16 px-3 md:absolute md:top-20 md:right-4 md:left-auto md:px-0 z-[1100] flex justify-center md:block">
      <div className="w-full max-w-lg md:max-w-md animate-in fade-in slide-in-from-top-5 duration-300">

        <div className="bg-white/90 backdrop-blur-xl border border-zinc-200/60 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-all">

          {/* Header */}
          <div className="p-5 border-b border-zinc-100 bg-zinc-50/60 flex items-center justify-between">
            <div>
              <h3 className="text-sm md:text-base font-black tracking-wide text-zinc-900">
                Chi tiết địa điểm
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Đặt tên và phân loại vị trí
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-50 to-white flex items-center justify-center border border-rose-100">
                <Sparkles className="w-4 h-4 text-rose-600" />
              </div>

              <button
                onClick={cancelSelection}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-5">

            {/* Coordinates */}
            <div className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border flex items-center justify-center shadow-sm">
                <MapPin className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xs text-zinc-600">
                {latitude ? `${latitude}, ${longitude}` : 'Chưa có tọa độ'}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-[11px] font-bold text-zinc-500 uppercase">
                Tên địa điểm
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 outline-none"
              />
            </div>

            {/* Sub form */}
            {creationType === 'sub' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                <select
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  className="p-3 rounded-xl border bg-zinc-50 text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </select>

                <select
                  value={subType}
                  onChange={(e) => setSubType(e.target.value)}
                  className="p-3 rounded-xl border bg-zinc-50 text-sm"
                >
                  <option value="food">🍲 Ăn uống</option>
                  <option value="shop">🛍️ Mua sắm</option>
                  <option value="office">🏢 Văn phòng</option>
                  <option value="student">👥 Nhóm</option>
                </select>

              </div>
            ) : (
              <select
                value={mainIconType}
                onChange={(e) => setMainIconType(e.target.value)}
                className="w-full p-3 rounded-xl border bg-zinc-50 text-sm"
              >
                <option value="startup">🚀 Startup</option>
                <option value="market">🏪 Market</option>
                <option value="cinema">🎬 Cinema</option>
                <option value="jobs">💼 Jobs</option>
              </select>
            )}

            {/* Toggle */}
            <div className="flex p-1 bg-zinc-100 rounded-xl">
              <button
                type="button"
                onClick={() => setCreationType('sub')}
                className={`flex-1 py-2 text-xs rounded-lg ${
                  creationType === 'sub'
                    ? 'bg-white shadow text-zinc-900'
                    : 'text-zinc-500'
                }`}
              >
                📍 Thường
              </button>

              <button
                type="button"
                onClick={() => setCreationType('main')}
                className={`flex-1 py-2 text-xs rounded-lg ${
                  creationType === 'main'
                    ? 'bg-zinc-900 text-white shadow'
                    : 'text-zinc-500'
                }`}
              >
                🌟 Nâng cao
              </button>
            </div>

            {/* Notice */}
            {creationType === 'main' && (
              <div className="p-3 bg-zinc-900 text-white rounded-xl text-xs flex gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>
                  Dành cho đối tác, sẽ được xác minh trong 24h
                </span>
              </div>
            )}

            {/* Submit */}
            {isSuccess ? (
              <div className="py-3 bg-emerald-50 border text-emerald-600 rounded-xl text-sm flex justify-center items-center gap-2">
                <Check className="w-4 h-4" />
                Thành công!
              </div>
            ) : (
              <button
                type="submit"
                className={`w-full py-3 text-sm font-bold rounded-xl transition-all active:scale-[0.98]
                ${
                  creationType === 'sub'
                    ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white'
                    : 'bg-zinc-900 text-white'
                }`}
              >
                {creationType === 'sub'
                  ? 'Hoàn tất'
                  : 'Đăng ký'}
              </button>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}