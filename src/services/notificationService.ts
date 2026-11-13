export interface NotificationPreferences {
  enabled: boolean;
  prayerAlerts: boolean;
  liveKajianAlerts: boolean;
  sholawatReminder: boolean;
  soundEnabled: boolean;
  minutesBefore: number;
}

export interface ScheduledKajianItem {
  id: string;
  title: string;
  channel: string;
  speaker: string;
  timeStr: string;
  category: string;
}

export const UPCOMING_KAJIAN_LIST: ScheduledKajianItem[] = [
  {
    id: 'kjn-1',
    title: 'Kajian Subuh: Menyempurnakan Akhlaq dalam Muamalah',
    channel: 'City Media UPIC Limo',
    speaker: 'Ust. Fahrul Rozi',
    timeStr: '05:00 WIB',
    category: 'Akhlaq & Muamalah'
  },
  {
    id: 'kjn-2',
    title: 'Siaran Langsung Thawaf & Khutbah Masjidil Haram',
    channel: 'Makkah TV',
    speaker: 'Syaikh Abdurrahman As-Sudais',
    timeStr: '12:30 WIB',
    category: 'Haramain Live'
  },
  {
    id: 'kjn-3',
    title: 'Fiqih Sukuk, Mudarabah & Anti Riba Modern',
    channel: 'Niaga TV',
    speaker: 'Dr. Erwandi Tarmizi',
    timeStr: '16:00 WIB',
    category: 'Ekonomi Syariah'
  },
  {
    id: 'kjn-4',
    title: 'Menebar Sunnah: Syarah Riyadhus Shalihin',
    channel: 'Rodja TV',
    speaker: 'Ust. Yazid bin Abdul Qadir Jawas',
    timeStr: '19:45 WIB',
    category: 'Kajian Ilmiah'
  }
];

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  enabled: false,
  prayerAlerts: true,
  liveKajianAlerts: true,
  sholawatReminder: true,
  soundEnabled: true,
  minutesBefore: 10
};

/**
 * Checks if browser supports the Web Notification API
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Gets current notification permission status: 'granted' | 'denied' | 'default' | 'unsupported'
 */
export function getNotificationPermissionStatus(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Gracefully requests notification permission with user interaction
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.warn('Error requesting notification permission:', error);
    return false;
  }
}

/**
 * Plays a pleasant Islamic tone / chime using Web Audio API
 */
export function playNotificationTone(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Harmonic chime chords (E4 -> G#4 -> B4 -> E5)
    const frequencies = [329.63, 415.30, 493.88, 659.25];

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.001, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 1.0);
    });
  } catch (_) {
    // Audio context may be restricted before user gesture
  }
}

/**
 * Dispatches a native Web Notification and optional sound
 */
export function sendWebNotification(
  title: string,
  options: {
    body: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: any;
    requireInteraction?: boolean;
    playSound?: boolean;
  }
): boolean {
  if (!isNotificationSupported()) return false;

  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        badge: options.badge || '/favicon.ico',
        tag: options.tag || 'islamicity-alert',
        requireInteraction: options.requireInteraction ?? false
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      if (options.playSound !== false) {
        playNotificationTone();
      }

      return true;
    } catch (err) {
      console.warn('Native notification failed, falling back:', err);
      return false;
    }
  }

  return false;
}

/**
 * Load preferences from localStorage
 */
export function loadNotificationPreferences(): NotificationPreferences {
  try {
    const raw = localStorage.getItem('islamicity_notification_prefs');
    if (raw) return { ...DEFAULT_NOTIFICATION_PREFERENCES, ...JSON.parse(raw) };
  } catch (_) {}
  return DEFAULT_NOTIFICATION_PREFERENCES;
}

/**
 * Save preferences to localStorage
 */
export function saveNotificationPreferences(prefs: NotificationPreferences): void {
  try {
    localStorage.setItem('islamicity_notification_prefs', JSON.stringify(prefs));
  } catch (_) {}
}

// ============================================================================
// Monthly Zakat Assessment Reminder Helpers
// ============================================================================
export interface MonthlyZakatReminderConfig {
  enabled: boolean;
  dayOfMonth: number; // 1..28
  timeStr: string; // "HH:mm"
  zakatFocus: 'penghasilan' | 'maal' | 'semua';
  lastNotifiedMonthKey: string | null; // "YYYY-MM"
  lastAssessedMonthKey: string | null; // "YYYY-MM"
}

