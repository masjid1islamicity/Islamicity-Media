import React, { useState, useEffect } from 'react';
import { NavTab, DonationRecord } from './types/islamicity';
import { Header } from './components/Header';
import { LiveTvRadioSection } from './components/LiveTvRadioSection';
import { PrayerTimeSchedulerSection } from './components/PrayerTimeSchedulerSection';
import { QiblaCompassSection } from './components/QiblaCompassSection';
import { SholawatSection } from './components/SholawatSection';
import { ZakatCalculatorSection } from './components/ZakatCalculatorSection';
import { QrisDonationModal } from './components/QrisDonationModal';
import { EducationArticlesSection } from './components/EducationArticlesSection';
import { CommunityForumSection } from './components/CommunityForumSection';
import { SimpulDirectorySection } from './components/SimpulDirectorySection';
import { AnalyticsUpicDashboard } from './components/AnalyticsUpicDashboard';
import { VoucherHajiSection } from './components/VoucherHajiSection';
import { MosqueMapSection } from './components/MosqueMapSection';
import { NotificationModal } from './components/NotificationModal';
import { InAppToast, ToastMessage } from './components/InAppToast';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('tv-radio');
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState<boolean>(false);
  const [isQrisModalOpen, setIsQrisModalOpen] = useState<boolean>(false);
  const [qrisInitialAmount, setQrisInitialAmount] = useState<number>(100000);
  const [qrisInitialCategory, setQrisInitialCategory] = useState<string>('infaq');
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);
  const [activeToast, setActiveToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    const handleQuotaExceeded = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Persistent Sholawat Count
  const [sholawatCount, setSholawatCount] = useState<number>(() => {
    const saved = localStorage.getItem('islamicity_sholawat_total');
    return saved ? parseInt(saved, 10) : 1428960;
  });

  useEffect(() => {
    localStorage.setItem('islamicity_sholawat_total', sholawatCount.toString());
  }, [sholawatCount]);

  const handleIncrementSholawat = (amount = 1) => {
    setSholawatCount(prev => prev + amount);
  };

  const handleOpenQrisModal = (amount = 100000, category = 'infaq') => {
    setQrisInitialAmount(amount);
    setQrisInitialCategory(category);
    setIsQrisModalOpen(true);
  };

  const handlePayZakatFromCalculator = (amount: number, typeLabel: string) => {
    setQrisInitialAmount(amount);
    setQrisInitialCategory('zakat');
    setIsQrisModalOpen(true);
  };

  const handleRecordDonation = (record: DonationRecord) => {
    console.log('Donation recorded:', record);
  };

  const handleShowToast = (title: string, message: string, type: 'prayer' | 'kajian' | 'info' = 'info') => {
    setActiveToast({
      id: Date.now().toString(),
      title,
      message,
      type
    });
    setTimeout(() => {
      setActiveToast(null);
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {mapsQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-[60] shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Universal Top Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenQris={() => handleOpenQrisModal(100000, 'infaq')}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        sholawatCount={sholawatCount}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'tv-radio' && (
          <LiveTvRadioSection
            onOpenQrisWithAmount={(amt, cat) => handleOpenQrisModal(amt, cat)}
          />
        )}

        {activeTab === 'jadwal-sholat' && (
          <PrayerTimeSchedulerSection />
        )}

        {activeTab === 'kompas-kiblat' && (
          <QiblaCompassSection />
        )}

        {activeTab === 'peta-masjid' && (
          <MosqueMapSection />
        )}

        {activeTab === 'sholawat' && (
          <SholawatSection
            sholawatCount={sholawatCount}
            onIncrementSholawat={handleIncrementSholawat}
          />
        )}

        {activeTab === 'zakat-qris' && (
          <ZakatCalculatorSection
            onPayZakat={handlePayZakatFromCalculator}
          />
        )}

        {activeTab === 'edukasi' && (
          <EducationArticlesSection />
        )}

        {activeTab === 'komunitas' && (
          <CommunityForumSection />
        )}

        {activeTab === 'simpul-umat' && (
          <SimpulDirectorySection />
        )}

        {activeTab === 'analitik-upic' && (
          <AnalyticsUpicDashboard
            sholawatCount={sholawatCount}
          />
        )}

        {activeTab === 'voucher-haji' && (
          <VoucherHajiSection />
        )}
      </main>

      {/* QRIS & BSI Integrated Payment Modal */}
      <QrisDonationModal
        isOpen={isQrisModalOpen}
        onClose={() => setIsQrisModalOpen(false)}
        initialAmount={qrisInitialAmount}
        initialCategory={qrisInitialCategory}
        onRecordDonation={handleRecordDonation}
      />

      {/* Push Notification Service Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        onShowInAppToast={(title, message) => handleShowToast(title, message)}
      />

      {/* In-App Floating Toast Alert */}
      <InAppToast
        toast={activeToast}
        onDismiss={() => setActiveToast(null)}
      />

      {/* Footer */}
      <Footer onSelectTab={setActiveTab} />
    </div>
  );
}
