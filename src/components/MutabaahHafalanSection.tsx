import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Flame, 
  Award, 
  TrendingUp, 
  Plus, 
  Share2, 
  Printer, 
  Bookmark, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  UserCheck, 
  RotateCcw, 
  Check, 
  Copy, 
  Info,
  Clock,
  Heart,
  ChevronDown,
  Filter
} from 'lucide-react';
import { QuranDayChecklist, QuranMutabaahProfile } from '../types/islamicity';

export interface SurahProgressItem {
  number: number;
  name: string;
  arabicName: string;
  totalVerses: number;
  juz: number;
  status: 'mutqin' | 'proses' | 'belum';
  lastMurajaah?: string;
  notes?: string;
}

export const JUZ_30_SURAHS: SurahProgressItem[] = [
  { number: 67, name: 'Al-Mulk', arabicName: 'الملك', totalVerses: 30, juz: 29, status: 'mutqin', lastMurajaah: '18 Okt 2026' },
  { number: 78, name: 'An-Naba\'', arabicName: 'النبأ', totalVerses: 40, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 79, name: 'An-Nazi\'at', arabicName: 'النازعات', totalVerses: 46, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 80, name: '\'Abasa', arabicName: 'عبس', totalVerses: 42, juz: 30, status: 'proses', lastMurajaah: '20 Okt 2026', notes: 'Ayat 20-30 perlu pemantapan waqaf' },
  { number: 81, name: 'At-Takwir', arabicName: 'التكوير', totalVerses: 29, juz: 30, status: 'proses' },
  { number: 82, name: 'Al-Infitar', arabicName: 'الانفطار', totalVerses: 19, juz: 30, status: 'mutqin', lastMurajaah: '17 Okt 2026' },
  { number: 83, name: 'Al-Muthaffifin', arabicName: 'المطففين', totalVerses: 36, juz: 30, status: 'belum' },
  { number: 84, name: 'Al-Insyiqaq', arabicName: 'الانشقاق', totalVerses: 25, juz: 30, status: 'belum' },
  { number: 85, name: 'Al-Buruj', arabicName: 'البروج', totalVerses: 22, juz: 30, status: 'mutqin', lastMurajaah: '16 Okt 2026' },
  { number: 86, name: 'Ath-Thariq', arabicName: 'الطارق', totalVerses: 17, juz: 30, status: 'mutqin', lastMurajaah: '16 Okt 2026' },
  { number: 87, name: 'Al-A\'la', arabicName: 'الأعلى', totalVerses: 19, juz: 30, status: 'mutqin', lastMurajaah: '18 Okt 2026' },
  { number: 88, name: 'Al-Ghasyiyah', arabicName: 'الغاشية', totalVerses: 26, juz: 30, status: 'mutqin', lastMurajaah: '18 Okt 2026' },
  { number: 89, name: 'Al-Fajr', arabicName: 'الفجر', totalVerses: 30, juz: 30, status: 'proses' },
  { number: 90, name: 'Al-Balad', arabicName: 'البلد', totalVerses: 20, juz: 30, status: 'mutqin', lastMurajaah: '15 Okt 2026' },
  { number: 91, name: 'Asy-Syams', arabicName: 'الشمس', totalVerses: 15, juz: 30, status: 'mutqin', lastMurajaah: '15 Okt 2026' },
  { number: 92, name: 'Al-Lail', arabicName: 'الليل', totalVerses: 21, juz: 30, status: 'mutqin', lastMurajaah: '14 Okt 2026' },
  { number: 93, name: 'Adh-Dhuha', arabicName: 'الضحى', totalVerses: 11, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 94, name: 'Al-Insyirah', arabicName: 'الشرح', totalVerses: 8, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 95, name: 'At-Tin', arabicName: 'التين', totalVerses: 8, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 96, name: 'Al-\'Alaq', arabicName: 'العلق', totalVerses: 19, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 97, name: 'Al-Qadr', arabicName: 'القدر', totalVerses: 5, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 98, name: 'Al-Bayyinah', arabicName: 'البينة', totalVerses: 8, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 99, name: 'Az-Zalzalah', arabicName: 'الزلزلة', totalVerses: 8, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 100, name: 'Al-\'Adiyat', arabicName: 'العاديات', totalVerses: 11, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 101, name: 'Al-Qari\'ah', arabicName: 'القارعة', totalVerses: 11, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 102, name: 'At-Takatsur', arabicName: 'التكاثر', totalVerses: 8, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 103, name: 'Al-\'Ashr', arabicName: 'العصر', totalVerses: 3, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 104, name: 'Al-Humazah', arabicName: 'الهمزة', totalVerses: 9, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 105, name: 'Al-Fil', arabicName: 'الفيل', totalVerses: 5, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 106, name: 'Quraisy', arabicName: 'قريش', totalVerses: 4, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 107, name: 'Al-Ma\'un', arabicName: 'الماعون', totalVerses: 7, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 108, name: 'Al-Kautsar', arabicName: 'الكوثر', totalVerses: 3, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 109, name: 'Al-Kafirun', arabicName: 'الكافرون', totalVerses: 6, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 110, name: 'An-Nasr', arabicName: 'النصر', totalVerses: 3, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 111, name: 'Al-Lahab', arabicName: 'المسد', totalVerses: 5, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 112, name: 'Al-Ikhlas', arabicName: 'الإخلاص', totalVerses: 4, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 113, name: 'Al-Falaq', arabicName: 'الفلق', totalVerses: 5, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
  { number: 114, name: 'An-Nas', arabicName: 'الناس', totalVerses: 6, juz: 30, status: 'mutqin', lastMurajaah: '19 Okt 2026' },
];

const DEFAULT_WEEKLY_CHECKLIST: QuranDayChecklist[] = [
  {
    dayId: 'senin',
    dayName: 'Senin',
    dateStr: '19 Okt 2026',
    ziyadahTarget: 'QS. \'Abasa ayat 1 - 15',
    ziyadahDone: true,
    murajaahTarget: 'Surah An-Naba\' s/d An-Nazi\'at (Juz 30)',
    murajaahDone: true,
    tasmiDone: true,
    tilawahDone: true,
    notes: 'Alhamdulillah tasmi\' lancar disimak Ust. Fahrul Rozi, makhraj huruf \'Ain mantap.'
  },
  {
    dayId: 'selasa',
    dayName: 'Selasa',
    dateStr: '20 Okt 2026',
    ziyadahTarget: 'QS. \'Abasa ayat 16 - 32',
    ziyadahDone: true,
    murajaahTarget: 'Surah Al-Mulk ayat 1 - 30 (Juz 29)',
    murajaahDone: true,
    tasmiDone: false,
    tilawahDone: true,
    notes: 'Fokus pengulangan waqaf pada ayat 25-28.'
  },
  {
    dayId: 'rabu',
    dayName: 'Rabu',
    dateStr: '21 Okt 2026',
    ziyadahTarget: 'QS. \'Abasa ayat 33 - 42 (Khatam \'Abasa)',
    ziyadahDone: false,
    murajaahTarget: 'Surah Al-Muthaffifin & Al-Infitar',
    murajaahDone: false,
    tasmiDone: false,
    tilawahDone: false,
    notes: 'Persiapan ujian maqra\' mingguan halaqah.'
  },
  {
    dayId: 'kamis',
    dayName: 'Kamis',
    dateStr: '22 Okt 2026',
    ziyadahTarget: 'Muraja\'ah Akbar Surah \'Abasa penuh 42 ayat',
    ziyadahDone: false,
    murajaahTarget: 'Surah At-Takwir & Al-Buruj',
    murajaahDone: false,
    tasmiDone: false,
    tilawahDone: false,
    notes: 'Puasa sunnah Kamis sambil muraja\'ah menjelang berbuka.'
  },
  {
    dayId: 'jumat',
    dayName: 'Jum\'at',
    dateStr: '23 Okt 2026',
    ziyadahTarget: 'QS. At-Takwir ayat 1 - 14',
    ziyadahDone: false,
    murajaahTarget: 'Khatmil Al-Kahf (Sunnah Jum\'at)',
    murajaahDone: false,
    tasmiDone: false,
    tilawahDone: false,
    notes: 'Tilawah Surah Al-Kahf ba\'da Subuh / sebelum Jumatan.'
  },
  {
    dayId: 'sabtu',
    dayName: 'Sabtu',
    dateStr: '24 Okt 2026',
    ziyadahTarget: 'QS. At-Takwir ayat 15 - 29 (Khatam)',
    ziyadahDone: false,
    murajaahTarget: 'Juz 30 Paruh Kedua (Al-A\'la s/d An-Nas)',
    murajaahDone: false,
    tasmiDone: false,
    tilawahDone: false,
    notes: 'Halaqah simakan virtual Islamicity Media Zoom/Live.'
  },
  {
    dayId: 'ahad',
    dayName: 'Ahad',
    dateStr: '25 Okt 2026',
    ziyadahTarget: 'Evaluasi & Tasmi\' Akbar Bersama Musyrif',
    ziyadahDone: false,
    murajaahTarget: 'Muraja\'ah 1 Juz penuh (Juz 30)',
    murajaahDone: false,
    tasmiDone: false,
    tilawahDone: false,
    notes: 'Penyusunan target pekan depan bersama Ustadz pembimbing.'
  }
];

export const MutabaahHafalanSection: React.FC = () => {
  // Profile state
  const [profile, setProfile] = useState<QuranMutabaahProfile>(() => {
    const saved = localStorage.getItem('islamicity_mutabaah_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      targetSurah: 'Juz 30 (Juz \'Amma)',
      targetJuz: 'Juz 30 & 29',
      weeklyTargetVerses: 60,
      musyrifName: 'Ust. Fahrul Rozi, S.Q., Al-Hafizh',
      halaqahGroup: 'Halaqah Huffazh Islamicity Media #14'
    };
  });

  // Weekly checklist state
  const [weeklyList, setWeeklyList] = useState<QuranDayChecklist[]>(() => {
    const saved = localStorage.getItem('islamicity_mutabaah_weekly_checklist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_WEEKLY_CHECKLIST;
  });

  // Surah tracker list
  const [surahs, setSurahs] = useState<SurahProgressItem[]>(() => {
    const saved = localStorage.getItem('islamicity_mutabaah_surahs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return JUZ_30_SURAHS;
  });

  const [selectedDayId, setSelectedDayId] = useState<string>('selasa');
  const [surahFilter, setSurahFilter] = useState<'semua' | 'mutqin' | 'proses' | 'belum'>('semua');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);

  // Quick Setoran Log state
  const [logSurahName, setLogSurahName] = useState<string>('\'Abasa');
  const [logStartAyat, setLogStartAyat] = useState<number>(1);
  const [logEndAyat, setLogEndAyat] = useState<number>(15);
  const [logGrade, setLogGrade] = useState<'Mumtaz (Sangat Lancar)' | 'Jayyid Jiddan (Lancar)' | 'Jayyid (Cukup)' | 'Perlu Diulang'>('Mumtaz (Sangat Lancar)');
  const [logNotes, setLogNotes] = useState<string>('Mad thabi\'i dan ghunnah sudah stabil.');

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('islamicity_mutabaah_weekly_checklist', JSON.stringify(weeklyList));
  }, [weeklyList]);

  useEffect(() => {
    localStorage.setItem('islamicity_mutabaah_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('islamicity_mutabaah_surahs', JSON.stringify(surahs));
  }, [surahs]);

  // Calculations
  const selectedDay = weeklyList.find(d => d.dayId === selectedDayId) || weeklyList[0];

  const totalTasks = weeklyList.length * 4; // 4 main tasks per day (ziyadah, murajaah, tasmi, tilawah)
  const completedTasks = weeklyList.reduce((acc, day) => {
    return acc + 
      (day.ziyadahDone ? 1 : 0) + 
      (day.murajaahDone ? 1 : 0) + 
      (day.tasmiDone ? 1 : 0) + 
      (day.tilawahDone ? 1 : 0);
  }, 0);
  const weeklyPercentage = Math.round((completedTasks / totalTasks) * 100);

  const mutqinCount = surahs.filter(s => s.status === 'mutqin').length;
  const prosesCount = surahs.filter(s => s.status === 'proses').length;
  const belumCount = surahs.filter(s => s.status === 'belum').length;

  // Toggle tasks
  const handleToggleTask = (dayId: string, taskKey: 'ziyadahDone' | 'murajaahDone' | 'tasmiDone' | 'tilawahDone') => {
    setWeeklyList(prev => prev.map(item => {
      if (item.dayId === dayId) {
        return {
          ...item,
          [taskKey]: !item[taskKey]
        };
      }
      return item;
    }));
  };

  // Update day text fields
  const handleUpdateDayDetail = (dayId: string, field: 'ziyadahTarget' | 'murajaahTarget' | 'notes', val: string) => {
    setWeeklyList(prev => prev.map(item => {
      if (item.dayId === dayId) {
        return {
          ...item,
          [field]: val
        };
      }
      return item;
    }));
  };

  // Toggle surah status
  const handleCycleSurahStatus = (surahNumber: number) => {
    setSurahs(prev => prev.map(s => {
      if (s.number === surahNumber) {
        const nextStatus: Record<string, 'mutqin' | 'proses' | 'belum'> = {
          'belum': 'proses',
          'proses': 'mutqin',
          'mutqin': 'belum'
        };
        return {
          ...s,
          status: nextStatus[s.status],
          lastMurajaah: nextStatus[s.status] === 'mutqin' ? 'Hari ini' : s.lastMurajaah
        };
      }
      return s;
    }));
  };

  // Quick Setoran Log Submit
  const handleSaveSetoran = (e: React.FormEvent) => {
    e.preventDefault();
    // Update selected day with setoran note
    const entryNote = `Setoran QS. ${logSurahName} (Ayat ${logStartAyat}-${logEndAyat}) - Predikat: ${logGrade}. ${logNotes}`;
    setWeeklyList(prev => prev.map(d => {
      if (d.dayId === selectedDayId) {
        return {
          ...d,
          ziyadahDone: true,
          tasmiDone: true,
          notes: d.notes ? `${d.notes}\n[Log]: ${entryNote}` : entryNote
        };
      }
      return d;
    }));

    // Find and update the surah if matched
    setSurahs(prev => prev.map(s => {
      if (s.name.toLowerCase().includes(logSurahName.toLowerCase())) {
        return {
          ...s,
          status: 'mutqin',
          lastMurajaah: '20 Okt 2026'
        };
      }
      return s;
    }));

    setShowLogModal(false);
  };

  // Copy weekly summary for WhatsApp / Telegram halaqah
  const handleCopyWeeklySummary = () => {
    const text = `*MUTABA'AH HARIAN HAFALAN AL-QUR'AN*
🏛️ Islamicity Media Superapp (global.media.islamicity.tv)
━━━━━━━━━━━━━━━━━━━━
👤 Santri / Pengguna: Jamaah Islamicity
👥 Halaqah: ${profile.halaqahGroup}
👳 Musyrif: ${profile.musyrifName}
📅 Pekan: 19 - 25 Oktober 2026
🎯 Target: ${profile.targetSurah} (${profile.weeklyTargetVerses} Ayat/Pekan)
━━━━━━━━━━━━━━━━━━━━
*CAPAIAN MINGGUAN:*
📊 Skor Kepatuhan: ${weeklyPercentage}% (${completedTasks}/${totalTasks} Target)
⭐ Surah Mutqin: ${mutqinCount} Surah
🟡 Sedang Dihafal: ${prosesCount} Surah
🔥 Istiqomah: 6 Hari Berturut-turut

*DETAIL CHECK-LIST HARIAN:*
${weeklyList.map(d => `• ${d.dayName} (${d.dateStr}): 
   - Ziyadah: [${d.ziyadahDone ? '✓' : '✗'}] ${d.ziyadahTarget}
   - Muraja'ah: [${d.murajaahDone ? '✓' : '✗'}] ${d.murajaahTarget}
   - Tasmi': [${d.tasmiDone ? '✓' : '✗'}]
   - Tilawah: [${d.tilawahDone ? '✓' : '✗'}]`).join('\n\n')}

_“Khairukum man ta'allamal Qur'ana wa 'allamahu” (HR. Bukhari)_
Insya Allah istiqomah menghafal demi kemuliaan akhirat!`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const filteredSurahs = surahs.filter(s => {
    if (surahFilter === 'semua') return true;
    return s.status === surahFilter;
  });

  return (
    <div className="space-y-6">
      {/* Hero Banner Mutaba'ah */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-800/50 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mutaba'ah Harian & Check-List Mingguan Huffazh</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-emerald-400" />
              <span>Monitoring Progres Hafalan Al-Qur'an</span>
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Jaga kelancaran hafalan Kalamullah dengan evaluasi terstruktur: <strong className="text-emerald-400">Ziyadah</strong> (setoran baru), <strong className="text-emerald-400">Muraja'ah</strong> rutin, <strong className="text-emerald-400">Tasmi'</strong> bersama musyrif, dan tilawah istiqomah setiap hari.
            </p>
          </div>

          {/* Quick Metrics Header */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950/80 border border-emerald-700/40 rounded-xl px-4 py-3 min-w-[130px]">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>Istiqomah</span>
              </div>
              <div className="text-2xl font-black text-white mt-0.5">6 Hari</div>
              <div className="text-[10px] text-slate-400">Streak Tanpa Putus</div>
            </div>

            <div className="bg-slate-950/80 border border-emerald-700/40 rounded-xl px-4 py-3 min-w-[140px]">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <TrendingUp className="w-4 h-4" />
                <span>Pekan Ini</span>
              </div>
              <div className="text-2xl font-black text-emerald-400 mt-0.5">{weeklyPercentage}%</div>
              <div className="text-[10px] text-slate-400">{completedTasks} dari {totalTasks} checklist</div>
            </div>

            <div className="bg-slate-950/80 border border-emerald-700/40 rounded-xl px-4 py-3 min-w-[130px]">
              <div className="flex items-center gap-1.5 text-xs text-sky-400 font-medium">
                <Award className="w-4 h-4" />
                <span>Surah Mutqin</span>
              </div>
              <div className="text-2xl font-black text-white mt-0.5">{mutqinCount}</div>
              <div className="text-[10px] text-slate-400">Lancar & Teruji</div>
            </div>
          </div>
        </div>

        {/* Profile Ribbon */}
        <div className="mt-6 pt-5 border-t border-emerald-800/40 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <div className="flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-emerald-400" />
              <span>Target: <strong className="text-white">{profile.targetSurah}</strong></span>
            </div>
            <div className="hidden sm:inline text-slate-600">•</div>
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Musyrif: <strong className="text-white">{profile.musyrifName}</strong></span>
            </div>
            <div className="hidden sm:inline text-slate-600">•</div>
            <div className="text-slate-400">
              Grup: <span className="text-slate-200">{profile.halaqahGroup}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditProfile(!showEditProfile)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              Ubah Target & Musyrif
            </button>
            <button
              onClick={() => setShowLogModal(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catat Setoran Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Panel (Collapsible) */}
      {showEditProfile && (
        <div className="bg-slate-900 border border-emerald-800/60 rounded-xl p-5 shadow-lg animate-in fade-in">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-emerald-400" />
            <span>Pengaturan Target Hafalan & Halaqah Al-Qur'an</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Target Fokus Hafalan</label>
              <input
                type="text"
                value={profile.targetSurah}
                onChange={(e) => setProfile({ ...profile, targetSurah: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                placeholder="Contoh: Juz 30 / Juz 29 / QS. Al-Baqarah"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Target Ayat per Pekan</label>
              <input
                type="number"
                value={profile.weeklyTargetVerses}
                onChange={(e) => setProfile({ ...profile, weeklyTargetVerses: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                placeholder="Contoh: 50"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Nama Musyrif / Pembimbing</label>
              <input
                type="text"
                value={profile.musyrifName}
                onChange={(e) => setProfile({ ...profile, musyrifName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                placeholder="Nama Ustadz / Guru Simakan"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Nama Halaqah / Komunitas</label>
              <input
                type="text"
                value={profile.halaqahGroup}
                onChange={(e) => setProfile({ ...profile, halaqahGroup: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                placeholder="Nama kelompok halaqah"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowEditProfile(false)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg"
            >
              Simpan Target
            </button>
          </div>
        </div>
      )}

      {/* Bagian 1: Sistem Check-List Mingguan 7 Hari */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg space-y-6">
        {/* Week bar controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Check-List Mingguan Mutaba'ah</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                  Pekan 3 Oktober 2026
                </span>
              </div>
              <p className="text-xs text-slate-400">
                19 Okt 2026 – 25 Okt 2026 • Centang langsung setiap kali menyelesaikan setoran & muraja'ah
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleCopyWeeklySummary}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5 shadow-sm"
              title="Salin rekap mutaba'ah untuk disetor ke WhatsApp Musyrif/Halaqah"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{isCopied ? 'Tersalin!' : 'Bagikan ke WA Halaqah'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
              title="Cetak lembar mutaba'ah mingguan"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak Rekap</span>
            </button>
          </div>
        </div>

        {/* 7 Days Weekly Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
          {weeklyList.map((day) => {
            const isToday = day.dayId === 'selasa';
            const isSelected = day.dayId === selectedDayId;
            const dayDoneCount = 
              (day.ziyadahDone ? 1 : 0) + 
              (day.murajaahDone ? 1 : 0) + 
              (day.tasmiDone ? 1 : 0) + 
              (day.tilawahDone ? 1 : 0);
            const isFull = dayDoneCount === 4;

            return (
              <div
                key={day.dayId}
                onClick={() => setSelectedDayId(day.dayId)}
                className={`cursor-pointer rounded-xl p-3.5 border transition-all relative flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-slate-850 border-emerald-500 shadow-md ring-1 ring-emerald-500/50' 
                    : isToday 
                    ? 'bg-slate-900/90 border-emerald-600/50 hover:bg-slate-850' 
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/80'
                }`}
              >
                {isToday && (
                  <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500 text-slate-950 uppercase tracking-wider">
                    Hari Ini
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {day.dayName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {dayDoneCount}/4
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{day.dateStr}</div>

                  {/* Visual Checklist Pill Bars */}
                  <div className="mt-3 space-y-1.5">
                    {/* Ziyadah */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTask(day.dayId, 'ziyadahDone');
                      }}
                      className={`w-full text-left px-2 py-1 rounded text-[11px] flex items-center justify-between transition-colors ${
                        day.ziyadahDone 
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 font-semibold' 
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-300'
                      }`}
                    >
                      <span className="truncate">Ziyadah</span>
                      {day.ziyadahDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
                    </button>

                    {/* Muraja'ah */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTask(day.dayId, 'murajaahDone');
                      }}
                      className={`w-full text-left px-2 py-1 rounded text-[11px] flex items-center justify-between transition-colors ${
                        day.murajaahDone 
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 font-semibold' 
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-300'
                      }`}
                    >
                      <span className="truncate">Muraja'ah</span>
                      {day.murajaahDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
                    </button>

                    {/* Tasmi' */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTask(day.dayId, 'tasmiDone');
                      }}
                      className={`w-full text-left px-2 py-1 rounded text-[11px] flex items-center justify-between transition-colors ${
                        day.tasmiDone 
                          ? 'bg-sky-950/80 text-sky-300 border border-sky-800/50 font-semibold' 
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-300'
                      }`}
                    >
                      <span className="truncate">Tasmi'</span>
                      {day.tasmiDone ? <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" /> : <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
                    </button>

                    {/* Tilawah */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTask(day.dayId, 'tilawahDone');
                      }}
                      className={`w-full text-left px-2 py-1 rounded text-[11px] flex items-center justify-between transition-colors ${
                        day.tilawahDone 
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50 font-semibold' 
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-300'
                      }`}
                    >
                      <span className="truncate">Tilawah</span>
                      {day.tilawahDone ? <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" /> : <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
                    </button>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                  <span className={isFull ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {isFull ? 'Tuntas 100%' : `${dayDoneCount * 25}%`}
                  </span>
                  <span className="text-emerald-500/80 font-medium">Buka Detail →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Day Deep Dive Editor */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  Rincian Mutaba'ah Hari {selectedDay.dayName}
                </span>
                <span className="text-xs text-slate-400 font-mono">({selectedDay.dateStr})</span>
                {selectedDay.dayId === 'selasa' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                    Hari Ini
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Atur target spesifik maqra', hafalan baru, dan evaluasi tajwid untuk hari ini.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setWeeklyList(prev => prev.map(d => {
                    if (d.dayId === selectedDayId) {
                      return {
                        ...d,
                        ziyadahDone: true,
                        murajaahDone: true,
                        tasmiDone: true,
                        tilawahDone: true
                      };
                    }
                    return d;
                  }));
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Tandai Semua Selesai</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Ziyadah Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="font-bold text-white text-xs">1. Ziyadah (Setoran Hafalan Baru)</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleTask(selectedDay.dayId, 'ziyadahDone')}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedDay.ziyadahDone
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {selectedDay.ziyadahDone ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{selectedDay.ziyadahDone ? 'Sudah Setor' : 'Belum Setor'}</span>
                </button>
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Target Surah & Ayat:</label>
                <input
                  type="text"
                  value={selectedDay.ziyadahTarget}
                  onChange={(e) => handleUpdateDayDetail(selectedDay.dayId, 'ziyadahTarget', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-750 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  placeholder="Misal: QS. 'Abasa ayat 1 - 15"
                />
              </div>
            </div>

            {/* Muraja'ah Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="font-bold text-white text-xs">2. Muraja'ah (Pengulangan Hafalan Lama)</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleTask(selectedDay.dayId, 'murajaahDone')}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedDay.murajaahDone
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {selectedDay.murajaahDone ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{selectedDay.murajaahDone ? 'Sudah Muraja\'ah' : 'Belum Muraja\'ah'}</span>
                </button>
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Target Maqra' / Surah Lama:</label>
                <input
                  type="text"
                  value={selectedDay.murajaahTarget}
                  onChange={(e) => handleUpdateDayDetail(selectedDay.dayId, 'murajaahTarget', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-750 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  placeholder="Misal: Surah An-Naba' & An-Nazi'at"
                />
              </div>
            </div>

            {/* Tasmi' Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span className="font-bold text-white text-xs">3. Tasmi' (Disimak Musyrif / Rekan)</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleTask(selectedDay.dayId, 'tasmiDone')}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedDay.tasmiDone
                      ? 'bg-sky-500 text-slate-950 shadow'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {selectedDay.tasmiDone ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{selectedDay.tasmiDone ? 'Telah Disimak' : 'Belum Simakan'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Disimak oleh <strong>{profile.musyrifName}</strong> atau rekan halaqah untuk memastikan makharijul huruf, shifatul huruf, dan panjang pendek mad terjaga sempurna.
              </p>
            </div>

            {/* Tilawah Tartil Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="font-bold text-white text-xs">4. Tilawah Tartil (One Day One Juz)</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleTask(selectedDay.dayId, 'tilawahDone')}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedDay.tilawahDone
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {selectedDay.tilawahDone ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{selectedDay.tilawahDone ? 'Tilawah Tuntas' : 'Belum Tilawah'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Membaca mushaf dengan tartil dan tadabbur minimal 1 Juz atau 10 lembar sehari sebagai nutrisi ruhani penghafal Qur'an.
              </p>
            </div>
          </div>

          {/* Notes Input */}
          <div className="pt-2">
            <label className="block text-slate-400 text-xs mb-1">
              Catatan Evaluasi Musyrif / Tajwid Hari Ini:
            </label>
            <textarea
              rows={2}
              value={selectedDay.notes || ''}
              onChange={(e) => handleUpdateDayDetail(selectedDay.dayId, 'notes', e.target.value)}
              className="w-full bg-slate-950 border border-slate-750 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
              placeholder="Catatan waqaf, idgham bighunnah, atau evaluasi ayat yang sering keliru..."
            />
          </div>
        </div>
      </div>

      {/* Bagian 2: Peta Capaian Surah Juz 30 & Populer (38 Surah) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>Peta Progres Kelancaran Surah (Juz 'Amma & Surat Pilihan)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Klik pada surah untuk mengubah status: <span className="text-slate-400">Belum</span> → <span className="text-amber-400">Sedang Dihafal</span> → <span className="text-emerald-400">Mutqin (Lancar)</span>
            </p>
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSurahFilter('semua')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                surahFilter === 'semua' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua ({surahs.length})
            </button>
            <button
              onClick={() => setSurahFilter('mutqin')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                surahFilter === 'mutqin' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <span>Mutqin</span>
              <span className="text-[10px] bg-emerald-800/80 px-1.5 py-0.2 rounded-full">{mutqinCount}</span>
            </button>
            <button
              onClick={() => setSurahFilter('proses')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                surahFilter === 'proses' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              <span>Ziyadah</span>
              <span className="text-[10px] bg-amber-800/80 px-1.5 py-0.2 rounded-full">{prosesCount}</span>
            </button>
            <button
              onClick={() => setSurahFilter('belum')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                surahFilter === 'belum' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Belum ({belumCount})
            </button>
          </div>
        </div>

        {/* Surahs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredSurahs.map((surah) => {
            const isMutqin = surah.status === 'mutqin';
            const isProses = surah.status === 'proses';

            return (
              <div
                key={surah.number}
                onClick={() => handleCycleSurahStatus(surah.number)}
                className={`cursor-pointer rounded-xl p-3 border transition-all text-left flex flex-col justify-between select-none ${
                  isMutqin 
                    ? 'bg-emerald-950/40 border-emerald-700/60 hover:bg-emerald-950/60' 
                    : isProses 
                    ? 'bg-amber-950/30 border-amber-600/50 hover:bg-amber-950/50' 
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900'
                }`}
                title="Klik untuk mengubah status hafalan surah ini"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono text-slate-500 font-semibold">#{surah.number}</span>
                    <span className="font-arabic text-xs text-slate-300">{surah.arabicName}</span>
                  </div>
                  <div className="font-bold text-white text-xs truncate">
                    {surah.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {surah.totalVerses} Ayat • Juz {surah.juz}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isMutqin 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : isProses 
                      ? 'bg-amber-500/20 text-amber-300' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isMutqin ? 'Mutqin ✓' : isProses ? 'Ziyadah' : 'Belum'}
                  </span>
                  <RotateCcw className="w-3 h-3 text-slate-600 hover:text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bagian 3: Keutamaan Menghafal Al-Qur'an & Panduan Adab */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-emerald-950/70 to-slate-900 border border-emerald-800/40 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <Heart className="w-5 h-5 fill-emerald-400/20" />
            <h4 className="text-sm font-bold text-white">Keutamaan Shahibul Qur'an (Penghafal Al-Qur'an)</h4>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-900/50">
            <p className="font-arabic text-right text-base text-emerald-200 leading-loose">
              خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
            </p>
            <p className="text-xs text-slate-300 mt-2 italic">
              "Sebaik-baik kalian adalah orang yang mempelajari Al-Qur'an dan mengajarkannya."
            </p>
            <span className="text-[10px] text-emerald-400 block mt-1 font-semibold">
              — HR. Bukhari no. 5027
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Menghafal Al-Qur'an bukan sekadar mengingat lafazh, melainkan menanamkan akhlaq mulia Rosulullah SAW dalam setiap aspek kehidupan berbangsa dan berkeluarga.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sky-400">
            <Info className="w-5 h-5" />
            <h4 className="text-sm font-bold text-white">Tips Istiqomah Menjaga Hafalan (Muraja'ah)</h4>
          </div>
          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
              <span><strong>Gunakan dalam Sholat Wajib & Sunnah:</strong> Bacalah surah hafalan baru saat sholat tahajjud, rawatib, dan dhuha.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
              <span><strong>Metode 1:4 (1 Ziyadah, 4 Muraja'ah):</strong> Untuk setiap 1 halaman baru yang dihafal, ulangi minimal 4 halaman sebelumnya agar tidak hilang.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
              <span><strong>Tasmi' Bersanad:</strong> Mintalah disimak oleh musyrif agar tajwid, mad, dan ghunnah teruji secara sahih.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Modal Catat Setoran Baru */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-emerald-800/80 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowLogModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Catat Setoran Hafalan Baru</h3>
                <p className="text-xs text-slate-400">Rekam catatan setoran harian ke dalam log mutaba'ah</p>
              </div>
            </div>

            <form onSubmit={handleSaveSetoran} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-3">
                  <label className="block text-slate-300 mb-1">Pilih Surah yang Disetor</label>
                  <select
                    value={logSurahName}
                    onChange={(e) => setLogSurahName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {surahs.map(s => (
                      <option key={s.number} value={s.name}>
                        QS. {s.name} ({s.arabicName}) - {s.totalVerses} Ayat (Juz {s.juz})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Dari Ayat</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={logStartAyat}
                    onChange={(e) => setLogStartAyat(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Sampai Ayat</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={logEndAyat}
                    onChange={(e) => setLogEndAyat(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Kelancaran</label>
                  <select
                    value={logGrade}
                    onChange={(e) => setLogGrade(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Mumtaz (Sangat Lancar)">Mumtaz (Sangat Lancar)</option>
                    <option value="Jayyid Jiddan (Lancar)">Jayyid Jiddan (Lancar)</option>
                    <option value="Jayyid (Cukup)">Jayyid (Cukup)</option>
                    <option value="Perlu Diulang">Perlu Diulang</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Catatan Tajwid / Waqaf dari Musyrif</label>
                <textarea
                  rows={3}
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Catatan dari Ustadz atau koreksi makharijul huruf..."
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
                >
                  Simpan ke Mutaba'ah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
