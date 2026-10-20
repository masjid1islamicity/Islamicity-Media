import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Building2, 
  Copy, 
  Check, 
  CheckCircle2, 
  Printer, 
  Share2, 
  Sparkles, 
  ShieldCheck,
  Download
} from 'lucide-react';
import { DonationRecord } from '../types/islamicity';

interface QrisDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
  initialCategory?: string;
  onRecordDonation?: (record: DonationRecord) => void;
}

export const QrisDonationModal: React.FC<QrisDonationModalProps> = ({
  isOpen,
  onClose,
  initialAmount = 100000,
  initialCategory = 'infaq',
  onRecordDonation
}) => {
  const [amount, setAmount] = useState<number>(initialAmount);
  const [category, setCategory] = useState<string>(initialCategory);
  const [donorName, setDonorName] = useState<string>('Hamba Allah');
  const [donorPhone, setDonorPhone] = useState<string>('081234567890');
  const [donorEmail, setDonorEmail] = useState<string>('umat@islamicity.tv');
  const [doaMessage, setDoaMessage] = useState<string>('Semoga menjadi sedekah jariyah dan pembersih harta keluarga kami.');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [copiedBsi, setCopiedBsi] = useState<boolean>(false);
  const [completedRecord, setCompletedRecord] = useState<DonationRecord | null>(null);

  if (!isOpen) return null;

  const presetAmounts = [25000, 50000, 100000, 250000, 500000, 1000000, 2500000];

  const handleSimulateSuccess = () => {
    const record: DonationRecord = {
      id: 'TRX-' + Math.floor(100000 + Math.random() * 900000),
      programTitle: category === 'artvisi' 
        ? 'Dukungan Operasional ARTVISI & 70+ TV Dakwah' 
        : category === 'zakat' 
        ? 'Tunaikan Zakat Maal & Profesi Syariah' 
        : category === 'wakaf'
        ? 'Wakaf Pembangunan Menara 5 Islamicity'
        : 'Infaq & Sedekah Media Dakwah Islamicity',
      category: category as any,
      amount: amount,
      donorName: isAnonymous ? 'Hamba Allah' : donorName,
      donorEmail: donorEmail,
      donorPhone: donorPhone,
      doaMessage: doaMessage,
      isAnonymous: isAnonymous,
      paymentMethod: 'qris',
      status: 'success',
      timestamp: new Date().toLocaleString('id-ID'),
      referenceNumber: 'ISLM-' + Date.now().toString().slice(-8)
    };

    setCompletedRecord(record);
    if (onRecordDonation) {
      onRecordDonation(record);
    }
  };

  const handleCopyBsiNumber = () => {
    navigator.clipboard.writeText('7888819198');
    setCopiedBsi(true);
    setTimeout(() => setCopiedBsi(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-emerald-800/40 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 px-6 py-4 border-b border-emerald-800/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {completedRecord ? 'Tanda Terima & Akad ZISWAF Digital' : 'Sistem Pembayaran Terintegrasi QRIS & BSI'}
              </h3>
              <p className="text-[11px] text-emerald-400 font-mono">
                qris.media.islamicity.tv · qris.masjid.islamicity.tv
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {completedRecord ? (
            /* Successful Receipt Screen */
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white">Akad ZISWAF Berhasil Ditunaikan</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  "Jazakumullahu khairan katsiran. Semoga Allah memberikan pahala atas apa yang engkau berikan dan memberkahi harta yang engkau tinggalkan."
                </p>
              </div>

              {/* Digital Certificate / Receipt Box */}
              <div className="p-5 rounded-xl bg-slate-950 border border-emerald-600/30 space-y-4 text-xs font-mono">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <span className="text-emerald-400 font-bold">ISLAMICITY MEDIA DIGITAL RECEIPT</span>
                  <span className="text-slate-400">NO: {completedRecord.referenceNumber}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <span className="text-slate-500 block">Program:</span>
                    <strong className="text-white">{completedRecord.programTitle}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Nominal Donasi:</span>
                    <strong className="text-emerald-400 text-sm">Rp {completedRecord.amount.toLocaleString('id-ID')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Nama Muzakki / Donatur:</span>
                    <strong className="text-white">{completedRecord.donorName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Waktu Transaksi:</span>
                    <span>{completedRecord.timestamp}</span>
                  </div>
                </div>

                {completedRecord.doaMessage && (
                  <div className="pt-2 border-t border-slate-800 text-slate-400 italic">
                    <span className="text-slate-500 block font-normal">Pesan & Doa:</span>
                    "{completedRecord.doaMessage}"
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
                  <span>Status: LUNAS / TERVERIFIKASI SYARIAH</span>
                  <span>Gerakan 100 Tahun Kebangkitan Umat</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan Bukti Akad</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Selesai & Kembali ke Portal</span>
                </button>
              </div>
            </div>
          ) : (
            /* Donation Form and Payment View */
            <div className="space-y-5">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Pilih Alokasi Dana
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setCategory('zakat')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg text-center transition-colors ${
                      category === 'zakat' ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Zakat Maal / Profesi
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('artvisi')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg text-center transition-colors ${
                      category === 'artvisi' ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    TV & Radio ARTVISI
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('wakaf')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg text-center transition-colors ${
                      category === 'wakaf' ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Wakaf Menara 5 TV
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('infaq')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg text-center transition-colors ${
                      category === 'infaq' ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Infaq Dakwah Umum
                  </button>
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Pilih Nominal (Rp)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                        amount === preset
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                      }`}
                    >
                      Rp {preset.toLocaleString('id-ID')}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  placeholder="Nominal lainnya (Rp)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white font-mono tabular-nums focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Muzakki / Donor Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    disabled={isAnonymous}
                    value={isAnonymous ? 'Hamba Allah' : donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Nomor WhatsApp</label>
                  <input
                    type="text"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1">Doa / Niat ZISWAF</label>
                  <input
                    type="text"
                    value={doaMessage}
                    onChange={(e) => setDoaMessage(e.target.value)}
                    placeholder="Tuliskan doa atau permohonan hajat..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonCheckbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-emerald-500 focus:ring-0 bg-slate-800 border-slate-700"
                  />
                  <label htmlFor="anonCheckbox" className="text-slate-400 text-xs cursor-pointer">
                    Sembunyikan nama saya (Tampil sebagai Hamba Allah)
                  </label>
                </div>
              </div>

              {/* QRIS & BSI Visual Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
                {/* Simulated QRIS code */}
                <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white text-slate-950 text-center">
                  <div className="text-[10px] font-bold tracking-widest text-red-600 mb-1">QRIS NASIONAL</div>
                  {/* Visual SVG QR */}
                  <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="white"/>
                    <rect x="10" y="10" width="24" height="24" stroke="black" strokeWidth="6" fill="none"/>
                    <rect x="16" y="16" width="12" height="12" fill="black"/>
                    <rect x="66" y="10" width="24" height="24" stroke="black" strokeWidth="6" fill="none"/>
                    <rect x="72" y="16" width="12" height="12" fill="black"/>
                    <rect x="10" y="66" width="24" height="24" stroke="black" strokeWidth="6" fill="none"/>
                    <rect x="16" y="72" width="12" height="12" fill="black"/>
                    {/* Data dots pattern */}
                    <rect x="42" y="12" width="6" height="6" fill="black"/>
                    <rect x="52" y="18" width="6" height="6" fill="black"/>
                    <rect x="42" y="30" width="6" height="6" fill="black"/>
                    <rect x="15" y="42" width="6" height="6" fill="black"/>
                    <rect x="25" y="48" width="6" height="6" fill="black"/>
                    <rect x="45" y="45" width="10" height="10" fill="#047857"/>
                    <rect x="65" y="42" width="6" height="6" fill="black"/>
                    <rect x="80" y="48" width="6" height="6" fill="black"/>
                    <rect x="42" y="68" width="6" height="6" fill="black"/>
                    <rect x="52" y="78" width="6" height="6" fill="black"/>
                    <rect x="75" y="70" width="8" height="8" fill="black"/>
                    <rect x="85" y="85" width="6" height="6" fill="black"/>
                  </svg>
                  <div className="text-[10px] font-semibold text-slate-800 mt-1">
                    Scan via BCA, Mandiri, BSI, GoPay, OVO, ShopeePay
                  </div>
                </div>

                {/* Bank Transfer alternative */}
                <div className="flex flex-col justify-between space-y-2 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                      <Building2 className="w-4 h-4" />
                      <span>Transfer Bank Syariah Mandiri (BSI)</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Asosiasi Radio & Televisi Islam Indonesia (ARTVISI) & Layanan Zakat Islamicity
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-slate-900 border border-slate-700 font-mono">
                    <span className="text-[10px] text-slate-400 block">Nomor Rekening:</span>
                    <div className="flex items-center justify-between text-amber-300 font-bold text-sm">
                      <span>7 8888 1919 8</span>
                      <button
                        type="button"
                        onClick={handleCopyBsiNumber}
                        className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                        title="Salin Nomor Rekening"
                      >
                        {copiedBsi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">Kode Bank: 451</span>
                  </div>

                  <div className="text-[10px] text-slate-400 leading-tight">
                    Konfirmasi transfer via WA ke <span className="text-emerald-400 font-bold">0822 2882 1515</span>:
                    <br />
                    <code>LIVEARTVISI#{isAnonymous ? 'HambaAllah' : donorName}#{donorPhone}#{amount}</code>
                  </div>
                </div>
              </div>

              {/* Action: Simulate Payment & Issue Official Receipt */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSimulateSuccess}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>Saya Sudah Membayar & Terbitkan Akad Digital</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
