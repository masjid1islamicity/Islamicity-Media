import { HijriDateParts, IslamicEventItem } from '../types/islamicity';

export const HIJRI_MONTHS_ID: Array<{ number: number; nameId: string; nameAr: string }> = [
  { number: 1, nameId: 'Muharram', nameAr: 'مُحَرَّم' },
  { number: 2, nameId: 'Safar', nameAr: 'صَفَر' },
  { number: 3, nameId: "Rabi'ul Awal", nameAr: 'رَبِيْعُ الأَوَّل' },
  { number: 4, nameId: "Rabi'ul Akhir", nameAr: 'رَبِيْعُ الآخِر' },
  { number: 5, nameId: 'Jumadil Awal', nameAr: 'جُمَادَى الأُوْلَى' },
  { number: 6, nameId: 'Jumadil Akhir', nameAr: 'جُمَادَى الآخِرَة' },
  { number: 7, nameId: 'Rajab', nameAr: 'رَجَب' },
  { number: 8, nameId: "Sya'ban", nameAr: 'شَعْبَان' },
  { number: 9, nameId: 'Ramadhan', nameAr: 'رَمَضَان' },
  { number: 10, nameId: 'Syawal', nameAr: 'شَوَّال' },
  { number: 11, nameId: "Dzulqa'dah", nameAr: 'ذُو القَعْدَة' },
  { number: 12, nameId: 'Dzulhijjah', nameAr: 'ذُو الحِجَّة' },
];

const WEEKDAYS_ID = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];

/**
 * Converts a Gregorian calendar date (year, month 1-12, day 1-31) to Julian Day Number.
 */
function gregorianToJdn(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/**
 * Converts a Julian Day Number to Gregorian Date (local noon to avoid DST boundary drift).
 */
function jdnToGregorian(jdn: number): Date {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);

  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);

  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

/**
 * Tabular Islamic (Kuwaiti) JDN <-> Hijri conversion.
 */
function jdnToHijriMath(jdn: number): { year: number; month: number; day: number } {
  const l = jdn - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 =
    l2 -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { year, month, day };
}

function hijriToJdnMath(year: number, month: number, day: number): number {
  return (
    Math.floor((11 * year + 3) / 30) +
    354 * year +
    30 * month -
    Math.floor((month - 1) / 2) +
    day +
    1948440 -
    385
  );
}

function tryUmmAlQuraIntl(date: Date): { year: number; month: number; day: number } | null {
  try {
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
    const fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
    const parts = fmt.formatToParts(normalized);
    const dayStr = parts.find((p) => p.type === 'day')?.value;
    const monthStr = parts.find((p) => p.type === 'month')?.value;
    const yearStr = parts.find((p) => p.type === 'year')?.value;
    if (!dayStr || !monthStr || !yearStr) return null;

    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return null;
    if (month < 1 || month > 12 || day < 1 || day > 30) return null;
    return { year, month, day };
  } catch {
    return null;
  }
}

/**
 * Converts a Gregorian Date into Hijri date parts (Indonesian & Arabic labels).
 * Uses Umm al-Qura calendar via Intl when supported, with mathematical Kuwaiti fallback.
 */
export function gregorianToHijri(date: Date): HijriDateParts {
  const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  const intlResult = tryUmmAlQuraIntl(normalized);
  const raw =
    intlResult ??
    jdnToHijriMath(
      gregorianToJdn(
        normalized.getFullYear(),
        normalized.getMonth() + 1,
        normalized.getDate()
      )
    );

  const monthMeta = HIJRI_MONTHS_ID[raw.month - 1] ?? HIJRI_MONTHS_ID[0];
  const weekdayId = WEEKDAYS_ID[normalized.getDay()] ?? 'Hari';

  return {
    day: raw.day,
    month: raw.month,
    year: raw.year,
    monthNameId: monthMeta.nameId,
    monthNameAr: monthMeta.nameAr,
    weekdayId,
    formattedId: `${raw.day} ${monthMeta.nameId} ${raw.year} H`,
  };
}

/**
 * Converts a Hijri date (year, month 1-12, day 1-30) to a Gregorian Date.
 * Uses the Kuwaiti astronomical estimate and refines by +/-2 days against Intl Umm al-Qura when available.
 */
