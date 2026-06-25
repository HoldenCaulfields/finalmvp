import React, { useState } from 'react';
import { ScheduleItem } from '../types';
import { Clock, MapPin, Sparkles, CalendarDays, AlertCircle } from 'lucide-react';

interface ScheduleTabProps {
  schedule: ScheduleItem[];
}

export default function ScheduleTab({ schedule }: ScheduleTabProps) {
  const [selectedType, setSelectedType] = useState<'all' | 'main' | 'culture' | 'workshop' | 'exhibition'>('all');

  const types = [
    { value: 'all', label: 'Tất Cả Hoạt Động' },
    { value: 'main', label: 'Sự Kiện Chính' },
    { value: 'culture', label: 'Văn Hóa & Ẩm Thực' },
    { value: 'workshop', label: 'Trình Diễn Làng Nghề' },
    { value: 'exhibition', label: 'Triển Lãm & Hội Thảo' },
  ];

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'main':
        return { bg: 'bg-rose-600 text-white', label: 'Lễ Hội Chính' };
      case 'culture':
        return { bg: 'bg-rose-50 text-rose-700 border border-rose-100', label: 'Văn Hóa & Ẩm Thực' };
      case 'workshop':
        return { bg: 'bg-zinc-900 text-white', label: 'Trình Diễn Nghệ Nhân' };
      case 'exhibition':
        return { bg: 'bg-amber-50 text-amber-800 border border-amber-100', label: 'Hội Thảo / Triển Lãm' };
      default:
        return { bg: 'bg-zinc-100 text-zinc-600', label: 'Hoạt Động Khác' };
    }
  };

  // Lọc danh sách lịch trình
  const filteredSchedule = schedule.filter((item) => {
    const matchType = selectedType === 'all' || item.type === selectedType;
    return matchType;
  });

  const getDayLabel = (dateStr: string) => {
    if (dateStr === '2026-06-26') return 'Thứ Sáu, 26 tháng 6';
    if (dateStr === '2026-06-27') return 'Thứ Bảy, 27 tháng 6';
    if (dateStr === '2026-06-28') return 'Chủ Nhật, 28 tháng 6';
    return dateStr;
  };

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      {/* Tab Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-semibold border border-rose-100">
          <CalendarDays className="w-3.5 h-3.5 text-rose-600" />
          <span>LỊCH TRÌNH CHÍNH THỨC</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
          Khám Phá Các Hoạt Động Lễ Hội Văn Hóa Chăm
        </h2>
        <p className="text-xs text-zinc-500 font-medium">Diễn ra từ ngày 26/06 đến 28/06/2026</p>
      </section>

      {/* Filtering Toolbar */}
      <section className="bg-white p-5 rounded-2xl border border-rose-100/50 shadow-xs space-y-4 max-w-4xl mx-auto">
        {/* Bộ lọc Phân loại hoạt động */}
        <div className="space-y-2 pt-3 border-t border-zinc-100">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Phân loại hoạt động:</span>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  selectedType === type.value
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Chronological Timeline */}
      <section className="max-w-3xl mx-auto relative">
        <div className="absolute left-4 sm:left-1/2 top-2 bottom-2 w-0.5 bg-zinc-200 -translate-x-1/2 hidden sm:block"></div>

        <div className="space-y-8">
          {filteredSchedule.map((item, index) => {
            const isEven = index % 2 === 0;
            const typeStyle = getTypeStyle(item.type);

            return (
              <div
                key={item.id}
                id={`schedule-item-${item.id}`}
                className="relative flex flex-col sm:flex-row items-stretch sm:justify-between w-full group"
              >
                {/* Timeline Dot Icon */}
                <div className="absolute left-4 sm:left-1/2 w-8 h-8 rounded-full bg-white border-2 border-rose-500 shadow-xs flex items-center justify-center -translate-x-1/2 z-10 top-0 group-hover:scale-110 transition-transform hidden sm:flex">
                  <Clock className="w-3.5 h-3.5 text-rose-600" />
                </div>

                {/* Content Card */}
                <div className={`w-full sm:w-[46%] ${isEven ? 'sm:order-first text-left sm:text-right' : 'sm:order-last text-left'}`}>
                  <div className="bg-white rounded-2xl border border-rose-100/60 p-5 sm:p-6 shadow-3xs hover:shadow-xs transition-all space-y-3 relative">
                    <div className={`flex items-center gap-2 flex-wrap ${isEven ? 'sm:justify-end' : 'justify-start'}`}>
                      <span className="text-[10px] text-zinc-500 font-bold font-mono bg-zinc-100 px-2 py-0.5 rounded">
                        {getDayLabel(item.date)}
                      </span>
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${typeStyle.bg}`}>
                        {typeStyle.label}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-extrabold text-zinc-900 leading-snug">
                      {item.title}
                    </h4>

                    {/* Time & Location */}
                    <div className={`flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-zinc-500 ${isEven ? 'sm:justify-end' : 'justify-start'}`}>
                      <span className="font-bold flex items-center gap-1 text-zinc-800 bg-rose-50/50 px-2 py-1 rounded border border-rose-100/30">
                        <Clock className="w-3.5 h-3.5 text-rose-500" /> {item.time}
                      </span>
                      <span className="flex items-center gap-1 truncate max-w-xs font-medium">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" /> {item.location}
                      </span>
                    </div>

                    <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="w-0 sm:w-[46%] hidden sm:block"></div>
              </div>
            );
          })}
        </div>

          {filteredSchedule.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-zinc-200 text-zinc-500 space-y-2">
            <AlertCircle className="w-10 h-10 mx-auto text-zinc-300" />
            <p className="text-sm font-bold">Không tìm thấy hoạt động phù hợp bộ lọc.</p>
            <p className="text-xs text-zinc-400">Vui lòng chọn ngày khác hoặc đổi phân loại lọc hoạt động để theo dõi nhé!</p>
          </div>
        )}
      </section>

      {/* Info Warning */}
      <section className="bg-zinc-900 text-white rounded-2xl p-6 text-center max-w-2xl mx-auto space-y-2">
        <p className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center justify-center gap-1">
          <Sparkles className="w-4 h-4 text-rose-500" /> Lưu ý thời gian thực tế
        </p>
        <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
          Chương trình Ngày hội diễn ra tập trung tại **Quảng trường 16/4 (Phan Rang - Tháp Chàm)**. Lịch thi văn nghệ, thể thao có thể thay đổi nhẹ tùy thuộc vào tiến độ điều phối thực tế từ Ban tổ chức địa phương.
        </p>
      </section>
    </div>
  );
}