const MONTHLY_ZAKAT_REMINDER_KEY = 'islamicity_zakat_monthly_reminder';

export const DEFAULT_MONTHLY_ZAKAT_REMINDER: MonthlyZakatReminderConfig = {
  enabled: false,
  dayOfMonth: 25,
  timeStr: '09:00',
  zakatFocus: 'penghasilan',
  lastNotifiedMonthKey: null,
  lastAssessedMonthKey: null,
};

export function getMonthKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function loadMonthlyZakatReminder(): MonthlyZakatReminderConfig {
  try {
    const raw = localStorage.getItem(MONTHLY_ZAKAT_REMINDER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<MonthlyZakatReminderConfig>;
      return {
        ...DEFAULT_MONTHLY_ZAKAT_REMINDER,
        ...parsed,
        dayOfMonth: Math.min(28, Math.max(1, Number(parsed.dayOfMonth) || 25)),
      };
    }
  } catch (_) {}
  return DEFAULT_MONTHLY_ZAKAT_REMINDER;
}

export function saveMonthlyZakatReminder(config: MonthlyZakatReminderConfig): void {
  try {
    localStorage.setItem(MONTHLY_ZAKAT_REMINDER_KEY, JSON.stringify(config));
  } catch (_) {}
}

export function getNextMonthlyZakatReminderDate(
  config: MonthlyZakatReminderConfig,
  now: Date = new Date()
): Date {
  const [hhRaw, mmRaw] = (config.timeStr || '09:00').split(':').map(Number);
  const hh = Number.isFinite(hhRaw) ? hhRaw : 9;
  const mm = Number.isFinite(mmRaw) ? mmRaw : 0;
  const safeDay = Math.min(28, Math.max(1, config.dayOfMonth || 25));

  const thisMonthCandidate = new Date(now.getFullYear(), now.getMonth(), safeDay, hh, mm, 0, 0);
  if (thisMonthCandidate.getTime() > now.getTime()) {
    return thisMonthCandidate;
  }
  return new Date(now.getFullYear(), now.getMonth() + 1, safeDay, hh, mm, 0, 0);
}

export function isMonthlyZakatReminderDue(
  config: MonthlyZakatReminderConfig,
  now: Date = new Date()
): boolean {
  if (!config.enabled) return false;
  const currentMonthKey = getMonthKey(now);
  if (config.lastNotifiedMonthKey === currentMonthKey) return false;
  if (config.lastAssessedMonthKey === currentMonthKey) return false;

  const [hhRaw, mmRaw] = (config.timeStr || '09:00').split(':').map(Number);
  const hh = Number.isFinite(hhRaw) ? hhRaw : 9;
  const mm = Number.isFinite(mmRaw) ? mmRaw : 0;
  const safeDay = Math.min(28, Math.max(1, config.dayOfMonth || 25));

  const dueThisMonth = new Date(now.getFullYear(), now.getMonth(), safeDay, hh, mm, 0, 0);
  return now.getTime() >= dueThisMonth.getTime();
}

export function getZakatFocusLabel(focus: MonthlyZakatReminderConfig['zakatFocus']): string {
  if (focus === 'maal') return 'Zakat Maal & Tabungan';
  if (focus === 'semua') return 'Seluruh Kewajiban Zakat';
  return 'Zakat Penghasilan Bulanan';
}

export function dispatchMonthlyZakatReminderNotification(
  config: MonthlyZakatReminderConfig,
  isTest: boolean = false
): { sentNative: boolean; title: string; body: string } {
  const focusLabel = getZakatFocusLabel(config.zakatFocus);
  const title = isTest
    ? `Uji Pengingat Zakat Bulanan (${focusLabel})`
    : `Waktunya Evaluasi ${focusLabel}`;
  const body = isTest
    ? `Simulasi pengingat rutin setiap tanggal ${config.dayOfMonth} pukul ${config.timeStr}. Hitung & tunaikan zakat Anda secara transparan.`
    : `Pengingat bulanan tanggal ${config.dayOfMonth}: mari evaluasi harta & penghasilan Anda di Kalkulator Zakat Islamicity.`;

  const prefs = loadNotificationPreferences();
  const sentNative = sendWebNotification(title, {
    body,
    tag: isTest ? 'islamicity-zakat-monthly-test' : `islamicity-zakat-monthly-${getMonthKey()}`,
    requireInteraction: !isTest,
    playSound: prefs.soundEnabled,
  });

  return { sentNative, title, body };
}

