export type NavTab = 
  | 'tv-radio'
  | 'jadwal-sholat'
  | 'kompas-kiblat'
  | 'sholawat'
  | 'zakat-qris'
  | 'edukasi'
  | 'komunitas'
  | 'simpul-umat'
  | 'analitik-upic'
  | 'voucher-haji';

export interface PrayerTimesSchedule {
  date: string;
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface PrayerAlarmSettings {
  [prayerKey: string]: boolean;
}

export interface QiblaLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface QiblaState {
  heading: number;
  qiblaBearing: number;
  distanceKm: number;
  isAligned: boolean;
  sensorSource: 'magnetometer' | 'deviceorientation' | 'simulated';
  latitude: number;
  longitude: number;
  locationName: string;
}

export interface ChannelItem {
  id: string;
  name: string;
  type: 'tv' | 'radio';
  tagline: string;
  category: string;
  streamUrl: string;
  fallbackVideoId?: string;
  logoText: string;
  location: string;
  isLive: boolean;
  viewers: number;
  freqOrBandwidth?: string;
  artvisiMember: boolean;
  description: string;
}

export interface ZakatCalculation {
  monthlyIncome: number;
  sideIncome: number;
  monthlyExpenses: number;
  goldPricePerGram: number;
  goldGramsOwned: number;
  businessAssets: number;
  businessDebts: number;
  zakatType: 'penghasilan' | 'maal' | 'emas' | 'perdagangan' | 'fitrah';
}

export interface DonationRecord {
  id: string;
  programTitle: string;
  category: 'zakat' | 'infaq' | 'sedekah' | 'wakaf' | 'artvisi';
  amount: number;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  doaMessage: string;
  isAnonymous: boolean;
  paymentMethod: 'qris' | 'bsi_transfer' | 'va';
  status: 'pending' | 'success';
  timestamp: string;
  referenceNumber: string;
}

export interface SimpulNode {
  id: number;
  name: string;
  region: string;
  province: string;
  category: 'Relawan' | 'Alumni' | 'Profesi' | 'Pakar' | 'Perempuan' | 'Santri & Ulama';
  contactPerson: string;
  memberCount: number;
  isVerified: boolean;
}

export interface ForumPost {
  id: string;
  author: string;
  avatar: string;
  role: string;
  city: string;
  timeAgo: string;
  title: string;
  content: string;
  category: 'Dakwah & Akhlaq' | 'Ekonomi Syariah' | 'Kemandirian Umat' | 'UPIC Hyperlocal' | 'Tanya Ustadz';
  likes: number;
  repliesCount: number;
  replies?: Array<{
    id: string;
    author: string;
    role: string;
    content: string;
    timeAgo: string;
  }>;
}

export interface VoucherItem {
  id: string;
  code: string;
  title: string;
  provider: string;
  discountValue: string;
  minTransaction: string;
  expiryDate: string;
  category: 'Haji & Umrah' | 'LimoCity Terapi' | 'Expert Class' | 'Media Pesantren';
  quotaRemaining: number;
  terms: string[];
}
