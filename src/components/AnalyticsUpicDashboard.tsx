import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Tv, 
  Heart, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  Sparkles, 
  Target, 
  Building2,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface AnalyticsUpicDashboardProps {
  sholawatCount: number;
}

export const AnalyticsUpicDashboard: React.FC<AnalyticsUpicDashboardProps> = ({
  sholawatCount
}) => {
  // Simulator states for BEP
  const [therapyClients, setTherapyClients] = useState<number>(36); // target min 32
  const [classTickets, setClassTickets] = useState<number>(12); // target min 10
  const [adSpend, setAdSpend] = useState<number>(300000);

  // Financial assumptions from prompt
  const fixedMonthlyCost = 1600000;
  const therapyMargin = 35000;
  const classMargin = 50000;

  // Real-time calculations
  const therapyRevenueContribution = therapyClients * therapyMargin;
  const classRevenueContribution = classTickets * classMargin;
  const totalContribution = therapyRevenueContribution + classRevenueContribution;
  const netBalance = totalContribution - fixedMonthlyCost;
  const costCoveragePercent = Math.round((totalContribution / fixedMonthlyCost) * 100);

  const totalLeads = therapyClients + classTickets;
  const calculatedCpl = totalLeads > 0 ? Math.round(adSpend / totalLeads) : 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            <span>Dashboard Analitik Dampak Sosial & Evaluasi BEP UPIC Limo</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Monitoring real-time keterlibatan umat, performa siaran hyperlocal, dan tata kelola anggaran berbasis hasil riil.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-lg self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Status Sistem: Siaran & Transaksi Berjalan Normal</span>
        </div>
      </div>

      {/* 4 High-Level Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total ZISWAF Tersalurkan</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white tabular-nums">
            Rp 482.500.000
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% bulan ini via QRIS & BSI</span>
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Dzikir Sholawat Berjamaah</span>
            <Heart className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-300 tabular-nums">
            {sholawatCount.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Terhimpun dari jamaah nusantara
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Jam Siaran Dakwah & Live</span>
            <Tv className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white tabular-nums">
            2.840 Jam
          </div>
          <p className="text-[11px] text-blue-400 mt-2">
            15+ Saluran TV & Radio ARTVISI
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Penerima Manfaat / Mustahik</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white tabular-nums">
            18.420 Jiwa
          </div>
          <p className="text-[11px] text-purple-400 mt-2">
            Termasuk pasien dhuafa LimoCity
          </p>
        </div>
      </div>

      {/* UPIC Limo Hyperlocal Center Showcase */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 relative aspect-video lg:aspect-auto">
            <img
              src="/src/assets/images/islamic_community_center_1792488059603.jpg"
              alt="Unit Pelayanan Islamicity Limo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent lg:hidden" />
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                Profil Unit Kerja Hyperlocal
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Unit Pelayanan Islamicity (UPIC) Limo, Kota Depok
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Divisi City Media & Dakwah Lokal berfokus pada produksi konten <em>hyperlocal</em> dengan konsep <strong>low-cost setup</strong> (memanfaatkan perangkat HP & Laptop yang tersedia), mengintegrasikan layanan dakwah, terapi thibbun nabawi syariah (LimoCity Terapi), dan Expert Class wirausaha.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Setup Awal:</span>
                <strong className="text-white font-mono">Rp 600.000</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Beban Operasional:</span>
                <strong className="text-white font-mono">Rp 1.600.000 / bln</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Model Keberlanjutan:</span>
                <strong className="text-emerald-400 font-medium">BEP Fungsional</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rencana Anggaran Biaya (RAB) Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table A: Setup Investasi Awal */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="font-bold text-white text-sm">
              A. Biaya Investasi Awal (Setup Modal Rendah)
            </h4>
            <span className="text-xs font-mono text-emerald-400 font-bold">Total: Rp 600.000</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-300">A1. Mic Lavalier Clip-on (2 unit)</span>
              <span className="font-mono tabular-nums text-slate-200">Rp 300.000</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-300">A2. Lighting Dasar (Ring Light / Softbox 1 unit)</span>
              <span className="font-mono tabular-nums text-slate-200">Rp 250.000</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-300">A3. Lisensi Aplikasi Editing HP (CapCut Pro / VN)</span>
              <span className="font-mono tabular-nums text-slate-200">Rp 50.000</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            *Biaya satu kali pengadaan di luar laptop/smartphone relawan yang sudah tersedia.
          </p>
        </div>

        {/* Table B: Biaya Operasional Bulanan */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="font-bold text-white text-sm">
              B. Biaya Operasional Bulanan (Recurring Cost)
            </h4>
            <span className="text-xs font-mono text-amber-300 font-bold">Total: Rp 1.600.000</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-300">B1. Honorarium Koordinator Konten & Editor (1 org)</span>
              <span className="font-mono tabular-nums text-slate-200">Rp 1.000.000</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-300">B2. Kuota Internet Khusus Live Streaming</span>
              <span className="font-mono tabular-nums text-slate-200">Rp 200.000</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-300">B3. Promosi Ads Media Sosial (IG/FB Hyperlocal)</span>
              <span className="font-mono tabular-nums text-slate-200">Rp 300.000</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-300">B4. Biaya Produksi / Liputan Lapangan Tak Terduga</span>
              <span className="font-mono tabular-nums text-slate-200">Rp 100.000</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            *Biaya operasional tetap yang harus ditutupi oleh kontribusi leads unit bisnis UPIC Limo.
          </p>
        </div>
      </div>

      {/* Interactive BEP Simulator Console */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-800/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <span>Simulator Titik Impas (Break-Even Point / BEP) Fungsional</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Media berfungsi sebagai <em>Authority Builder</em> yang menghasilkan <em>Leads</em> bagi LimoCity Terapi & Expert Class.
            </p>
          </div>

          <div className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 ${
            netBalance >= 0
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
              : 'bg-red-950 text-red-300 border border-red-500/50'
          }`}>
            {netBalance >= 0 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
            <span>STATUS: {netBalance >= 0 ? `SURPLUS MANDIRI (+Rp ${netBalance.toLocaleString('id-ID')})` : `DEFISIT (-Rp ${Math.abs(netBalance).toLocaleString('id-ID')})`}</span>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
          {/* Slider 1: LimoCity Terapi */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">
                Klien Layanan LimoCity Terapi (Target BEP: 32 Klien)
              </span>
              <span className="font-mono text-emerald-400 font-bold text-sm tabular-nums">
                {therapyClients} Klien
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="70"
              value={therapyClients}
              onChange={(e) => setTherapyClients(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Margin Rp 35.000 / Klien</span>
              <span className="text-slate-200 font-mono font-medium">
                Kontribusi: Rp {therapyRevenueContribution.toLocaleString('id-ID')} ({Math.round((therapyRevenueContribution / 1120000) * 100)}% target)
              </span>
            </div>
          </div>

          {/* Slider 2: Expert Class Tickets */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">
                Tiket Pelatihan Expert Class (Target BEP: 10 Tiket)
              </span>
              <span className="font-mono text-amber-300 font-bold text-sm tabular-nums">
                {classTickets} Tiket
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={classTickets}
              onChange={(e) => setClassTickets(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Margin Rp 50.000 / Tiket</span>
              <span className="text-slate-200 font-mono font-medium">
                Kontribusi: Rp {classRevenueContribution.toLocaleString('id-ID')} ({Math.round((classRevenueContribution / 480000) * 100)}% target)
              </span>
            </div>
          </div>
        </div>

        {/* Financial Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Beban Operasional:</span>
            <strong className="text-white font-mono text-sm">Rp {fixedMonthlyCost.toLocaleString('id-ID')}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Total Kontribusi Masuk:</span>
            <strong className="text-emerald-400 font-mono text-sm">Rp {totalContribution.toLocaleString('id-ID')}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Rasio Penutupan Biaya:</span>
            <strong className="text-amber-300 font-mono text-sm">{costCoveragePercent}%</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">CPL (Cost Per Lead):</span>
            <strong className={`font-mono text-sm ${calculatedCpl <= 15000 ? 'text-emerald-400' : 'text-red-400'}`}>
              Rp {calculatedCpl.toLocaleString('id-ID')} {calculatedCpl <= 15000 ? '(Efisien)' : '(Tinggi)'}
            </strong>
          </div>
        </div>
      </div>

      {/* KPI Evaluation Scorecard Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <span>Key Performance Indicator (KPI) Sederhana Divisi Media</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Indikator bulanan untuk mengukur kualitas jangkauan (Top of Funnel) dan kontribusi bisnis riil (Bottom of Funnel).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">No</th>
                <th className="py-2.5 px-3">Indikator Kinerja (KPI)</th>
                <th className="py-2.5 px-3">Kategori</th>
                <th className="py-2.5 px-3">Target Minimum</th>
                <th className="py-2.5 px-3">Realisasi Saat Ini</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              <tr>
                <td className="py-2.5 px-3">1</td>
                <td className="py-2.5 px-3 font-sans text-white">Frekuensi Konten Hyperlocal</td>
                <td className="py-2.5 px-3 text-slate-400">Konten & Jangkauan</td>
                <td className="py-2.5 px-3">Min 30 Konten</td>
                <td className="py-2.5 px-3 text-emerald-400">34 Konten</td>
                <td className="py-2.5 px-3 text-emerald-400 font-sans font-semibold">Tercapai</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3">2</td>
                <td className="py-2.5 px-3 font-sans text-white">Frekuensi Live Kajian</td>
                <td className="py-2.5 px-3 text-slate-400">Konten & Jangkauan</td>
                <td className="py-2.5 px-3">Min 4 Sesi/bln</td>
                <td className="py-2.5 px-3 text-emerald-400">5 Sesi</td>
                <td className="py-2.5 px-3 text-emerald-400 font-sans font-semibold">Tercapai</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3">3</td>
                <td className="py-2.5 px-3 font-sans text-white">Tingkat Engagement Rata-Rata</td>
                <td className="py-2.5 px-3 text-slate-400">Konten & Jangkauan</td>
                <td className="py-2.5 px-3">Min 5.0%</td>
                <td className="py-2.5 px-3 text-emerald-400">6.2%</td>
                <td className="py-2.5 px-3 text-emerald-400 font-sans font-semibold">Tercapai</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3">4</td>
                <td className="py-2.5 px-3 font-sans text-white">Peningkatan Jangkauan Lokal (Reach)</td>
                <td className="py-2.5 px-3 text-slate-400">Konten & Jangkauan</td>
                <td className="py-2.5 px-3">Min 2.000 Akun</td>
                <td className="py-2.5 px-3 text-emerald-400">3.450 Akun</td>
                <td className="py-2.5 px-3 text-emerald-400 font-sans font-semibold">Tercapai</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3">5</td>
                <td className="py-2.5 px-3 font-sans text-white">Produksi Testimoni LimoCity Terapi</td>
                <td className="py-2.5 px-3 text-slate-400">Konten & Jangkauan</td>
                <td className="py-2.5 px-3">Min 4 Video</td>
                <td className="py-2.5 px-3 text-emerald-400">4 Video</td>
                <td className="py-2.5 px-3 text-emerald-400 font-sans font-semibold">Tercapai</td>
              </tr>
              <tr className="bg-emerald-950/20 font-bold">
                <td className="py-2.5 px-3">6</td>
                <td className="py-2.5 px-3 font-sans text-white">Kontribusi Leads (LimoCity Terapi)</td>
                <td className="py-2.5 px-3 text-emerald-400">Bisnis & BEP</td>
                <td className="py-2.5 px-3">Min 32 Klien</td>
                <td className="py-2.5 px-3 text-emerald-400">{therapyClients} Klien</td>
                <td className="py-2.5 px-3 text-emerald-400 font-sans">
                  {therapyClients >= 32 ? 'Tercapai' : 'Perlu Evaluasi'}
                </td>
              </tr>
              <tr className="bg-emerald-950/20 font-bold">
                <td className="py-2.5 px-3">7</td>
                <td className="py-2.5 px-3 font-sans text-white">Kontribusi Revenue (Expert Class)</td>
                <td className="py-2.5 px-3 text-emerald-400">Bisnis & BEP</td>
                <td className="py-2.5 px-3">Min 10 Tiket</td>
                <td className="py-2.5 px-3 text-emerald-400">{classTickets} Tiket</td>
                <td className="py-2.5 px-3 text-emerald-400 font-sans">
                  {classTickets >= 10 ? 'Tercapai' : 'Perlu Evaluasi'}
                </td>
              </tr>
              <tr className="bg-emerald-950/20 font-bold">
                <td className="py-2.5 px-3">8</td>
                <td className="py-2.5 px-3 font-sans text-white">Cost Per Lead (CPL) Rata-rata</td>
                <td className="py-2.5 px-3 text-emerald-400">Bisnis & BEP</td>
                <td className="py-2.5 px-3">Maks Rp 15.000</td>
                <td className="py-2.5 px-3 text-emerald-400">Rp {calculatedCpl.toLocaleString('id-ID')}</td>
                <td className="py-2.5 px-3 text-emerald-400 font-sans">
                  {calculatedCpl <= 15000 ? 'Sangat Efisien' : 'Melebihi Batas'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
