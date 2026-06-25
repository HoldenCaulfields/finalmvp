
import React, { useState } from 'react';
import { ScheduleItem } from '../types';
import { Clock, MapPin, Filter, Sparkles, CalendarDays, BookOpen, AlertCircle } from 'lucide-react';

interface ScheduleTabProps {
  schedule: ScheduleItem[];
}

export default function ScheduleTab({ schedule }: ScheduleTabProps) {
  const [selectedDay, setSelectedDay] = useState<'all' | '2026-06-26' | '2026-06-27' | '2026-06-28'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'main' | 'culture' | 'workshop' | 'exhibition'>('all');

  const days = [
    { value: 'all', label: 'Tất Cả Ngày' },
    { value: '2026-06-26', label: 'Ngày 26/06 (Khai Mạc)' },
    { value: '2026-06-27', label: 'Ngày 27/06 (Hội Thảo & Hội Thi)' },
    { value: '2026-06-28', label: 'Ngày 28/06 (Thể Thao & Bế Mạc)' },
  ];

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

  // Filter schedule list
  const filteredSchedule = schedule.filter((item) => {
    const matchDay = selectedDay === 'all' || item.date === selectedDay;
    const matchType = selectedType === 'all' || item.type === selectedType;
    return matchDay && matchType;
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
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-serif">
          Khám Phá Hoạt Động Lễ Hội Chăm VI
        </h2>
        <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
          Đừng bỏ lỡ các màn trống hội rộn rã, trình diễn dệt vải thổ cẩm của nghệ nhân, hội thi ẩm thực và đêm múa hội dân tộc lung linh diễn ra từ 26/06 đến 28/06/2026.
        </p>
      </section>

      {/* Filtering Toolbar */}
      <section className="bg-white p-5 rounded-2xl border border-rose-100/50 shadow-xs space-y-4 max-w-4xl mx-auto">
        {/* Filter by Day */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Chọn ngày diễn ra:</span>
          <div className="flex flex-wrap gap-2">
            {days.map((day) => (
              <button
                key={day.value}
                onClick={() => setSelectedDay(day.value as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  selectedDay === day.value
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter by Category */}
        <div className="space-y-2 pt-2 border-t border-zinc-100">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Phân loại hoạt động:</span>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  selectedType === type.value
                    ? 'bg-zinc-950 text-white shadow-xs'
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
        {/* Decorative central line for timeline on desktop */}
        <div className="absolute left-4 sm:left-1/2 top-2 bottom-2 w-0.5 bg-zinc-200 -translate-x-1/2 hidden sm:block"></div>

        {/* List of items */}
        <div className="space-y-8">
          {filteredSchedule.map((item, index) => {
            const isEven = index % 2 === 0;
            const typeStyle = getTypeStyle(item.type);

            return (
              <div
                key={item.id}
                id={`schedule-item-${item.id}`}
                className={`relative flex flex-col sm:flex-row items-stretch sm:justify-between w-full group`}
              >
                {/* Timeline Dot Icon */}
                <div className="absolute left-4 sm:left-1/2 w-8 h-8 rounded-full bg-white border-2 border-rose-500 shadow-xs flex items-center justify-center -translate-x-1/2 z-10 top-0 group-hover:scale-110 transition-transform hidden sm:flex">
                  <Clock className="w-3.5 h-3.5 text-rose-600" />
                </div>

                {/* Left Side Container (takes full width on mobile, half on desktop) */}
                <div className={`w-full sm:w-[46%] ${isEven ? 'sm:order-first text-left sm:text-right' : 'sm:order-last text-left'}`}>
                  {/* Outer card wrapping event details */}
                  <div className="bg-white rounded-2xl border border-rose-100/60 p-5 sm:p-6 shadow-3xs hover:shadow-xs transition-all space-y-3 relative">
                    {/* Corner date badge for quick scan */}
                    <div className="flex items-center justify-between sm:justify-start gap-2 flex-wrap">
                      <span className="text-[10px] text-zinc-500 font-bold font-mono bg-zinc-100 px-2 py-0.5 rounded">
                        {getDayLabel(item.date)}
                      </span>
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${typeStyle.bg}`}>
                        {typeStyle.label}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-extrabold text-zinc-900 font-serif leading-snug">
                      {item.title}
                    </h4>

                    {/* Time & Place Details Row */}
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

                {/* Placeholders on the opposite side to balance grid on desktop */}
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
          <Sparkles className="w-4 h-4 text-rose-500 animate-spin" /> Lưu ý thời gian thực tế
        </p>
        <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
          Chương trình Ngày hội diễn ra liên tục tại bãi biển Nha Trang và Tháp Bà Po Nagar. Lịch thi ẩm thực có thể thay đổi nhẹ tùy thuộc vào tiến độ của từng đoàn nghệ thuật địa phương.
        </p>
      </section>
    </div>
  );
}
