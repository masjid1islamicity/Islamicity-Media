import React, { useState, useEffect } from 'react';
import { NavTab } from '../types/islamicity';
import {
  BookOpen,
  Coins,
  HeartHandshake,
  Shield,
  Users,
  Scale,
  Compass,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  AlertCircle,
  Landmark,
  ScrollText,
  Layers,
} from 'lucide-react';

interface ResolusiJihadUlamaModuleProps {
  onSelectTab?: (tab: NavTab) => void;
  onOpenQrisWithAmount?: (amount: number, category: string) => void;
}

interface QuranicPillar {
  id: string;
  orderLabel: string;
  surahRef: string;
  citationNote?: string;
  shortTitle: string;
  themeFocus: string;
  arabic: string;
  transliteration: string;
  translation: string;
  tafsirSummary: string;
  islamicityAction: string;
}

const QURANIC_PILLARS: QuranicPillar[] = [
  {
    id: 'nisa-141',
    orderLabel: 'Ayat 01',
    surahRef: 'QS. An-Nisa [4]: 141',
    shortTitle: 'Kedaulatan Iman & Kemandirian Umat',
    themeFocus: 'Menjaga Izzah & Ketahanan Umat',
    arabic:
      'وَلَن يَجْعَلَ اللَّهُ لِلْكَافِرِينَ عَلَى الْمُؤْمِنِينَ سَبِيلًا',
    transliteration:
      'Wa lan yaj‘alallāhu lil-kāfirīna ‘alal-mu’minīna sabīlā',
    translation:
      'Dan Allah sekali-kali tidak akan memberi jalan kepada orang-orang kafir untuk memusnahkan (menguasai) orang-orang yang beriman.',
    tafsirSummary:
      'Ayat ini menegaskan prinsip dasar kedaulatan dan kemandirian umat Islam. Orang beriman dilarang menyerahkan kendali aqidah, hukum, ekonomi, dan masa depan generasi kepada dominasi pihak yang memusuhi kebenaran.',
    islamicityAction:
      'Ulama dan warga Islamicity wajib membangun ekosistem mandiri—mulai dari ketahanan ekonomi syariah bebas riba, kemandirian media dakwah, hingga proteksi moral keluarga agar umat tidak terjajah secara pemikiran maupun finansial.',
  },
  {
    id: 'hajj-78',
    orderLabel: 'Ayat 02',
    surahRef: 'QS. Al-Hajj [22]: 78',
    shortTitle: 'Jihad Sebenar-benarnya: Harta & Jiwa Raga',
    themeFocus: 'Kesungguhan Total (Haqqa Jihâdihi)',
    arabic:
      'وَجَاهِدُوا فِي اللَّهِ حَقَّ جِهَادِهِ ۚ هُوَ اجْتَبَاكُمْ وَمَا جَعَلَ عَلَيْكُمْ فِي الدِّينِ مِنْ حَرَجٍ ۚ مِّلَّةَ أَبِيكُمْ إِبْرَاهِيمَ ۚ هُوَ سَمَّاكُمُ الْمُسْلِمِينَ مِن قَبْلُ وَفِي هَٰذَا لِيَكُونَ الرَّسُولُ شَهِيدًا عَلَيْكُمْ وَتَكُونُوا شُهَدَاءَ عَلَى النَّاسِ ۚ فَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَاعْتَصِمُوا بِاللَّهِ هُوَ مَوْلَاكُمْ ۖ فَنِعْمَ الْمَوْلَىٰ وَنِعْمَ النَّصِيرُ',
    transliteration:
      'Wa jāhidū fillāhi haqqa jihādihī, huwajtabākum wa mā ja‘ala ‘alaikum fid-dīni min haraj... fa aqīmuṣ-ṣalāta wa ātuz-zakāta wa‘taṣimū billāh',
    translation:
      'Dan berjihadlah kamu pada jalan Allah dengan jihad yang sebenar-benarnya. Dia telah memilih kamu dan Dia sekali-kali tidak menjadikan untuk kamu dalam agama suatu kesempitan... Maka dirikanlah sholat, tunaikanlah zakat, dan berpeganglah kamu pada tali Allah. Dia adalah Pelindungmu, maka Dialah sebaik-baik Pelindung dan sebaik-baik Penolong.',
    tafsirSummary:
      'Perintah "haqqa jihâdihi" menuntut pengerahan segenap daya: jihad dengan harta (zakat, wakaf, infaq fi sabilillah) dan jihad dengan jiwa raga (ilmu, tenaga, kesabaran, pembelaan kebenaran), yang selalu ditopang sholat, zakat, dan berpegang teguh kepada Allah.',
    islamicityAction:
      'Resolusi Jihad kontemporer di Islamicity menggabungkan kontribusi harta produktif (Baitul Maal, QRIS wakaf media, penyantunan dhuafa) bersama pengabdian jiwa raga para relawan, santri, dan profesional di medan dakwah.',
  },
  {
    id: 'fatir-28',
    orderLabel: 'Ayat 03',
    surahRef: 'QS. Fatir [35]: 28',
    shortTitle: 'Khasyah sebagai Jati Diri Ulama Sejati',
    themeFocus: 'Integritas Spiritual & Keilmuan Ulama',
    arabic:
      'إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ ۗ إِنَّ اللَّهَ عَزِيزٌ غَفُورٌ',
    transliteration:
      'Innamā yakhsyallāha min ‘ibādihil-‘ulamā’u, innallāha ‘azīzun ghafūr',
    translation:
      'Sesungguhnya yang takut kepada Allah di antara hamba-hamba-Nya, hanyalah ulama. Sesungguhnya Allah Maha Perkasa lagi Maha Pengampun.',
    tafsirSummary:
      'Standar ulama dalam Al-Qur’an bukan sekadar gelar akademik atau kepandaian retorika, melainkan "khasyah"—rasa takut yang mendalam kepada Allah sehingga ilmunya melahirkan ketundukan, keberanian menyuarakan al-haq, dan keikhlasan membimbing umat.',
    islamicityAction:
      'Peran Ulama Islamicity saat ini adalah menjadi kompas moral yang tidak tergoda oleh tekanan duniawi, meluruskan niat perjuangan umat, dan melahirkan fatwa serta keteladanan nyata bagi masyarakat.',
  },
  {
    id: 'imran-104',
    orderLabel: 'Ayat 04',
    surahRef: 'QS. Ali \'Imran [3]: 104',
    shortTitle: 'Mandat Dakwah Jama\'i & Amar Ma\'ruf Nahi Munkar',
    themeFocus: 'Konsolidasi Ummat & Simpul Dakwah',
    arabic:
      'وَلْتَكُن مِّنكُمْ أُمَّةٌ يَدْعُونَ إِلَى الْخَيْرِ وَيَأْمُرُونَ بِالْمَعْرُوفِ وَيَنْهَوْنَ عَنِ الْمُنكَرِ ۚ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ',
    transliteration:
      'Waltakum minkum ummatuy yad‘ūna ilal-khairi wa ya’murūna bil-ma‘rūfi wa yanhauna ‘anil-munkari wa ulā’ika humul-mufliḥūn',
    translation:
      'Dan hendaklah ada di antara kamu segolongan umat yang menyeru kepada kebajikan, menyuruh kepada yang ma’ruf dan mencegah dari yang munkar; merekalah orang-orang yang beruntung.',
    tafsirSummary:
      'Perjuangan menegakkan nilai Islam membutuhkan barisan yang terorganisir (ummah), tidak berjalan sendiri-sendiri. Tugas intinya adalah menyeru kepada kebaikan Islam, menegakkan yang ma’ruf, serta mencegah kemunkaran sosial, ekonomi, dan moral.',
    islamicityAction:
      'Ulama bersama jaringan simpul relawan, masjid, pesantren, dan media ARTVISI bersatu menggerakkan dakwah terstruktur—edukasi publik, advokasi ekonomi halal, serta penguatan ukhuwah lintas wilayah.',
  },
  {
    id: 'thaha-124',
    orderLabel: 'Ayat 05',
    surahRef: 'QS. Thaha [20]: 124',
    citationNote: 'Rujukan Surah Thaha (Surah ke-20) ayat 124',
    shortTitle: 'Peringatan Krisis Akibat Berpaling dari Dzikrullah',
    themeFocus: 'Solusi atas Ma\'îsyatan Dhankâ',
    arabic:
      'وَمَنْ أَعْرَضَ عَن ذِكْرِي فَإِنَّ لَهُ مَعِيشَةً ضَنكًا وَنَحْشُرُهُ يَوْمَ الْقِيَامَةِ أَعْمَىٰ',
    transliteration:
      'Wa man a‘raḍa ‘an żikrī fa inna lahū ma‘īsyatan ḍankā wa naḥsyuruhū yaumal-qiyāmati a‘mā',
    translation:
      'Dan barang siapa berpaling dari peringatan-Ku, maka sesungguhnya baginya penghidupan yang sempit, dan Kami akan menghimpunkannya pada hari kiamat dalam keadaan buta.',
    tafsirSummary:
      'Berpaling dari peringatan Allah (Al-Qur’an dan syariat-Nya) menjadi pangkal kesempitan hidup (ma’îsyatan dhankâ): kegelisahan jiwa, ketimpangan ekonomi akibat riba dan keserakahan, serta hilangnya keberkahan hidup di dunia sebelum kebutaan di akhirat.',
    islamicityAction:
      'Ulama Islamicity memikul tanggung jawab besar menyelamatkan masyarakat dari krisis batin dan sistem hidup sekuler dengan mengajak kembali kepada Al-Qur’an, dzikir/sholawat, sholat berjamaah, dan muamalah yang diberkahi.',
  },
];

