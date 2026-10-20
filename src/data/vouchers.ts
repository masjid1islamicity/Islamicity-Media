import { VoucherItem } from '../types/islamicity';

export const VOUCHERS_DATA: VoucherItem[] = [
  {
    id: 'vcr-haji-01',
    code: 'HAJIBARAKAH2026',
    title: 'Voucher Subsidi Perlengkapan & Belanja Haji',
    provider: 'Kemitraan Islamicity & Asosiasi Travel Syariah',
    discountValue: 'Rp 2.500.000',
    minTransaction: 'Paket Haji Khusus / Furoda / Umrah Plus',
    expiryDate: '31 Desember 2026',
    category: 'Haji & Umrah',
    quotaRemaining: 184,
    terms: [
      'Berlaku bagi jamaah yang terdaftar di mitra biro haji resmi Kemenag & jejaring Islamicity.',
      'Dapat digunakan untuk subsidi koper perlengkapan haji, baju ihram, dan paket katering di Makkah & Madinah.',
      'Dapat dipindahtangankan kepada orang tua atau kerabat dekat dengan mengisi formulir pengalihan hak.'
    ]
  },
  {
    id: 'vcr-terapi-limo',
    code: 'LIMOCITYSEHAT',
    title: 'Voucher Layanan LimoCity Terapi (Bekam & Totok Syariah)',
    provider: 'Unit Pelayanan Islamicity (UPIC) Limo',
    discountValue: 'Diskon 50% (Rp 35.000)',
    minTransaction: '1 Sesi Terapi Holistik',
    expiryDate: '30 November 2026',
    category: 'LimoCity Terapi',
    quotaRemaining: 92,
    terms: [
      'Dilayani langsung oleh terapis bersertifikasi PBI (Perkumpulan Bekam Indonesia).',
      'Lokasi sentra pelayanan: UPIC Limo, Kota Depok.',
      'Termasuk konsultasi pola makan thibbun nabawi dan gratis cek tensi & asam urat.'
    ]
  },
  {
    id: 'vcr-expert-class',
    code: 'EXPERTISLAMICITY',
    title: 'Beasiswa Parsial Tiket Expert Class & Training Center',
    provider: 'Akademi Wirausaha & Dakwah Islamicity',
    discountValue: 'Potongan Rp 50.000',
    minTransaction: 'Tiket Seminar / Workshop Eksekutif',
    expiryDate: '15 Desember 2026',
    category: 'Expert Class',
    quotaRemaining: 45,
    terms: [
      'Materi: Digital Marketing Hyperlocal Dakwah, Fiqih Muamalah Sukuk & Mudarabah.',
      'Mendapatkan sertifikat resmi dari Dewan Pakar Islamicity Media.',
      'Akses rekaman eksklusif di portal podcast.islamicity.tv selama 1 tahun.'
    ]
  },
  {
    id: 'vcr-pesantren-digital',
    code: 'PESANTRENDIGITAL100',
    title: 'Voucher Akses Pesantren Masyarakat Digital',
    provider: 'Pesantren Digital Islamicity Global',
    discountValue: 'Gratis 100% Akses Penuh',
    minTransaction: 'Pendaftaran Santri Masyarakat',
    expiryDate: 'Permanen 2026/2027',
    category: 'Media Pesantren',
    quotaRemaining: 500,
    terms: [
      'Program #100TahunKebangkitanUmatUlama menuju Baldatun Thoyyibatun wa Rabbun Ghofur.',
      'Akses kurikulum tafsir tematik, bahasa arab praktis, dan coding dakwah.',
      'Didukung oleh digital.pesantren.islamicity.tv dan maju.islamicity.tv.'
    ]
  }
];
