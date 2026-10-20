import React, { useState, useEffect } from 'react';
import { NavTab } from '../types/islamicity';
import { 
  Tv, 
  Heart, 
  Calculator, 
  BookOpen, 
  Users, 
  Network, 
  BarChart3, 
  Gift, 
  Radio, 
  Clock, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Menu,
  X,
  Compass,
  Bell
} from 'lucide-react';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenQris: () => void;
  onOpenNotifications: () => void;
  sholawatCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenQris,
  onOpenNotifications,
  sholawatCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isRadioPlaying, setIsRadioPlaying] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-emerald-900/30">
      {/* Top Notification / Prayer & Sholawat Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-800/20 text-xs px-4 py-1.5 flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap py-0.5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>GLOBAL.MEDIA.ISLAMICITY.TV</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div 
            onClick={() => onSelectTab('jadwal-sholat')}
            className="hidden md:flex items-center gap-3 text-slate-400 text-[11px] cursor-pointer hover:text-emerald-300 transition-colors"
            title="Klik untuk melihat Jadwal Sholat Lengkap"
          >
            <span>Jadwal Sholat Hari Ini:</span>
            <span>Subuh <strong className="text-slate-200">04:32</strong></span>
            <span>Dzuhur <strong className="text-slate-200">11:54</strong></span>
            <span>Ashar <strong className="text-slate-200">15:10</strong></span>
            <span>Maghrib <strong className="text-slate-200">17:59</strong></span>
            <span>Isya <strong className="text-slate-200">19:10</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] tabular-nums">
            <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="hidden sm:inline">Total Sholawat:</span>
            <strong>{sholawatCount.toLocaleString('id-ID')}</strong>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-[11px] font-mono tabular-nums pl-2 border-l border-slate-800">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>{currentTime || '09:00:00 WIB'}</span>
          </div>
        </div>
      </div>

      {/* Main Top Bar strictly obeying 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <button 
            onClick={() => onSelectTab('tv-radio')}
            className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600/30 transition-colors">
              <Tv className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                Islamicity Media
              </span>
              <span className="block text-[10px] text-emerald-400/80 uppercase tracking-widest font-mono">
                City Media & Global TV
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 text-sm font-medium text-slate-300">
            <button
              onClick={() => onSelectTab('tv-radio')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'tv-radio'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Live TV & Radio
            </button>
            <button
              onClick={() => onSelectTab('jadwal-sholat')}
              className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'jadwal-sholat'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Jadwal Sholat</span>
            </button>
            <button
              onClick={() => onSelectTab('kompas-kiblat')}
              className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'kompas-kiblat'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kompas Kiblat</span>
            </button>
            <button
              onClick={() => onSelectTab('zakat-qris')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'zakat-qris'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Zakat & QRIS
            </button>
            <button
              onClick={() => onSelectTab('sholawat')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'sholawat'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Jutaan Sholawat
            </button>
            <button
              onClick={() => onSelectTab('edukasi')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'edukasi'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Edukasi Islamicity
            </button>
            <button
              onClick={() => onSelectTab('komunitas')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'komunitas'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Forum Umat
            </button>
            <button
              onClick={() => onSelectTab('simpul-umat')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'simpul-umat'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Simpul Pejuang
            </button>
            <button
              onClick={() => onSelectTab('analitik-upic')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'analitik-upic'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Analitik & UPIC Limo
            </button>
            <button
              onClick={() => onSelectTab('voucher-haji')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'voucher-haji'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Voucher Haji
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Utility Icons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenNotifications}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors relative"
              title="Pengaturan Notifikasi & Pengingat Adzan"
              aria-label="Buka Pengaturan Notifikasi"
            >
              <Bell className="w-4 h-4 text-emerald-400" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
            </button>

            <button
              onClick={onOpenQris}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-emerald-400 rounded-lg hover:from-amber-300 hover:to-emerald-300 transition-all shadow-md shadow-emerald-950 whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Infaq & Zakat QRIS</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/95 border-b border-emerald-900/40 px-4 py-3 space-y-1">
          <button
            onClick={() => { onSelectTab('tv-radio'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
              activeTab === 'tv-radio' ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Tv className="w-4 h-4" /> Live TV & Radio ARTVISI
          </button>
          <button
            onClick={() => { onSelectTab('jadwal-sholat'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
              activeTab === 'jadwal-sholat' ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" /> Jadwal Waktu Sholat
          </button>
          <button
            onClick={() => { onSelectTab('kompas-kiblat'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
              activeTab === 'kompas-kiblat' ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" /> Kompas Kiblat Magnetometer
          </button>
          <button
            onClick={() => { onSelectTab('zakat-qris'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
              activeTab === 'zakat-qris' ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" /> Kalkulator Zakat & QRIS
          </button>
          <button
            onClick={() => { onSelectTab('sholawat'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
              activeTab === 'sholawat' ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Heart className="w-4 h-4" /> Gerakan Jutaan Sholawat
          </button>
          <button
            onClick={() => { onSelectTab('edukasi'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
              activeTab === 'edukasi' ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Edukasi & Konsep Islamicity
          </button>
          <button
            onClick={() => { onSelectTab('komunitas'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
              activeTab === 'komunitas' ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" /> Diskusi & Forum Umat
          </button>
          <button
            onClick={() => { onSelectTab('simpul-umat'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
              activeTab === 'simpul-umat' ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Network className="w-4 h-4" /> Direktori Simpul Pejuang (700+)
          </button>
          <button
            onClick={() => { onSelectTab('analitik-upic'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
              activeTab === 'analitik-upic' ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Analitik Dampak & BEP UPIC Limo
          </button>
          <button
            onClick={() => { onSelectTab('voucher-haji'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
              activeTab === 'voucher-haji' ? 'bg-emerald-900/40 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Gift className="w-4 h-4" /> Voucher Belanja Haji & Hadiah
          </button>
          <button
            onClick={() => { onOpenNotifications(); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 text-amber-300 hover:bg-slate-800 border-t border-slate-800/80 mt-1"
          >
            <Bell className="w-4 h-4 text-emerald-400" /> Pengaturan Notifikasi Web & Adzan
          </button>
        </div>
      )}
    </header>
  );
};