interface UlamaRoleItem {
  number: string;
  title: string;
  verseAnchor: string;
  summary: string;
  concreteMandate: string;
}

const ULAMA_ROLES: UlamaRoleItem[] = [
  {
    number: '01',
    title: 'Penjaga Khasyah & Kemurnian Risalah',
    verseAnchor: 'QS. Fatir [35]: 28',
    summary:
      'Menjadi teladan ulama rabbani yang takut hanya kepada Allah SWT, menjaga kemurnian akidah dan fatwa dari kompromi batil maupun pragmatisme sesaat.',
    concreteMandate:
      'Membimbing majelis ilmu, membentengi umat dari syubhat, dan memastikan setiap gerak perjuangan berpijak pada dalil shahih.',
  },
  {
    number: '02',
    title: 'Penggerak Barisan Amar Ma\'ruf Nahi Munkar',
    verseAnchor: 'QS. Ali \'Imran [3]: 104',
    summary:
      'Mengonsolidasikan ulama, santri, profesional, dan komunitas masjid menjadi satu barisan dakwah terorganisir yang konsisten menyuarakan kebenaran.',
    concreteMandate:
      'Menghidupkan kolaborasi jaringan media dakwah ARTVISI, forum kajian, dan pembinaan generasi muda di seluruh simpul Nusantara.',
  },
  {
    number: '03',
    title: 'Pengawal Kedaulatan & Kemandirian Ekonomi Umat',
    verseAnchor: 'QS. An-Nisa [4]: 141 · QS. Al-Hajj [22]: 78',
    summary:
      'Mengarahkan jihad harta umat agar tidak berhenti sebagai seremoni, melainkan menjadi kekuatan ekonomi berdaulat yang memerdekakan kaum dhuafa.',
    concreteMandate:
      'Mengoptimalkan ZISWAF produktif, pembiayaan halal bebas riba, serta pendanaan mandiri infrastruktur pendidikan dan dakwah.',
  },
  {
    number: '04',
    title: 'Pembimbing Jiwa dari Krisis Ma\'îsyatan Dhankâ',
    verseAnchor: 'QS. Thaha [20]: 124',
    summary:
      'Menjawab krisis kegelisahan modern, tekanan utang, dan keterasingan spiritual dengan mengembalikan masyarakat pada dzikrullah dan syariat Allah.',
    concreteMandate:
      'Menghadirkan pendampingan rohani, gerakan sholawat dan tadabbur Al-Qur’an, serta solusi sosial berbasis masjid.',
  },
];

