import React, { useState } from 'react';
import { ForumPost } from '../types/islamicity';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Send, 
  Sparkles, 
  PlusCircle, 
  Tag, 
  Clock, 
  MapPin,
  HelpCircle,
  X
} from 'lucide-react';

export const CommunityForumSection: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: 'post-1',
      author: 'Ust. Zulkifli Rahman',
      avatar: 'ZR',
      role: 'Dewan Syariah',
      city: 'Jakarta',
      timeAgo: '2 jam yang lalu',
      title: 'Bagaimana Menghidupkan Koperasi Berbasis Mudarabah di Lingkungan Masjid?',
      content: 'Assalamu’alaikum warahmatullah. Pengurus masjid seringkali memiliki dana kas infaq mengendap di bank umum. Padahal jika dioptimalkan melalui akad Mudarabah untuk modal pedagang kecil di sekitar masjid, dampaknya sangat besar bagi kemandirian ekonomi umat.',
      category: 'Ekonomi Syariah',
      likes: 42,
      repliesCount: 3,
      replies: [
        {
          id: 'rep-1',
          author: 'H. Suryadi (UPIC Limo)',
          role: 'Pengurus UPIC',
          content: 'Wa\'alaikumsalam ustadz. Di Limo kami sudah mulai dengan pembiayaan gerobak berkah syariah tanpa bunga dan pendampingan thibbun nabawi. Sangat efektif.',
          timeAgo: '1 jam yang lalu'
        },
        {
          id: 'rep-2',
          author: 'Dr. Ilham Akbar',
          role: 'Pakar Finansial',
          content: 'Sangat setuju. Perlu ada standardisasi SOP pencatatan keuangan dan monitoring agar amanah tetap terjaga.',
          timeAgo: '45 menit yang lalu'
        }
      ]
    },
    {
      id: 'post-2',
      author: 'Ahmad Fauzi',
      avatar: 'AF',
      role: 'Relawan Media',
      city: 'Depok',
      timeAgo: '5 jam yang lalu',
      title: 'Optimalisasi Live Streaming Kajian Subuh dengan Biaya Rendah (Low-Cost Setup)',
      content: 'Untuk rekan-rekan pengurus media di tingkat kecamatan dan masjid, kita tidak butuh alat mahal. Cukup HP dengan mic lavalier clip-on Rp 300rb dan ring light mini, siaran sudah sangat jernih dan nyaman didengar pemirsa.',
      category: 'UPIC Hyperlocal',
      likes: 28,
      repliesCount: 1,
      replies: [
        {
          id: 'rep-3',
          author: 'Reza Pahlevi',
          role: 'Kreator Dakwah',
          content: 'Betul sekali akhi, kuncinya ada pada konsistensi jadwal dan kualitas audio yang tidak bising.',
          timeAgo: '3 jam yang lalu'
        }
      ]
    },
    {
      id: 'post-3',
      author: 'Fathimah Zahra',
      avatar: 'FZ',
      role: 'Pendidik Santri',
      city: 'Bandung',
      timeAgo: '1 hari yang lalu',
      title: 'Tanya Ustadz: Hukum Penggunaan Zakat untuk Infrastruktur Dakwah Digital?',
      content: 'Bolehkah zakat dialokasikan untuk pembiayaan server live streaming TV dakwah atau beasiswa santri coding di Pesantren Digital? Mohon pencerahan asatidz.',
      category: 'Tanya Ustadz',
      likes: 35,
      repliesCount: 1,
      replies: [
        {
          id: 'rep-4',
          author: 'KH. Shobirin',
          role: 'Asatidz Fiqih',
          content: 'Berdasarkan fatwa sebagian ulama kontemporer dan asnaf Fi Sabilillah, penyebaran ilmu syariah melalui media digital yang membela peradaban Islam termasuk dalam makna luas jihad fi sabilillah, terutama bila manfaatnya mengentaskan kebodohan dan kemiskinan umat.',
          timeAgo: '18 jam yang lalu'
        }
      ]
    }
  ]);

  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'Dakwah & Akhlaq' | 'Ekonomi Syariah' | 'Kemandirian Umat' | 'UPIC Hyperlocal' | 'Tanya Ustadz'>('Dakwah & Akhlaq');
  const [replyInputs, setReplyInputs] = useState<{ [postId: string]: string }>({});
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);

  const categories = ['Semua', 'Ekonomi Syariah', 'UPIC Hyperlocal', 'Tanya Ustadz', 'Dakwah & Akhlaq', 'Kemandirian Umat'];

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: ForumPost = {
      id: 'post-' + Date.now(),
      author: 'Sahabat Beriman',
      avatar: 'SB',
      role: 'Jamaah Aktif',
      city: 'Indonesia',
      timeAgo: 'Baru saja',
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      likes: 1,
      repliesCount: 0,
      replies: []
    };

    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setIsNewPostModalOpen(false);
  };

  const handleSendReply = (postId: string) => {
    const text = replyInputs[postId];
    if (!text || !text.trim()) return;

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const newReply = {
          id: 'rep-' + Date.now(),
          author: 'Anda (Jamaah)',
          role: 'Peserta Diskusi',
          content: text.trim(),
          timeAgo: 'Baru saja'
        };
        return {
          ...p,
          repliesCount: p.repliesCount + 1,
          replies: [...(p.replies || []), newReply]
        };
      }
      return p;
    }));

    setReplyInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const filteredPosts = posts.filter(post => {
    if (activeCategory === 'Semua') return true;
    return post.category === activeCategory;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            <span>Forum Diskusi Interaktif & Konsultasi Syariah</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Ruang musyawarah jamaah, tanya ustadz, dan kolaborasi program kemandirian ekonomi umat.
          </p>
        </div>

        <button
          onClick={() => setIsNewPostModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buka Topik Diskusi Baru</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Stream */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="p-5 sm:p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4 transition-all"
          >
            {/* Author info & Metadata */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-950 border border-emerald-600/40 text-emerald-400 font-bold text-xs flex items-center justify-center">
                  {post.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{post.author}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {post.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" /> {post.city}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" /> {post.timeAgo}
                    </span>
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/40">
                {post.category}
              </span>
            </div>

            {/* Post Content */}
            <div className="space-y-2">
              <h4 className="text-base font-bold text-slate-100">
                {post.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {post.content}
              </p>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleLike(post.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 flex items-center gap-1.5 transition-colors font-mono tabular-nums"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{post.likes} Dukungan</span>
                </button>
                <button
                  onClick={() => setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 flex items-center gap-1.5 transition-colors font-mono tabular-nums"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>{post.repliesCount} Tanggapan</span>
                </button>
              </div>

              <button
                onClick={() => setActiveReplyPostId(post.id)}
                className="text-emerald-400 hover:underline text-xs font-semibold"
              >
                Beri Tanggapan
              </button>
            </div>

            {/* Replies List */}
            {post.replies && post.replies.length > 0 && (
              <div className="pt-2 pl-4 border-l-2 border-slate-800 space-y-2.5">
                {post.replies.map((rep) => (
                  <div key={rep.id} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-200">{rep.author}</strong>
                        <span className="text-[10px] text-slate-400">({rep.role})</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{rep.timeAgo}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{rep.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input Form */}
            {activeReplyPostId === post.id && (
              <div className="pt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Tulis tanggapan atau solusi beradab..."
                  value={replyInputs[post.id] || ''}
                  onChange={(e) => setReplyInputs({ ...replyInputs, [post.id]: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => handleSendReply(post.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Buat Topik Baru */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-emerald-800/50 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsNewPostModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">
                Buka Topik Musyawarah Baru
              </h3>
            </div>

            <form onSubmit={handleAddPost} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Kategori Diskusi</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Dakwah & Akhlaq">Dakwah & Akhlaq</option>
                  <option value="Ekonomi Syariah">Ekonomi Syariah</option>
                  <option value="Kemandirian Umat">Kemandirian Umat</option>
                  <option value="UPIC Hyperlocal">UPIC Hyperlocal</option>
                  <option value="Tanya Ustadz">Tanya Ustadz</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Judul Topik / Pertanyaan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Solusi Pembiayaan Syariah Tanpa Bunga untuk Warung Jamaah"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Isi Pesan / Penjelasan Lengkap</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Uraikan gagasan, latar belakang masalah, atau pertanyaan fiqih Anda secara santun..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
                >
                  Terbitkan ke Forum Umat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
