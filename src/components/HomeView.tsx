import React, { useState, useEffect } from 'react';
import { 
  Baby, Heart, Flame, CalendarRange, Clock, Sparkles, ChevronRight, 
  Settings, Save, Share2, Eye, Compass, Pin, Copy, RefreshCw, CalendarCheck
} from 'lucide-react';
import { 
  calculateTimeDifference, calculateAgeMetrics, calculateLifeProgress, 
  calculateDayProgress, calculateYearProgress, getPresetHolidaysCountdowns,
  getMarriageAnniversaryName
} from '../utils/timeCalculations';
import { generateDurationVibeText, getRandomQuote } from '../utils/quotes';
import { Anniversary, EventType } from '../types';

interface HomeViewProps {
  onOpenAnniversaryModal: () => void;
  onOpenPosterModal: (title: string, countValue: string, countUnit: string, subText: string, quote: string) => void;
  savedAnniversaries: Anniversary[];
  onSaveAnniversary: (ann: Omit<Anniversary, 'id'>) => void;
  fontSizeClass: string;
}

export default function HomeView({
  onOpenAnniversaryModal,
  onOpenPosterModal,
  savedAnniversaries,
  onSaveAnniversary,
  fontSizeClass
}: HomeViewProps) {
  const [now, setNow] = useState(new Date());

  // Local storage state for default quick modules
  const [lifeData, setLifeData] = useState<{ birthDate: string; expectedAge: number } | null>(() => {
    const saved = localStorage.getItem('duojiusuanshu_life');
    return saved ? JSON.parse(saved) : null;
  });

  const [loveData, setLoveData] = useState<{ startDate: string; partnerName: string } | null>(() => {
    const saved = localStorage.getItem('duojiusuanshu_love');
    return saved ? JSON.parse(saved) : null;
  });

  const [marriageData, setMarriageData] = useState<{ startDate: string } | null>(() => {
    const saved = localStorage.getItem('duojiusuanshu_marriage');
    return saved ? JSON.parse(saved) : null;
  });

  // UI States for Quick Setups
  const [showLifeForm, setShowLifeForm] = useState(false);
  const [lifeInputBirth, setLifeInputBirth] = useState('2000-01-01T00:00');
  const [lifeInputAge, setLifeInputAge] = useState(80);

  const [showLoveForm, setShowLoveForm] = useState(false);
  const [loveInputStart, setLoveInputStart] = useState('2020-05-20T13:14');
  const [loveInputPartner, setLoveInputPartner] = useState('TA');

  const [showMarriageForm, setShowMarriageForm] = useState(false);
  const [marriageInputStart, setMarriageInputStart] = useState('2024-10-01T10:00');

  // Universal custom time calculator states
  const [calcDateA, setCalcDateA] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().slice(0, 16);
  });
  const [calcDateB, setCalcDateB] = useState(() => new Date().toISOString().slice(0, 16));
  const [calcVibeStyle, setCalcVibeStyle] = useState<'healing' | 'literary' | 'funny' | 'inspiring'>('healing');
  const [calcTitle, setCalcTitle] = useState('自定义事件计算');
  const [resetConfirmKey, setResetConfirmKey] = useState<string | null>(null);

  // Pin / Quick access state
  const [pinnedModules, setPinnedModules] = useState<string[]>(() => {
    const saved = localStorage.getItem('duojiusuanshu_pinned_mods');
    return saved ? JSON.parse(saved) : ['progress', 'life', 'love', 'marriage', 'holidays', 'universal'];
  });

  // Live ticking clock (updates every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const nowStr = now.toISOString();

  // 1. Calculate Today's & Year Progress
  const dayProgress = calculateDayProgress(nowStr);
  const yearProgress = calculateYearProgress(nowStr);

  // 2. Life Clock calculations
  const lifeMetrics = lifeData 
    ? calculateLifeProgress(lifeData.birthDate, lifeData.expectedAge, nowStr) 
    : null;
  const lifeAgeDetails = lifeData
    ? calculateAgeMetrics(lifeData.birthDate, nowStr)
    : null;

  // 3. Love Clock calculations
  const loveDiff = loveData
    ? calculateTimeDifference(loveData.startDate, nowStr)
    : null;

  // 4. Marriage Clock calculations
  const marriageDiff = marriageData
    ? calculateTimeDifference(marriageData.startDate, nowStr)
    : null;

  // 5. Universal calculator diff
  const universalDiff = calculateTimeDifference(calcDateA, calcDateB);

  // Holiday Presets
  const holidayCountdowns = getPresetHolidaysCountdowns(nowStr);

  // Copy helper
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('已成功复制文本到剪贴板！');
  };

  // Toggle pinned state of modules to let users customize home order
  const togglePinModule = (id: string) => {
    const next = pinnedModules.includes(id) 
      ? pinnedModules.filter(m => m !== id)
      : [...pinnedModules, id];
    setPinnedModules(next);
    localStorage.setItem('duojiusuanshu_pinned_mods', JSON.stringify(next));
  };

  // Handlers to Save/Reset default quick widgets
  const saveLifeSetup = () => {
    const val = { birthDate: new Date(lifeInputBirth).toISOString(), expectedAge: lifeInputAge };
    localStorage.setItem('duojiusuanshu_life', JSON.stringify(val));
    setLifeData(val);
    setShowLifeForm(false);
  };

  const saveLoveSetup = () => {
    const val = { startDate: new Date(loveInputStart).toISOString(), partnerName: loveInputPartner.trim() || 'TA' };
    localStorage.setItem('duojiusuanshu_love', JSON.stringify(val));
    setLoveData(val);
    setShowLoveForm(false);
  };

  const saveMarriageSetup = () => {
    const val = { startDate: new Date(marriageInputStart).toISOString() };
    localStorage.setItem('duojiusuanshu_marriage', JSON.stringify(val));
    setMarriageData(val);
    setShowMarriageForm(false);
  };

  const confirmReset = (key: string) => {
    setResetConfirmKey(null);
    localStorage.removeItem(`duojiusuanshu_${key}`);
    if (key === 'life') setLifeData(null);
    if (key === 'love') setLoveData(null);
    if (key === 'marriage') setMarriageData(null);
  };

  // Convert Home Module calculations into saved Anniversary Record
  const handleSaveToAnniversaryBook = (title: string, date: string, type: EventType) => {
    onSaveAnniversary({
      title,
      dateTime: date,
      type,
      isPinned: false,
      icon: type === 'love' ? '❤️' : type === 'marriage' ? '💍' : type === 'life' ? '👶' : '🗓️',
      category: new Date(date).getTime() <= Date.now() ? 'past' : 'future',
      notes: undefined
    });
    alert('已成功保存至「我的纪念日」记录本！');
  };

  // Render components inside the user's custom sort order
  const sortedModules = [
    { id: 'progress', label: '时间消耗度量', component: renderProgressSection() },
    { id: 'life', label: '人生时光机', component: renderLifeSection() },
    { id: 'love', label: '甜蜜恋爱恋习册', component: renderLoveSection() },
    { id: 'marriage', label: '婚姻白头契约', component: renderMarriageSection() },
    { id: 'universal', label: '万能时间差计算', component: renderUniversalCalculator() },
    { id: 'holidays', label: '传统法定节假日', component: renderHolidaysSection() },
  ].sort((a, b) => {
    const pinA = pinnedModules.includes(a.id);
    const pinB = pinnedModules.includes(b.id);
    if (pinA && !pinB) return -1;
    if (!pinA && pinB) return 1;
    return 0; // maintain original order
  });

  return (
    <div className={`space-y-6 pb-20 ${fontSizeClass}`}>
      
      {/* Render sorted/pinned modules */}
      <div className="space-y-6">
        {sortedModules.map((m) => (
          <div key={m.id} className="relative">
            {m.component}
          </div>
        ))}
      </div>
    </div>
  );

  // SECTION 1: TIME CONSUMING PROGRESS (TODAY + YEAR)
  function renderProgressSection() {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 space-y-5 shadow-xl">
        <div className="flex justify-between items-center">
          <span className="bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>时光流逝度量</span>
          </span>
          <button
            onClick={() => togglePinModule('progress')}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              pinnedModules.includes('progress')
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
            }`}
            title={pinnedModules.includes('progress') ? '取消首页置顶' : '置顶展示到首位'}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Today's Progress */}
          <div className="bg-white/5 p-5 rounded-[24px] border border-white/10 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">今日时间已流逝</span>
              <span className="font-mono text-blue-400 font-bold">{dayProgress.progressPercent.toFixed(2)}%</span>
            </div>
            <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden relative">
              <div 
                style={{ width: `${dayProgress.progressPercent}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>已消耗 {Math.floor(dayProgress.elapsedSeconds / 60)} 分钟</span>
              <span>剩余约 {dayProgress.remainingHours} 小时</span>
            </div>
          </div>

          {/* This Year's Progress */}
          <div className="bg-white/5 p-5 rounded-[24px] border border-white/10 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">今年已流逝</span>
              <span className="font-mono text-purple-400 font-bold">{yearProgress.progressPercent.toFixed(2)}%</span>
            </div>
            <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                style={{ width: `${yearProgress.progressPercent}%` }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>已过去 {yearProgress.elapsedDays} 天</span>
              <span>剩余 {yearProgress.remainingDays} 天</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SECTION 2: LIFE CLOCK
  function renderLifeSection() {
    const cardTitle = "来到世界多久了";
    const totalDaysLived = lifeMetrics ? String(lifeMetrics.totalDaysLived) : '0';
    const subTextBreakdown = lifeMetrics && lifeAgeDetails
      ? `已度过 ${lifeMetrics.totalDaysLived} 天 | 标准周岁: ${lifeAgeDetails.completedAge}岁, 传统虚岁: ${lifeAgeDetails.nominalAge}岁`
      : '';
    const quoteTxt = lifeMetrics ? generateDurationVibeText('life', lifeMetrics.totalDaysLived, 'healing') : '';

    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-xl transition-all duration-300">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center">
            <span className="bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Baby className="w-3.5 h-3.5 text-blue-400" />
              <span>人生计时</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {lifeData && (
              <>
                {resetConfirmKey === 'life' ? (
                  <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 rounded-xl px-2 py-1">
                    <span className="text-[10px] text-rose-400 font-medium mr-1">确认重置？</span>
                    <button
                      onClick={() => confirmReset('life')}
                      className="text-[10px] bg-rose-500 hover:bg-rose-600 text-white px-2 py-0.5 rounded-lg transition-all cursor-pointer font-semibold"
                    >
                      确定
                    </button>
                    <button
                      onClick={() => setResetConfirmKey(null)}
                      className="text-[10px] bg-white/10 hover:bg-white/20 text-slate-300 px-2 py-0.5 rounded-lg transition-all cursor-pointer"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => handleSaveToAnniversaryBook('来到这个世界', lifeData.birthDate, 'life')}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-slate-300 hover:text-white transition-all cursor-pointer"
                      title="备份至纪念日"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setResetConfirmKey('life')}
                      className="p-2 bg-white/5 hover:bg-rose-500/10 border-white/5 text-rose-400 hover:text-rose-300 rounded-xl border transition-all cursor-pointer"
                      title="重置"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </>
            )}
            <button
              onClick={() => togglePinModule('life')}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                pinnedModules.includes('life')
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
              }`}
              title={pinnedModules.includes('life') ? '取消首页置顶' : '置顶展示到首位'}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {!lifeData ? (
          <div>
            {!showLifeForm ? (
              <div 
                onClick={() => setShowLifeForm(true)}
                className="group border border-dashed border-white/10 hover:border-blue-500/40 rounded-[24px] p-6 text-center cursor-pointer bg-white/5 hover:bg-blue-500/5 transition-all"
              >
                <Baby className="w-8 h-8 text-slate-500 group-hover:text-blue-400 mx-auto mb-2 transition-colors" />
                <p className="text-xs text-slate-300 font-medium">配置人生时光机</p>
                <p className="text-[10px] text-slate-500 mt-1">输入您的出生日期，一键计算存活总天数、人生进度百分比</p>
              </div>
            ) : (
              <div className="space-y-3 bg-white/5 p-5 rounded-[24px] border border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">您的出生时间</label>
                    <input 
                      type="datetime-local" 
                      value={lifeInputBirth}
                      onChange={(e) => setLifeInputBirth(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-[#050510] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">预期寿命基准 (岁)</label>
                    <input 
                      type="number" 
                      value={lifeInputAge}
                      onChange={(e) => setLifeInputAge(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 bg-[#050510] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      min={1}
                      max={150}
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button 
                    onClick={() => setShowLifeForm(false)}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 text-[10px] font-semibold rounded-xl"
                  >
                    取消
                  </button>
                  <button 
                    onClick={saveLifeSetup}
                    className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-semibold rounded-xl"
                  >
                    开启时光机
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {/* Massive Live Counter */}
            <div className="text-center py-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-[24px] border border-white/10 relative overflow-hidden">
              <span className="text-[10px] tracking-widest text-slate-400 block uppercase mb-1">来到这个世界已经</span>
              <div className="flex items-baseline justify-center gap-2 my-2">
                <span className="text-5xl sm:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 tracking-tighter font-sans leading-none glow">
                  {lifeMetrics?.totalDaysLived}
                </span>
                <span className="text-xl font-light opacity-50">天</span>
              </div>
              
              <div className="mt-3 text-xs font-mono text-blue-400 font-semibold space-x-1 flex items-center justify-center">
                <span>或</span>
                <span className="bg-black/30 px-2 py-0.5 rounded-md border border-white/10">{lifeMetrics?.remainingHours} 小时</span>
              </div>
            </div>

            {/* Life Progress based on expected baseline age */}
            <div className="bg-white/5 p-5 rounded-[24px] border border-white/10 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">人生进度百分比 (基准 {lifeData.expectedAge} 岁)</span>
                <span className="font-semibold text-blue-400 font-mono">{lifeMetrics?.progressPercent.toFixed(3)}%</span>
              </div>
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${lifeMetrics?.progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400">
                <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10">
                  <span className="block text-slate-500">周岁年龄</span>
                  <span className="font-semibold text-white font-mono text-xs">{lifeAgeDetails?.completedAge} 岁</span>
                </div>
                <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10">
                  <span className="block text-slate-500">虚岁年龄</span>
                  <span className="font-semibold text-white font-mono text-xs">{lifeAgeDetails?.nominalAge} 岁</span>
                </div>
                <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10">
                  <span className="block text-slate-500">下次生日</span>
                  <span className="font-semibold text-white font-mono text-xs">{lifeAgeDetails?.daysToNextBirthday} 天</span>
                </div>
              </div>
            </div>


          </div>
        )}
      </div>
    );
  }

  // SECTION 3: LOVE TIMING
  function renderLoveSection() {
    const cardTitle = `与 ${loveData?.partnerName || 'TA'} 相恋`;
    const totalDaysLived = loveDiff ? String(loveDiff.totalDays) : '0';
    const subTextBreakdown = loveDiff
      ? `在一起第 ${loveDiff.totalDays} 天 | 已过 ${loveDiff.years}年${loveDiff.months}月${loveDiff.days}天`
      : '';
    const quoteTxt = loveDiff ? generateDurationVibeText('love', loveDiff.totalDays, 'healing') : '';

    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center">
            <span className="bg-pink-500/10 text-pink-300 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-pink-400" />
              <span>恋爱计时</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {loveData && (
              <>
                {resetConfirmKey === 'love' ? (
                  <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 rounded-xl px-2 py-1">
                    <span className="text-[10px] text-rose-400 font-medium mr-1">确认重置？</span>
                    <button
                      onClick={() => confirmReset('love')}
                      className="text-[10px] bg-rose-500 hover:bg-rose-600 text-white px-2 py-0.5 rounded-lg transition-all cursor-pointer font-semibold"
                    >
                      确定
                    </button>
                    <button
                      onClick={() => setResetConfirmKey(null)}
                      className="text-[10px] bg-white/10 hover:bg-white/20 text-slate-300 px-2 py-0.5 rounded-lg transition-all cursor-pointer"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => handleSaveToAnniversaryBook(`与 ${loveData.partnerName} 相恋`, loveData.startDate, 'love')}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-slate-300 hover:text-white transition-all cursor-pointer"
                      title="备份至纪念日"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setResetConfirmKey('love')}
                      className="p-2 bg-white/5 hover:bg-rose-500/10 border-white/5 text-rose-400 hover:text-rose-300 rounded-xl border transition-all cursor-pointer"
                      title="重置"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </>
            )}
            <button
              onClick={() => togglePinModule('love')}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                pinnedModules.includes('love')
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
              }`}
              title={pinnedModules.includes('love') ? '取消首页置顶' : '置顶展示到首位'}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {!loveData ? (
          <div>
            {!showLoveForm ? (
              <div 
                onClick={() => setShowLoveForm(true)}
                className="group border border-dashed border-white/10 hover:border-pink-500/40 rounded-[24px] p-6 text-center cursor-pointer bg-white/5 hover:bg-pink-500/5 transition-all"
              >
                <Heart className="w-8 h-8 text-slate-500 group-hover:text-pink-400 mx-auto mb-2 transition-colors" />
                <p className="text-xs text-slate-300 font-medium">配置恋爱恋习册</p>
                <p className="text-[10px] text-slate-500 mt-1">输入您和另一半确定关系的浪漫纪念日，实时追踪心动天数</p>
              </div>
            ) : (
              <div className="space-y-3 bg-white/5 p-5 rounded-[24px] border border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">在一起的起始日期</label>
                    <input 
                      type="datetime-local" 
                      value={loveInputStart}
                      onChange={(e) => setLoveInputStart(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-[#050510] border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">另一半的称呼</label>
                    <input 
                      type="text" 
                      value={loveInputPartner}
                      onChange={(e) => setLoveInputPartner(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-[#050510] border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500"
                      placeholder="TA 的昵称"
                      maxLength={15}
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button 
                    onClick={() => setShowLoveForm(false)}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 text-[10px] font-semibold rounded-xl"
                  >
                    取消
                  </button>
                  <button 
                    onClick={saveLoveSetup}
                    className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-[10px] font-semibold rounded-xl"
                  >
                    一键契约
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-center py-6 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-[24px] border border-white/10 relative overflow-hidden">
              <span className="text-[10px] tracking-widest text-slate-400 block uppercase mb-1">
                与 <span className="text-pink-400 font-bold">{loveData.partnerName}</span> 甜蜜相守
              </span>
              <div className="flex items-baseline justify-center gap-2 my-2">
                <span className="text-5xl sm:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 tracking-tighter font-sans leading-none glow-pink">
                  {loveDiff?.totalDays}
                </span>
                <span className="text-xl font-light opacity-50 text-pink-300">天</span>
              </div>

              <div className="mt-3 text-xs text-slate-400 flex items-center justify-center gap-1.5 font-mono">
                <span>相伴时长:</span>
                <span className="text-pink-300">{loveDiff?.years} 年</span>
                <span className="text-pink-300">{loveDiff?.months} 月</span>
                <span className="text-pink-300">{loveDiff?.days} 天</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // SECTION 4: MARRIAGE TIMING
  function renderMarriageSection() {
    const cardTitle = "婚姻长跑时光契约";
    const totalDaysLived = marriageDiff ? String(marriageDiff.totalDays) : '0';
    const marriageYears = marriageDiff ? marriageDiff.years : 0;
    const subTextBreakdown = marriageDiff
      ? `结婚 ${marriageDiff.totalDays} 天 | 已携手 ${marriageDiff.years}年${marriageDiff.months}月${marriageDiff.days}天 | 属于: ${getMarriageAnniversaryName(marriageYears)}`
      : '';
    const quoteTxt = marriageDiff ? generateDurationVibeText('marriage', marriageDiff.totalDays, 'healing') : '';

    // Next Wedding Anniversary Countdown
    let nextAnniversaryDays = 365;
    if (marriageData) {
      const marriageDate = new Date(marriageData.startDate);
      const now = new Date();
      let nextY = now.getFullYear();
      let nextAnn = new Date(nextY, marriageDate.getMonth(), marriageDate.getDate());
      if (now.getTime() > nextAnn.getTime()) {
        nextY++;
        nextAnn = new Date(nextY, marriageDate.getMonth(), marriageDate.getDate());
      }
      const diffMs = nextAnn.getTime() - now.getTime();
      nextAnniversaryDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }

    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center">
            <span className="bg-amber-500/10 text-amber-300 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>婚姻契约</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {marriageData && (
              <>
                {resetConfirmKey === 'marriage' ? (
                  <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 rounded-xl px-2 py-1">
                    <span className="text-[10px] text-rose-400 font-medium mr-1">确认重置？</span>
                    <button
                      onClick={() => confirmReset('marriage')}
                      className="text-[10px] bg-rose-500 hover:bg-rose-600 text-white px-2 py-0.5 rounded-lg transition-all cursor-pointer font-semibold"
                    >
                      确定
                    </button>
                    <button
                      onClick={() => setResetConfirmKey(null)}
                      className="text-[10px] bg-white/10 hover:bg-white/20 text-slate-300 px-2 py-0.5 rounded-lg transition-all cursor-pointer"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => handleSaveToAnniversaryBook('金石之盟结婚纪念', marriageData.startDate, 'marriage')}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-slate-300 hover:text-white transition-all cursor-pointer"
                      title="备份至纪念日"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setResetConfirmKey('marriage')}
                      className="p-2 bg-white/5 hover:bg-rose-500/10 border-white/5 text-rose-400 hover:text-rose-300 rounded-xl border transition-all cursor-pointer"
                      title="重置"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </>
            )}
            <button
              onClick={() => togglePinModule('marriage')}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                pinnedModules.includes('marriage')
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
              }`}
              title={pinnedModules.includes('marriage') ? '取消首页置顶' : '置顶展示到首位'}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {!marriageData ? (
          <div>
            {!showMarriageForm ? (
              <div 
                onClick={() => setShowMarriageForm(true)}
                className="group border border-dashed border-white/10 hover:border-amber-500/40 rounded-[24px] p-6 text-center cursor-pointer bg-white/5 hover:bg-amber-500/5 transition-all"
              >
                <Flame className="w-8 h-8 text-slate-500 group-hover:text-amber-400 mx-auto mb-2 transition-colors" />
                <p className="text-xs text-slate-300 font-medium">缔结婚姻白头誓约</p>
                <p className="text-[10px] text-slate-500 mt-1">输入领证或婚礼的浪漫日期，计算婚姻金石契约存续时长</p>
              </div>
            ) : (
              <div className="space-y-3 bg-white/5 p-5 rounded-[24px] border border-white/10">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">结婚起始纪念日期</label>
                  <input 
                    type="datetime-local" 
                    value={marriageInputStart}
                    onChange={(e) => setMarriageInputStart(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-[#050510] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button 
                    onClick={() => setShowMarriageForm(false)}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 text-[10px] font-semibold rounded-xl"
                  >
                    取消
                  </button>
                  <button 
                    onClick={saveMarriageSetup}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-semibold rounded-xl"
                  >
                    百年好合
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-center py-6 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-[24px] border border-white/10 relative overflow-hidden">
              <span className="text-[10px] tracking-widest text-slate-400 block uppercase mb-1">
                执子之手 · 琴瑟共鸣
              </span>
              <div className="flex items-baseline justify-center gap-2 my-2">
                <span className="text-5xl sm:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 tracking-tighter font-sans leading-none glow">
                  {marriageDiff?.totalDays}
                </span>
                <span className="text-xl font-light opacity-50 text-amber-300">天</span>
              </div>

              <div className="mt-3 text-xs font-mono text-slate-400 flex items-center justify-center gap-1.5">
                <span className="bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20 text-[10px] font-bold text-amber-400">
                  婚龄阶段: {getMarriageAnniversaryName(marriageYears)}
                </span>
                <span>携手已过 {marriageYears}年{marriageDiff?.months}月{marriageDiff?.days}天</span>
              </div>
            </div>

            {/* Anniversary Countdown */}
            <div className="bg-white/5 p-4 rounded-[20px] border border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">结婚纪念日周年倒计时:</span>
              <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-400 text-[10px] font-mono font-bold">
                剩 {nextAnniversaryDays} 天
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // SECTION 5: UNIVERSAL CUSTOM TIME DIFFERENCE CALCULATOR
  function renderUniversalCalculator() {
    const cardTitle = calcTitle || "时间差精准测算";
    const totalDaysLived = String(universalDiff.totalDays);
    const subTextBreakdown = `跨越时间：${universalDiff.years}年${universalDiff.months}月${universalDiff.days}天 (${universalDiff.totalDays}天)`;
    const quoteTxt = generateDurationVibeText('custom', universalDiff.totalDays, calcVibeStyle);

    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-xl space-y-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="bg-purple-500/10 text-purple-300 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <CalendarRange className="w-3.5 h-3.5 text-purple-400" />
              <span>万能计算</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => handleSaveToAnniversaryBook(calcTitle, calcDateA, 'custom')}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="保存为纪念记录"
            >
              <Save className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => togglePinModule('universal')}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                pinnedModules.includes('universal')
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
              }`}
              title={pinnedModules.includes('universal') ? '取消首页置顶' : '置顶展示到首位'}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Inputs panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-white/5 p-5 rounded-[24px] border border-white/10">
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">开始时间点 (时间点 A)</label>
            <input 
              type="datetime-local" 
              value={calcDateA}
              onChange={(e) => setCalcDateA(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-[#050510] border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">结束时间点 (时间点 B)</label>
            <input 
              type="datetime-local" 
              value={calcDateB}
              onChange={(e) => setCalcDateB(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-[#050510] border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label className="text-[10px] font-bold text-slate-400 block mb-1">计算事件自定义标题</label>
            <input 
              type="text" 
              value={calcTitle}
              onChange={(e) => setCalcTitle(e.target.value.slice(0, 20))}
              className="w-full text-xs px-3 py-2 bg-[#050510] border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
              placeholder="自定义海报标题"
              maxLength={20}
            />
          </div>
        </div>

        {/* Live dynamic count-up result */}
        <div className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 p-5 rounded-[24px] border border-white/10 text-center space-y-4">
          <div>
            <span className="text-[10px] text-slate-400 tracking-wide block uppercase mb-1">测算两点绝对时间间隔</span>
            <div className="flex items-baseline justify-center gap-1.5 my-1">
              <span className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 tracking-tighter font-sans leading-none glow">
                {universalDiff.totalDays}
              </span>
              <span className="text-lg font-light opacity-50 text-slate-400">天</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 text-center font-mono text-[11px]">
              <span className="text-slate-500 block text-[9px]">分级拆解</span>
              <span className="text-white font-bold block mt-0.5">
                {universalDiff.years}年{universalDiff.months}月{universalDiff.days}天
              </span>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 text-center font-mono text-[11px]">
              <span className="text-slate-500 block text-[9px]">累计小时</span>
              <span className="text-blue-400 font-bold block mt-0.5">
                {universalDiff.totalHours} 小时
              </span>
            </div>
          </div>
        </div>

        {/* Copy or copy code button */}
        <div className="flex gap-2">
          <button
            onClick={() => handleCopyText(`【${cardTitle}】计算结果：\n开始时间：${calcDateA}\n结束时间：${calcDateB}\n时间差距：${universalDiff.totalDays}天 (${universalDiff.years}年${universalDiff.months}月${universalDiff.days}天)`)}
            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs border border-white/10 flex items-center justify-center gap-1.5 transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>复制文字结果</span>
          </button>
        </div>


      </div>
    );
  }

  // SECTION 6: SYSTEM HOLIDAY COUNTDOWNS (BENTO GRID STYLE)
  function renderHolidaysSection() {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 space-y-5 shadow-xl">
        <div className="flex justify-between items-center">
          <span className="bg-emerald-500/10 text-emerald-300 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
            <CalendarRange className="w-3.5 h-3.5 text-emerald-400" />
            <span>节日倒计时</span>
          </span>
          <button
            onClick={() => togglePinModule('holidays')}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              pinnedModules.includes('holidays')
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
            }`}
            title={pinnedModules.includes('holidays') ? '取消首页置顶' : '置顶展示到首位'}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {holidayCountdowns.map((hol) => {
            // Blinking highlight for upcoming events within 3 days
            const isImminent = hol.daysRemaining <= 3;
            return (
              <div 
                key={hol.name} 
                className={`p-4 rounded-[20px] border flex flex-col justify-between transition-all ${
                  isImminent 
                    ? 'bg-emerald-500/10 border-emerald-400/40 shadow-md shadow-emerald-400/5 animate-pulse' 
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{hol.name}</span>
                    {isImminent && (
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                    )}
                  </div>
                  <p className="text-[9px] text-slate-500 mt-1">传统或法定</p>
                </div>

                <div className="mt-4 flex items-baseline gap-0.5">
                  <span className={`text-2xl font-black font-mono tracking-tight ${isImminent ? 'text-emerald-400' : 'text-white'}`}>
                    {hol.daysRemaining}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold ml-1">天</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
