import React, { useState, useEffect, useRef, useMemo } from 'react';
import { NavTab } from '../types/islamicity';
import {
  HIJRI_MONTHS_ID,
  gregorianToHijri,
  hijriToGregorian,
  getUpcomingIslamicEvents,
  formatGregorianId,
  formatInputDateValue,
} from '../utils/hijriCalendar';
import { 
  Tv, 
  Heart, 
  Calculator, 
  BookOpen, 
  Network, 
  BarChart3, 
  Gift, 
  Radio, 
  Clock, 
  Sparkles,
  Menu,
  X,
  Compass,
  Bell,
  MapPin,
  Calendar,
  ArrowLeftRight,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenQris: () => void;
  onOpenNotifications: () => void;
  sholawatCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenQris,
  onOpenNotifications,
  sholawatCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [todayDate, setTodayDate] = useState<Date>(() => new Date());

  // Hijri Converter & Upcoming Events Popover state
  const [isHijriPanelOpen, setIsHijriPanelOpen] = useState<boolean>(false);
  const [converterMode, setConverterMode] = useState<'g2h' | 'h2g'>('g2h');
  const [selectedGregorianStr, setSelectedGregorianStr] = useState<string>(() =>
    formatInputDateValue(new Date())
  );

  const initialHijri = useMemo(() => gregorianToHijri(new Date()), []);
  const [hijriDayInput, setHijriDayInput] = useState<number>(initialHijri.day);
  const [hijriMonthInput, setHijriMonthInput] = useState<number>(initialHijri.month);
  const [hijriYearInput, setHijriYearInput] = useState<number>(initialHijri.year);

  const hijriPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WIB'
      );
      setTodayDate((prev) =>
        prev.getDate() !== now.getDate() || prev.getMonth() !== now.getMonth()
          ? now
          : prev
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close Hijri popover on Escape or outside click
  useEffect(() => {
    if (!isHijriPanelOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsHijriPanelOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (hijriPanelRef.current && !hijriPanelRef.current.contains(e.target as Node)) {
        setIsHijriPanelOpen(false);
      }
    };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isHijriPanelOpen]);

  const todayHijri = useMemo(() => gregorianToHijri(todayDate), [todayDate]);
  const upcomingEvents = useMemo(
    () => getUpcomingIslamicEvents(todayDate, 5),
    [todayDate]
  );
  const nextEvent = upcomingEvents[0];

  const convertedFromGregorian = useMemo(() => {
    const [y, m, d] = selectedGregorianStr.split('-').map((v) => parseInt(v, 10));
    if (!y || !m || !d) return todayHijri;
    return gregorianToHijri(new Date(y, m - 1, d, 12, 0, 0));
  }, [selectedGregorianStr, todayHijri]);

  const convertedFromHijri = useMemo(() => {
    const safeYear = Math.min(1600, Math.max(1200, hijriYearInput || todayHijri.year));
    const safeMonth = Math.min(12, Math.max(1, hijriMonthInput));
    const safeDay = Math.min(30, Math.max(1, hijriDayInput));
    const gDate = hijriToGregorian(safeYear, safeMonth, safeDay);
    const todayNoon = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth(),
      todayDate.getDate(),
      12,
      0,
      0
    );
    const diffDays = Math.round(
      (gDate.getTime() - todayNoon.getTime()) / (1000 * 60 * 60 * 24)
    );
    return {
      gregorianDate: gDate,
      formatted: formatGregorianId(gDate),
      diffDays,
    };
  }, [hijriYearInput, hijriMonthInput, hijriDayInput, todayDate, todayHijri.year]);

  return (
    <header
      ref={hijriPanelRef}
      className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-emerald-900/30"
    >
      {/* Top Notification / Hijri Calendar & Sholawat Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-800/20 text-xs px-4 py-1.5 flex items-center justify-between gap-4 text-slate-300">
        <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap py-0.5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium shrink-0">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>GLOBAL.MEDIA.ISLAMICITY.TV</span>
          </div>

          <span className="text-slate-700" aria-hidden="true">·</span>

          {/* Hijri Date & Upcoming Islamic Event Trigger */}
          <button
            type="button"
            onClick={() => setIsHijriPanelOpen((prev) => !prev)}
            aria-expanded={isHijriPanelOpen}
            aria-controls="hijri-calendar-popover"
            className="flex items-center gap-1.5 text-[11px] text-amber-200 hover:text-amber-100 transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:underline"
            title="Buka Konverter Tanggal Hijriyah & Agenda Hari Besar Islam"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold tabular-nums">{todayHijri.formattedId}</span>
            {nextEvent && (
              <span className="hidden xl:inline text-slate-400">
                · Berikutnya: <strong className="text-emerald-300 font-medium">{nextEvent.title}</strong>{' '}
                <span className="tabular-nums">
                  ({nextEvent.daysUntil === 0
                    ? 'Hari ini'
                    : nextEvent.daysUntil === 1
                    ? 'Besok'
                    : `${nextEvent.daysUntil} hari lagi`})
                </span>
              </span>
            )}
            <ChevronDown
              className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${
                isHijriPanelOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          <span className="text-slate-700 hidden 2xl:inline" aria-hidden="true">·</span>

          <button
            type="button"
            onClick={() => onSelectTab('jadwal-sholat')}
            className="hidden 2xl:flex items-center gap-2.5 text-slate-400 text-[11px] hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0"
            title="Klik untuk melihat Jadwal Sholat Lengkap"
          >
            <span>Sholat:</span>
            <span>Subuh <strong className="text-slate-200 tabular-nums">04:32</strong></span>
            <span>Dzuhur <strong className="text-slate-200 tabular-nums">11:54</strong></span>
            <span>Ashar <strong className="text-slate-200 tabular-nums">15:10</strong></span>
            <span>Maghrib <strong className="text-slate-200 tabular-nums">17:59</strong></span>
            <span>Isya <strong className="text-slate-200 tabular-nums">19:10</strong></span>
          </button>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] tabular-nums whitespace-nowrap">
            <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="hidden sm:inline">Sholawat:</span>
            <strong>{sholawatCount.toLocaleString('id-ID')}</strong>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-[11px] font-mono tabular-nums pl-2 border-l border-slate-800 whitespace-nowrap">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>{currentTime || '09:00:00 WIB'}</span>
          </div>
        </div>
      </div>

      {/* Interactive Hijri Date Converter & Upcoming Islamic Events Popover */}
      {isHijriPanelOpen && (
        <div
          id="hijri-calendar-popover"
          className="absolute left-0 right-0 top-full z-50 border-b border-emerald-800/40 bg-slate-950/98 backdrop-blur-xl shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-bold text-white text-sm">
                  Kalender Hijriyah & Konverter Tanggal Islam
                </span>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <span className="text-slate-400">
                  Hari ini: <strong className="text-slate-200">{formatGregorianId(todayDate)}</strong>
                </span>
                <span className="text-slate-600" aria-hidden="true">/</span>
                <span className="text-amber-300 font-semibold tabular-nums">
                  {todayHijri.formattedId}
                </span>
                <span className="font-arabic text-emerald-300 text-sm">
                  ({todayHijri.monthNameAr})
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsHijriPanelOpen(false)}
                aria-label="Tutup panel kalender Hijriyah"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 6 cols: Bidirectional Hijri <-> Gregorian Converter */}
              <div className="lg:col-span-6 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
                    <span>Konverter Tanggal Masehi ↔ Hijriyah</span>
                  </div>

                  {/* Mode Switcher */}
                  <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setConverterMode('g2h')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
                        converterMode === 'g2h'
                          ? 'bg-emerald-600 text-slate-950 font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Masehi → Hijriyah
                    </button>
                    <button
                      type="button"
                      onClick={() => setConverterMode('h2g')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
                        converterMode === 'h2g'
                          ? 'bg-emerald-600 text-slate-950 font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Hijriyah → Masehi
                    </button>
                  </div>
                </div>

                {converterMode === 'g2h' ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label
                          htmlFor="gregorian-date-input"
                          className="block text-[11px] text-slate-400 mb-1"
                        >
                          Pilih Tanggal Masehi
                        </label>
                        <input
                          id="gregorian-date-input"
                          type="date"
                          value={selectedGregorianStr}
                          onChange={(e) => setSelectedGregorianStr(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 tabular-nums"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedGregorianStr(formatInputDateValue(todayDate))}
                        className="mt-5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 font-medium whitespace-nowrap"
                      >
                        Hari Ini
                      </button>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-950 border border-emerald-500/30 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[11px] text-slate-400">Hasil Konversi Hijriyah</div>
                        <div className="text-base font-bold text-amber-300 tabular-nums mt-0.5">
                          {convertedFromGregorian.weekdayId}, {convertedFromGregorian.formattedId}
                        </div>
                      </div>
                      <div className="text-right font-arabic text-xl text-emerald-300">
                        {convertedFromGregorian.day} {convertedFromGregorian.monthNameAr} {convertedFromGregorian.year}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label
                          htmlFor="hijri-day-select"
                          className="block text-[11px] text-slate-400 mb-1"
                        >
                          Tanggal (1–30)
                        </label>
                        <select
                          id="hijri-day-select"
                          value={hijriDayInput}
                          onChange={(e) => setHijriDayInput(Number(e.target.value))}
                          className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 tabular-nums"
                        >
                          {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="hijri-month-select"
                          className="block text-[11px] text-slate-400 mb-1"
                        >
                          Bulan Hijriyah
                        </label>
                        <select
                          id="hijri-month-select"
                          value={hijriMonthInput}
                          onChange={(e) => setHijriMonthInput(Number(e.target.value))}
                          className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                        >
                          {HIJRI_MONTHS_ID.map((m) => (
                            <option key={m.number} value={m.number}>
                              {m.number}. {m.nameId}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="hijri-year-input"
                          className="block text-[11px] text-slate-400 mb-1"
                        >
                          Tahun (H)
                        </label>
                        <input
                          id="hijri-year-input"
                          type="number"
                          min={1200}
                          max={1600}
                          value={hijriYearInput}
                          onChange={(e) => setHijriYearInput(Number(e.target.value))}
                          className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 tabular-nums"
                        />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-950 border border-emerald-500/30 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[11px] text-slate-400">Hasil Konversi Masehi</div>
                        <div className="text-base font-bold text-emerald-300 tabular-nums mt-0.5">
                          {convertedFromHijri.formatted}
                        </div>
                      </div>
                      <div className="text-right text-[11px] text-slate-400 tabular-nums">
                        {convertedFromHijri.diffDays === 0
                          ? 'Hari Ini'
                          : convertedFromHijri.diffDays > 0
                          ? `${convertedFromHijri.diffDays} hari lagi`
                          : `${Math.abs(convertedFromHijri.diffDays)} hari lalu`}
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <span className="text-slate-500">Cepat:</span>
                  {[
                    { label: '1 Ramadhan', month: 9, day: 1 },
                    { label: '1 Syawal', month: 10, day: 1 },
                    { label: '10 Dzulhijjah', month: 12, day: 10 },
                    { label: '1 Muharram', month: 1, day: 1 },
                  ].map((preset) => {
                    const targetYear =
                      preset.month < todayHijri.month ||
                      (preset.month === todayHijri.month && preset.day < todayHijri.day)
                        ? todayHijri.year + 1
                        : todayHijri.year;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setConverterMode('h2g');
                          setHijriDayInput(preset.day);
                          setHijriMonthInput(preset.month);
                          setHijriYearInput(targetYear);
                        }}
                        className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-300 transition-colors"
                      >
                        {preset.label} {targetYear} H
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right 6 cols: Upcoming Islamic Events Display */}
              <div className="lg:col-span-6 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Agenda Hari Besar & Sunnah Islam Mendatang</span>
                  </div>
                  <span className="text-[11px] text-slate-400 tabular-nums">
                    {upcomingEvents.length} agenda terdekat
                  </span>
                </div>

                <div className="divide-y divide-slate-800/80 max-h-[250px] overflow-y-auto pr-1">
                  {upcomingEvents.map((ev) => (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => {
                        setConverterMode('h2g');
                        setHijriDayInput(ev.hijriDay);
                        setHijriMonthInput(ev.hijriMonth);
                        setHijriYearInput(ev.hijriYear);
                      }}
                      className="w-full py-2.5 text-left hover:bg-slate-950/60 px-2 rounded-lg transition-colors flex items-start justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-white flex flex-wrap items-center gap-2">
                          <span>{ev.title}</span>
                          {ev.arabicTitle && (
                            <span className="font-arabic text-sm text-emerald-300/90 font-normal">
                              {ev.arabicTitle}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 tabular-nums">
                          <span>{ev.category}</span>
                          <span aria-hidden="true"> · </span>
                          <span className="text-amber-300">{ev.hijriFormatted}</span>
                          <span aria-hidden="true"> · </span>
                          <span>{ev.gregorianFormatted}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {ev.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`text-xs font-mono font-semibold tabular-nums ${
                            ev.daysUntil <= 3
                              ? 'text-amber-300'
                              : 'text-emerald-400'
                          }`}
                        >
                          {ev.daysUntil === 0
                            ? 'Hari Ini'
                            : ev.daysUntil === 1
                            ? 'Besok'
                            : `${ev.daysUntil} hari`}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 xl:gap-6 h-16">
          {/* Zone 1: Brand wordmark */}
          <button 
            onClick={() => onSelectTab('tv-radio')}
            className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600/30 transition-colors">
              <Tv className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-base xl:text-lg font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                Islamicity Media
              </span>
              <span className="block text-[10px] text-emerald-400/80 uppercase tracking-widest font-mono">
                City Media & Global TV
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-3.5 text-xs xl:text-[13px] font-medium text-slate-300 overflow-x-auto no-scrollbar">
            <button
              onClick={() => onSelectTab('tv-radio')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'tv-radio'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Live TV & Radio
            </button>
            <button
              onClick={() => onSelectTab('jadwal-sholat')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1 ${
                activeTab === 'jadwal-sholat'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Jadwal Sholat</span>
            </button>
            <button
              onClick={() => onSelectTab('kompas-kiblat')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1 ${
                activeTab === 'kompas-kiblat'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kompas Kiblat</span>
            </button>
            <button
              onClick={() => onSelectTab('peta-masjid')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1 ${
                activeTab === 'peta-masjid'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Peta Masjid</span>
            </button>
            <button
              onClick={() => onSelectTab('zakat-qris')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'zakat-qris'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Zakat & QRIS
            </button>
            <button
              onClick={() => onSelectTab('sholawat')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'sholawat'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Sholawat
            </button>
            <button
              onClick={() => onSelectTab('edukasi')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'edukasi'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Edukasi
            </button>
            <button
              onClick={() => onSelectTab('komunitas')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'komunitas'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Komunitas
            </button>
            <button
              onClick={() => onSelectTab('simpul-umat')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'simpul-umat'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Simpul
            </button>
            <button
              onClick={() => onSelectTab('analitik-upic')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'analitik-upic'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              UPIC Limo
            </button>
            <button
              onClick={() => onSelectTab('voucher-haji')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'voucher-haji'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Voucher Haji
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Notification Bell */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenNotifications}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors relative"
              title="Pengaturan Notifikasi & Pengingat Adzan"
              aria-label="Buka Pengaturan Notifikasi"
            >
              <Bell className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              onClick={onOpenQris}
              className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-emerald-400 rounded-lg hover:from-amber-300 hover:to-emerald-300 transition-all shadow-md shadow-emerald-950 whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Infaq & Zakat QRIS</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/95 border-b border-emerald-900/40 px-4 py-3 space-y-1 max-h-[75vh] overflow-y-auto">
          <button
            type="button"
            onClick={() => {
              setIsHijriPanelOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between bg-slate-950/80 text-amber-300 border border-slate-800 mb-1"
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{todayHijri.formattedId}</span>
            </span>
            <span className="text-[11px] text-emerald-300">Konverter & Agenda</span>
          </button>
          <button
            onClick={() => { onSelectTab('tv-radio'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
              activeTab === 'tv-radio' ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Tv className="w-4 h-4" /> Live TV & Radio ARTVISI
          </button>
          <button
            onClick={() => { onSelectTab('jadwal-sholat'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
              activeTab === 'jadwal-sholat' ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" /> Jadwal Waktu Sholat
          </button>
          <button
            onClick={() => { onSelectTab('kompas-kiblat'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
              activeTab === 'kompas-kiblat' ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" /> Kompas Kiblat Magnetometer
          </button>
          <button
            onClick={() => { onSelectTab('peta-masjid'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
              activeTab === 'peta-masjid' ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" /> Peta Masjid Terdekat & Jejaring Islamicity
          </button>
          <button
            onClick={() => { onSelectTab('zakat-qris'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
              activeTab === 'zakat-qris' ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" /> Kalkulator Zakat & QRIS
          </button>
          <button
            onClick={() => { onSelectTab('sholawat'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
              activeTab === 'sholawat' ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Heart className="w-4 h-4" /> Gerakan Jutaan Sholawat
          </button>
          <button
            onClick={() => { onSelectTab('edukasi'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
              activeTab === 'edukasi' ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Edukasi & Konsep Islamicity
          </button>
          <button
            onClick={() => { onSelectTab('komunitas'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
              activeTab === 'komunitas' ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Komunitas & Mutaba'ah Al-Qur'an
          </button>
          <button
            onClick={() => { onSelectTab('simpul-umat'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
              activeTab === 'simpul-umat' ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Network className="w-4 h-4" /> Direktori Simpul Pejuang (700+)
          </button>
          <button
            onClick={() => { onSelectTab('analitik-upic'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
              activeTab === 'analitik-upic' ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Analitik Dampak & BEP UPIC Limo
          </button>
          <button
            onClick={() => { onSelectTab('voucher-haji'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
              activeTab === 'voucher-haji' ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Gift className="w-4 h-4" /> Voucher Belanja Haji & Hadiah
          </button>
          <button
            onClick={() => { onOpenNotifications(); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 text-amber-300 hover:bg-slate-800 border-t border-slate-800/80 mt-1"
          >
            <Bell className="w-4 h-4 text-emerald-400" /> Pengaturan Notifikasi Web & Adzan
          </button>
        </div>
      )}
    </header>
  );
};
