import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bell, 
  BellRing, 
  BellOff, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Volume2, 
  Clock, 
  Tv, 
  ShieldCheck, 
  Send,
  HelpCircle
} from 'lucide-react';
import { 
  NotificationPreferences, 
  getNotificationPermissionStatus, 
  requestNotificationPermission, 
  sendWebNotification, 
  loadNotificationPreferences, 
  saveNotificationPreferences,
  UPCOMING_KAJIAN_LIST,
  ScheduledKajianItem
} from '../services/notificationService';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowInAppToast?: (title: string, message: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onShowInAppToast
}) => {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');
  const [prefs, setPrefs] = useState<NotificationPreferences>(loadNotificationPreferences);
  const [testSentMessage, setTestSentMessage] = useState<string | null>(null);
  const [scheduledAlerts, setScheduledAlerts] = useState<string[]>(['kjn-1', 'kjn-2']);

  useEffect(() => {
    if (isOpen) {
      setPermissionStatus(getNotificationPermissionStatus());
      setPrefs(loadNotificationPreferences());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermissionStatus(getNotificationPermissionStatus());
    if (granted) {
      const updated = { ...prefs, enabled: true };
      setPrefs(updated);
      saveNotificationPreferences(updated);

      // Send welcoming notification
      sendWebNotification('Notifikasi Islamicity Media Aktif', {
        body: 'Alhamdulillah! Anda akan menerima pengingat adzan waktu sholat dan siaran kajian live.',
        playSound: prefs.soundEnabled
      });

      if (onShowInAppToast) {
        onShowInAppToast('Izin Notifikasi Diberikan', 'Anda akan menerima pengingat adzan dan live kajian.');
      }
    }
  };

  const handleTogglePreference = (key: keyof NotificationPreferences) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    saveNotificationPreferences(updated);
  };

  const handleTestNotification = (type: 'prayer' | 'kajian') => {
    let title = '';
    let body = '';

    if (type === 'prayer') {
      title = 'Pengingat Waktu Sholat: Dzuhur (11:54 WIB)';
      body = 'Allahu Akbar, seruan adzan Dzuhur telah berkumandang. Mari bersiap menuju masjid.';
    } else {
      title = 'Live Kajian Subuh UPIC Limo Sedang Berlangsung';
      body = 'Tema: Menyempurnakan Akhlaq dalam Muamalah bersama Ust. Fahrul Rozi.';
    }

    const sent = sendWebNotification(title, {
      body,
      playSound: prefs.soundEnabled
    });

    if (onShowInAppToast) {
      onShowInAppToast(title, body);
    }

    if (sent) {
      setTestSentMessage('Notifikasi Web terkirim ke sistem operasi Anda!');
    } else if (permissionStatus === 'denied') {
      setTestSentMessage('Browser memblokir notifikasi. Silakan izinkan melalui ikon gembok di bilah alamat.');
    } else {
      setTestSentMessage('Notifikasi ditampilkan dalam aplikasi (In-App Toast). Klik "Aktifkan Izin Browser" untuk notifikasi desktop.');
    }

    setTimeout(() => setTestSentMessage(null), 4000);
  };

  const toggleKajianReminder = (kajian: ScheduledKajianItem) => {
    if (scheduledAlerts.includes(kajian.id)) {
      setScheduledAlerts(prev => prev.filter(id => id !== kajian.id));
      if (onShowInAppToast) {
        onShowInAppToast('Pengingat Dibatalkan', `Pengingat untuk ${kajian.title} dinonaktifkan.`);
      }
    } else {
      setScheduledAlerts(prev => [...prev, kajian.id]);
      if (onShowInAppToast) {
        onShowInAppToast('Pengingat Disetel', `Anda akan diingatkan sebelum siaran ${kajian.title} dimulai.`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-emerald-800/40 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 px-6 py-4 border-b border-emerald-800/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Layanan Pengingat & Notifikasi Web (Web Notification API)
              </h3>
              <p className="text-[11px] text-emerald-400 font-mono">
                Pengingat Adzan Waktu Sholat & Siaran Live Kajian
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Permission Status Banner */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            permissionStatus === 'granted'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : permissionStatus === 'denied'
              ? 'bg-red-950/40 border-red-500/40 text-red-300'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
          }`}>
            <div className="flex items-start gap-3">
              {permissionStatus === 'granted' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : permissionStatus === 'denied' ? (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              ) : (
                <Bell className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs">
                <strong className="block text-sm">
                  {permissionStatus === 'granted'
                    ? 'Izin Notifikasi Web Aktif'
                    : permissionStatus === 'denied'
                    ? 'Izin Notifikasi Diblokir oleh Browser'
                    : 'Izin Notifikasi Belum Diaktifkan'}
                </strong>
                <p className="text-slate-300 mt-0.5 leading-relaxed">
                  {permissionStatus === 'granted'
                    ? 'Perangkat Anda siap menerima pemberitahuan adzan dan jadwal kajian bahkan saat tab di latar belakang.'
                    : permissionStatus === 'denied'
                    ? 'Untuk mengaktifkan kembali, klik ikon gembok pada bilah alamat URL browser dan ubah setelan Notifikasi ke "Izinkan".'
                    : 'Izinkan notifikasi browser untuk mendapatkan pengingat waktu sholat dan siaran langsung dakwah secara tepat waktu.'}
                </p>
              </div>
            </div>

            {permissionStatus !== 'granted' && permissionStatus !== 'denied' && (
              <button
                onClick={handleRequestPermission}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs whitespace-nowrap shadow transition-colors self-start sm:self-auto"
              >
                Aktifkan Izin
              </button>
            )}
          </div>

          {testSentMessage && (
            <div className="p-3 rounded-lg bg-slate-950 border border-emerald-500/50 text-emerald-300 text-xs text-center font-mono">
              {testSentMessage}
            </div>
          )}

          {/* Preferences Toggles */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pengaturan Kategori Pemberitahuan
            </h4>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-emerald-400" />
                <div>
                  <strong className="text-white block">Pengingat Waktu Sholat Fardhu</strong>
                  <span className="text-slate-400 text-[11px]">Pemberitahuan saat masuk waktu Subuh, Dzuhur, Ashar, Maghrib, Isya</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.prayerAlerts}
                onChange={() => handleTogglePreference('prayerAlerts')}
                className="rounded text-emerald-500 focus:ring-0 w-4 h-4 bg-slate-800 border-slate-700"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Tv className="w-4 h-4 text-blue-400" />
                <div>
                  <strong className="text-white block">Siaran Langsung Live Kajian & Makkah TV</strong>
                  <span className="text-slate-400 text-[11px]">Pemberitahuan ketika program kajian majelis atau siaran thawaf dimulai</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.liveKajianAlerts}
                onChange={() => handleTogglePreference('liveKajianAlerts')}
                className="rounded text-emerald-500 focus:ring-0 w-4 h-4 bg-slate-800 border-slate-700"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <div>
                  <strong className="text-white block">Suara Nada Harmonis (Audio Chime)</strong>
                  <span className="text-slate-400 text-[11px]">Memutar melodi lembut pengingat ibadah</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.soundEnabled}
                onChange={() => handleTogglePreference('soundEnabled')}
                className="rounded text-emerald-500 focus:ring-0 w-4 h-4 bg-slate-800 border-slate-700"
              />
            </div>
          </div>

          {/* Test Notification Buttons */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Uji Coba Pengiriman Notifikasi Sekarang:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleTestNotification('prayer')}
                className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tes Notifikasi Sholat</span>
              </button>
              <button
                onClick={() => handleTestNotification('kajian')}
                className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Tv className="w-3.5 h-3.5 text-blue-400" />
                <span>Tes Notifikasi Live Kajian</span>
              </button>
            </div>
          </div>

          {/* Upcoming Kajian with Reminder Buttons */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Jadwal Live Kajian Mendatang</span>
            </h4>

            <div className="space-y-2">
              {UPCOMING_KAJIAN_LIST.map((kajian) => {
                const isScheduled = scheduledAlerts.includes(kajian.id);
                return (
                  <div
                    key={kajian.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <strong className="text-white block leading-snug">{kajian.title}</strong>
                      <span className="text-slate-400 text-[11px]">
                        {kajian.speaker} · <span className="text-emerald-400 font-medium">{kajian.channel}</span> · <span className="font-mono">{kajian.timeStr}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => toggleKajianReminder(kajian)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                        isScheduled
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {isScheduled ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Bell className="w-3 h-3 text-slate-400" />}
                      <span>{isScheduled ? 'Diingatkan' : 'Ingatkan Saya'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Notifikasi aman & bebas iklan komersial</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
