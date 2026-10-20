import React, { useState } from 'react';
import { 
  Calculator, 
  Coins, 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  FileText,
  Download,
  Printer,
  FileSpreadsheet,
  PlusCircle,
  Trash2,
  Calendar,
  Layers,
  X,
  ExternalLink
} from 'lucide-react';

interface ZakatCalculatorSectionProps {
  onPayZakat: (amount: number, typeLabel: string) => void;
}

export interface ZakatLedgerItem {
  id: string;
  date: string;
  type: string;
  netBaseAmount: number;
  nisabValue: number;
  zakatDue: number;
  status: 'Lunas & Disalurkan' | 'Dihitung / Terjadwal';
  channel: string;
  referenceNo: string;
}

export const ZakatCalculatorSection: React.FC<ZakatCalculatorSectionProps> = ({
  onPayZakat
}) => {
  const [activeType, setActiveType] = useState<'penghasilan' | 'maal' | 'emas' | 'perdagangan'>('penghasilan');

  // Input states
  const [monthlySalary, setMonthlySalary] = useState<number>(12500000);
  const [monthlyBonus, setMonthlyBonus] = useState<number>(2000000);
  const [monthlyNeeds, setMonthlyNeeds] = useState<number>(4000000);

  const [cashAndDeposit, setCashAndDeposit] = useState<number>(150000000);
  const [otherLiquidAssets, setOtherLiquidAssets] = useState<number>(20000000);
  const [currentDebts, setCurrentDebts] = useState<number>(15000000);

  const [goldGrams, setGoldGrams] = useState<number>(95);
  const [goldPricePerGram, setGoldPricePerGram] = useState<number>(1450000);

  const [tradeInventory, setTradeInventory] = useState<number>(200000000);
  const [tradeReceivables, setTradeReceivables] = useState<number>(35000000);
  const [tradeDebtsDue, setTradeDebtsDue] = useState<number>(50000000);

  // Constants
  const ANNUAL_NISAB_GOLD_GRAMS = 85;
  const annualNisabRupiah = ANNUAL_NISAB_GOLD_GRAMS * goldPricePerGram; // 85 * 1.450.000 = Rp 123.250.000
  const monthlyNisabRupiah = annualNisabRupiah / 12; // Rp 10.270.833

  // Printable report preview modal state
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [reportNotification, setReportNotification] = useState<string | null>(null);

  // Initial Zakat Ledger Records
  const [ledgerItems, setLedgerItems] = useState<ZakatLedgerItem[]>([
    {
      id: 'ZK-2026-10492',
      date: '15 Oktober 2026',
      type: 'Zakat Penghasilan (Bulan Berjalan)',
      netBaseAmount: 10500000,
      nisabValue: 10270833,
      zakatDue: 262500,
      status: 'Lunas & Disalurkan',
      channel: 'UPIC Limo & ARTVISI',
      referenceNo: 'ISLM-ZIS-94819'
    },
    {
      id: 'ZK-2026-09214',
      date: '28 September 2026',
      type: 'Zakat Maal (Tabungan 1 Tahun)',
      netBaseAmount: 155000000,
      nisabValue: 123250000,
      zakatDue: 3875000,
      status: 'Lunas & Disalurkan',
      channel: 'Baitul Maal Islamicity',
      referenceNo: 'ISLM-ZIS-88210'
    },
    {
      id: 'ZK-2026-08119',
      date: '10 Agustus 2026',
      type: 'Zakat Emas Simpanan (95 Gram)',
      netBaseAmount: 137750000,
      nisabValue: 123250000,
      zakatDue: 3443750,
      status: 'Lunas & Disalurkan',
      channel: 'Mitra Baznas & ARTVISI',
      referenceNo: 'ISLM-ZIS-77412'
    }
  ]);

  // Computations
  let totalNetAssets = 0;
  let isObligated = false;
  let zakatAmount = 0;
  let calculationNote = '';

  if (activeType === 'penghasilan') {
    const netIncomeMonthly = (monthlySalary + monthlyBonus) - monthlyNeeds;
    totalNetAssets = netIncomeMonthly;
    isObligated = (monthlySalary + monthlyBonus) >= monthlyNisabRupiah;
    zakatAmount = isObligated ? Math.max(0, Math.round(netIncomeMonthly * 0.025)) : 0;
    calculationNote = `Nisab Zakat Profesi Bulanan: Rp ${Math.round(monthlyNisabRupiah).toLocaleString('id-ID')} (setara ${ANNUAL_NISAB_GOLD_GRAMS}g emas / 12)`;
  } else if (activeType === 'maal') {
    totalNetAssets = (cashAndDeposit + otherLiquidAssets) - currentDebts;
    isObligated = totalNetAssets >= annualNisabRupiah;
    zakatAmount = isObligated ? Math.max(0, Math.round(totalNetAssets * 0.025)) : 0;
    calculationNote = `Nisab Zakat Maal: Rp ${annualNisabRupiah.toLocaleString('id-ID')} dengan syarat kepemilikan 1 tahun (haul)`;
  } else if (activeType === 'emas') {
    totalNetAssets = goldGrams * goldPricePerGram;
    isObligated = goldGrams >= ANNUAL_NISAB_GOLD_GRAMS;
    zakatAmount = isObligated ? Math.max(0, Math.round(totalNetAssets * 0.025)) : 0;
    calculationNote = `Nisab Emas Murni: 85 gram. Emas perhiasan yang dipakai sehari-hari tidak dikenakan zakat.`;
  } else if (activeType === 'perdagangan') {
    totalNetAssets = (tradeInventory + tradeReceivables) - tradeDebtsDue;
    isObligated = totalNetAssets >= annualNisabRupiah;
    zakatAmount = isObligated ? Math.max(0, Math.round(totalNetAssets * 0.025)) : 0;
    calculationNote = `Rumus: (Nilai Barang Dagangan + Piutang Lancar - Hutang Jatuh Tempo) × 2,5%`;
  }

  const formatCurrency = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  // Add current calculated zakat to ledger
  const handleSaveCalculationToLedger = () => {
    const typeLabel = `Zakat ${activeType.charAt(0).toUpperCase() + activeType.slice(1)}`;
    const newItem: ZakatLedgerItem = {
      id: 'ZK-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      type: `${typeLabel} (${isObligated ? 'Wajib Zakat' : 'Infaq Sukarela'})`,
      netBaseAmount: totalNetAssets,
      nisabValue: activeType === 'penghasilan' ? Math.round(monthlyNisabRupiah) : annualNisabRupiah,
      zakatDue: zakatAmount > 0 ? zakatAmount : 100000,
      status: 'Dihitung / Terjadwal',
      channel: 'UPIC Limo & City Media',
      referenceNo: 'ISLM-CALC-' + Date.now().toString().slice(-6)
    };

    setLedgerItems(prev => [newItem, ...prev]);
    setReportNotification(`Perhitungan "${typeLabel}" berhasil ditambahkan ke Ringkasan Transaksi Zakat.`);
    setTimeout(() => setReportNotification(null), 3500);
  };

  // Remove item from ledger
  const handleDeleteLedgerItem = (id: string) => {
    setLedgerItems(prev => prev.filter(item => item.id !== id));
  };

  // Download CSV feature
  const handleDownloadCsv = () => {
    const headers = [
      'ID Transaksi',
      'Tanggal Transaksi',
      'Jenis Zakat',
      'Dasar Perhitungan (Rp)',
      'Nilai Nisab Acuan (Rp)',
      'Total Zakat (2.5%) (Rp)',
      'Status Pengelolaan',
      'Kanal Penyaluran',
      'Nomor Referensi'
    ];

    const rows = ledgerItems.map(item => [
      item.id,
      `"${item.date}"`,
      `"${item.type}"`,
      item.netBaseAmount,
      item.nisabValue,
      item.zakatDue,
      `"${item.status}"`,
      `"${item.channel}"`,
      `"${item.referenceNo}"`
    ]);

    const csvContent = '\uFEFF' + [
      '# RINGKASAN PENGELOLAAN ZAKAT TRANSPARAN - ISLAMICITY MEDIA & BAITUL MAAL',
      `# Tanggal Unduh: ${new Date().toLocaleString('id-ID')}`,
      `# Harga Emas Acuan: Rp ${goldPricePerGram.toLocaleString('id-ID')} / gram`,
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ringkasan_zakat_transparan_islamicity_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalCalculatedZakat = ledgerItems.reduce((acc, curr) => acc + curr.zakatDue, 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calculator className="w-6 h-6 text-emerald-400" />
            <span>Kalkulator Zakat & Pengelolaan Transparan Transaksi</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Hitung kewajiban zakat secara akurat, tunaikan via QRIS terpadu, dan unduh ringkasan transaksi dalam format PDF atau CSV.
          </p>
        </div>

        {/* Live Gold Price Indicator */}
        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-3 text-xs self-start sm:self-auto">
          <Coins className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <div className="text-slate-400">Harga Emas Acuan (Antam):</div>
            <div className="font-mono font-bold text-amber-300 tabular-nums">
              {formatCurrency(goldPricePerGram)} / gram
            </div>
          </div>
        </div>
      </div>

      {reportNotification && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{reportNotification}</span>
        </div>
      )}

      {/* Calculator Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Panel (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          {/* Segmented Type Tabs */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Pilih Jenis Zakat
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setActiveType('penghasilan')}
                className={`py-2 px-3 text-xs font-medium rounded-lg transition-colors text-center ${
                  activeType === 'penghasilan'
                    ? 'bg-emerald-600 text-white font-semibold shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                Penghasilan
              </button>
              <button
                onClick={() => setActiveType('maal')}
                className={`py-2 px-3 text-xs font-medium rounded-lg transition-colors text-center ${
                  activeType === 'maal'
                    ? 'bg-emerald-600 text-white font-semibold shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                Zakat Maal
              </button>
              <button
                onClick={() => setActiveType('emas')}
                className={`py-2 px-3 text-xs font-medium rounded-lg transition-colors text-center ${
                  activeType === 'emas'
                    ? 'bg-emerald-600 text-white font-semibold shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                Emas / Perak
              </button>
              <button
                onClick={() => setActiveType('perdagangan')}
                className={`py-2 px-3 text-xs font-medium rounded-lg transition-colors text-center ${
                  activeType === 'perdagangan'
                    ? 'bg-emerald-600 text-white font-semibold shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                Perdagangan
              </button>
            </div>
          </div>

          {/* Form Fields by Type */}
          <div className="space-y-4">
            {activeType === 'penghasilan' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Gaji / Penghasilan Pokok Bulanan (Rp)
                  </label>
                  <input
                    type="number"
                    value={monthlySalary}
                    onChange={(e) => setMonthlySalary(Number(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tunjangan / Bonus / Pendapatan Lain (Rp)
                  </label>
                  <input
                    type="number"
                    value={monthlyBonus}
                    onChange={(e) => setMonthlyBonus(Number(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Pengeluaran Kebutuhan Pokok Bulanan (Rp)
                  </label>
                  <input
                    type="number"
                    value={monthlyNeeds}
                    onChange={(e) => setMonthlyNeeds(Number(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono tabular-nums"
                  />
                </div>
              </>
            )}

            {activeType === 'maal' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Uang Tunai, Tabungan & Deposito yang Tersimpan 1 Tahun (Rp)
                  </label>
                  <input
                    type="number"
                    value={cashAndDeposit}
                    onChange={(e) => setCashAndDeposit(Number(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Aset Likuid Lainnya / Reksa Dana Syariah (Rp)
                  </label>
                  <input
                    type="number"
                    value={otherLiquidAssets}
                    onChange={(e) => setOtherLiquidAssets(Number(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Hutang Jatuh Tempo Tahun Berjalan (Rp)
                  </label>
                  <input
                    type="number"
                    value={currentDebts}
                    onChange={(e) => setCurrentDebts(Number(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono tabular-nums"
                  />
                </div>
              </>
            )}

            {activeType === 'emas' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Jumlah Emas Simpanan / Batangan (Gram)
                  </label>
                  <input
                    type="number"
                    value={goldGrams}
                    onChange={(e) => setGoldGrams(Number(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Harga Emas Acuan per Gram (Rp)
                  </label>
                  <input
                    type="number"
                    value={goldPricePerGram}
                    onChange={(e) => setGoldPricePerGram(Number(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono tabular-nums"
                  />
                </div>
              </>
            )}

            {activeType === 'perdagangan' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nilai Persediaan Barang Dagangan Saat Tutup Buku (Rp)
                  </label>
                  <input
                    type="number"
                    value={tradeInventory}
                    onChange={(e) => setTradeInventory(Number(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Piutang Dagang Lancar (Rp)
                  </label>
                  <input
                    type="number"
                    value={tradeReceivables}
                    onChange={(e) => setTradeReceivables(Number(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Hutang Usaha Jatuh Tempo Saat Tutup Buku (Rp)
                  </label>
                  <input
                    type="number"
                    value={tradeDebtsDue}
                    onChange={(e) => setTradeDebtsDue(Number(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono tabular-nums"
                  />
                </div>
              </>
            )}
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{calculationNote}</span>
          </div>
        </div>

        {/* Calculation Summary & Payment Trigger (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Status Kewajiban
              </span>
              <span className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5 ${
                isObligated
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {isObligated ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
                <span>{isObligated ? 'WAJIB ZAKAT' : 'BELUM WAJIB ZAKAT'}</span>
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Nilai Bersih / Terhitung:</span>
                <span className="font-mono font-semibold tabular-nums text-slate-100">
                  {formatCurrency(totalNetAssets)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Nisab Acuan:</span>
                <span className="font-mono tabular-nums">
                  {activeType === 'penghasilan' 
                    ? formatCurrency(Math.round(monthlyNisabRupiah)) + '/bln' 
                    : formatCurrency(annualNisabRupiah) + '/thn'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Kadar Zakat:</span>
                <span className="font-mono font-semibold text-emerald-400">2,5 %</span>
              </div>
            </div>

            {/* Total Zakat Box */}
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/30 text-center">
              <span className="text-xs text-emerald-300/80 font-medium uppercase tracking-wider">
                Total Zakat yang Harus Ditunaikan
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono mt-1 tabular-nums">
                {formatCurrency(zakatAmount)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {isObligated ? 'Telah memenuhi nishab dan haul syariah' : 'Tetap dianjurkan menunaikan Infaq/Sedekah sukarela'}
              </p>
            </div>

            {/* Save to Ledger Button */}
            <button
              onClick={handleSaveCalculationToLedger}
              className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Simpan Perhitungan Ini ke Ringkasan Transaksi</span>
            </button>

            {/* Sacred Niat Box */}
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Niat Zakat (Muzakki):</span>
              </div>
              <p className="font-arabic text-right text-base text-amber-200/90 leading-relaxed my-1">
                نَوَيْتُ أَنْ أُخْرِجَ زَكَاةَ مَالِي فَرْضًا لِلَّهِ تَعَالَى
              </p>
              <p className="text-[11px] text-slate-400 italic">
                "Aku berniat mengeluarkan zakat hartaku, fardhu karena Allah Ta'ala."
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                const amountToPay = zakatAmount > 0 ? zakatAmount : 100000;
                onPayZakat(amountToPay, `Zakat ${activeType.charAt(0).toUpperCase() + activeType.slice(1)}`);
              }}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-slate-950 transition-all shadow-lg shadow-emerald-950 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{zakatAmount > 0 ? 'Tunaikan Zakat via QRIS Terintegrasi' : 'Tunaikan Infaq/Sedekah via QRIS'}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
            <div className="text-center text-[11px] text-slate-500 mt-2 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Terintegrasi dengan qris.masjid.islamicity.tv & qris.media.islamicity.tv</span>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Transparent Zakat Ledger & PDF/CSV Download Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">
                Buku Pengelolaan & Ringkasan Transaksi Zakat Transparan
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Rekapitulasi perhitungan dan penyaluran zakat muzakki dengan jaminan transparansi akuntabel Baitul Maal Islamicity.
            </p>
          </div>

          {/* Download Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDownloadCsv}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
              title="Unduh seluruh ringkasan dalam format CSV/Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Unduh Format CSV</span>
            </button>

            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all shadow-md"
              title="Cetak atau unduh dokumen tanda terima PDF resmi"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>Unduh / Cetak Bukti PDF</span>
            </button>
          </div>
        </div>

        {/* Aggregate Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Total Transaksi Tercatat:</span>
            <strong className="text-white text-base font-bold font-mono tabular-nums">
              {ledgerItems.length} Catatan
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Akumulasi ZISWAF Dikelola:</span>
            <strong className="text-emerald-400 text-base font-bold font-mono tabular-nums">
              {formatCurrency(totalCalculatedZakat)}
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Prinsip Pengelolaan:</span>
            <span className="text-amber-300 font-semibold flex items-center gap-1 mt-0.5">
              <span>8 Asnaf & Diawasi Dewan Syariah</span>
            </span>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">No / ID</th>
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3">Jenis Zakat</th>
                <th className="py-3 px-3">Dasar Harta (Rp)</th>
                <th className="py-3 px-3">Nisab (Rp)</th>
                <th className="py-3 px-3">Zakat 2,5% (Rp)</th>
                <th className="py-3 px-3">Kanal Penyaluran</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300 tabular-nums">
              {ledgerItems.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">
                    {item.id}
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-300">
                    {item.date}
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-200">
                    {item.type}
                  </td>
                  <td className="py-3 px-3">
                    {formatCurrency(item.netBaseAmount)}
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {formatCurrency(item.nisabValue)}
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-400">
                    {formatCurrency(item.zakatDue)}
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-300">
                    {item.channel}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                      item.status.includes('Lunas')
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => handleDeleteLedgerItem(item.id)}
                      className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                      title="Hapus Catatan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Printable Document Modal */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 my-8 space-y-6">
            {/* Modal Controls Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-800">
                Dokumen Resmi Bukti Pengelolaan Zakat Transparan
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  onClick={() => setIsPdfModalOpen(false)}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Letterhead Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b-2 border-emerald-900">
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-black tracking-tight text-emerald-950 uppercase font-sans">
                  BAITUL MAAL ISLAMICITY MEDIA
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  Unit Pelayanan Islamicity (UPIC) Limo & Jejaring ARTVISI Indonesia
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  global.media.islamicity.tv · qris.masjid.islamicity.tv · BSI 7888819198
                </div>
              </div>

              <div className="text-right sm:text-right text-xs">
                <div className="font-bold text-slate-900 font-mono">NO: ISLM/ZIS/2026/X-9821</div>
                <div className="text-slate-500 text-[11px]">Tanggal: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase mt-1">
                  Akuntabel & Terverifikasi
                </span>
              </div>
            </div>

            {/* Statement of Transparency */}
            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <p>
                Dokumen ini merupakan ringkasan resmi perhitungan kewajiban dan penunaian ZISWAF yang dikelola sesuai dengan ketentuan syariat Al-Qur'an (Surat At-Taubah ayat 60) dan regulasi perundang-undangan pengelolaan zakat yang berlaku.
              </p>
            </div>

            {/* Summary Table */}
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">No</th>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Jenis Zakat</th>
                    <th className="py-2.5 px-3 text-right">Dasar Harta</th>
                    <th className="py-2.5 px-3 text-right">Zakat (2,5%)</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                  {ledgerItems.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="py-2.5 px-3 text-slate-500">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-800">{item.date}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-800 font-medium">{item.type}</td>
                      <td className="py-2.5 px-3 text-right">{formatCurrency(item.netBaseAmount)}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-800">{formatCurrency(item.zakatDue)}</td>
                      <td className="py-2.5 px-3 text-center font-sans">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold text-xs">
                    <td colSpan={4} className="py-3 px-3 text-right font-sans uppercase">
                      Total Akumulasi Zakat Dikelola:
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-900 font-mono text-sm">
                      {formatCurrency(totalCalculatedZakat)}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Asnaf Distribution Allocation Guarantee */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                Komitmen Alokasi 8 Asnaf Penerima Manfaat:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-500 block">Fakir & Miskin:</span>
                  <strong className="text-emerald-800">50% Alokasi</strong>
                </div>
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-500 block">Fi Sabilillah (Dakwah):</span>
                  <strong className="text-emerald-800">25% Alokasi</strong>
                </div>
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-500 block">Amil Transparan:</span>
                  <strong className="text-emerald-800">12.5% Operasional</strong>
                </div>
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-500 block">Gharimin & Ibnu Sabil:</span>
                  <strong className="text-emerald-800">12.5% Alokasi</strong>
                </div>
              </div>
            </div>

            {/* Signature and Verification Footer */}
            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block">Muzakki / Pengelola:</span>
                <div className="h-14 flex items-center">
                  <span className="font-mono text-xs text-slate-800">[ Terverifikasi Digital ]</span>
                </div>
                <span className="font-bold text-slate-900 block">Sahabat Jamaah Islamicity</span>
                <span className="text-[10px] text-slate-500">ID: {ledgerItems[0]?.referenceNo || 'ISLM-VERIFIED'}</span>
              </div>

              <div className="text-right">
                <span className="text-slate-500 block">Dewan Pengawas Syariah:</span>
                <div className="h-14 flex items-center justify-end">
                  <div className="px-3 py-1 rounded border-2 border-emerald-800 text-emerald-800 font-bold font-arabic text-sm transform -rotate-2">
                    مُعْتَمَدٌ شَرْعِيًّا
                  </div>
                </div>
                <span className="font-bold text-slate-900 block">Dewan Syariah Islamicity & ARTVISI</span>
                <span className="text-[10px] text-slate-500">Sertifikasi Fiqih Muamalah 1448 H</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
