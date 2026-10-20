export interface ArticleItem {
  id: string;
  title: string;
  kicker: string;
  author: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string[];
  quranVerse?: {
    arabic: string;
    surah: string;
    translation: string;
  };
  keyTakeaways: string[];
}

export const ISLAMICITY_ARTICLES: ArticleItem[] = [
  {
    id: 'konsep-islamicity-modern',
    title: 'Konsep Media Islamicity dalam Perspektif Al-Qur’an, Sunnah, Para Ahli, dan Praktik Global',
    kicker: 'Landasan Teologis & Manajemen Aset',
    author: 'Dewan Pakar & Syariah Islamicity Media',
    date: 'Oktober 2026',
    readTime: '6 menit baca',
    excerpt: 'Memahami Islamicity sebagai wadah induk landasan spiritual dan moral dalam pengelolaan aset, tata kelola media dakwah, dan ekosistem keuangan Islam yang adil dan berkelanjutan.',
    quranVerse: {
      arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا كُونُوا قَوَّامِينَ لِلَّهِ شُهَدَاءَ بِالْقِسْطِ ۖ وَلَا يَجْرِمَنَّكُمْ شَنَآنُ قَوْمٍ عَلَىٰ أَلَّا تَعْدِلُوا ۚ اعْدِلُوا هُوَ أَقْرَبُ لِلتَّقْوَىٰ',
      surah: 'QS. Al-Maidah [5]: 8',
      translation: 'Wahai orang-orang yang beriman, jadilah kamu penegak keadilan karena Allah, (ketika) menjadi saksi dengan adil. Dan janganlah kebencianmu terhadap suatu kaum mendorong kamu untuk berlaku tidak adil. Berlaku adillah, karena adil itu lebih dekat kepada takwa.'
    },
    content: [
      'Istilah “Islamicity” merujuk pada segala sesuatu yang berkaitan dengan Islam, baik itu nilai-nilai, prinsip, hukum, maupun praktik peradaban sehari-hari. Dalam konteks “induk sosialisasi legalitas aset manajemen dan induk collateral serta induk tatanan yang maha mulya Allah SWT”, Islamicity merupakan wadah spiritual dan moral dalam pengelolaan aset publik dan komunikasi massa.',
      'Al-Qur\'an dan Sunnah meletakkan empat pilar fundamental: Keadilan (\'Adalah) dalam setiap muamalah tanpa eksploitasi, Amanah (transparansi dan akuntabilitas kepemilikan), Kehalalan (bebas dari riba, maysir, dan gharar), serta Keseimbangan (Mizan antara kemakmuran duniawi dan bekal ukhrawi).',
      'Para ahli keuangan Islam modern telah mengkodifikasikan instrumen syariah berdaya guna tinggi: Sukuk (surat berharga berbasis aset riil), Mudarabah (kerjasama bagi hasil antara shahibul maal dan mudharib), Musyarakah (kemitraan modal setara), serta Murabahah (jual beli transparan dengan margin jelas).',
      'Di panggung global, platform media berperan sebagai akselerator literasi dan pemersatu umat, merajut potensi ekonomi mikro menjadi kekuatan raksasa yang mandiri dan bermartabat.'
    ],
    keyTakeaways: [
      'Empat Pilar: Keadilan, Amanah, Kehalalan, dan Keseimbangan Hidup.',
      'Instrumen Nyata: Sukuk, Mudarabah, Musyarakah, dan Murabahah.',
      'Media Berjamaah: Mengubah pusat biaya (cost center) menjadi penggerak nilai sosial & ekonomi nyata.'
    ]
  },
  {
    id: 'narasi-terbaik-media-islam',
    title: 'Strategi Menyusun Narasi Positif Islamicity di Era Digital',
    kicker: 'Komunikasi & Peradaban',
    author: 'Divisi Redaksi & Dakwah Hyperlocal',
    date: 'Oktober 2026',
    readTime: '5 menit baca',
    excerpt: 'Bagaimana menghadirkan narasi dakwah yang humanis, menangkal stigmatisasi, dan membuktikan solusi Islam atas kemiskinan dan ketimpangan sosial melalui jurnalisme beradab.',
    quranVerse: {
      arabic: 'ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ ۖ وَجَادِلْهُم بِالَّتِي هِيَ أَحْسَنُ',
      surah: 'QS. An-Nahl [16]: 125',
      translation: 'Serulah (manusia) kepada jalan Tuhan-mu dengan hikmah dan pelajaran yang baik dan bantahlah mereka dengan cara yang baik.'
    },
    content: [
      'Media bukan sekadar alat transmisi informasi, melainkan medium penyempurna akhlaq sebagaimana teladan baginda Rasulullah SAW. Dalam membangun narasi Islamicity yang memikat dan dipercaya, fokus harus bertumpu pada kisah manusia (Human Stories).',
      'Cerita inspiratif tentang wirausahawan Muslim yang memberdayakan desanya, dokter relawan yang melayani mustahik tanpa biaya, serta saintis Muslim yang memecahkan problematika lingkungan memiliki daya sentuh berkali-kali lipat dibanding ceramah normatif.',
      'Visual yang memikat dan data terpercaya (infografis, live broadcast, podcast interaktif) memudahkan generasi muda mencerna substansi syariah tanpa terbebani jargon berbelit.',
      'Bahasa yang inklusif dan solutif menangkal stigmatisasi negatif, menegaskan bahwa nilai-nilai Islam sejalan dengan keadilan universal yang didambakan seluruh umat manusia.'
    ],
    keyTakeaways: [
      'Fokus pada kisah nyata pemberdayaan dan keteladanan akhlaq.',
      'Gunakan infografis, video pendek, dan siaran langsung tanpa iklan yang mengganggu.',
      'Bangun sinergi dengan 70+ jaringan ARTVISI dan komunitas dakwah akar rumput.'
    ]
  },
  {
    id: 'maulid-nabi-penyempurna-akhlaq',
    title: 'Maulid Nabi Muhammad SAW: Meneguhkan Komitmen Peradaban Akhlaq Mulya',
    kicker: 'Spiritualitas & Keteladanan',
    author: 'Majelis As-Sholawat Islamicity',
    date: 'Oktober 2026',
    readTime: '4 menit baca',
    excerpt: 'Menggemakan jutaan sholawat bersama sebagai gerakan spiritual dan aksi riil meneruskan estafet perjuangan Rasulullah SAW menuju Baldatun Thoyyibatun wa Rabbun Ghofur.',
    quranVerse: {
      arabic: 'إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا',
      surah: 'QS. Al-Ahzab [33]: 56',
      translation: 'Sesungguhnya Allah dan malaikat-malaikat-Nya bersholawat untuk Nabi. Wahai orang-orang yang beriman, bersholawatlah kamu untuk Nabi dan ucapkanlah salam penghormatan kepadanya.'
    },
    content: [
      'Peringatan Maulid Nabi Muhammad SAW senantiasa menjadi panggilan jiwa bagi setiap insan beriman untuk merenungi misi agung kenabian: "Innama bu\'itstu li-utammima makarimal akhlaq" (Sesungguhnya aku diutus hanyalah untuk menyempurnakan kemuliaan akhlaq).',
      'Gerakan Jutaan Sholawat Digital Islamicity Media dirancang bukan sekadar hitungan angka di layar, melainkan ikhtiar menghidupkan dzikir di sanubari jutaan Muslim serentak dari pelosok kampung hingga mancanegara.',
      'Melalui satu ketukan tombol sholawat, doa terpanjat bagi keselamatan bangsa-bangsa Islam, kemandirian ekonomi dhuafa, dan keberkahan bagi para pemimpin yang amanah dan istiqomah melayani rakyat.'
    ],
    keyTakeaways: [
      'Sholawat adalah wasilah syafaat dan pembuka pintu rahmat Ilahi.',
      'Menghubungkan dzikir lisan dengan perbaikan akhlaq kepemimpinan dan muamalah.',
      'Penyebaran dakwah sholawat sebagai sedekah jariyah tanpa batas ruang dan waktu.'
    ]
  }
];
