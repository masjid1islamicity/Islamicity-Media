import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  MapPin, 
  Bell, 
  BellOff, 
  BellRing,
  Volume2, 
  Calendar, 
  CheckCircle2, 
  Check, 
  Sparkles, 
  Printer, 
  ShieldCheck, 
  AlertCircle,
  Globe,
  BookOpen,
  Send
} from 'lucide-react';
import { 
  calculatePrayerTimes, 
  getDetailedPrayersList, 
  generateWeeklySchedule, 
  CALCULATION_METHODS,
  CalculationMethod
} from '../utils/prayerTimes';
import { DEFAULT_CITIES } from '../utils/qibla';
import { PrayerAlarmSettings } from '../types/islamicity';
import {
  getNotificationPermissionStatus,
  requestNotificationPermission,
  sendWebNotification,
  loadNotificationPreferences,
} from '../services/notificationService';

const PRAYER_PUSH_STORAGE_KEY = 'islamicity_prayer_push_alerts';
const PRAYER_NOTIFIED_STORAGE_KEY = 'islamicity_prayer_notified_today';

const DEFAULT_PRAYER_ALARMS: PrayerAlarmSettings = {
  imsak: false,
  subuh: true,
  terbit: false,
  dhuha: false,
  dzuhur: true,
  ashar: true,
  maghrib: true,
  isya: true
};

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

  // Browser Web Notification API permission state
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>(() =>
    getNotificationPermissionStatus()
  );
  const [notificationFeedback, setNotificationFeedback] = useState<{
    type: 'success' | 'warning' | 'info';
    message: string;
  } | null>(null);
  const [livePrayerAlert, setLivePrayerAlert] = useState<{
    name: string;
    time: string;
  } | null>(null);

  // Per-prayer push notification toggles (persisted in localStorage)
  const [alarmSettings, setAlarmSettings] = useState<PrayerAlarmSettings>(() => {
    try {
      const saved = localStorage.getItem(PRAYER_PUSH_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PRAYER_ALARMS, ...JSON.parse(saved) };
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_PRAYER_ALARMS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(PRAYER_PUSH_STORAGE_KEY, JSON.stringify(alarmSettings));
    } catch {
      // ignore storage errors
    }
  }, [alarmSettings]);

  // Track which prayers already fired a notification today to prevent duplicates
  const notifiedPrayersRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PRAYER_NOTIFIED_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          notifiedPrayersRef.current = new Set(parsed);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Sync permission state when window regains focus (e.g. user changed browser setting)
  useEffect(() => {
    const syncPermission = () => setNotificationPermission(getNotificationPermissionStatus());
    window.addEventListener('focus', syncPermission);
    return () => window.removeEventListener('focus', syncPermission);
  }, []);

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

  // Helper to dispatch a prayer time Web Notification safely once per prayer per day
  const dispatchPrayerAlert = (prayerName: string, prayerKey: string, prayerTime: string) => {
    const dateKey = new Date().toISOString().slice(0, 10);
    const dedupeKey = `${dateKey}:${prayerKey}`;
    if (notifiedPrayersRef.current.has(dedupeKey)) return;

    notifiedPrayersRef.current.add(dedupeKey);
    try {
      // Keep only today's entries in storage
      const todayEntries = Array.from(notifiedPrayersRef.current).filter((k) =>
        k.startsWith(dateKey)
      );
      localStorage.setItem(PRAYER_NOTIFIED_STORAGE_KEY, JSON.stringify(todayEntries));
    } catch {
      // ignore storage errors
    }

    const prefs = loadNotificationPreferences();
    const isFardhu = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].includes(prayerKey);
    const title = isFardhu
      ? `Waktu Sholat ${prayerName} (${prayerTime})`
      : `Pengingat Waktu ${prayerName} (${prayerTime})`;
    const body = isFardhu
      ? `Allahu Akbar, telah masuk waktu ${prayerName} untuk wilayah ${currentCityName}. Mari bersiap menunaikan sholat.`
      : `Telah masuk waktu ${prayerName} (${prayerTime}) untuk wilayah ${currentCityName}.`;

    sendWebNotification(title, {
      body,
      tag: `islamicity-prayer-${dedupeKey}`,
      requireInteraction: isFardhu,
      playSound: prefs.soundEnabled,
    });

    setLivePrayerAlert({ name: prayerName, time: prayerTime });
  };

  // Monitor current time every tick and fire push notification when an enabled prayer time arrives
  useEffect(() => {
    const nowMs = currentTime.getTime();
    for (const prayer of prayers) {
      if (!alarmSettings[prayer.key]) continue;
      if (nowMs >= prayer.timestamp && nowMs < prayer.timestamp + 60_000) {
        dispatchPrayerAlert(prayer.name, prayer.key, prayer.time);
      }
    }
  }, [currentTime, prayers, alarmSettings, currentCityName]);

  // Also schedule an exact timeout for the next enabled prayer today
  useEffect(() => {
    const nowMs = Date.now();
    const nextEnabled = prayers.find(
      (p) => alarmSettings[p.key] && p.timestamp > nowMs
    );
    if (!nextEnabled) return;

    const delayMs = nextEnabled.timestamp - nowMs;
    // Cap timeout at 24h to avoid 32-bit timer overflow
    if (delayMs <= 0 || delayMs > 24 * 60 * 60 * 1000) return;

    const timeoutId = window.setTimeout(() => {
      dispatchPrayerAlert(nextEnabled.name, nextEnabled.key, nextEnabled.time);
    }, delayMs);

    return () => window.clearTimeout(timeoutId);
  }, [prayers, alarmSettings, currentCityName]);

  const showFeedback = (type: 'success' | 'warning' | 'info', message: string) => {
    setNotificationFeedback({ type, message });
    window.setTimeout(() => {
      setNotificationFeedback((prev) => (prev?.message === message ? null : prev));
    }, 5000);
  };

  const handleRequestBrowserPermission = async () => {
    if (notificationPermission === 'unsupported') {
      showFeedback('warning', 'Browser Anda tidak mendukung Web Notification API.');
      return;
    }
    const granted = await requestNotificationPermission();
    const updatedStatus = getNotificationPermissionStatus();
    setNotificationPermission(updatedStatus);
    if (granted) {
      showFeedback(
        'success',
        'Izin notifikasi push aktif! Anda akan menerima pengingat otomatis saat masuk waktu sholat yang dipilih.'
      );
      sendWebNotification('Pengingat Sholat Islamicity Aktif', {
        body: `Notifikasi push waktu sholat untuk ${currentCityName} telah diaktifkan.`,
        tag: 'islamicity-prayer-permission-ready',
      });
    } else if (updatedStatus === 'denied') {
      showFeedback(
        'warning',
        'Izin notifikasi diblokir browser. Buka pengaturan situs (ikon gembok di bilah URL) lalu ubah Notifikasi ke "Izinkan".'
      );
    }
  };

  const handleTestPrayerPushNotification = async () => {
    if (notificationPermission === 'unsupported') {
      showFeedback('warning', 'Web Notification API tidak tersedia di browser ini.');
      return;
    }
    if (notificationPermission === 'default') {
      const granted = await requestNotificationPermission();
      setNotificationPermission(getNotificationPermissionStatus());
      if (!granted) {
        showFeedback('warning', 'Izin notifikasi belum diberikan sehingga notifikasi browser tidak dapat ditampilkan.');
        return;
      }
    }
    if (getNotificationPermissionStatus() === 'denied') {
      showFeedback(
        'warning',
        'Notifikasi diblokir oleh browser. Izinkan notifikasi di setelan situs untuk menerima push alert.'
      );
      return;
    }

    const target = currentNextPrayer || prayers[1];
    const sent = sendWebNotification(`Uji Pengingat: Waktu ${target.name} (${target.time})`, {
      body: `Simulasi notifikasi waktu sholat untuk ${currentCityName}. Pengingat per waktu sholat siap digunakan.`,
      tag: 'islamicity-prayer-test',
      playSound: true,
    });

    if (sent) {
      showFeedback('success', `Notifikasi push uji coba untuk waktu ${target.name} berhasil dikirim!`);
    }
  };

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

  const toggleAlarm = async (key: string, label: string, timeStr: string) => {
    const nextValue = !(alarmSettings[key] ?? false);

    setAlarmSettings(prev => ({
      ...prev,
      [key]: nextValue
    }));

    if (nextValue) {
      const currentStatus = getNotificationPermissionStatus();
      setNotificationPermission(currentStatus);

      if (currentStatus === 'unsupported') {
        showFeedback(
          'info',
          `Pengingat ${label} (${timeStr}) disimpan, namun browser ini tidak mendukung Web Notification API.`
        );
      } else if (currentStatus === 'default') {
        const granted = await requestNotificationPermission();
        const updatedStatus = getNotificationPermissionStatus();
        setNotificationPermission(updatedStatus);
        if (granted) {
          showFeedback('success', `Push notifikasi untuk ${label} (${timeStr}) aktif dan diizinkan browser.`);
        } else {
          showFeedback(
            'warning',
            `Pengingat ${label} diaktifkan, namun izin notifikasi browser belum diberikan.`
          );
        }
      } else if (currentStatus === 'denied') {
        showFeedback(
          'warning',
          `Pengingat ${label} diaktifkan, tetapi notifikasi browser sedang diblokir. Izinkan di pengaturan situs agar alert muncul.`
        );
      } else {
        showFeedback('success', `Notifikasi push untuk ${label} (${timeStr}) diaktifkan.`);
      }
    } else {
      showFeedback('info', `Notifikasi push untuk ${label} (${timeStr}) dinonaktifkan.`);
    }
  };

  const toggleAllFardhuAlarms = async (enable: boolean) => {
    setAlarmSettings((prev) => ({
      ...prev,
      subuh: enable,
      dzuhur: enable,
      ashar: enable,
      maghrib: enable,
      isya: enable,
    }));

    if (enable && getNotificationPermissionStatus() === 'default') {
      const granted = await requestNotificationPermission();
      setNotificationPermission(getNotificationPermissionStatus());
      if (granted) {
        showFeedback('success', 'Push notifikasi 5 waktu sholat fardhu berhasil diaktifkan.');
        return;
      }
    }
    showFeedback(
      enable ? 'success' : 'info',
      enable
        ? 'Notifikasi push untuk 5 waktu sholat fardhu diaktifkan.'
        : 'Notifikasi push untuk 5 waktu sholat fardhu dimatikan.'
    );
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

  const enabledPushCount = prayers.filter((p) => alarmSettings[p.key]).length;

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

      {livePrayerAlert && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-400/60 text-emerald-100 text-xs flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <BellRing className="w-5 h-5 text-amber-300 shrink-0" />
            <div>
              <strong className="text-sm text-white block">
                Telah Masuk Waktu {livePrayerAlert.name} ({livePrayerAlert.time})
              </strong>
              <span className="text-emerald-200">
                Wilayah {currentCityName}. Mari bersiap menunaikan ibadah tepat pada waktunya.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLivePrayerAlert(null)}
            className="px-3 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold shrink-0"
          >
            Tutup
          </button>
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

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={handlePlayAdhanSound}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Dengarkan simulasi nada adzan"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Uji Nada Pengingat</span>
              </button>
              <button
                type="button"
                onClick={handleTestPrayerPushNotification}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Kirim notifikasi uji coba via Web Notification API"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tes Push Notifikasi</span>
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

      {/* Push Notification Controls Bar & Today's 8 Daily Prayer Times Cards Grid */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Jadwal Sholat Hari Ini ({todaySchedule.date})</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Standar Kemenag RI · {enabledPushCount}/8 notifikasi aktif
          </span>
        </div>

        {/* Web Notification API Permission & Bulk Toggle Strip */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2.5 text-xs">
            {notificationPermission === 'granted' ? (
              <BellRing className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
            ) : (
              <Bell className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            )}
            <div>
              <span className="font-semibold text-white">
                Notifikasi Push Adzan (Web Notification API):{' '}
              </span>
              <span
                className={
                  notificationPermission === 'granted'
                    ? 'text-emerald-400 font-semibold'
                    : notificationPermission === 'denied'
                    ? 'text-red-400 font-semibold'
                    : 'text-amber-300 font-semibold'
                }
              >
                {notificationPermission === 'granted'
                  ? 'Diizinkan Browser'
                  : notificationPermission === 'denied'
                  ? 'Diblokir Browser'
                  : notificationPermission === 'unsupported'
                  ? 'Tidak Didukung Browser'
                  : 'Menunggu Izin'}
              </span>
              <span className="text-slate-400 block sm:inline sm:ml-2">
                — Klik sakelar lonceng pada tiap kartu sholat untuk mengaktifkan atau mematikan pengingat.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 text-xs">
            {notificationPermission !== 'granted' && notificationPermission !== 'unsupported' && (
              <button
                type="button"
                onClick={handleRequestBrowserPermission}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition-colors whitespace-nowrap"
              >
                Izinkan Notifikasi Browser
              </button>
            )}
            <button
              type="button"
              onClick={() => toggleAllFardhuAlarms(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium transition-colors whitespace-nowrap"
            >
              Aktifkan 5 Sholat Fardhu
            </button>
            <button
              type="button"
              onClick={() =>
                setAlarmSettings({
                  imsak: false,
                  subuh: false,
                  terbit: false,
                  dhuha: false,
                  dzuhur: false,
                  ashar: false,
                  maghrib: false,
                  isya: false,
                })
              }
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 font-medium transition-colors whitespace-nowrap"
            >
              Nonaktifkan Semua
            </button>
          </div>
        </div>

        {notificationFeedback && (
          <div
            className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
              notificationFeedback.type === 'success'
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                : notificationFeedback.type === 'warning'
                ? 'bg-amber-950/50 border-amber-500/40 text-amber-200'
                : 'bg-slate-900 border-slate-700 text-slate-300'
            }`}
          >
            {notificationFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{notificationFeedback.message}</span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {prayers.map((prayer) => {
            const isAlarmOn = alarmSettings[prayer.key] ?? false;
            return (
              <div
                key={prayer.key}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-2.5 ${
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
                      type="button"
                      role="switch"
                      aria-checked={isAlarmOn}
                      aria-label={`Notifikasi push untuk waktu ${prayer.name} (${prayer.time})`}
                      onClick={() => toggleAlarm(prayer.key, prayer.name, prayer.time)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isAlarmOn
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                      title={isAlarmOn ? `Matikan notifikasi ${prayer.name}` : `Aktifkan notifikasi ${prayer.name}`}
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
                  <div className="flex items-center justify-between gap-1 mt-1">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {prayer.isNext ? 'Berikutnya' : prayer.isPassed ? 'Lewat' : 'Mendatang'}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleAlarm(prayer.key, prayer.name, prayer.time)}
                      className={`text-[10px] font-semibold transition-colors ${
                        isAlarmOn ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {isAlarmOn ? 'Push ON' : 'Push OFF'}
                    </button>
                  </div>
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
