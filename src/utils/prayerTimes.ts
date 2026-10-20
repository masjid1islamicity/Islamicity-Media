import { PrayerTimesSchedule } from '../types/islamicity';

export interface PrayerDefinition {
  key: 'imsak' | 'subuh' | 'terbit' | 'dhuha' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';
  name: string;
  arabicName: string;
  time: string; // HH:mm
  timestamp: number; // unix ms
  isNext: boolean;
  isPassed: boolean;
}

export interface CalculationMethod {
  id: string;
  name: string;
  fajrAngle: number;
  ishaAngle: number;
}

export const CALCULATION_METHODS: CalculationMethod[] = [
  { id: 'kemenag', name: 'Kemenag RI / Standar Indonesia (Subuh 20°, Isya 18°)', fajrAngle: 20, ishaAngle: 18 },
  { id: 'mwl', name: 'Muslim World League (Subuh 18°, Isya 17°)', fajrAngle: 18, ishaAngle: 17 },
  { id: 'egypt', name: 'Egyptian General Authority (Subuh 19.5°, Isya 17.5°)', fajrAngle: 19.5, ishaAngle: 17.5 },
  { id: 'makkah', name: 'Umm Al-Qura University, Makkah (Subuh 18.5°, Isya 90m)', fajrAngle: 18.5, ishaAngle: 19 }
];

// Helper: Convert degrees to radians and vice-versa
const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/**
 * Calculates solar position and astronomical prayer times based on latitude, longitude, and date.
 */
