import React, { useState } from 'react';
import { VOUCHERS_DATA } from '../data/vouchers';
import { VoucherItem } from '../types/islamicity';
import { 
  Gift, 
  Copy, 
  Check, 
  Sparkles, 
  Calendar, 
  Tag, 
  ShieldCheck, 
  Plane, 
  BookOpen, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';

export const VoucherHajiSection: React.FC = () => {
  const [vouchers, setVouchers] = useState<VoucherItem[]>(VOUCHERS_DATA);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [claimedVouchers, setClaimedVouchers] = useState<string[]>([]);
  const [selectedVoucherForModal, setSelectedVoucherForModal] = useState<VoucherItem | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleClaim = (v: VoucherItem) => {
    if (!claimedVouchers.includes(v.id)) {
      setClaimedVouchers(prev => [...prev, v.id]);
      setVouchers(prev => prev.map(item => {
        if (item.id === v.id) {
          return { ...item, quotaRemaining: Math.max(0, item.quotaRemaining - 1) };
        }
        return item;
      }));
    }
    setSelectedVoucherForModal(v);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Gift className="w-6 h-6 text-amber-400" />
            <span>Voucher Belanja Haji, Media & Layanan Berkah Umat</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Program kemitraan barakah untuk kemudahan ibadah ke Tanah Suci, terapi thibbun nabawi UPIC, dan kursus dakwah digital.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/60 border border-amber-800/40 px-3 py-1.5 rounded-lg self-start sm:self-auto font-medium">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Subsidi Khusus Jamaah Islamicity</span>
        </div>
      </div>

      {/* Voucher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {vouchers.map((voucher) => {
          const isClaimed = claimedVouchers.includes(voucher.id);
          return (
            <div
              key={voucher.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                voucher.category === 'Haji & Umrah'
                  ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-600/40 shadow-lg shadow-amber-950/30'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                    {voucher.category}
                  </span>
                  <span className="text-xs font-mono text-emerald-400">
                    Sisa Kuota: <strong>{voucher.quotaRemaining}</strong>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">
                  {voucher.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Disediakan oleh: <span className="text-slate-300">{voucher.provider}</span>
                </p>

                {/* Big Discount Value */}
                <div className="my-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Nilai Manfaat:</span>
                    <strong className="text-xl font-bold font-mono text-amber-300 tabular-nums">
                      {voucher.discountValue}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Syarat:</span>
                    <span className="text-xs text-slate-200">{voucher.minTransaction}</span>
                  </div>
                </div>

                {/* Terms Preview */}
                <ul className="space-y-1 text-xs text-slate-400">
                  {voucher.terms.slice(0, 2).map((t, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Berlaku s/d {voucher.expiryDate}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(voucher.code)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
                    title="Salin Kode Voucher"
                  >
                    {copiedCode === voucher.code ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleClaim(voucher)}
                    className={`px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
                      isClaimed
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                    }`}
                  >
                    {isClaimed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Gift className="w-3.5 h-3.5" />}
                    <span>{isClaimed ? 'Sudah Diklaim' : 'Klaim Voucher'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Claimed Modal / Instructions */}
      {selectedVoucherForModal && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-600/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h4 className="text-base font-bold text-white">
                Voucher Berhasil Diaktifkan: {selectedVoucherForModal.title}
              </h4>
            </div>
            <button
              onClick={() => setSelectedVoucherForModal(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Tutup Rincian
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono">
              <span className="text-slate-500 block text-[10px]">KODE REDEEM:</span>
              <strong className="text-amber-300 text-base font-bold">{selectedVoucherForModal.code}</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono">
              <span className="text-slate-500 block text-[10px]">NILAI MANFAAT:</span>
              <strong className="text-emerald-400 text-base font-bold">{selectedVoucherForModal.discountValue}</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">PENUKARAN:</span>
              <span className="text-slate-200">Ketik kode saat pendaftaran di UPIC / Mitra Travel</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 space-y-1">
            <strong>Syarat & Ketentuan Lengkap:</strong>
            {selectedVoucherForModal.terms.map((t, i) => (
              <p key={i} className="pl-3 border-l border-emerald-500 text-slate-300">{t}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
