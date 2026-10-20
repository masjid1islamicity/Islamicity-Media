import React, { useState } from 'react';
import { 
  Heart, 
  Share2, 
  Check, 
  Sparkles, 
  Copy, 
  Award, 
  Volume2, 
  BookOpen, 
  MessageCircle, 
  Send 
} from 'lucide-react';

interface SholawatSectionProps {
  sholawatCount: number;
  onIncrementSholawat: (incrementBy?: number) => void;
}

export const SholawatSection: React.FC<SholawatSectionProps> = ({
  sholawatCount,
  onIncrementSholawat
}) => {
  const [justTapped, setJustTapped] = useState(false);
  const [personalSessionCount, setPersonalSessionCount] = useState(0);
  const [copiedBroadcast, setCopiedBroadcast] = useState(false);
  const [customAdd, setCustomAdd] = useState<number>(1);

  const targetCount = 10000000;
  const progressPercent = Math.min(100, (sholawatCount / targetCount) * 100);

  const handleTap = (amount = 1) => {
    onIncrementSholawat(amount);
    setPersonalSessionCount(prev => prev + amount);
    setJustTapped(true);
    setTimeout(() => setJustTapped(false), 300);
  };

  const broadcastMessage = `Bismillahirrahmaanirrahiim …\n\nKami ingin mengajak dengan jutaan Sholawat bersama kepada Sahabat yang mencintai Rasulullah Muhammad SAW.\nDengan jutaan orang berdzikir, Semoga Negara2 Islam diselamatkan Allah SWT.\n\nKITA SEMUA UMAT RASULULLAH SAW..!!!\n\n*ALLAHUMMA SHALLI’ALA SAYYIDINA MUHAMMAD,*\n*WA’ALA AALI SAYYIDINA MUHAMMAD*\n\nاللّٰهم صَلِّ عَلَی سَيِّدِنَا مُحَمَّدٍ وَ عَلَی آلِ سَيِّدِنَا مُحَمَّدﷺ\n\nKirim kepada semua sahabat Muslim dan INSYA ALLAH ramailah orang bersama-sama membaca Keindahan dan Keagungan Kepribadian Rasulullah SAW, Sang Manusia Agung Kekasih Allah SWT.\n\nAnggaplah sebagai sedekah Jariyah..!!\nKunjungi platform: http://global.media.islamicity.tv`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(broadcastMessage);
    setCopiedBroadcast(true);
    setTimeout(() => setCopiedBroadcast(false), 3000);
  };

  const handleShareWa = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(broadcastMessage)}`;
    window.open(url, '_blank');
  };

  const handleShareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent('http://global.media.islamicity.tv')}&text=${encodeURIComponent(broadcastMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Spiritual Card */}
      <div className="relative rounded-2xl bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 border border-emerald-800/40 p-6 sm:p-10 shadow-2xl text-center overflow-hidden">
        {/* Decorative backdrop glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Maulid Nabi Muhammad SAW & Gerakan Sejuta Dzikir Umat</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Meneruskan Perjuangan Rasulullah SAW Menyempurnakan Akhlaq
          </h2>
          
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Mari bergandeng tangan melantunkan dzikir dan sholawat berjamaah. Hanya dengan membaca dan menyebarkan kepada sahabat beriman, kita alirkan sedekah jariyah tanpa putus.
          </p>

          {/* Sacred Arabic Calligraphy Display */}
          <div className="py-6 my-4 bg-emerald-950/30 rounded-xl border border-emerald-800/20 max-w-3xl mx-auto px-4">
            <p className="font-arabic text-2xl sm:text-4xl lg:text-5xl text-amber-300 leading-loose sm:leading-loose">
              اللّٰهم صَلِّ عَلَی سَيِّدِنَا مُحَمَّدٍ وَ عَلَی آلِ سَيِّدِنَا مُحَمَّدﷺ
            </p>
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-emerald-300/90 mt-2 uppercase">
              "Allahumma Shalli ‘Ala Sayyidina Muhammad, Wa ‘Ala Aali Sayyidina Muhammad"
            </p>
          </div>

          {/* Big Interactive Sholawat Counter Display */}
          <div className="py-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Akumulasi Sholawat Digital Berjamaah
            </div>
            <div className="text-4xl sm:text-6xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-amber-200 tabular-nums">
              {sholawatCount.toLocaleString('id-ID')}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Dari target <strong className="text-slate-200">10.000.000 Sholawat</strong> Menuju Baldatun Thoyyibatun wa Rabbun Ghofur
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md mx-auto mt-3 bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">
              Progress: {progressPercent.toFixed(2)}% Tercapai
            </div>
          </div>

          {/* Large Tap to Count Sholawat Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => handleTap(1)}
              className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base sm:text-lg transition-all transform active:scale-95 shadow-xl flex items-center justify-center gap-3 ${
                justTapped
                  ? 'bg-amber-400 text-slate-950 scale-105 shadow-amber-400/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
              }`}
            >
              <Heart className={`w-6 h-6 ${justTapped ? 'fill-slate-950 text-slate-950' : 'fill-white text-white'}`} />
              <span>Kirim 1x Sholawat (+1)</span>
            </button>

            <button
              onClick={() => handleTap(10)}
              className="w-full sm:w-auto px-5 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>+10 Sholawat</span>
            </button>

            <button
              onClick={() => handleTap(100)}
              className="w-full sm:w-auto px-5 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>+100 Tasbih</span>
            </button>
          </div>

          {personalSessionCount > 0 && (
            <div className="text-xs text-emerald-400 font-medium">
              Alhamdulillah! Anda telah membaca <span className="font-bold text-white font-mono">{personalSessionCount}</span> sholawat pada sesi ini.
            </div>
          )}
        </div>
      </div>

      {/* Share & Sedekah Jariyah Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-emerald-400" />
              <span>Sebarkan Pesan Sholawat sebagai Sedekah Jariyah</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Tolonglah, walaupun anda tak mau membacanya secara tuntas, hanya menghantarkannya kepada rekan yang lain sudah menjadi kebaikan tak terputus.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleShareWa}
              className="px-3.5 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Bagikan WhatsApp</span>
            </button>
            <button
              onClick={handleShareTelegram}
              className="px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
            >
              <Send className="w-4 h-4" />
              <span>Bagikan Telegram</span>
            </button>
            <button
              onClick={handleCopyMessage}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copiedBroadcast ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copiedBroadcast ? 'Teks Tersalin!' : 'Salin Pesan'}</span>
            </button>
          </div>
        </div>

        {/* Message Preview Box */}
        <div className="mt-4 p-4 rounded-lg bg-slate-950/80 border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
          {broadcastMessage}
        </div>
      </div>

      {/* Keutamaan Sholawat Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-emerald-900/40 text-emerald-400 flex items-center justify-center mb-3">
            <Award className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-white text-sm mb-1">10 Kali Shalawat & Rahmat</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            "Barangsiapa bershalawat kepadaku satu kali, maka Allah akan bershalawat kepadanya sepuluh kali dan menghapus sepuluh dosanya." (HR. An-Nasa'i).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-amber-900/40 text-amber-400 flex items-center justify-center mb-3">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-white text-sm mb-1">Syafaat Hari Kiamat</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            "Manusia yang paling utama bersamaku pada hari kiamat adalah mereka yang paling banyak bershalawat kepadaku." (HR. At-Tirmidzi).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-blue-900/40 text-blue-400 flex items-center justify-center mb-3">
            <BookOpen className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-white text-sm mb-1">Penyempurna Akhlaq Bangsa</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Membangun tatanan kota dan kecamatan yang berkeadilan, amanah, serta berjiwa pengayom sesuai teladan Rasulullah SAW.
          </p>
        </div>
      </div>
    </div>
  );
};
