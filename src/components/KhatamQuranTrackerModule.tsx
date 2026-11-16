import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Plus,
  RotateCcw,
  Trash2,
  Calendar,
  Award,
  TrendingUp,
  Target,
  Check,
  Flame,
} from 'lucide-react';

interface JuzDefinition {
  juz: number;
  startRef: string;
  totalPages: number; // Standard 604-page Madinah Mushaf: Juz 1-29 = 20 pages, Juz 30 = 24 pages
}

const TOTAL_MUSHAF_PAGES = 604;

const THIRTY_JUZ_DATA: JuzDefinition[] = [
  { juz: 1, startRef: 'Al-Fatihah 1 – Al-Baqarah 141', totalPages: 20 },
  { juz: 2, startRef: 'Al-Baqarah 142 – 252', totalPages: 20 },
  { juz: 3, startRef: 'Al-Baqarah 253 – Ali \'Imran 92', totalPages: 20 },
  { juz: 4, startRef: 'Ali \'Imran 93 – An-Nisa 23', totalPages: 20 },
  { juz: 5, startRef: 'An-Nisa 24 – 147', totalPages: 20 },
  { juz: 6, startRef: 'An-Nisa 148 – Al-Ma\'idah 81', totalPages: 20 },
  { juz: 7, startRef: 'Al-Ma\'idah 82 – Al-An\'am 110', totalPages: 20 },
  { juz: 8, startRef: 'Al-An\'am 111 – Al-A\'raf 87', totalPages: 20 },
  { juz: 9, startRef: 'Al-A\'raf 88 – Al-Anfal 40', totalPages: 20 },
  { juz: 10, startRef: 'Al-Anfal 41 – At-Taubah 92', totalPages: 20 },
  { juz: 11, startRef: 'At-Taubah 93 – Hud 5', totalPages: 20 },
  { juz: 12, startRef: 'Hud 6 – Yusuf 52', totalPages: 20 },
  { juz: 13, startRef: 'Yusuf 53 – Ibrahim 52', totalPages: 20 },
  { juz: 14, startRef: 'Al-Hijr 1 – An-Nahl 128', totalPages: 20 },
  { juz: 15, startRef: 'Al-Isra 1 – Al-Kahf 74', totalPages: 20 },
  { juz: 16, startRef: 'Al-Kahf 75 – Thaha 135', totalPages: 20 },
  { juz: 17, startRef: 'Al-Anbiya 1 – Al-Hajj 78', totalPages: 20 },
  { juz: 18, startRef: 'Al-Mu\'minun 1 – Al-Furqan 20', totalPages: 20 },
  { juz: 19, startRef: 'Al-Furqan 21 – An-Naml 55', totalPages: 20 },
  { juz: 20, startRef: 'An-Naml 56 – Al-\'Ankabut 45', totalPages: 20 },
  { juz: 21, startRef: 'Al-\'Ankabut 46 – Al-Ahzab 30', totalPages: 20 },
  { juz: 22, startRef: 'Al-Ahzab 31 – Yasin 27', totalPages: 20 },
  { juz: 23, startRef: 'Yasin 28 – Az-Zumar 31', totalPages: 20 },
  { juz: 24, startRef: 'Az-Zumar 32 – Fussilat 46', totalPages: 20 },
  { juz: 25, startRef: 'Fussilat 47 – Al-Jatsiyah 37', totalPages: 20 },
  { juz: 26, startRef: 'Al-Ahqaf 1 – Adz-Dzariyat 30', totalPages: 20 },
  { juz: 27, startRef: 'Adz-Dzariyat 31 – Al-Hadid 29', totalPages: 20 },
  { juz: 28, startRef: 'Al-Mujadilah 1 – At-Tahrim 12', totalPages: 20 },
  { juz: 29, startRef: 'Al-Mulk 1 – Al-Mursalat 50', totalPages: 20 },
  { juz: 30, startRef: 'An-Naba\' 1 – An-Nas 6', totalPages: 24 },
];

