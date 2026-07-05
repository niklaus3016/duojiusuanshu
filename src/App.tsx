import React, { useState, useEffect } from 'react';
import { 
  Home, Calendar, Heart, Settings as SettingsIcon, Sparkles, 
  Plus, X, Bell, Info, ShieldAlert, CheckCircle, Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Anniversary, AppSettings } from './types';
import HomeView from './components/HomeView';
import AnniversariesView from './components/AnniversariesView';
import SettingsView from './components/SettingsView';
import AnniversaryModal from './components/AnniversaryModal';
import PosterModal from './components/PosterModal';
import AgreementModal from './components/AgreementModal';
import PrivacyPolicyContent from './components/PrivacyPolicyContent';
import UserAgreementContent from './components/UserAgreementContent';

// Mock Initial seed data for anniversaries if local storage is empty
const INITIAL_ANNIVERSARIES: Anniversary[] = [
  {
    id: 'seed-1',
    title: '考上理想大学纪念日',
    dateTime: '2022-09-01T08:00:00Z',
    type: 'custom',
    isPinned: true,
    icon: '🎓',
    category: 'past'
  },
  {
    id: 'seed-2',
    title: '下一次除夕守岁',
    dateTime: '2027-02-16T18:00:00Z', // 2027 Chinese Lunar New Year's Eve
    type: 'countdown',
    isPinned: false,
    icon: '🎉',
    category: 'future'
  },
  {
    id: 'seed-3',
    title: '第一次看日出契约',
    dateTime: '2023-05-20T05:20:00Z',
    type: 'love',
    isPinned: false,
    icon: '🌅',
    category: 'past'
  }
];

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'home' | 'anniversaries' | 'settings'>('home');

  // Load state from LocalStorage
  const [anniversaries, setAnniversaries] = useState<Anniversary[]>(() => {
    const saved = localStorage.getItem('duojiusuanshu_anniversaries');
    return saved ? JSON.parse(saved) : INITIAL_ANNIVERSARIES;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('duojiusuanshu_settings');
    return saved ? JSON.parse(saved) : {
      fontSize: 'base',
      theme: 'glass',
      nickname: '时光旅人',
      watermark: '多久算数'
    };
  });

  // Anniversary Dialogs control
  const [isAnniversaryModalOpen, setIsAnniversaryModalOpen] = useState(false);
  const [editingAnniversary, setEditingAnniversary] = useState<Anniversary | null>(null);

  // Poster Modal control
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [posterData, setPosterData] = useState({
    title: '',
    countValue: '',
    countUnit: '',
    subText: '',
    quote: ''
  });

  // ====== Privacy & User Agreement ======
  const PRIVACY_CONSENT_KEY = 'duojiusuanshu_privacy_consent';
  const [hasPrivacyConsent, setHasPrivacyConsent] = useState<boolean>(() => {
    try {
      return localStorage.getItem(PRIVACY_CONSENT_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(() => {
    try {
      return localStorage.getItem(PRIVACY_CONSENT_KEY) !== 'true';
    } catch {
      return true;
    }
  });
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [agreementModal, setAgreementModal] = useState<null | 'agreement' | 'privacy'>(null);

  // Open detail modal handlers
  const handleOpenAgreement = () => setAgreementModal('agreement');
  const handleOpenPrivacy = () => setAgreementModal('privacy');
  const handleCloseAgreement = () => setAgreementModal(null);

  // Accept: persist consent, allow app usage
  const handleAcceptPrivacy = () => {
    try {
      localStorage.setItem(PRIVACY_CONSENT_KEY, 'true');
    } catch {}
    setHasPrivacyConsent(true);
    setShowPrivacyModal(false);
  };

  // Decline: first show secondary confirm
  const handleDeclinePrivacy = () => setShowDeclineModal(true);
  const handleDeclineCancel = () => setShowDeclineModal(false);
  const handleDeclineConfirm = () => {
    // 用户明确拒绝：关闭二次确认，保持主隐私弹窗常驻
    setShowDeclineModal(false);
  };

  // Sync state to localStorage on modification
  useEffect(() => {
    localStorage.setItem('duojiusuanshu_anniversaries', JSON.stringify(anniversaries));
  }, [anniversaries]);

  useEffect(() => {
    localStorage.setItem('duojiusuanshu_settings', JSON.stringify(settings));
  }, [settings]);

  // Handle Save Anniversary (both add new and edit existing)
  const handleSaveAnniversary = (ann: Omit<Anniversary, 'id'> & { id?: string }) => {
    if (ann.id) {
      // Editing existing
      setAnniversaries(prev => prev.map(item => item.id === ann.id ? (ann as Anniversary) : item));
    } else {
      // Creating new
      const newAnn: Anniversary = {
        ...ann,
        id: `ann-${Date.now()}`
      };
      setAnniversaries(prev => [...prev, newAnn]);
    }
  };

  // Handle Delete Anniversary
  const handleDeleteAnniversary = (id: string) => {
    setAnniversaries(prev => prev.filter(item => item.id !== id));
  };

  // Toggle Pinned
  const handleTogglePin = (id: string) => {
    setAnniversaries(prev => prev.map(item => item.id === id ? { ...item, isPinned: !item.isPinned } : item));
  };

  // Wipe all data sandbox reset
  const handleClearAllData = () => {
    localStorage.clear();
    setAnniversaries(INITIAL_ANNIVERSARIES);
    setSettings({
      fontSize: 'base',
      theme: 'glass',
      nickname: '时光旅人',
      watermark: '多久算数'
    });
    setActiveTab('home');
    alert('本地缓存数据已被擦除重置，应用回到初始状态。');
  };

  // Map font-size setting to tailwind scaling classes
  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case 'sm': return 'text-xs md:text-sm';
      case 'lg': return 'text-base md:text-lg';
      case 'xl': return 'text-lg md:text-xl';
      default: return 'text-sm md:text-base';
    }
  };

  // Open edit modal directly
  const handleOpenEditModal = (ann?: Anniversary) => {
    if (ann) {
      setEditingAnniversary(ann);
    } else {
      setEditingAnniversary(null);
    }
    setIsAnniversaryModalOpen(true);
  };

  // Open poster builder helper
  const handleOpenPosterModal = (title: string, countValue: string, countUnit: string, subText: string, quote: string) => {
    setPosterData({ title, countValue, countUnit, subText, quote });
    setIsPosterModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#050510] font-sans text-slate-100 overflow-x-hidden select-none">
      
      {/* 1. Fluid moving background (frosted glass) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Deep background color gradients */}
        <div className="absolute inset-0 bg-[#050510]" />
        
        {/* Soft flowing glass spheres matching the Sophisticated Dark spec */}
        <div className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '15s' }} />
        <div className="absolute -bottom-[10%] -left-[10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '18s' }} />
      </div>

      {/* 2. Top App Bar - Android status bar & Title */}
      <header className="sticky top-0 z-40 w-full max-w-lg mx-auto bg-[#050510]/45 backdrop-blur-xl border-b border-white/10 py-4.5 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-purple-500/20 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <img src="/favicon-512.png" alt="多久算数 Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">多久算数</h1>
            <p className="text-[10px] text-slate-400 mt-0.5">用纯净的心灵，感悟光阴穿梭的浪漫刻度</p>
          </div>
        </div>
      </header>

      {/* 3. Main Screen View Container (Fluid single-column bento card layout) */}
      <main className="relative z-10 w-full max-w-lg mx-auto px-6 py-6 min-h-[calc(100vh-140px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {activeTab === 'home' && (
              <HomeView 
                onOpenAnniversaryModal={() => handleOpenEditModal()}
                onOpenPosterModal={handleOpenPosterModal}
                savedAnniversaries={anniversaries}
                onSaveAnniversary={handleSaveAnniversary}
                fontSizeClass={getFontSizeClass()}
              />
            )}
            
            {activeTab === 'anniversaries' && (
              <AnniversariesView 
                anniversaries={anniversaries}
                onOpenAnniversaryModal={handleOpenEditModal}
                onDeleteAnniversary={handleDeleteAnniversary}
                onTogglePin={handleTogglePin}
                onOpenPosterModal={handleOpenPosterModal}
                fontSizeClass={getFontSizeClass()}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView 
                settings={settings}
                onUpdateSettings={(val) => setSettings(prev => ({ ...prev, ...val }))}
                anniversaries={anniversaries}
                onClearAllData={handleClearAllData}
                fontSizeClass={getFontSizeClass()}
                onOpenPrivacyPolicy={handleOpenPrivacy}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Frosted Bottom Navigation Bar - Android layout */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#050510]/60 backdrop-blur-xl border-t border-white/10 py-2.5 shadow-2xl">
        <div className="max-w-lg mx-auto px-6 flex justify-around items-center">
          
          {/* Tab 1: Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-xl ${
              activeTab === 'home' ? 'text-blue-400 scale-102' : 'text-slate-400 hover:text-slate-200'
            }`}
            id="tab-home"
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'home' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' : ''}`}>
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold tracking-wide">首页</span>
          </button>

          {/* Tab 2: Anniversaries */}
          <button
            onClick={() => setActiveTab('anniversaries')}
            className={`flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-xl ${
              activeTab === 'anniversaries' ? 'text-blue-400 scale-102' : 'text-slate-400 hover:text-slate-200'
            }`}
            id="tab-anniversaries"
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'anniversaries' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' : ''}`}>
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold tracking-wide">纪念日</span>
          </button>

          {/* Tab 3: Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-xl ${
              activeTab === 'settings' ? 'text-blue-400 scale-102' : 'text-slate-400 hover:text-slate-200'
            }`}
            id="tab-settings"
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' : ''}`}>
              <SettingsIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold tracking-wide">设置</span>
          </button>

        </div>
      </nav>

      {/* 5. Anniversary/Countdown Editing Drawer Modal */}
      <AnniversaryModal 
        isOpen={isAnniversaryModalOpen}
        onClose={() => {
          setIsAnniversaryModalOpen(false);
          setEditingAnniversary(null);
        }}
        onSave={handleSaveAnniversary}
        editingAnniversary={editingAnniversary}
      />

      {/* 6. Share Poster Generator Dialog */}
      <PosterModal 
        isOpen={isPosterModalOpen}
        onClose={() => setIsPosterModalOpen(false)}
        title={posterData.title}
        countValue={posterData.countValue}
        countUnit={posterData.countUnit}
        subText={posterData.subText}
        quote={posterData.quote}
        nickname={settings.nickname}
        watermark={settings.watermark}
      />

      {/* ====== 7. 隐私政策 & 用户协议 主弹窗 ====== */}
      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[90]">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-[#0F0F1A]/95 backdrop-blur-2xl w-full max-w-sm shadow-2xl max-h-[85vh] overflow-y-auto rounded-[28px] border border-white/10"
            >
              <div className="p-6">
                {/* Title */}
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-blue-400/20">
                    <ShieldAlert size={28} className="text-blue-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-6 text-center">
                  用户协议与隐私政策
                </h3>

                {/* Info cards */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 bg-white/[0.03] border border-white/5 rounded-xl p-4">
                    <CheckCircle size={18} className="text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-300 leading-relaxed">
                      <strong className="text-white">个人信息收集说明：</strong>《隐私政策》中关于纪念日、时光记录、昵称、水印及设备用户信息的收集和使用说明。
                    </p>
                  </div>
                  <div className="flex items-start gap-3 bg-white/[0.03] border border-white/5 rounded-xl p-4">
                    <Smartphone size={18} className="text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-300 leading-relaxed">
                      <strong className="text-white">数据共享说明：</strong>《隐私政策》中与第三方 SDK 类服务商数据共享、相关信息收集和使用说明。
                    </p>
                  </div>
                </div>

                {/* Agreement links */}
                <div className="mb-2">
                  <p className="text-xs text-slate-400 mb-2">用户协议和隐私政策说明：</p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    阅读完整的
                    <span
                      onClick={handleOpenAgreement}
                      className="text-blue-400 hover:underline cursor-pointer font-semibold mx-1"
                    >
                      《用户服务协议》
                    </span>
                    和
                    <span
                      onClick={handleOpenPrivacy}
                      className="text-blue-400 hover:underline cursor-pointer font-semibold mx-1"
                    >
                      《隐私政策》
                    </span>
                    了解详细内容。
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex border-t border-white/10">
                <button
                  onClick={handleDeclinePrivacy}
                  className="flex-1 py-4 text-base font-medium text-slate-300 bg-transparent border-r border-white/10 rounded-bl-[28px] hover:bg-white/5 transition-colors"
                >
                  不同意
                </button>
                <button
                  onClick={handleAcceptPrivacy}
                  className="flex-1 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 rounded-br-[28px] transition-colors shadow-lg shadow-blue-500/20"
                >
                  同意并继续
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ====== 8. 拒绝隐私政策 二次确认弹窗 ====== */}
      <AnimatePresence>
        {showDeclineModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-[#0F0F1A]/95 backdrop-blur-2xl rounded-[28px] w-full max-w-md overflow-hidden shadow-2xl border border-white/10 flex flex-col"
            >
              <div className="flex-1 p-6">
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-10 h-10 shrink-0 bg-amber-500/15 rounded-xl flex items-center justify-center border border-amber-400/20">
                    <Info size={22} className="text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">确认拒绝</h2>
                    <p className="text-slate-400 leading-relaxed">
                      您确定要拒绝《用户协议》和《隐私政策》吗？<br/>
                      <span className="text-amber-400 font-medium">拒绝后将无法使用「多久算数」的全部服务</span>，应用将保持当前提示，您可随时重新选择同意。
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-t border-white/10">
                <button
                  onClick={handleDeclineCancel}
                  className="flex-1 py-4 text-center text-slate-300 font-medium hover:bg-white/5 transition-colors"
                >
                  取消（重新考虑）
                </button>
                <div className="w-px bg-white/10"></div>
                <button
                  onClick={handleDeclineConfirm}
                  className="flex-1 py-4 text-center text-red-400 font-medium hover:bg-red-500/5 transition-colors"
                >
                  确定拒绝
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ====== 9. 协议 / 隐私政策详情弹窗 ====== */}
      <AgreementModal
        isOpen={agreementModal === 'agreement'}
        onClose={handleCloseAgreement}
        title="用户服务协议"
        content={<UserAgreementContent />}
      />
      <AgreementModal
        isOpen={agreementModal === 'privacy'}
        onClose={handleCloseAgreement}
        title="隐私政策"
        content={<PrivacyPolicyContent />}
      />

    </div>
  );
}
