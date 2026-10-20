import { QiblaLocation } from '../types/islamicity';

export const KAABA_COORDINATES = {
  latitude: 21.422487,
  longitude: 39.826206,
  name: 'Ka\'bah, Masjidil Haram, Makkah Al-Mukarramah'
};

export const DEFAULT_CITIES: QiblaLocation[] = [
  { city: 'Depok (UPIC Limo)', country: 'Indonesia', latitude: -6.3687, longitude: 106.7788 },
  { city: 'DKI Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456 },
  { city: 'Bandung', country: 'Indonesia', latitude: -6.9175, longitude: 107.6191 },
  { city: 'Surabaya', country: 'Indonesia', latitude: -7.2575, longitude: 112.7521 },
  { city: 'Semarang', country: 'Indonesia', latitude: -6.9667, longitude: 110.4167 },
  { city: 'Yogyakarta', country: 'Indonesia', latitude: -7.7956, longitude: 110.3695 },
  { city: 'Banda Aceh', country: 'Indonesia', latitude: 5.5483, longitude: 95.3238 },
  { city: 'Medan', country: 'Indonesia', latitude: 3.5952, longitude: 98.6722 },
  { city: 'Padang', country: 'Indonesia', latitude: -0.9471, longitude: 100.4172 },
  { city: 'Makassar', country: 'Indonesia', latitude: -5.1477, longitude: 119.4327 },
  { city: 'Banjarmasin', country: 'Indonesia', latitude: -3.3194, longitude: 114.5908 },
  { city: 'Mataram (Lombok)', country: 'Indonesia', latitude: -8.5768, longitude: 116.1158 },
  { city: 'Kuala Lumpur', country: 'Malaysia', latitude: 3.1390, longitude: 101.6869 },
  { city: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 }
];

/**
 * Calculates the forward azimuth (Qibla bearing) from coordinates to the Kaaba
 * Result is in degrees from True North [0, 360)
 */
export function calculateQiblaBearing(latitude: number, longitude: number): number {
  const phi1 = (latitude * Math.PI) / 180;
  const phi2 = (KAABA_COORDINATES.latitude * Math.PI) / 180;
  const deltaLambda = ((KAABA_COORDINATES.longitude - longitude) * Math.PI) / 180;

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);
  
  let qiblaRad = Math.atan2(y, x);
  let qiblaDeg = (qiblaRad * 180) / Math.PI;

  return (qiblaDeg + 360) % 360;
}

/**
 * Calculates the great circle distance in kilometers to the Kaaba
 */
export function calculateDistanceToKaaba(latitude: number, longitude: number): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((KAABA_COORDINATES.latitude - latitude) * Math.PI) / 180;
  const dLon = ((KAABA_COORDINATES.longitude - longitude) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((latitude * Math.PI) / 180) *
      Math.cos((KAABA_COORDINATES.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Normalizes an angle into [0, 360) degrees
 */
export function normalizeAngle(angle: number): number {
  let normalized = angle % 360;
  if (normalized < 0) normalized += 360;
  return normalized;
}

/**
 * Computes shortest angular difference between device heading and target Qibla bearing
 * Range is -180 to +180
 */
export function getAngularDifference(heading: number, targetBearing: number): number {
  let diff = (targetBearing - heading) % 360;
  if (diff < -180) diff += 360;
  if (diff > 180) diff -= 360;
  return diff;
}
