import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  Bell, 
  BellOff, 
  Volume2, 
  Calendar, 
  CheckCircle2, 
  Check, 
  Sparkles, 
  Printer, 
  ShieldCheck, 
  AlertCircle,
  Globe,
  Settings,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { 
  calculatePrayerTimes, 
  getDetailedPrayersList, 
  generateWeeklySchedule, 
  CALCULATION_METHODS,
  CalculationMethod
} from '../utils/prayerTimes';
import { DEFAULT_CITIES } from '../utils/qibla';
import { PrayerAlarmSettings, PrayerTimesSchedule } from '../types/islamicity';

export const PrayerTimeSchedulerSection: React.FC = () => {
  // Location state
  const [currentCityName, setCurrentCityName] = useState<string>('Depok (UPIC Limo)');
  const [latitude, setLatitude] = useState<number>(-6.3687);
  const [longitude, setLongitude] = useState<number>(106.7788);
  const [timezoneOffset, setTimezoneOffset] = useState<number>(7);
  const [isUsingGps, setIsUsingGps] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Calculation method state
  const [selectedMethod, setSelectedMethod] = useState<CalculationMethod>(CALCULATION_METHODS[0]);

  // Real-time clock state
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Alarm settings per prayer
  const [alarmSettings, setAlarmSettings] = useState<PrayerAlarmSettings>({
    imsak: false,
    subuh: true,
    terbit: false,
    dhuha: false,
    dzuhur: true,
    ashar: true,
    maghrib: true,
    isya: true
  });

  // Daily prayer completion tracker (persisted locally)
  const [completedPrayers, setCompletedPrayers] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem('islamicity_prayer_tracker_today');
    return saved ? JSON.parse(saved) : { subuh: true, dzuhur: false, ashar: false, maghrib: false, isya: false };
  });

  useEffect(() => {
    localStorage.setItem('islamicity_prayer_tracker_today', JSON.stringify(completedPrayers));
  }, [completedPrayers]);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute today's schedule
  const todaySchedule = calculatePrayerTimes(latitude, longitude, currentTime, timezoneOffset, selectedMethod);
  const { prayers, currentNextPrayer, timeRemainingMs } = getDetailedPrayersList(todaySchedule, currentTime);

  // Generate 7-day upcoming weekly schedule
  const weeklySchedule = generateWeeklySchedule(latitude, longitude, currentTime, timezoneOffset, selectedMethod);

  // Format countdown
  const formatCountdown = (ms: number): string => {
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Geolocation trigger
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation tidak didukung oleh browser Anda.');
      return;
    }
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        setIsUsingGps(true);
        setCurrentCityName(`Koordinat GPS (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`);

        // Estimate timezone for Indonesia
        if (lng >= 95 && lng < 114) {
          setTimezoneOffset(7); // WIB
        } else if (lng >= 114 && lng < 125) {
          setTimezoneOffset(8); // WITA
        } else if (lng >= 125) {
          setTimezoneOffset(9); // WIT
        }
      },
      (err) => {
        setGpsError(`Gagal membaca GPS: ${err.message}. Anda dapat memilih kota secara manual.`);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSelectCity = (city: typeof DEFAULT_CITIES[0]) => {
    setLatitude(city.latitude);
    setLongitude(city.longitude);
    setCurrentCityName(`${city.city}, ${city.country}`);
    setIsUsingGps(false);
    setGpsError(null);

    // Set appropriate timezone
    if (city.city.includes('Makassar')) {
      setTimezoneOffset(8);
    } else if (city.city.includes('London')) {
      setTimezoneOffset(0);
    } else if (city.city.includes('Kuala Lumpur')) {
      setTimezoneOffset(8);
    } else {
      setTimezoneOffset(7);
    }
  };

  const toggleAlarm = (key: string) => {
    setAlarmSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const togglePrayerCompletion = (key: string) => {
    setCompletedPrayers(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Play audio test for adhan
  const handlePlayAdhanSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      osc.frequency.exponentialRampToValueAtTime(554.37, audioCtx.currentTime + 0.4); // C#5
      osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.8); // E5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (_) {}
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header & Geolocation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-emerald-400" />
            <span>Jadwal Waktu Sholat & Pengingat Ibadah Berjamaah</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Penjadwalan astronomis akurat berdasarkan koordinat lintang & bujur kota Anda sesuai hisab Kemenag RI.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={handleGetLocation}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{isUsingGps ? 'GPS Aktif' : 'Deteksi GPS Kota Saya'}</span>
          </button>
        </div>
      </div>

      {gpsError && (
        <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Hero Live Countdown & Next Prayer Highlight Card */}
      <div className="relative rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-800/40 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          <div className="md:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{todaySchedule.date} · 1448 H</span>
            </div>

            <h3 className="text-xl sm:text-3xl font-extrabold text-white">
              Menuju Waktu <span className="text-amber-300">{currentNextPrayer?.name || 'Subuh'}</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Lokasi saat ini: <strong className="text-white">{currentCityName}</strong> (UTC+{timezoneOffset}).
              Luruskan niat dan persiapkan diri menyambut seruan adzan.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handlePlayAdhanSound}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Dengarkan simulasi nada adzan"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Uji Nada Pengingat</span>
              </button>
            </div>
          </div>

          {/* Big Countdown Box */}
          <div className="md:col-span-5 bg-slate-950/80 border border-emerald-600/30 rounded-2xl p-6 text-center shadow-inner">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest block mb-1">
              HITUNG MUNDUR WAKTU BERIKUTNYA
            </span>
            <div className="text-4xl sm:text-5xl font-mono font-black text-amber-300 tracking-tight tabular-nums">
              {formatCountdown(timeRemainingMs)}
            </div>
            <div className="text-xs text-slate-400 mt-2 font-mono tabular-nums">
              Masuk Waktu {currentNextPrayer?.name}: <strong className="text-white text-sm">{currentNextPrayer?.time} WIB</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Today's 8 Daily Prayer Times Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Jadwal Sholat Hari Ini ({todaySchedule.date})</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Standar Kemenag RI</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {prayers.map((prayer) => {
            const isAlarmOn = alarmSettings[prayer.key] ?? false;
            return (
              <div
                key={prayer.key}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-2 ${
                  prayer.isNext
                    ? 'bg-emerald-950/70 border-amber-400 shadow-lg shadow-emerald-950/80 ring-1 ring-amber-400/40'
                    : prayer.isPassed
                    ? 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-arabic text-amber-300 text-sm">{prayer.arabicName}</span>
                    <button
                      onClick={() => toggleAlarm(prayer.key)}
                      className={`p-1 rounded hover:bg-slate-800 transition-colors ${isAlarmOn ? 'text-emerald-400' : 'text-slate-600'}`}
                      title={isAlarmOn ? 'Pengingat Aktif' : 'Nyalakan Pengingat'}
                    >
                      {isAlarmOn ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <h4 className={`font-bold text-sm ${prayer.isNext ? 'text-amber-300' : 'text-white'}`}>
                    {prayer.name}
                  </h4>
                </div>

                <div>
                  <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white tabular-nums">
                    {prayer.time}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                    {prayer.isNext ? 'Berikutnya' : prayer.isPassed ? 'Telah lewat' : 'Akan datang'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Middle Section: Sholat Tracker & Quick City Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sholat Tracker 5 Waktu (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Mutaba'ah Sholat Fardhu Hari Ini</span>
            </h4>
            <span className="text-[11px] text-emerald-400 font-mono">
              {Object.values(completedPrayers).filter(Boolean).length}/5 Selesai
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Centang sholat fardhu yang telah Anda tunaikan secara berjamaah untuk menjaga kedisiplinan ibadah harian.
          </p>

          <div className="space-y-2">
            {[
              { key: 'subuh', name: 'Subuh (2 Rakaat)', time: todaySchedule.subuh },
              { key: 'dzuhur', name: 'Dzuhur (4 Rakaat)', time: todaySchedule.dzuhur },
              { key: 'ashar', name: 'Ashar (4 Rakaat)', time: todaySchedule.ashar },
              { key: 'maghrib', name: 'Maghrib (3 Rakaat)', time: todaySchedule.maghrib },
              { key: 'isya', name: 'Isya (4 Rakaat)', time: todaySchedule.isya }
            ].map((fardhu) => {
              const isChecked = completedPrayers[fardhu.key] ?? false;
              return (
                <div
                  key={fardhu.key}
                  onClick={() => togglePrayerCompletion(fardhu.key)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    isChecked
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-slate-200'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                      isChecked ? 'bg-emerald-500 text-slate-950' : 'border border-slate-700 bg-slate-900'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <strong className={`block ${isChecked ? 'text-white' : 'text-slate-300'}`}>
                        {fardhu.name}
                      </strong>
                      <span className="text-[11px] font-mono text-slate-400">{fardhu.time} WIB</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    isChecked ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isChecked ? 'Alhamdulillah' : 'Belum'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* City Selector & Calculation Methods (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Ganti Kota & Wilayah di Indonesia</span>
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">38 Provinsi</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DEFAULT_CITIES.slice(0, 9).map((c) => {
              const isSelected = currentCityName.includes(c.city);
              return (
                <button
                  key={c.city}
                  onClick={() => handleSelectCity(c)}
                  className={`py-2 px-3 rounded-lg text-left text-xs transition-colors flex flex-col ${
                    isSelected
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold shadow'
                      : 'bg-slate-950/70 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{c.city}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{c.country}</span>
                </button>
              );
            })}
          </div>

          {/* Calculation Method Selection */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Metode Perhitungan Hisab
            </label>
            <select
              value={selectedMethod.id}
              onChange={(e) => {
                const found = CALCULATION_METHODS.find(m => m.id === e.target.value);
                if (found) setSelectedMethod(found);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {CALCULATION_METHODS.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 7-Day Weekly Prayer Schedule Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Tabel Jadwal Sholat 7 Hari Kedepan ({currentCityName})</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Hisab astronomis presisi waktu masuk sholat fardhu dan imsakiyah.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Unduh Jadwal</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Hari & Tanggal</th>
                <th className="py-2.5 px-3">Imsak</th>
                <th className="py-2.5 px-3">Subuh</th>
                <th className="py-2.5 px-3">Syuruq</th>
                <th className="py-2.5 px-3">Dhuha</th>
                <th className="py-2.5 px-3">Dzuhur</th>
                <th className="py-2.5 px-3">Ashar</th>
                <th className="py-2.5 px-3">Maghrib</th>
                <th className="py-2.5 px-3">Isya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300 tabular-nums">
              {weeklySchedule.map((row, idx) => {
                const isTodayRow = idx === 0;
                return (
                  <tr key={idx} className={isTodayRow ? 'bg-emerald-950/30 font-semibold text-emerald-300' : 'hover:bg-slate-800/40'}>
                    <td className="py-2.5 px-3 font-sans text-white">
                      {row.date} {isTodayRow && '(Hari Ini)'}
                    </td>
                    <td className="py-2.5 px-3">{row.imsak}</td>
                    <td className="py-2.5 px-3 text-amber-300">{row.subuh}</td>
                    <td className="py-2.5 px-3 text-slate-500">{row.terbit}</td>
                    <td className="py-2.5 px-3">{row.dhuha}</td>
                    <td className="py-2.5 px-3 text-amber-300">{row.dzuhur}</td>
                    <td className="py-2.5 px-3 text-amber-300">{row.ashar}</td>
                    <td className="py-2.5 px-3 text-amber-300">{row.maghrib}</td>
                    <td className="py-2.5 px-3 text-amber-300">{row.isya}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dzikir & Doa Sesudah Adzan Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Doa Setelah Mendengar Adzan</span>
          </h4>
          <p className="font-arabic text-right text-base text-amber-200/90 leading-loose">
            اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ
          </p>
          <p className="text-[11px] text-slate-300 italic leading-relaxed">
            "Ya Allah, Tuhan yang memiliki seruan yang sempurna dan sholat yang senantiasa didirikan, berikanlah kepada Nabi Muhammad wasilah dan keutamaan, serta tempatkanlah beliau pada tempat terpuji yang telah Engkau janjikan." (HR. Bukhari).
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Keutamaan Menjaga Sholat di Awal Waktu</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dari Abdullah bin Mas'ud RA, ia berkata: "Aku bertanya kepada Rasulullah SAW: 'Amalan apakah yang paling dicintai Allah?' Beliau menjawab: <strong>'Sholat pada waktunya.'</strong>" (HR. Bukhari dan Muslim).
          </p>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            Jaringan dakwah Islamicity City Media menyiarkan pengingat adzan langsung dari masjid-masjid percontohan di seluruh kota kecamatan.
          </div>
        </div>
      </div>
    </div>
  );
};
