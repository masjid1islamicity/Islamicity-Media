import React from 'react';
import { NavTab } from '../types/islamicity';
import { Tv, Radio, ShieldCheck, Heart, MapPin, ExternalLink } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Tv className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Islamicity Media
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Infrastruktur platform dan superaplikasi dakwah, edukasi peradaban, zakat & wakaf, dan komunitas digital terpadu menuju Baldatun Thoyyibatun wa Rabbun Ghofur.
            </p>
            <div className="text-[11px] text-emerald-400/80 font-mono">
              Induk Sosialisasi Legalitas Aset Manajemen & Tatanan Umat
            </div>
          </div>

          {/* Network Portals */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Jejaring Portal Resmi
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="http://global.media.islamicity.tv" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>global.media.islamicity.tv</span>
                </a>
              </li>
              <li>
                <a href="http://live.media.islamicity.tv" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>live.media.islamicity.tv</span>
                </a>
              </li>
              <li>
                <a href="http://podcast.islamicity.tv" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>podcast.islamicity.tv</span>
                </a>
              </li>
              <li>
                <a href="http://qris.media.islamicity.tv" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>qris.media.islamicity.tv</span>
                </a>
              </li>
              <li>
                <a href="http://towers5.islamicity.tv" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>towers5.islamicity.tv (Wakaf Menara 5)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Fitur Utama */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Layanan Terpadu
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onSelectTab('tv-radio')} className="hover:text-emerald-400 transition-colors">
                  Live TV & Radio ARTVISI (15+ Channel)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('jadwal-sholat')} className="hover:text-emerald-400 transition-colors">
                  Jadwal Waktu Sholat & Imsakiyah
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('kompas-kiblat')} className="hover:text-emerald-400 transition-colors">
                  Kompas Kiblat Magnetometer Presisi
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('zakat-qris')} className="hover:text-emerald-400 transition-colors">
                  Kalkulator Zakat & Pembayaran QRIS
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('sholawat')} className="hover:text-emerald-400 transition-colors">
                  Gerakan Jutaan Sholawat Maulid Nabi
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('simpul-umat')} className="hover:text-emerald-400 transition-colors">
                  700+ Direktori Simpul Pejuang Umat
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('analitik-upic')} className="hover:text-emerald-400 transition-colors">
                  Analitik Dampak & BEP UPIC Limo
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('voucher-haji')} className="hover:text-emerald-400 transition-colors">
                  Voucher Belanja Haji & Terapi Limo
                </button>
              </li>
            </ul>
          </div>

          {/* ARTVISI & Sentra UPIC */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Sentra Dakwah & Rekening Resmi
            </h4>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1 text-xs">
              <div className="font-semibold text-slate-200">ARTVISI Indonesia</div>
              <div className="text-slate-400 font-mono">Bank Syariah Mandiri (BSI):</div>
              <div className="text-amber-300 font-bold font-mono">7 8888 1919 8 (Kode 451)</div>
              <div className="text-[11px] text-slate-400">Konfirmasi WA: 0822 2882 1515</div>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>UPIC Limo, Kota Depok, Jawa Barat</span>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            Copyright © 1448 H / 2026 M Islamicity Media Global. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              <span>Menebar Akhlaq Karimah & Kebajikan Umat</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
