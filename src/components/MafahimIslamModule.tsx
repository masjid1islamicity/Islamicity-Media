import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Globe2,
  Compass,
  Gavel,
  AlertTriangle,
  Sun,
  Target,
  Lightbulb,
  CheckCircle2,
  Maximize2,
  Download,
  X,
  RotateCcw,
  Sparkles,
  Quote,
} from 'lucide-react';

const REFLECTION_STORAGE_KEY = 'islamicity_mafahim_reflection_checks';
const INFOGRAPHIC_SRC = '/assets/aistudio/image_85970863.png';

interface ReflectionItem {
  id: string;
  label: string;
  detail: string;
}

const REFLECTION_ITEMS: ReflectionItem[] = [
  {
    id: 'measure-by-sharia',
    label: 'Menimbang setiap perilaku dengan ḍawābiṭ syariat',
    detail: 'Menjadikan halal-haram sebagai tolok ukur keputusan harian, bukan sekadar mengikuti kebiasaan atau hawa nafsu.',
  },
  {
    id: 'practice-not-info',
    label: 'Mengubah ma\'lûmât (pengetahuan) menjadi amal nyata',
    detail: 'Setiap ilmu yang dipelajari dari kajian langsung diterapkan dalam interaksi keluarga, muamalah, dan masyarakat.',
  },
  {
    id: 'tadabbur-kauniyah',
    label: 'Tadabbur ayat alam semesta untuk menguatkan iman',
    detail: 'Membaca fenomena matahari, gunung, dan lautan sebagai tanda kebesaran Allah SWT yang menundukkan hati.',
  },
  {
    id: 'aqidah-axis',
    label: 'Menjaga poros Aqidah dalam memaknai nash',
    detail: 'Mengembalikan pemahaman hukum dan pemikiran Islam pada Aqidah shahihah serta petunjuk Al-Qur\'an dan As-Sunnah.',
  },
  {
    id: 'islam-kaffah',
    label: 'Menempatkan Islam secara utuh (kaffah) sebagai solusi',
    detail: 'Meyakini bahwa aturan Islam adalah solusi komprehensif bagi kebahagiaan dunia dan keselamatan akhirat.',
  },
];

