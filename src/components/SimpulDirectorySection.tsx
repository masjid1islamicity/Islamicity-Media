import React, { useState } from 'react';
import { SIMPUL_NODES_DATA } from '../data/simpulPejuang';
import { SimpulNode } from '../types/islamicity';
import { 
  Network, 
  Search, 
  Users, 
  MapPin, 
  CheckCircle2, 
  UserPlus, 
  ExternalLink,
  Phone,
  ShieldCheck,
  Building,
  PlusCircle,
  X
} from 'lucide-react';

export const SimpulDirectorySection: React.FC = () => {
  const [nodes, setNodes] = useState<SimpulNode[]>(SIMPUL_NODES_DATA);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedProvince, setSelectedProvince] = useState<string>('Semua');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);

  // New registration form state
  const [newName, setNewName] = useState<string>('');
  const [newRegion, setNewRegion] = useState<string>('');
  const [newProvince, setNewProvince] = useState<string>('Jawa Barat');
  const [newCategory, setNewCategory] = useState<'Relawan' | 'Alumni' | 'Profesi' | 'Pakar' | 'Perempuan' | 'Santri & Ulama'>('Relawan');
  const [newContact, setNewContact] = useState<string>('');
  const [newCount, setNewCount] = useState<number>(250);
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState<string>('');

  const categories = ['Semua', 'Relawan', 'Alumni', 'Profesi', 'Pakar', 'Perempuan', 'Santri & Ulama'];
  
  const provinces = [
    'Semua',
    'DKI Jakarta',
    'Jawa Barat',
    'Jawa Tengah',
    'Jawa Timur',
    'DI Yogyakarta',
    'Banten',
    'Sumatera Utara',
    'Sumatera Barat',
    'Sumatera Selatan',
    'Aceh',
    'Riau',
    'Lampung',
    'Sulawesi Selatan',
    'Sulawesi Tengah',
    'Kalimantan Selatan',
    'Kalimantan Barat',
    'Nusa Tenggara Barat',
    'Luar Negeri'
  ];

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = 
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'Semua' || node.category === selectedCategory;
    const matchesProvince = selectedProvince === 'Semua' || node.province === selectedProvince;

    return matchesSearch && matchesCategory && matchesProvince;
  });

  const handleRegisterNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newContact.trim()) return;

    const newNode: SimpulNode = {
      id: Date.now(),
      name: newName.trim(),
      region: newRegion.trim() || 'Kecamatan / Kota',
      province: newProvince,
      category: newCategory,
      contactPerson: newContact.trim(),
      memberCount: Number(newCount) || 100,
      isVerified: true
    };

    setNodes(prev => [newNode, ...prev]);
    setRegisterSuccessMessage(`Simpul "${newNode.name}" berhasil didaftarkan di jejaring register.islamicity.tv!`);
    setTimeout(() => {
      setIsRegisterModalOpen(false);
      setRegisterSuccessMessage('');
      setNewName('');
      setNewContact('');
    }, 2000);
  };

  const totalMembers = nodes.reduce((acc, curr) => acc + curr.memberCount, 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header & Registration Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Network className="w-6 h-6 text-emerald-400" />
            <span>Direktori Simpul Pejuang Umat (700+ Jaringan Nasional)</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Induk sosialisasi dan jejaring kolaborasi pejuang akhlaq, ulama, alumni, profesional, dan relawan menuju kebangkitan umat.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Daftar Simpul Baru (register.islamicity.tv)</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <span className="text-[11px] text-slate-400 block">Total Simpul Terdata:</span>
          <strong className="text-lg sm:text-xl font-mono text-emerald-400 font-bold tabular-nums">
            {nodes.length} Simpul
          </strong>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block">Estimasi Relawan Aktif:</span>
          <strong className="text-lg sm:text-xl font-mono text-amber-300 font-bold tabular-nums">
            {totalMembers.toLocaleString('id-ID')} Jiwa
          </strong>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block">Cakupan Wilayah:</span>
          <strong className="text-lg sm:text-xl font-mono text-slate-200 font-bold tabular-nums">
            38 Provinsi & Diaspora
          </strong>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block">Verifikasi Legalitas:</span>
          <strong className="text-lg sm:text-xl font-mono text-blue-400 font-bold tabular-nums">
            100% Sah & Amanah
          </strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama simpul (contoh: Jarnas, ABRI-1, Sobat Anies, UPIC Limo)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Province Filter */}
          <div className="md:col-span-6">
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {provinces.map((prov) => (
                <option key={prov} value={prov}>
                  Provinsi: {prov}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Simpul Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNodes.map((node) => (
          <div
            key={node.id}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4 className="font-bold text-white text-sm line-clamp-1">
                  {node.name}
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/30 whitespace-nowrap shrink-0">
                  {node.category}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{node.region} ({node.province})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Koordinator: <strong className="text-slate-300">{node.contactPerson}</strong></span>
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-slate-300 font-mono tabular-nums">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>{node.memberCount.toLocaleString('id-ID')} Anggota</span>
              </span>

              <button
                onClick={() => {
                  alert(`Telah terhubung dengan perwakilan "${node.name}". Silakan koordinasikan kegiatan dakwah dan program kemandirian umat.`);
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors flex items-center gap-1"
              >
                <span>Koordinasi →</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredNodes.length === 0 && (
        <div className="text-center py-12 bg-slate-900/40 rounded-xl border border-slate-800 text-slate-400 text-xs">
          Tidak ditemukan simpul dengan kata kunci "{searchTerm}". Silakan gunakan pencarian lain atau daftarkan simpul baru Anda.
        </div>
      )}

      {/* Modal Register Simpul Baru */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-emerald-800/50 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">
                Pendaftaran Simpul Pejuang (register.islamicity.tv)
              </h3>
            </div>

            {registerSuccessMessage ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500 text-emerald-300 text-center text-sm font-semibold">
                {registerSuccessMessage}
              </div>
            ) : (
              <form onSubmit={handleRegisterNode} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Nama Simpul / Komunitas / Majelis</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sahabat Anies Limo Mandiri"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Kabupaten / Kota</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Depok"
                      value={newRegion}
                      onChange={(e) => setNewRegion(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Provinsi</label>
                    <select
                      value={newProvince}
                      onChange={(e) => setNewProvince(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                    >
                      {provinces.filter(p => p !== 'Semua').map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Kategori</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                    >
                      {categories.filter(c => c !== 'Semua').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Perkiraan Jumlah Anggota</label>
                    <input
                      type="number"
                      value={newCount}
                      onChange={(e) => setNewCount(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Nama Koordinator & Kontak (WA)</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ust. Lukman (0812-xxxx-xxxx)"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
                  >
                    Kirim Pendaftaran ke Portal Pusat
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