interface CommitmentItem {
  id: string;
  pillar: 'Harta' | 'Jiwa Raga' | 'Peran Ulama';
  label: string;
  detail: string;
}

const COMMITMENT_ITEMS: CommitmentItem[] = [
  {
    id: 'jihad-harta-zakat',
    pillar: 'Harta',
    label: 'Menunaikan zakat, infaq rutin, dan wakaf dakwah secara terencana',
    detail: 'Mengalokasikan sebagian rezeki halal untuk kemandirian umat, Baitul Maal, dan media dakwah (QS. Al-Hajj [22]: 78).',
  },
  {
    id: 'jihad-harta-antiriba',
    pillar: 'Harta',
    label: 'Menjaga transaksi keluarga bebas riba, gharar, dan maysir',
    detail: 'Memilih akad syariah yang adil agar keberkahan rezeki terjaga dan umat tidak bergantung pada sistem ribawi (QS. An-Nisa [4]: 141).',
  },
  {
    id: 'jihad-jiwa-ibadah',
    pillar: 'Jiwa Raga',
    label: 'Menegakkan sholat tepat waktu, sholawat, dan tilawah harian',
    detail: 'Membangun kekuatan ruhiyah agar terhindar dari kesempitan hidup dan kelalaian terhadap dzikrullah (QS. Thaha [20]: 124).',
  },
  {
    id: 'jihad-jiwa-khidmat',
    pillar: 'Jiwa Raga',
    label: 'Berkhidmat dengan tenaga, keahlian profesi, dan waktu untuk dakwah',
    detail: 'Mengisi simpul relawan Islamicity, memakmurkan masjid sekitar, dan membantu tetangga maupun jamaah yang membutuhkan.',
  },
  {
    id: 'ulama-adab-ilmu',
    pillar: 'Peran Ulama',
    label: 'Memuliakan ulama yang ber-khasyah serta menghadiri majelis ilmu',
    detail: 'Menjadikan bimbingan ulama yang takut kepada Allah sebagai rujukan hukum dan kompas perjuangan sehari-hari (QS. Fatir [35]: 28).',
  },
  {
    id: 'ulama-amar-maruf',
    pillar: 'Peran Ulama',
    label: 'Mendukung dakwah amar ma\'ruf nahi munkar yang santun dan tegas',
    detail: 'Menjadi bagian dari barisan umat penyeru kebajikan melalui lisan, keteladanan akhlaq, dan karya nyata (QS. Ali \'Imran [3]: 104).',
  },
];

