import React, { useState } from 'react';
import { ChannelItem } from '../types/islamicity';
import { CHANNELS_DATA } from '../data/channels';
import { 
  Tv, 
  Radio, 
  Volume2, 
  VolumeX, 
  Users, 
  Share2, 
  Send, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Maximize2
} from 'lucide-react';

interface LiveTvRadioSectionProps {
  onOpenQrisWithAmount?: (amount: number, category: string) => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  city: string;
  text: string;
  time: string;
}

export const LiveTvRadioSection: React.FC<LiveTvRadioSectionProps> = ({
  onOpenQrisWithAmount
}) => {
  const [channels] = useState<ChannelItem[]>(CHANNELS_DATA);
  const [selectedChannel, setSelectedChannel] = useState<ChannelItem>(CHANNELS_DATA[0]);
  const [filterType, setFilterType] = useState<'all' | 'tv' | 'radio'>('all');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [copiedBank, setCopiedBank] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');

  const [liveChatMessages, setLiveChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'Abu Fauzan', city: 'Depok', text: 'Alhamdulillah Makkah TV jernih sekali, semoga dimudahkan berhaji sekeluarga.', time: '09:12' },
    { id: '2', sender: 'Umi Salamah', city: 'Padang', text: 'Surau TV dan Rodja TV selalu jadi rujukan kajian fiqih keluarga kami.', time: '09:14' },
    { id: '3', sender: 'Cak Nur', city: 'Surabaya', text: 'Salam dakwah untuk seluruh simpul umat dan relawan peradaban akhlaq.', time: '09:15' },
    { id: '4', sender: 'Ibrahim R.', city: 'Makassar', text: 'Allahumma Shalli \'Ala Sayyidina Muhammad wa \'Ala Aali Sayyidina Muhammad.', time: '09:18' }
  ]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'Sahabat Islamicity',
      city: 'Indonesia',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setLiveChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  const handleCopyBsi = () => {
    navigator.clipboard.writeText('7888819198');
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const filteredChannels = channels.filter(ch => {
    if (filterType === 'all') return true;
    return ch.type === filterType;
  });

  return (
    <div className="space-y-8">
      {/* Hero Stream Banner & Main Broadcast Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Main Player Display Area (8 cols) */}
          <div className="lg:col-span-8 bg-black flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
            <div className="relative aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center">
              {/* Background Backdrop Image */}
              <img
                src={selectedChannel.id.includes('makkah') || selectedChannel.id.includes('madinah')
                  ? '/src/assets/images/holy_sanctuary_makkah_madinah_1792488059039.jpg'
                  : '/src/assets/images/islamicity_media_broadcast_1792488058736.jpg'
                }
                alt={selectedChannel.name}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-75 scale-105 transition-transform duration-700"
              />

              {/* Player Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-between p-4 sm:p-6">
                {/* Channel Header inside Player */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-red-600 text-white flex items-center gap-1 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      LIVE
                    </span>
                    <span className="text-xs text-slate-300 font-mono hidden sm:inline">
                      {selectedChannel.freqOrBandwidth}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-200">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-mono tabular-nums">{selectedChannel.viewers.toLocaleString('id-ID')}</span> pemirsa
                    </span>
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 rounded bg-black/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                      title={isMuted ? 'Nyalakan Audio' : 'Bisukan'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  </div>
                </div>

                {/* Center Audio/Video Visualizer or Station Banner */}
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 text-emerald-300 mb-3 backdrop-blur-sm shadow-inner">
                    {selectedChannel.type === 'tv' ? <Tv className="w-8 h-8" /> : <Radio className="w-8 h-8" />}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-md">
                    {selectedChannel.name}
                  </h2>
                  <p className="text-sm text-emerald-300/90 max-w-md mx-auto mt-1 font-medium">
                    {selectedChannel.tagline}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    {selectedChannel.location} · {selectedChannel.artvisiMember ? 'Anggota Resmi ARTVISI' : 'Jejaring City Media'}
                  </p>
                </div>

                {/* Bottom Stream Player Controls Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Transmisi Siaran HD Tanpa Iklan Komersial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: selectedChannel.name,
                            text: `Saksikan siaran dakwah ${selectedChannel.name} di Islamicity Media:`,
                            url: window.location.href,
                          }).catch(() => {});
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Tautan siaran berhasil disalin ke clipboard!');
                        }
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Bagikan Siaran</span>
                    </button>
                    <a
                      href="http://live.artvisi.or.id/select-channel.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded bg-emerald-600/80 hover:bg-emerald-600 text-white transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Web ARTVISI</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Channel Info & Sinopsis */}
            <div className="p-4 sm:p-5 bg-slate-900/90 text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                    <span>{selectedChannel.name}</span>
                    <span className="text-xs font-normal text-slate-400">({selectedChannel.category})</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {selectedChannel.description}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => onOpenQrisWithAmount && onOpenQrisWithAmount(50000, 'artvisi')}
                    className="px-3 py-1.5 text-xs font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors whitespace-nowrap"
                  >
                    Dukung Operasional TV Ini
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Live Chat Room for Viewers (4 cols) */}
          <div className="lg:col-span-4 flex flex-col h-full max-h-[580px] bg-slate-950/60 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Komentar & Doa Pemirsa
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Real-time</span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
              {liveChatMessages.map((msg) => (
                <div key={msg.id} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-emerald-400">{msg.sender}</span>
                    <span className="text-slate-500">{msg.city} · {msg.time}</span>
                  </div>
                  <p className="text-slate-300 leading-snug">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="pt-2 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Tulis salam, doa, atau tanggapan..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center justify-center shrink-0"
                aria-label="Kirim pesan"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ARTVISI Official Notice & Donation Support Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/70 border border-emerald-800/30 rounded-xl p-5 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-8 space-y-2">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold tracking-wider uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ARTVISI - Asosiasi Radio Televisi Islam Indonesia</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Dukungan Operasional Dakwah ARTVISI & 70+ Lembaga Penyiaran Sunnah
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Dukung operasional penyiaran dakwah radio dan televisi Islam se-Indonesia melalui transfer rekening resmi:
              <strong className="text-amber-300 ml-1">Bank Syariah Mandiri (BSI) No. Rek: 7 8888 1919 8</strong> (Kode Bank: 451).
            </p>
            <div className="text-xs text-slate-400">
              Konfirmasi donasi via WhatsApp/SMS ke: <span className="font-mono text-emerald-300 font-semibold">0822 2882 1515</span> dengan format:
              <code className="ml-1 px-1.5 py-0.5 rounded bg-slate-900 text-slate-200 border border-slate-700">LIVEARTVISI#Nama#Alamat#JMLTransfer</code>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-2.5 justify-center">
            <button
              onClick={handleCopyBsi}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-100 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {copiedBank ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copiedBank ? 'No. Rekening Berhasil Disalin!' : 'Salin Rek. BSI 7888819198'}</span>
            </button>
            <button
              onClick={() => onOpenQrisWithAmount && onOpenQrisWithAmount(100000, 'artvisi')}
              className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Infaq Operasional via QRIS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Channel Grid Selection */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white">Daftar Kanal TV & Radio Islami</h3>
            <p className="text-xs text-slate-400">
              Akses siaran langsung 24 jam tanpa install aplikasi dan didukung seluruh web browser.
            </p>
          </div>

          {/* Interactive filter control */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterType === 'all' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua ({channels.length})
            </button>
            <button
              onClick={() => setFilterType('tv')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterType === 'tv' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Televisi ({channels.filter(c => c.type === 'tv').length})
            </button>
            <button
              onClick={() => setFilterType('radio')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterType === 'radio' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Radio ({channels.filter(c => c.type === 'radio').length})
            </button>
          </div>
        </div>

        {/* Channels Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredChannels.map((channel) => {
            const isCurrent = selectedChannel.id === channel.id;
            return (
              <div
                key={channel.id}
                onClick={() => {
                  setSelectedChannel(channel);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className={`group cursor-pointer rounded-xl p-4 transition-all border ${
                  isCurrent
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-950/50'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm tracking-wide ${
                      isCurrent 
                        ? 'bg-emerald-500 text-slate-950' 
                        : 'bg-slate-800 text-emerald-400 border border-slate-700'
                    }`}>
                      {channel.logoText}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100 group-hover:text-emerald-400 transition-colors text-sm">
                        {channel.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {channel.location}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    channel.type === 'tv'
                      ? 'bg-blue-900/50 text-blue-300 border border-blue-700/40'
                      : 'bg-amber-900/50 text-amber-300 border border-amber-700/40'
                  }`}>
                    {channel.type.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                  {channel.tagline}
                </p>

                <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-mono tabular-nums">
                    <Users className="w-3 h-3 text-emerald-400" />
                    {channel.viewers.toLocaleString('id-ID')}
                  </span>
                  <span className="text-emerald-400 font-medium group-hover:underline">
                    {isCurrent ? 'Sedang Diputar' : 'Tonton Siaran →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