export const MafahimIslamModule: React.FC = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(REFLECTION_STORAGE_KEY);
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
      localStorage.setItem(REFLECTION_STORAGE_KEY, JSON.stringify(checkedIds));
    } catch {
      // ignore storage errors
    }
  }, [checkedIds]);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const completionPct = Math.round((checkedIds.length / REFLECTION_ITEMS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-950 border border-emerald-700/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-widest text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Al-Qur'an dan As-Sunnah · Petunjuk Hidup Sepanjang Masa</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Hakikat <span className="text-amber-300 italic">Mafâhîm</span> Islam Sebagai Pedoman Perilaku
            </h3>
            <p className="text-sm text-emerald-100/90 italic leading-relaxed">
              &ldquo;Bukan sekadar untuk mengetahui, tetapi untuk mengamalkan demi kebahagiaan dunia dan keselamatan akhirat.&rdquo;
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Perbesar Infografis</span>
            </button>
            <a
              href={INFOGRAPHIC_SRC}
              download="hakikat-mafahim-islam.png"
              className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Unduh Poster</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Structured Study Curriculum */}
        <div className="lg:col-span-7 space-y-6">
          {/* SECTION 1: Apa Itu Mafâhîm Islam? */}
          <section className="p-5 sm:p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-emerald-600 text-slate-950 font-extrabold text-sm flex items-center justify-center shrink-0 tabular-nums">
                  1
                </span>
                <h4 className="text-lg font-bold text-white">
                  Apa Itu <span className="italic text-amber-300">Mafâhîm</span> Islam?
                </h4>
              </div>
              <span className="text-[11px] text-emerald-300 font-medium">
                Makna mendalam pedoman perilaku, bukan sekadar informasi
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="w-9 h-9 rounded-lg bg-red-950/50 border border-red-700/40 text-red-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h5 className="text-sm font-bold text-white leading-snug">
                  Bukan Sekadar Informasi (<span className="italic">Ma'lûmât</span>)
                </h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pemikiran Islam bukanlah tumpukan pengetahuan teoritis, akademik, atau wawasan ilmiah semata (seperti astronomi, kedokteran, atau kimia).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Globe2 className="w-4 h-4" />
                </div>
                <h5 className="text-sm font-bold text-white leading-snug">
                  Memiliki Realitas Faktual
                </h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Setiap makna yang ditunjukkan memiliki fakta yang dapat ditunjuk (baik fakta terindra seperti hukum/solusi kemasyarakatan, maupun hal gaib yang diyakini melalui akal dan penginderaan seperti malaikat, surga, dan neraka).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <h5 className="text-sm font-bold text-white leading-snug">
                  Fungsi Utama: Sebagai <span className="italic">Ḍawābiṭ</span>
                </h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Berfungsi sebagai <span className="italic text-slate-300">ḍawābiṭ</span> (pedoman/aturan) untuk mengarahkan perilaku manusia dalam kehidupan dunia menuju keselamatan di akhirat.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 2: Dua Hal Mendasar yang Wajib Dipahami Seorang Muslim */}
          <section className="p-5 sm:p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-slate-950 font-extrabold text-sm flex items-center justify-center shrink-0 tabular-nums">
                2
              </span>
              <h4 className="text-lg font-bold text-white">
                Dua Hal Mendasar yang Wajib Dipahami Seorang Muslim
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 2.1 */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                      <Gavel className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-emerald-400">2.1 · Pertama</div>
                      <h5 className="text-sm font-bold text-white leading-snug">
                        Islam sebagai Undang-Undang Pengatur Perilaku (<span className="italic">Al-Nâhiyah Al-'Amaliyyah</span>)
                      </h5>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>
                        Al-Qur'an dan Al-Sunnah datang membawa <span className="italic">mafahim</span> untuk diamalkan dan mengatur interaksi serta perbuatan manusia.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>
                        Menitikberatkan aspek <span className="italic">amaliah</span>/praktis, bukan sekadar hafalan materi atau informasi akademis.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Bahaya Pengabaian Callout */}
                <div className="p-3.5 rounded-lg bg-red-950/30 border border-red-800/50 space-y-1.5">
                  <div className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>Bahaya Pengabaian</span>
                  </div>
                  <p className="text-[11px] text-red-100/85 leading-relaxed">
                    Jika Islam hanya dipelajari sebagai materi pengajaran (tanpa diamalkan sebagai undang-undang kehidupan), Islam akan kehilangan &ldquo;daya hidup&rdquo; dan ruh aslinya. Akibatnya, pemahaman Islam versi orientalis yang hanya mencari kepuasan ilmiah tanpa niat mengamalkan akan menyamai kedudukan ulama yang kehilangan fungsi praktisnya.
                  </p>
                </div>
              </div>

              {/* 2.2 */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-emerald-400">2.2 · Kedua</div>
                      <h5 className="text-sm font-bold text-white leading-snug">
                        Al-Qur'an dan Hadis Berkedudukan sebagai <span className="italic">Dîn</span> &amp; Syariat
                      </h5>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>
                        Ayat-ayat tentang alam semesta (seperti peredaran matahari, lautan, gunung, tumbuhan, hingga fenomena fisik) tidak diturunkan sebagai teori sains, geografi, atau eksperimen kimia.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>
                        Ayat-ayat tersebut berfungsi untuk mengarahkan akal manusia kepada kekuasaan dan keagungan Allah, serta meyakinkan hati agar tunduk beriman kepada-Nya.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* QS Yasin 36:38 Callout */}
                <div className="p-3.5 rounded-lg bg-emerald-950/35 border border-emerald-700/40 space-y-1.5">
                  <p className="font-arabic text-right text-base text-amber-200 leading-relaxed">
                    وَالشَّمْسُ تَجْرِي لِمُسْتَقَرٍّ لَّهَا ۚ ذَٰلِكَ تَقْدِيرُ الْعَزِيزِ الْعَلِيمِ
                  </p>
                  <p className="text-[11px] text-slate-200 italic">
                    &ldquo;Dan matahari yang berjalan di tempat peredarannya...&rdquo; <span className="text-emerald-400 not-italic font-semibold">(QS Yasin [36]: 38)</span>
                  </p>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Tujuannya bukan untuk ilmu sains, tetapi untuk membangkitkan kesadaran akan kekuasaan Allah.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: Karakteristik Mutlak Sumber Hukum Islam (Nash-Nash) */}
          <section className="p-5 sm:p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-slate-950 font-extrabold text-sm flex items-center justify-center shrink-0 tabular-nums">
                3
              </span>
              <h4 className="text-lg font-bold text-white">
                Karakteristik Mutlak Sumber Hukum Islam (<span className="italic text-amber-300">Nash-Nash</span>)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Target className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Cakupan Terbatas</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Seluruh <span className="italic">nash</span> (baik dari segi <span className="italic">manthûq</span>, <span className="italic">mafhûm</span>, maupun <span className="italic">dalâlah</span>) berpusat pada satu poros utama: <strong className="text-amber-300">Aqidah beserta hukum-hukum syariat dan pemikiran yang terpancar darinya</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Solusi Komprehensif</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <span className="italic">Nash-nash</span> tersebut hadir sebagai petunjuk (<span className="italic">taujîh</span>), rahmat (<span className="italic">rahmah</span>), nasihat (<span className="italic">nashîhah</span>), sekaligus solusi nyata bagi problematika dan perilaku manusia.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 4: Kesimpulan & Refleksi Penting */}
          <section className="p-5 sm:p-6 rounded-xl bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-700/40 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center shrink-0 tabular-nums">
                4
              </span>
              <h4 className="text-lg font-bold text-white">
                Kesimpulan &amp; Refleksi Penting
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-500/30 space-y-2">
                <Quote className="w-5 h-5 text-amber-400" />
                <p className="text-xs sm:text-sm text-amber-100 leading-relaxed italic">
                  &ldquo;Mengetahui hukum syariat dan pemikiran Islam tanpa merealisasikannya sebagai pedoman hidup sehari-hari adalah sebuah musibah yang melemahkan pengaruh Islam di tengah umat.&rdquo;
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/30 space-y-2 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Oleh karena itu, <strong className="text-emerald-300">Islam harus diposisikan secara utuh (<span className="italic">kaffah</span>)</strong> sebagai solusi dan aturan penentu perilaku demi mencapai kebahagiaan hidup di dunia dan keselamatan di akhirat.
                </p>
                <div className="pt-2 border-t border-emerald-800/40 text-[11px] text-emerald-300 font-medium">
                  Islam Kaffah, Hidup Berkah, Dunia Bahagia, Akhirat Selamat
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs text-slate-300 italic">
                  &ldquo;Dan Kami tidak mengutus engkau (Muhammad), melainkan sebagai rahmat bagi seluruh alam.&rdquo;
                </p>
                <div className="text-[11px] font-semibold text-emerald-400">
                  — QS Al-Anbiya [21]: 107
                </div>
              </div>
              <p className="font-arabic text-xl text-amber-200 text-right shrink-0">
                وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ
              </p>
            </div>
          </section>
        </div>

        {/* Right 5 Cols: Official Infographic Poster + Interactive Muhasabah Checklist */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {/* Infographic Card */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Infografis Panduan Mafâhîm
              </h4>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Layar Penuh</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="w-full rounded-lg overflow-hidden border border-slate-800 hover:border-emerald-500/60 transition-colors bg-slate-950 block group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label="Perbesar infografis Hakikat Mafâhîm Islam Sebagai Pedoman Perilaku"
            >
              <img
                src={INFOGRAPHIC_SRC}
                alt="Infografis Hakikat Mafâhîm Islam Sebagai Pedoman Perilaku"
                className="w-full h-auto object-contain max-h-[540px] mx-auto transition-transform duration-200 group-hover:scale-[1.01]"
              />
            </button>
            <p className="text-[11px] text-slate-400 text-center">
              Klik gambar untuk memperbesar dan membaca detail infografis secara penuh.
            </p>
          </div>

          {/* Interactive Muhasabah Checklist */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Muhasabah Pengamalan Mafâhîm</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Komitmen praktis menjadikan pemahaman Islam sebagai pedoman perilaku harian.
                </p>
              </div>
              {checkedIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCheckedIds([])}
                  className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 shrink-0"
                  title="Reset daftar refleksi"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs tabular-nums">
                <span className="text-slate-400">Kesiapan Pengamalan Kaffah</span>
                <span className="font-bold text-emerald-400">
                  {checkedIds.length}/{REFLECTION_ITEMS.length} ({completionPct}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-300"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2">
              {REFLECTION_ITEMS.map((item) => {
                const isChecked = checkedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleCheck(item.id)}
                    aria-pressed={isChecked}
                    className={`w-full text-left p-3 rounded-lg border transition-colors flex items-start gap-2.5 ${
                      isChecked
                        ? 'bg-emerald-950/35 border-emerald-500/50 text-white'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                        isChecked
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : 'border-slate-600 bg-slate-900'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold leading-snug">{item.label}</div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{item.detail}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal for Infographic */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Infografis Hakikat Mafâhîm Islam Sebagai Pedoman Perilaku"
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-[70] bg-slate-950/90 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[92vh] bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="text-xs sm:text-sm font-bold text-white truncate">
                Infografis: Hakikat Mafâhîm Islam Sebagai Pedoman Perilaku
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={INFOGRAPHIC_SRC}
                  download="hakikat-mafahim-islam.png"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(false)}
                  aria-label="Tutup tampilan penuh infografis"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-3 sm:p-4 bg-slate-950 flex justify-center">
              <img
                src={INFOGRAPHIC_SRC}
                alt="Infografis Hakikat Mafâhîm Islam Sebagai Pedoman Perilaku"
                className="max-w-full h-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