const STORAGE_KEY = 'islamicity_resolusi_jihad_checks';

export const ResolusiJihadUlamaModule: React.FC<ResolusiJihadUlamaModuleProps> = ({
  onSelectTab,
  onOpenQrisWithAmount,
}) => {
  const [selectedVerseId, setSelectedVerseId] = useState<string>(QURANIC_PILLARS[0].id);
  const [showAllVerses, setShowAllVerses] = useState<boolean>(false);
  const [pillarFilter, setPillarFilter] = useState<'Semua' | 'Harta' | 'Jiwa Raga' | 'Peran Ulama'>('Semua');
  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedIds));
    } catch {
      // ignore storage errors
    }
  }, [checkedIds]);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const activeVerse =
    QURANIC_PILLARS.find((v) => v.id === selectedVerseId) ?? QURANIC_PILLARS[0];

  const filteredCommitments =
    pillarFilter === 'Semua'
      ? COMMITMENT_ITEMS
      : COMMITMENT_ITEMS.filter((item) => item.pillar === pillarFilter);

  const completionPct = Math.round((checkedIds.length / COMMITMENT_ITEMS.length) * 100);

  return (
    <div className="space-y-8">
      {/* Editorial Hero Header */}
      <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-950 border border-emerald-700/40 space-y-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-amber-300 font-medium">
          <span>Resolusi Jihad &amp; Kepemimpinan Ulama</span>
          <span aria-hidden="true">·</span>
          <span>5 Landasan Ayat Al-Qur&apos;an</span>
          <span aria-hidden="true">·</span>
          <span>Islamicity Media &amp; Simpul Umat</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8 space-y-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight text-balance">
              Resolusi Jihad di Jalan Allah dengan Harta &amp; Jiwa Raga serta Peran Ulama Islamicity Saat Ini
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              Seruan kebangkitan umat yang menyatukan pengorbanan harta (<span className="italic text-amber-200">bi amwâlikum</span>), kesungguhan jiwa raga (<span className="italic text-amber-200">bi anfusikum</span>), kedaulatan iman, dan kepemimpinan ulama ber-<span className="italic text-emerald-300">khasyah</span> untuk menegakkan dakwah dan menyelamatkan umat dari kesempitan hidup.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-wrap lg:justify-end gap-2.5">
            <button
              type="button"
              onClick={() => {
                if (onSelectTab) {
                  onSelectTab('zakat-qris');
                } else if (onOpenQrisWithAmount) {
                  onOpenQrisWithAmount(100000, 'wakaf');
                }
              }}
              className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <Coins className="w-4 h-4" />
              <span>Tunaikan Jihad Harta</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (onSelectTab) {
                  onSelectTab('simpul-umat');
                }
              }}
              className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <Users className="w-4 h-4 text-amber-300" />
              <span>Jejaring Simpul Ulama</span>
            </button>
          </div>
        </div>
      </section>

      {/* Section 1: Interactive 5 Quranic Verses Explorer */}
      <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Lima Landasan Ayat Al-Qur&apos;an</span>
            </h4>
            <p className="text-xs text-slate-400">
              Pilih ayat untuk menelaah teks Arab, terjemahan, hikmah tafsir, dan aktualisasinya di Islamicity saat ini.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAllVerses((prev) => !prev)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              showAllVerses
                ? 'bg-emerald-600 border-emerald-500 text-slate-950'
                : 'bg-slate-950 border-slate-700 text-slate-200 hover:border-slate-600'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showAllVerses ? 'Mode Satu Ayat' : 'Tampilkan Semua 5 Ayat'}</span>
          </button>
        </div>

        {!showAllVerses && (
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Pilih ayat Al-Qur'an">
            {QURANIC_PILLARS.map((verse) => {
              const isActive = verse.id === activeVerse.id;
              return (
                <button
                  key={verse.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedVerseId(verse.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-emerald-600 border-emerald-500 text-slate-950'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {verse.surahRef}
                </button>
              );
            })}
          </div>
        )}

        <div className="space-y-5">
          {(showAllVerses ? QURANIC_PILLARS : [activeVerse]).map((verse) => (
            <article
              key={verse.id}
              className="p-5 sm:p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-400 font-medium tabular-nums">
                    <span>{verse.orderLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{verse.surahRef}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-300">{verse.themeFocus}</span>
                  </div>
                  <h5 className="text-base sm:text-lg font-bold text-white">
                    {verse.shortTitle}
                  </h5>
                </div>
                {verse.citationNote && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{verse.citationNote}</span>
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-emerald-950/25 border border-emerald-800/35 space-y-3">
                <p
                  dir="rtl"
                  lang="ar"
                  className="font-arabic text-right text-xl sm:text-2xl text-amber-200 leading-loose"
                >
                  {verse.arabic}
                </p>
                <p className="text-xs text-emerald-300/90 italic">
                  {verse.transliteration}
                </p>
                <p className="text-sm text-slate-200 leading-relaxed pt-2 border-t border-emerald-900/40">
                  &ldquo;{verse.translation}&rdquo;
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <ScrollText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Kandungan &amp; Tafsir Ringkas</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {verse.tafsirSummary}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Aktualisasi Resolusi Jihad Islamicity</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {verse.islamicityAction}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Section 2: Dwitunggal Resolusi Jihad (Harta & Jiwa Raga) */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-white">
            Dwitunggal Resolusi Jihad di Jalan Allah
          </h4>
          <p className="text-xs sm:text-sm text-slate-400">
            Menyatukan pengorbanan harta dan pengabdian jiwa raga sebagai satu kesatuan perjuangan umat beriman.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Jihad dengan Harta */}
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-amber-300 font-medium">
                      Dimensi Pertama · Bi Amwâlikum
                    </div>
                    <h5 className="text-base font-bold text-white">
                      Jihad di Jalan Allah dengan Harta
                    </h5>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Menjadikan harta benda sebagai amunisi kebangkitan dakwah, kemandirian pangan dan pendidikan santri, serta benteng ekonomi umat agar tidak tunduk pada dominasi ribawi (QS. Al-Hajj [22]: 78 &amp; QS. An-Nisa [4]: 141).
              </p>

              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>
                    <strong className="text-white">Optimalisasi Zakat &amp; Infaq Produktif:</strong> Mengubah mustahik menjadi muzakki melalui modal usaha halal dan pendampingan UPIC hyperlocal.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>
                    <strong className="text-white">Wakaf Media &amp; Infrastruktur Dakwah:</strong> Membiayai siaran TV/Radio ARTVISI, masjid, serta pusat tahfidz Al-Qur&apos;an secara independen.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>
                    <strong className="text-white">Pembebasan dari Riba:</strong> Memindahkan aset dan transaksi umat menuju akad syariah yang adil dan transparan.
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Terhubung langsung ke Kalkulator Zakat &amp; QRIS Baitul Maal
              </span>
              <button
                type="button"
                onClick={() => {
                  if (onSelectTab) {
                    onSelectTab('zakat-qris');
                  } else if (onOpenQrisWithAmount) {
                    onOpenQrisWithAmount(100000, 'wakaf');
                  }
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <span>Hitung Zakat &amp; Wakaf</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Jihad dengan Jiwa Raga */}
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-emerald-300 font-medium">
                      Dimensi Kedua · Bi Anfusikum
                    </div>
                    <h5 className="text-base font-bold text-white">
                      Jihad di Jalan Allah dengan Jiwa Raga
                    </h5>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Mengerahkan akal, ilmu, tenaga, waktu, dan keberanian moral untuk membela kebenaran, menjaga keutuhan ukhuwah, serta memakmurkan syiar Islam di tengah masyarakat (QS. Ali &apos;Imran [3]: 104 &amp; QS. Thaha [20]: 124).
              </p>

              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>
                    <strong className="text-white">Istiqomah Ibadah &amp; Dzikrullah:</strong> Menegakkan sholat berjamaah, menghidupkan masjid, dan membentengi jiwa dari kelalaian.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>
                    <strong className="text-white">Khidmat Keilmuan &amp; Profesi:</strong> Dokter, insinyur, pendidik, jurnalis, dan relawan muda mengabdikan keahliannya demi kemaslahatan umat.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>
                    <strong className="text-white">Ketahanan Sosial &amp; Kemanusiaan:</strong> Siaga membantu jamaah terdampak krisis, musibah, dan kemiskinan di simpul-simpul wilayah.
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Terhubung ke Masjid Sekitar &amp; Direktori Simpul Umat
              </span>
              <button
                type="button"
                onClick={() => {
                  if (onSelectTab) {
                    onSelectTab('peta-masjid');
                  }
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <span>Temukan Masjid Terdekat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Peran Strategis Ulama Islamicity Saat Ini */}
      <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Landmark className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Empat Peran Strategis Ulama Islamicity Saat Ini</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-400">
              Menjawab tantangan zaman dengan ilmu yang melahirkan <span className="italic text-slate-300">khasyah</span>, kepemimpinan jama&apos;i, dan solusi nyata bagi umat.
            </p>
          </div>
          <div className="text-xs text-emerald-400 font-medium">
            Sinergi Ulama · Santri · Media Dakwah
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ULAMA_ROLES.map((role) => (
            <div
              key={role.number}
              className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between gap-2 text-xs tabular-nums">
                <span className="font-mono font-bold text-amber-300">
                  Peran {role.number}
                </span>
                <span className="text-emerald-400 font-medium">
                  {role.verseAnchor}
                </span>
              </div>
              <h5 className="text-base font-bold text-white leading-snug">
                {role.title}
              </h5>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {role.summary}
              </p>
              <div className="pt-2.5 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-200">Mandat Nyata: </strong>
                {role.concreteMandate}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Interactive Muhasabah & Ikrar Resolusi Jihad */}
      <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Ikrar &amp; Muhasabah Resolusi Jihad Umat</span>
            </h4>
            <p className="text-xs text-slate-400">
              Tandai komitmen amal harian Anda dalam jihad harta, jihad jiwa raga, dan dukungan terhadap dakwah ulama.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
              {(['Semua', 'Harta', 'Jiwa Raga', 'Peran Ulama'] as const).map((filterName) => (
                <button
                  key={filterName}
                  type="button"
                  onClick={() => setPillarFilter(filterName)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                    pillarFilter === filterName
                      ? 'bg-emerald-600 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {filterName}
                </button>
              ))}
            </div>

            {checkedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setCheckedIds([])}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs tabular-nums">
            <span className="text-slate-400">Tingkat Realisasi Resolusi Jihad Pribadi</span>
            <span className="font-bold text-emerald-400">
              {checkedIds.length}/{COMMITMENT_ITEMS.length} komitmen ({completionPct}%)
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-300"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredCommitments.map((item) => {
            const isChecked = checkedIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleCheck(item.id)}
                aria-pressed={isChecked}
                className={`p-4 rounded-xl border text-left transition-colors flex items-start gap-3 ${
                  isChecked
                    ? 'bg-emerald-950/35 border-emerald-500/50 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                    isChecked
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                      : 'border-slate-600 bg-slate-900'
                  }`}
                >
                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-amber-300">
                    Pilar {item.pillar}
                  </div>
                  <div className="text-xs sm:text-sm font-bold leading-snug text-white">
                    {item.label}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Komitmen tersimpan otomatis di peramban sebagai bahan muhasabah harian Anda.
            </span>
          </div>
          {onSelectTab && (
            <button
              type="button"
              onClick={() => onSelectTab('komunitas')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors whitespace-nowrap"
            >
              <span>Diskusikan di Forum Ukhuwah</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
