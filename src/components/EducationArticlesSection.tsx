import React, { useState } from 'react';
import { ISLAMICITY_ARTICLES, ArticleItem } from '../data/articles';
import { 
  BookOpen, 
  Scale, 
  ShieldCheck, 
  CheckCircle, 
  Coins, 
  Sparkles, 
  Share2, 
  ChevronRight,
  Lightbulb,
  TrendingUp,
  FileText
} from 'lucide-react';

export const EducationArticlesSection: React.FC = () => {
  const [articles] = useState<ArticleItem[]>(ISLAMICITY_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem>(ISLAMICITY_ARTICLES[0]);

  const fiqihInstruments = [
    {
      name: 'Sukuk',
      arabic: 'صُكُوك',
      category: 'Surat Berharga Syariah',
      description: 'Instrumen keuangan berbasis kepemilikan atas aset berwujud riil (bukan surat hutang bunga), memberikan imbal hasil proporsional dan transparan.'
    },
    {
      name: 'Mudarabah',
      arabic: 'مُضَارَبَة',
      category: 'Kerjasama Bagi Hasil',
      description: 'Kemitraan antara pemilik modal (shahibul maal) dengan pengelola keahlian (mudharib). Keuntungan dibagi sesuai nisbah akad yang disepakati.'
    },
    {
      name: 'Musyarakah',
      arabic: 'مُشَارَكَة',
      category: 'Kemitraan Modal Bersama',
      description: 'Kerjasama usaha di mana dua pihak atau lebih sama-sama menyertakan modal dan berbagi laba maupun risiko secara proporsional berkeadilan.'
    },
    {
      name: 'Murabahah',
      arabic: 'مُرَابَحَة',
      category: 'Jual Beli Transparan',
      description: 'Akad jual beli barang dengan penegasan harga perolehan pokok ditambah margin keuntungan yang diketahui dan disetujui bersama secara jelas.'
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-400" />
          <span>Konsep Islamicity: Al-Qur'an, Sunnah & Praktik Global</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Wadah induk landasan spiritual dan moral dalam pengelolaan aset manajemen, collateral, dan tatanan peradaban Allah SWT.
        </p>
      </div>

      {/* 4 Pilar Utama Islamicity Visual Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base mb-1">1. Keadilan ('Adalah)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Al-Qur'an menekankan keadilan mutlak dalam setiap transaksi muamalah, tanpa penindasan, monopoli, atau eksploitasi sesama manusia.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base mb-1">2. Amanah (Integritas)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pengelolaan aset, keuangan media dakwah, dan dana umat wajib transparan, akuntabel, dan dapat dipertanggungjawabkan di hadapan Allah SWT.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base mb-1">3. Kehalalan</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Semua aktivitas ekonomi, periklanan, dan model bisnis bebas dari riba (bunga), maysir (spekulasi judi), dan gharar (ketidakjelasan).
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base mb-1">4. Keseimbangan (Mizan)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Harmoni antara kemakmuran material duniawi dengan kesiapan ukhrawi. Pengelolaan aset berfokus pada kelestarian lingkungan dan kemanusiaan.
          </p>
        </div>
      </div>

      {/* Main Educational Article Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Article Selector List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Kajian & Doktrin Islamicity
          </h4>
          {articles.map((art) => {
            const isSelected = selectedArticle.id === art.id;
            return (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500 shadow-md shadow-emerald-950'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="text-[11px] font-medium text-emerald-400 mb-1">
                  {art.kicker}
                </div>
                <h5 className="font-bold text-white text-sm line-clamp-2 leading-snug mb-1.5">
                  {art.title}
                </h5>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>{art.date}</span>
                  <span>·</span>
                  <span>{art.readTime}</span>
                </div>
              </div>
            );
          })}

          {/* Fiqih Instruments Quick Box */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 mt-4">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Instrumen Keuangan Syariah</span>
            </h5>
            <div className="space-y-2 text-xs">
              {fiqihInstruments.map((inst) => (
                <div key={inst.name} className="p-2 rounded bg-slate-950/70 border border-slate-800/70">
                  <div className="flex justify-between items-center font-bold text-slate-200">
                    <span>{inst.name}</span>
                    <span className="font-arabic text-amber-300">{inst.arabic}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {inst.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Article Reading Pane (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="space-y-3 pb-5 border-b border-slate-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              {selectedArticle.kicker}
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {selectedArticle.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span>Penulis: <strong className="text-slate-300">{selectedArticle.author}</strong></span>
              <span>·</span>
              <span>{selectedArticle.date}</span>
              <span>·</span>
              <span>{selectedArticle.readTime}</span>
            </div>
          </div>

          {/* Quranic Verse Callout */}
          {selectedArticle.quranVerse && (
            <div className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-800/30 space-y-3">
              <p className="font-arabic text-right text-xl sm:text-2xl text-amber-200 leading-loose">
                {selectedArticle.quranVerse.arabic}
              </p>
              <div className="text-xs text-slate-300 italic border-t border-emerald-900/40 pt-2 leading-relaxed">
                "{selectedArticle.quranVerse.translation}"
              </div>
              <div className="text-[11px] font-semibold text-emerald-400">
                — {selectedArticle.quranVerse.surah}
              </div>
            </div>
          )}

          {/* Paragraphs */}
          <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-normal">
            {selectedArticle.content.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Key Takeaways */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Poin Kunci Peradaban Islamicity</span>
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {selectedArticle.keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