export interface KhatamDailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  juz: number;
  pagesRead: number;
  note: string;
  allocations: Array<{ juz: number; pages: number }>;
  createdAt: string;
}

interface KhatamTrackerState {
  juzPages: Record<number, number>;
  logs: KhatamDailyLog[];
  completedCycles: number;
  dailyGoalPages: number;
}

const STORAGE_KEY = 'islamicity_khatam_quran_v1';

function getTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function createEmptyJuzPages(): Record<number, number> {
  const map: Record<number, number> = {};
  for (let i = 1; i <= 30; i += 1) {
    map[i] = 0;
  }
  return map;
}

function loadInitialState(): KhatamTrackerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<KhatamTrackerState>;
      const baseJuz = createEmptyJuzPages();
      if (parsed.juzPages && typeof parsed.juzPages === 'object') {
        for (const def of THIRTY_JUZ_DATA) {
          const val = Number(parsed.juzPages[def.juz]);
          if (Number.isFinite(val)) {
            baseJuz[def.juz] = Math.min(def.totalPages, Math.max(0, Math.round(val)));
          }
        }
      }
      return {
        juzPages: baseJuz,
        logs: Array.isArray(parsed.logs) ? parsed.logs : [],
        completedCycles: Number.isFinite(Number(parsed.completedCycles))
          ? Math.max(0, Number(parsed.completedCycles))
          : 0,
        dailyGoalPages: Number.isFinite(Number(parsed.dailyGoalPages))
          ? Math.max(1, Number(parsed.dailyGoalPages))
          : 20,
      };
    }
  } catch {
    // ignore storage errors
  }

  return {
    juzPages: createEmptyJuzPages(),
    logs: [],
    completedCycles: 0,
    dailyGoalPages: 20,
  };
}