export function hijriToGregorian(year: number, month: number, day: number): Date {
  const safeMonth = Math.min(12, Math.max(1, month));
  const safeDay = Math.min(30, Math.max(1, day));
  const jdn = hijriToJdnMath(year, safeMonth, safeDay);
  const estimate = jdnToGregorian(jdn);

  // Refine alignment against Intl Umm al-Qura if supported in browser
  for (let offset = -2; offset <= 2; offset++) {
    const candidate = new Date(
      estimate.getFullYear(),
      estimate.getMonth(),
      estimate.getDate() + offset,
      12,
      0,
      0
    );
    const intlCheck = tryUmmAlQuraIntl(candidate);
    if (
      intlCheck &&
      intlCheck.year === year &&
      intlCheck.month === safeMonth &&
      intlCheck.day === safeDay
    ) {
      return candidate;
    }
  }

  return estimate;
}

export function formatGregorianId(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatInputDateValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

interface EventTemplate {
  id: string;
  title: string;
  arabicTitle: string;
  category: 'Hari Besar' | 'Puasa Sunnah' | 'Ibadah';
  month: number;
  day: number;
  description: string;
}

const ANNUAL_ISLAMIC_EVENTS: EventTemplate[] = [
  {
    id: 'tahun-baru-islam',
    title: 'Tahun Baru Islam 1 Muharram',
    arabicTitle: 'رأس السنة الهجرية',
    category: 'Hari Besar',
    month: 1,
    day: 1,
    description: 'Peringatan hijrah Rasulullah SAW dan awal tahun kalender Hijriyah.',
  },
  {
    id: 'puasa-tasua',
    title: "Puasa Sunnah Tasu'a",
    arabicTitle: 'صيام تاسوعاء',
    category: 'Puasa Sunnah',
    month: 1,
    day: 9,
    description: 'Puasa sunnah hari ke-9 Muharram mengiringi puasa Asyura.',
  },
  {
    id: 'hari-asyura',
    title: "Hari Asyura (10 Muharram)",
    arabicTitle: 'يوم عاشوراء',
    category: 'Puasa Sunnah',
    month: 1,
    day: 10,
    description: 'Puasa sunnah Asyura yang menghapus dosa setahun yang lalu.',
  },
  {
    id: 'maulid-nabi',
    title: 'Maulid Nabi Muhammad SAW',
    arabicTitle: 'المولد النبوي الشريف',
    category: 'Hari Besar',
    month: 3,
    day: 12,
    description: 'Peringatan kelahiran Baginda Rasulullah SAW dan perbanyak sholawat.',
  },
  {
    id: 'isra-miraj',
    title: "Isra Mi'raj Nabi Muhammad SAW",
    arabicTitle: 'الإسراء والمعراج',
    category: 'Hari Besar',
    month: 7,
    day: 27,
    description: 'Peristiwa agung perjalanan malam Rasulullah SAW dan perintah sholat 5 waktu.',
  },
  {
    id: 'nisfu-syaban',
    title: "Nisfu Sya'ban",
    arabicTitle: 'ليلة النصف من شعبان',
    category: 'Ibadah',
    month: 8,
    day: 15,
    description: "Pertengahan bulan Sya'ban sebagai persiapan ruhani menyambut Ramadhan.",
  },
  {
    id: 'awal-ramadhan',
    title: 'Awal Bulan Suci Ramadhan',
    arabicTitle: 'غرة شهر رمضان',
    category: 'Hari Besar',
    month: 9,
    day: 1,
    description: 'Permulaan ibadah puasa wajib Ramadhan, tarawih, dan tadarus Al-Qur’an.',
  },
  {
    id: 'nuzulul-quran',
    title: "Nuzulul Qur'an (17 Ramadhan)",
    arabicTitle: 'نزول القرآن الكريم',
    category: 'Ibadah',
    month: 9,
    day: 17,
    description: 'Peringatan turunnya wahyu pertama Al-Qur’an Al-Karim kepada Nabi SAW.',
  },
  {
    id: 'idul-fitri',
    title: 'Hari Raya Idul Fitri (1 Syawal)',
    arabicTitle: 'عيد الفطر المبارك',
    category: 'Hari Besar',
    month: 10,
    day: 1,
    description: 'Hari kemenangan umat Islam setelah menunaikan puasa Ramadhan & Zakat Fitrah.',
  },
  {
    id: 'puasa-arafah',
    title: 'Puasa Arafah (9 Dzulhijjah)',
    arabicTitle: 'صيام يوم عرفة',
    category: 'Puasa Sunnah',
    month: 12,
    day: 9,
    description: 'Puasa sunnah utama bagi yang tidak berhaji bertepatan dengan wukuf di Arafah.',
  },
  {
    id: 'idul-adha',
    title: 'Hari Raya Idul Adha (10 Dzulhijjah)',
    arabicTitle: 'عيد الأضحى المبارك',
    category: 'Hari Besar',
    month: 12,
    day: 10,
    description: 'Hari Raya Qurban dan syiar keteladanan Nabi Ibrahim AS & Ismail AS.',
  },
];

/**
 * Returns upcoming Islamic events sorted chronologically from `fromDate`.
 * Includes annual major events and the next monthly Ayyamul Bidh (13th of Hijri month).
 */
export function getUpcomingIslamicEvents(
  fromDate: Date = new Date(),
  limit: number = 6
): IslamicEventItem[] {
  const todayMidnight = new Date(
    fromDate.getFullYear(),
    fromDate.getMonth(),
    fromDate.getDate(),
    12,
    0,
    0
  );
  const currentHijri = gregorianToHijri(todayMidnight);
  const candidateYears = [currentHijri.year, currentHijri.year + 1];

  const items: IslamicEventItem[] = [];

  for (const hYear of candidateYears) {
    for (const tpl of ANNUAL_ISLAMIC_EVENTS) {
      const greg = hijriToGregorian(hYear, tpl.month, tpl.day);
      const diffMs = greg.getTime() - todayMidnight.getTime();
      const daysUntil = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (daysUntil >= 0) {
        const monthMeta = HIJRI_MONTHS_ID[tpl.month - 1];
        items.push({
          id: `${tpl.id}-${hYear}`,
          title: tpl.title,
          arabicTitle: tpl.arabicTitle,
          category: tpl.category,
          hijriDay: tpl.day,
          hijriMonth: tpl.month,
          hijriYear: hYear,
          hijriFormatted: `${tpl.day} ${monthMeta.nameId} ${hYear} H`,
          gregorianDate: greg,
          gregorianFormatted: greg.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          daysUntil,
          description: tpl.description,
        });
      }
    }
  }

  // Add upcoming Ayyamul Bidh (13-15 of current or next Hijri month)
  const ayyamMonth = currentHijri.day <= 15 ? currentHijri.month : (currentHijri.month % 12) + 1;
  const ayyamYear =
    currentHijri.day <= 15
      ? currentHijri.year
      : currentHijri.month === 12
      ? currentHijri.year + 1
      : currentHijri.year;

  // Note: 13 Dzulhijjah is Tasyrik day (forbidden to fast), so skip Ayyamul Bidh if month === 12
  if (ayyamMonth !== 12) {
    const ayyamDay = currentHijri.day >= 13 && currentHijri.day <= 15 ? currentHijri.day : 13;
    const ayyamGreg = hijriToGregorian(ayyamYear, ayyamMonth, ayyamDay);
    const ayyamDaysUntil = Math.round(
      (ayyamGreg.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (ayyamDaysUntil >= 0) {
      const monthMeta = HIJRI_MONTHS_ID[ayyamMonth - 1];
      items.push({
        id: `ayyamul-bidh-${ayyamYear}-${ayyamMonth}`,
        title: `Puasa Sunnah Ayyamul Bidh (${monthMeta.nameId})`,
        arabicTitle: 'صيام الأيام البيض',
        category: 'Puasa Sunnah',
        hijriDay: 13,
        hijriMonth: ayyamMonth,
        hijriYear: ayyamYear,
        hijriFormatted: `13–15 ${monthMeta.nameId} ${ayyamYear} H`,
        gregorianDate: ayyamGreg,
        gregorianFormatted: ayyamGreg.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        daysUntil: ayyamDaysUntil,
        description: 'Puasa sunnah pertengahan bulan Hijriyah (tanggal 13, 14, dan 15).',
      });
    }
  }

  return items.sort((a, b) => a.daysUntil - b.daysUntil).slice(0, limit);
}