export function calculatePrayerTimes(
  lat: number,
  lng: number,
  date: Date = new Date(),
  timezoneOffsetHours: number = 7, // default to WIB (UTC+7)
  method: CalculationMethod = CALCULATION_METHODS[0]
): PrayerTimesSchedule {
  // Day of the year
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Solar declination (approximate formula by Spencer / Cooper)
  const B = (360 / 365) * (dayOfYear - 81);
  const declination = 23.45 * Math.sin(toRad(B)); // in degrees
  const decRad = toRad(declination);
  const latRad = toRad(lat);

  // Equation of Time (EoT) in minutes
  const BRad = toRad(B);
  const EoT = 9.87 * Math.sin(2 * BRad) - 7.53 * Math.cos(BRad) - 1.5 * Math.sin(BRad);

  // Solar Noon (Transit) in local hours
  // Local Solar Noon = 12 + Timezone - (Longitude / 15) - (EoT / 60)
  const solarNoonHours = 12 + timezoneOffsetHours - (lng / 15) - (EoT / 60);

  // Helper to compute hour angle (H) for an elevation angle (alpha)
  const getHourAngle = (alphaDeg: number): number | null => {
    const alphaRad = toRad(alphaDeg);
    const cosH = (Math.sin(alphaRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
    if (cosH > 1 || cosH < -1) return null; // Sun never reaches this angle
    return toDeg(Math.acos(cosH));
  };

  // 1. Sunrise and Sunset (sun center at -0.833° considering atmospheric refraction and solar radius)
  const sunriseHourAngle = getHourAngle(-0.833) || 90;
  const sunsetHours = solarNoonHours + (sunriseHourAngle / 15);
  const sunriseHours = solarNoonHours - (sunriseHourAngle / 15);

  // 2. Fajr / Subuh (depression angle, e.g. -20° for Kemenag)
  const fajrHourAngle = getHourAngle(-method.fajrAngle) || 105;
  const fajrHours = solarNoonHours - (fajrHourAngle / 15);

  // 3. Isha (depression angle, e.g. -18°)
  const ishaHourAngle = getHourAngle(-method.ishaAngle) || 105;
  const ishaHours = solarNoonHours + (ishaHourAngle / 15);

  // 4. Asr (Shafi'i: shadow = length + noon shadow)
  // Noon shadow = tan(|lat - declination|)
  const noonZenith = Math.abs(lat - declination);
  const asrAltitudeRad = Math.atan(1 / (1 + Math.tan(toRad(noonZenith))));
  const asrHourAngle = getHourAngle(toDeg(asrAltitudeRad)) || 45;
  const asrHours = solarNoonHours + (asrHourAngle / 15);

  // 5. Imsak: 10 minutes prior to Subuh
  const imsakHours = fajrHours - (10 / 60);

  // 6. Dhuha: when sun reaches approx 4.5° elevation (approx 20 mins after sunrise)
  const dhuhaHourAngle = getHourAngle(4.5) || 85;
  const dhuhaHours = solarNoonHours - (dhuhaHourAngle / 15);

  // Helper: Format decimal hours into HH:mm with safety buffer (ihtiyat ~ +2 min for prayer entry)
  const formatTime = (h: number, bufferMinutes: number = 2): string => {
    const totalMinutes = Math.round((h * 60) + bufferMinutes);
    let hours = Math.floor(totalMinutes / 60) % 24;
    let mins = totalMinutes % 60;
    if (hours < 0) hours += 24;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const formattedDate = date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return {
    date: formattedDate,
    imsak: formatTime(imsakHours, 0),
    subuh: formatTime(fajrHours, 2),
    terbit: formatTime(sunriseHours, -1),
    dhuha: formatTime(dhuhaHours, 2),
    dzuhur: formatTime(solarNoonHours, 2),
    ashar: formatTime(asrHours, 2),
    maghrib: formatTime(sunsetHours, 2),
    isya: formatTime(ishaHours, 2)
  };
}

/**
 * Parses today's prayer times into an array with countdowns and active state
 */
export function getDetailedPrayersList(
  schedule: PrayerTimesSchedule,
  currentDate: Date = new Date()
): {
  prayers: PrayerDefinition[];
  currentNextPrayer: PrayerDefinition | null;
  timeRemainingMs: number;
} {
  const parseTimeToMs = (timeStr: string): number => {
    const [hh, mm] = timeStr.split(':').map(Number);
    const d = new Date(currentDate);
    d.setHours(hh, mm, 0, 0);
    return d.getTime();
  };

  const currentMs = currentDate.getTime();

  const rawList: Omit<PrayerDefinition, 'isNext' | 'isPassed'>[] = [
    { key: 'imsak', name: 'Imsak', arabicName: 'الإمساك', time: schedule.imsak, timestamp: parseTimeToMs(schedule.imsak) },
    { key: 'subuh', name: 'Subuh', arabicName: 'الفجر', time: schedule.subuh, timestamp: parseTimeToMs(schedule.subuh) },
    { key: 'terbit', name: 'Syuruq', arabicName: 'الشروق', time: schedule.terbit, timestamp: parseTimeToMs(schedule.terbit) },
    { key: 'dhuha', name: 'Dhuha', arabicName: 'الضحى', time: schedule.dhuha, timestamp: parseTimeToMs(schedule.dhuha) },
    { key: 'dzuhur', name: 'Dzuhur', arabicName: 'الظهر', time: schedule.dzuhur, timestamp: parseTimeToMs(schedule.dzuhur) },
    { key: 'ashar', name: 'Ashar', arabicName: 'العصر', time: schedule.ashar, timestamp: parseTimeToMs(schedule.ashar) },
    { key: 'maghrib', name: 'Maghrib', arabicName: 'المغرب', time: schedule.maghrib, timestamp: parseTimeToMs(schedule.maghrib) },
    { key: 'isya', name: 'Isya', arabicName: 'العشاء', time: schedule.isya, timestamp: parseTimeToMs(schedule.isya) }
  ];

  // Find the next upcoming prayer
  let nextIndex = -1;
  for (let i = 0; i < rawList.length; i++) {
    if (rawList[i].timestamp > currentMs) {
      nextIndex = i;
      break;
    }
  }

  // If all prayers today have passed, next is tomorrow's Imsak/Subuh
  let timeRemainingMs = 0;
  let currentNextPrayer: PrayerDefinition | null = null;

  if (nextIndex !== -1) {
    timeRemainingMs = Math.max(0, rawList[nextIndex].timestamp - currentMs);
  } else {
    // Tomorrow's first prayer (Imsak) is 24h away approx
    const tomorrowImsak = rawList[0].timestamp + (24 * 60 * 60 * 1000);
    timeRemainingMs = Math.max(0, tomorrowImsak - currentMs);
  }

  const prayers: PrayerDefinition[] = rawList.map((p, idx) => {
    const isPassed = p.timestamp <= currentMs;
    const isNext = (nextIndex === -1 && idx === 0) || idx === nextIndex;
    const def: PrayerDefinition = {
      ...p,
      isPassed,
      isNext
    };
    if (isNext) {
      currentNextPrayer = def;
    }
    return def;
  });

  return { prayers, currentNextPrayer, timeRemainingMs };
}

/**
 * Generates an 7-day upcoming weekly prayer schedule
 */
export function generateWeeklySchedule(
  lat: number,
  lng: number,
  startDate: Date = new Date(),
  timezoneOffsetHours: number = 7,
  method?: CalculationMethod
): PrayerTimesSchedule[] {
  const result: PrayerTimesSchedule[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    result.push(calculatePrayerTimes(lat, lng, d, timezoneOffsetHours, method));
  }
  return result;
}