export const KhatamQuranTrackerModule: React.FC = () => {
  const [tracker, setTracker] = useState<KhatamTrackerState>(() => loadInitialState());

  // Form states for logging daily reading
  const [logDate, setLogDate] = useState<string>(() => getTodayIso());
  const [selectedJuz, setSelectedJuz] = useState<number>(1);
  const [pagesInput, setPagesInput] = useState<number>(4);
  const [noteInput, setNoteInput] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tracker));
    } catch {
      // ignore storage errors
    }
  }, [tracker]);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    window.setTimeout(() => {
      setFeedbackMessage((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  // Cumulative metrics across all 30 Juz
  const metrics = useMemo(() => {
    let totalPagesCompleted = 0;
    let fullJuzCompleted = 0;
    let juzEquivalentSum = 0;

    for (const def of THIRTY_JUZ_DATA) {
      const done = tracker.juzPages[def.juz] || 0;
      totalPagesCompleted += done;
      if (done >= def.totalPages) {
        fullJuzCompleted += 1;
      }
      juzEquivalentSum += done / def.totalPages;
    }

    const completionPercentage = Math.min(100, (juzEquivalentSum / 30) * 100);
    const pagesRemaining = Math.max(0, TOTAL_MUSHAF_PAGES - totalPagesCompleted);
    const daysToFinishAtGoal =
      pagesRemaining === 0
        ? 0
        : Math.ceil(pagesRemaining / Math.max(1, tracker.dailyGoalPages));

    const todayStr = getTodayIso();
    const todayPages = tracker.logs
      .filter((log) => log.date === todayStr)
      .reduce((acc, log) => acc + log.pagesRead, 0);

    const uniqueLoggedDays = new Set(tracker.logs.map((l) => l.date)).size;

    return {
      totalPagesCompleted,
      fullJuzCompleted,
      juzEquivalentSum,
      completionPercentage,
      pagesRemaining,
      daysToFinishAtGoal,
      todayPages,
      uniqueLoggedDays,
    };
  }, [tracker]);

  // Next unfinished Juz helper for smart defaults
  const firstUnfinishedJuz = useMemo(() => {
    const found = THIRTY_JUZ_DATA.find(
      (def) => (tracker.juzPages[def.juz] || 0) < def.totalPages
    );
    return found ? found.juz : 30;
  }, [tracker.juzPages]);

  const allocateAndLogReading = (
    startJuz: number,
    pagesToAdd: number,
    date: string,
    customNote: string
  ) => {
    const cleanPages = Math.max(1, Math.round(pagesToAdd));
    const nextJuzPages = { ...tracker.juzPages };
    const allocations: Array<{ juz: number; pages: number }> = [];

    let remainingToAllocate = cleanPages;
    let cursorJuz = startJuz;

    while (remainingToAllocate > 0 && cursorJuz <= 30) {
      const def = THIRTY_JUZ_DATA[cursorJuz - 1];
      const currentDone = nextJuzPages[cursorJuz] || 0;
      const room = def.totalPages - currentDone;

      if (room > 0) {
        const addedHere = Math.min(room, remainingToAllocate);
        nextJuzPages[cursorJuz] = currentDone + addedHere;
        allocations.push({ juz: cursorJuz, pages: addedHere });
        remainingToAllocate -= addedHere;
      }
      cursorJuz += 1;
    }

    const totalApplied = allocations.reduce((sum, a) => sum + a.pages, 0);

    if (totalApplied === 0) {
      showFeedback(
        'Seluruh 30 Juz pada siklus aktif telah khatam 100%! Simpan siklus khatam untuk memulai putaran baru.'
      );
      return;
    }

    const newLog: KhatamDailyLog = {
      id: `kht-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      date,
      juz: startJuz,
      pagesRead: totalApplied,
      note:
        customNote.trim() ||
        `Tilawah ${
          allocations.length > 1
            ? `Juz ${allocations[0].juz}–${allocations[allocations.length - 1].juz}`
            : `Juz ${allocations[0].juz}`
        } (${THIRTY_JUZ_DATA[startJuz - 1].startRef})`,
      allocations,
      createdAt: new Date().toISOString(),
    };

    setTracker((prev) => ({
      ...prev,
      juzPages: nextJuzPages,
      logs: [newLog, ...prev.logs],
    }));

    const nextUnfinished = THIRTY_JUZ_DATA.find(
      (def) => (nextJuzPages[def.juz] || 0) < def.totalPages
    );
    if (nextUnfinished) {
      setSelectedJuz(nextUnfinished.juz);
    }

    setNoteInput('');
    showFeedback(
      `Alhamdulillah, tercatat +${totalApplied} halaman pada ${
        allocations.length > 1
          ? `Juz ${allocations[0].juz}–${allocations[allocations.length - 1].juz}`
          : `Juz ${allocations[0].juz}`
      }.`
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    allocateAndLogReading(selectedJuz, pagesInput, logDate || getTodayIso(), noteInput);
  };

  const handleToggleJuzComplete = (juzNum: number) => {
    const def = THIRTY_JUZ_DATA[juzNum - 1];
    const currentDone = tracker.juzPages[juzNum] || 0;
    const isCurrentlyComplete = currentDone >= def.totalPages;

    if (isCurrentlyComplete) {
      setTracker((prev) => ({
        ...prev,
        juzPages: {
          ...prev.juzPages,
          [juzNum]: 0,
        },
      }));
      showFeedback(`Progres Juz ${juzNum} direset ke 0 halaman.`);
    } else {
      const remainingInJuz = def.totalPages - currentDone;
      allocateAndLogReading(
        juzNum,
        remainingInJuz,
        getTodayIso(),
        `Menyelesaikan Juz ${juzNum} (${def.startRef})`
      );
    }
  };

  const handleDeleteLog = (logId: string) => {
    const target = tracker.logs.find((l) => l.id === logId);
    if (!target) return;

    setTracker((prev) => {
      const nextJuzPages = { ...prev.juzPages };
      for (const alloc of target.allocations) {
        const cur = nextJuzPages[alloc.juz] || 0;
        nextJuzPages[alloc.juz] = Math.max(0, cur - alloc.pages);
      }
      return {
        ...prev,
        juzPages: nextJuzPages,
        logs: prev.logs.filter((l) => l.id !== logId),
      };
    });
    showFeedback(`Catatan tilawah (${target.pagesRead} halaman) dihapus dan progres diperbarui.`);
  };

  const handleCompleteKhatamCycle = () => {
    setTracker((prev) => ({
      ...prev,
      juzPages: createEmptyJuzPages(),
      completedCycles: prev.completedCycles + 1,
    }));
    setSelectedJuz(1);
    showFeedback(
      `Barakallahu fiikum! Khatam Al-Qur'an ke-${tracker.completedCycles + 1} tercatat. Siklus 30 Juz baru dimulai.`
    );
  };

  const handleResetActiveCycle = () => {
    setTracker((prev) => ({
      ...prev,
      juzPages: createEmptyJuzPages(),
      logs: [],
    }));
    setSelectedJuz(1);
    showFeedback('Progres siklus 30 Juz dan catatan harian direset.');
  };

  // Circular SVG progress ring geometry
  const ringRadius = 58;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset =
    ringCircumference - (metrics.completionPercentage / 100) * ringCircumference;

  const dailyGoalRatio = Math.min(
    100,
    Math.round((metrics.todayPages / Math.max(1, tracker.dailyGoalPages)) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Feedback Notice */}
      {feedbackMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Top Cumulative Completion Overview */}
      <section className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-emerald-950/85 via-slate-900 to-slate-950 border border-emerald-700/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Circular Progress Ring + Cumulative Percentage */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg
                className="w-36 h-36 -rotate-90"
                viewBox="0 0 140 140"
                role="img"
                aria-label={`Progres Khatam Al-Qur'an ${metrics.completionPercentage.toFixed(1)} persen`}
              >
                <circle
                  cx="70"
                  cy="70"
                  r={ringRadius}
                  fill="none"
                  stroke="rgba(30, 41, 59, 0.9)"
                  strokeWidth="12"
                />
                <circle
                  cx="70"
                  cy="70"
                  r={ringRadius}
                  fill="none"
                  stroke="url(#khatamGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  className="transition-all duration-300"
                />
                <defs>
                  <linearGradient id="khatamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-white tabular-nums">
                  {metrics.completionPercentage.toFixed(1)}%
                </span>
                <span className="text-[11px] text-emerald-300 font-medium tabular-nums">
                  {metrics.juzEquivalentSum.toFixed(1)} / 30 Juz
                </span>
              </div>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <div className="text-xs text-amber-300 font-medium">
                Khatam Al-Qur&apos;an · Siklus 30 Juz ({TOTAL_MUSHAF_PAGES} Halaman)
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight text-balance">
                Pelacak Tilawah &amp; Khatam Al-Qur&apos;an
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Catat tilawah harian Anda per halaman atau per juz untuk melihat persentase kumulatif menuju khatam penuh 30 juz.
              </p>
              {metrics.completionPercentage >= 100 && (
                <button
                  type="button"
                  onClick={handleCompleteKhatamCycle}
                  className="mt-1 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <Award className="w-4 h-4" />
                  <span>Tandai Khatam &amp; Mulai Siklus Baru</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: 4 KPI Stats */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Juz Selesai</span>
              </div>
              <div className="text-xl font-extrabold text-white tabular-nums">
                {metrics.fullJuzCompleted} <span className="text-xs font-normal text-slate-400">/ 30</span>
              </div>
              <div className="text-[11px] text-emerald-400 tabular-nums">
                {metrics.totalPagesCompleted} / {TOTAL_MUSHAF_PAGES} hal.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Hari Ini</span>
              </div>
              <div className="text-xl font-extrabold text-amber-300 tabular-nums">
                {metrics.todayPages} <span className="text-xs font-normal text-slate-400">hal.</span>
              </div>
              <div className="text-[11px] text-slate-400 tabular-nums">
                Target {tracker.dailyGoalPages} hal./hari ({dailyGoalRatio}%)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Estimasi Selesai</span>
              </div>
              <div className="text-xl font-extrabold text-white tabular-nums">
                {metrics.daysToFinishAtGoal}{' '}
                <span className="text-xs font-normal text-slate-400">hari</span>
              </div>
              <div className="text-[11px] text-slate-400 tabular-nums">
                Sisa {metrics.pagesRemaining} halaman
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Khatam Tercapai</span>
              </div>
              <div className="text-xl font-extrabold text-white tabular-nums">
                {tracker.completedCycles}{' '}
                <span className="text-xs font-normal text-slate-400">kali</span>
              </div>
              <div className="text-[11px] text-slate-400 tabular-nums">
                {metrics.uniqueLoggedDays} hari tercatat
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Linear Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs tabular-nums">
            <span className="text-slate-300 font-medium">
              Progres Kumulatif Siklus 30 Juz
            </span>
            <span className="text-emerald-300 font-bold">
              {metrics.completionPercentage.toFixed(1)}% selesai · Lanjut ke Juz {firstUnfinishedJuz}
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-300"
              style={{ width: `${metrics.completionPercentage}%` }}
            />
          </div>
        </div>
      </section>

      {/* Middle Split: Log Daily Reading Form + Target & Recent History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 6 Cols: Log Daily Reading Form */}
        <section className="lg:col-span-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Catat Tilawah Harian</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Pilih juz dan jumlah halaman yang Anda baca hari ini (otomatis berlanjut ke juz berikutnya jika melebihi sisa halaman).
              </p>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="khatam-log-date"
                  className="block text-xs font-medium text-slate-300"
                >
                  Tanggal Tilawah
                </label>
                <input
                  id="khatam-log-date"
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono tabular-nums"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="khatam-log-juz"
                  className="block text-xs font-medium text-slate-300"
                >
                  Juz yang Dibaca
                </label>
                <select
                  id="khatam-log-juz"
                  value={selectedJuz}
                  onChange={(e) => setSelectedJuz(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 tabular-nums"
                >
                  {THIRTY_JUZ_DATA.map((def) => {
                    const done = tracker.juzPages[def.juz] || 0;
                    return (
                      <option key={def.juz} value={def.juz}>
                        Juz {def.juz} ({done}/{def.totalPages} hal.) · {def.startRef}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="khatam-log-pages" className="font-medium text-slate-300">
                  Jumlah Halaman Dibaca
                </label>
                <span className="text-slate-400 tabular-nums">
                  1 Juz ≈ 20 halaman Mushaf
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  id="khatam-log-pages"
                  type="number"
                  min={1}
                  max={604}
                  value={pagesInput}
                  onChange={(e) => setPagesInput(Math.max(1, Number(e.target.value) || 1))}
                  className="sm:w-32 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono tabular-nums"
                />
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { label: '2 hal.', pages: 2 },
                    { label: '4 hal. (1 waktu)', pages: 4 },
                    { label: '10 hal. (½ juz)', pages: 10 },
                    { label: '20 hal. (1 juz)', pages: 20 },
                  ].map((preset) => (
                    <button
                      key={preset.pages}
                      type="button"
                      onClick={() => setPagesInput(preset.pages)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap tabular-nums ${
                        pagesInput === preset.pages
                          ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="khatam-log-note"
                className="block text-xs font-medium text-slate-300"
              >
                Catatan Surah / Ayat Terakhir (Opsional)
              </label>
              <input
                id="khatam-log-note"
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Contoh: QS. Al-Baqarah ayat 142–202 ba'da Subuh"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Progres Tilawah</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  allocateAndLogReading(
                    selectedJuz,
                    4,
                    getTodayIso(),
                    `Tilawah cepat Juz ${selectedJuz}`
                  )
                }
                className="px-4 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Tambah Cepat +4 Hal.</span>
              </button>
            </div>
          </form>

          {/* Daily Target Pace Selector */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Target Harian Khatam Anda
              </span>
              <span className="text-amber-300 font-mono tabular-nums">
                {tracker.dailyGoalPages} hal./hari
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '4 Hal./hari (Khatam ±5 Bln)', pages: 4 },
                { label: '10 Hal./hari (Khatam 60 Hari)', pages: 10 },
                { label: '20 Hal./hari (1 Juz / 30 Hari)', pages: 20 },
                { label: '40 Hal./hari (2 Juz / 15 Hari)', pages: 40 },
              ].map((goal) => (
                <button
                  key={goal.pages}
                  type="button"
                  onClick={() =>
                    setTracker((prev) => ({ ...prev, dailyGoalPages: goal.pages }))
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs border transition-colors whitespace-nowrap tabular-nums ${
                    tracker.dailyGoalPages === goal.pages
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {goal.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Right 6 Cols: Daily Reading Log History */}
        <section className="lg:col-span-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Riwayat Catatan Tilawah Harian</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 tabular-nums">
                {tracker.logs.length} entri tersimpan di peramban Anda
              </p>
            </div>

            {tracker.logs.length > 0 && (
              <button
                type="button"
                onClick={handleResetActiveCycle}
                className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Siklus</span>
              </button>
            )}
          </div>

          {tracker.logs.length === 0 ? (
            <div className="p-8 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-300">
                Belum ada catatan tilawah pada siklus ini
              </div>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Gunakan formulir di samping untuk mencatat bacaan harian Anda, atau klik langsung salah satu kotak Juz 1–30 di bawah ini.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {tracker.logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-400 font-medium tabular-nums">
                      <span>{log.date}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-300 font-bold">
                        +{log.pagesRead} Halaman
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {log.allocations.length > 1
                          ? `Juz ${log.allocations[0].juz}–${
                              log.allocations[log.allocations.length - 1].juz
                            }`
                          : `Juz ${log.juz}`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 truncate">{log.note}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteLog(log.id)}
                    aria-label={`Hapus catatan tilawah tanggal ${log.date}`}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Bottom Interactive 30-Juz Grid */}
      <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h4 className="text-lg font-bold text-white">
              Peta Kemajuan 30 Juz Al-Qur&apos;an
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Klik kotak Juz untuk langsung menandai Juz selesai penuh (100%) atau meresetnya ke 0%.
            </p>
          </div>
          <div className="text-xs text-slate-300 tabular-nums">
            {metrics.fullJuzCompleted} dari 30 Juz selesai penuh
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {THIRTY_JUZ_DATA.map((def) => {
            const done = tracker.juzPages[def.juz] || 0;
            const pct = Math.min(100, Math.round((done / def.totalPages) * 100));
            const isComplete = done >= def.totalPages;
            const isInProgress = done > 0 && !isComplete;

            return (
              <button
                key={def.juz}
                type="button"
                onClick={() => handleToggleJuzComplete(def.juz)}
                aria-pressed={isComplete}
                className={`p-3.5 rounded-xl border text-left transition-colors space-y-2.5 flex flex-col justify-between ${
                  isComplete
                    ? 'bg-emerald-950/45 border-emerald-500/60 text-white'
                    : isInProgress
                    ? 'bg-amber-950/25 border-amber-500/45 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-white tabular-nums">
                    Juz {String(def.juz).padStart(2, '0')}
                  </span>
                  <span
                    className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 ${
                      isComplete
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : isInProgress
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-slate-900 border-slate-700 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {def.startRef}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] tabular-nums">
                    <span
                      className={
                        isComplete
                          ? 'text-emerald-300 font-semibold'
                          : isInProgress
                          ? 'text-amber-300 font-semibold'
                          : 'text-slate-500'
                      }
                    >
                      {isComplete ? 'Selesai' : isInProgress ? 'Berjalan' : 'Belum'}
                    </span>
                    <span className="text-slate-300 font-mono">
                      {done}/{def.totalPages} hal.
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isComplete
                          ? 'bg-emerald-500'
                          : isInProgress
                          ? 'bg-amber-400'
                          : 'bg-slate-700'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
