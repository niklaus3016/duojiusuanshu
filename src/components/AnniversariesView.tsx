import React, { useState, useEffect } from 'react';
import { 
  Pin, Edit3, Trash2, Calendar, Share2, Plus, Filter, Flame, Hourglass 
} from 'lucide-react';
import { Anniversary } from '../types';
import { calculateTimeDifference } from '../utils/timeCalculations';
import { generateDurationVibeText } from '../utils/quotes';

// Helper to format date cleanly as YYYY/MM/DD without hours, minutes, seconds
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
};

interface AnniversariesViewProps {
  anniversaries: Anniversary[];
  onOpenAnniversaryModal: (anniversary?: Anniversary) => void;
  onDeleteAnniversary: (id: string) => void;
  onTogglePin: (id: string) => void;
  onOpenPosterModal: (title: string, countValue: string, countUnit: string, subText: string, quote: string) => void;
  fontSizeClass: string;
}

export default function AnniversariesView({
  anniversaries,
  onOpenAnniversaryModal,
  onDeleteAnniversary,
  onTogglePin,
  onOpenPosterModal,
  fontSizeClass
}: AnniversariesViewProps) {
  const [filter, setFilter] = useState<'all' | 'past' | 'future' | 'pinned'>('all');
  const [now, setNow] = useState(new Date());
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Ticking state updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter and Sort anniversaries
  // Sorting: Pinned first, then by soonest / absolute date
  const filteredAnniversaries = anniversaries
    .filter((ann) => {
      if (filter === 'pinned') return ann.isPinned;
      if (filter === 'past') return ann.category === 'past';
      if (filter === 'future') return ann.category === 'future';
      return true;
    })
    .sort((a, b) => {
      // Pinned first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // Soonest dates first
      return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });

  const handleSharePoster = (ann: Anniversary) => {
    const diff = calculateTimeDifference(ann.dateTime, now.toISOString());
    const countValue = String(diff.totalDays);
    const unit = ann.category === 'past' ? '天' : '天';
    const title = ann.title;
    
    const subText = ann.category === 'past' 
      ? `已过 ${diff.years}年${diff.months}月${diff.days}天`
      : `剩余 ${diff.years}年${diff.months}月${diff.days}天`;

    const quote = generateDurationVibeText(ann.type, diff.totalDays, 'healing');
    
    onOpenPosterModal(title, countValue, unit, subText, quote);
  };

  return (
    <div className={`space-y-6 pb-20 ${fontSizeClass}`}>
      
      {/* View Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>我的纪念日</span>
            <span className="text-xs bg-indigo-500/15 border border-indigo-500/20 px-2 py-0.5 rounded-full text-indigo-400 font-mono font-bold">
              {anniversaries.length}
            </span>
          </h2>
        </div>
        <button
          onClick={() => onOpenAnniversaryModal()}
          className="p-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center"
          id="add-anniversary-floating-btn"
          title="新建记录"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex bg-slate-950/40 p-1 rounded-2xl border border-white/5 gap-1">
        {(['all', 'past', 'future', 'pinned'] as const).map((tab) => {
          const labels = { all: '全部', past: '正计时', future: '倒计时', pinned: '已置顶' };
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 py-2 text-xs font-medium rounded-xl transition-all ${
                filter === tab
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAnniversaries.length === 0 && (
        <div className="text-center py-16 bg-slate-900/40 border border-dashed border-white/10 rounded-3xl p-6">
          <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">还没有相关的时间记录</p>
          <p className="text-xs text-slate-500 mt-1 max-w-[220px] mx-auto">点击右上角 + 按钮，开始记录生命中的闪光纪念点或倒计时挑战</p>
          <button
            onClick={() => onOpenAnniversaryModal()}
            className="mt-4 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-semibold rounded-xl transition-all"
          >
            立即创建第一个
          </button>
        </div>
      )}

      {/* Anniversary List */}
      <div className="space-y-4">
        {filteredAnniversaries.map((ann) => {
          const diff = calculateTimeDifference(ann.dateTime, now.toISOString());
          const isCountdown = ann.category === 'future';
          
          // Is imminent (within 3 days for countdown, or exactly anniversary day today!)
          const isImminent = isCountdown && diff.totalDays <= 3;
          const isTodayAnniversary = !isCountdown && diff.days === 0 && diff.months === 0 && diff.years > 0;

          return (
            <div
              key={ann.id}
              className={`relative bg-slate-900/60 backdrop-blur-xl border rounded-3xl p-5 shadow-xl transition-all duration-300 group ${
                ann.isPinned ? 'border-indigo-500/30 bg-slate-900/80 shadow-indigo-500/5' : 'border-white/10 hover:border-white/20'
              } ${
                isImminent ? 'ring-1 ring-rose-500/30' : ''
              }`}
            >
              <div className="flex gap-4 items-start">
                
                {/* Custom icon bubble */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border ${
                  isCountdown 
                    ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' 
                    : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                }`}>
                  {ann.icon || '🎉'}
                </div>

                {/* Info main body */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-semibold text-white text-sm truncate leading-none">
                      {ann.title}
                    </h3>

                    {/* Blinking Aura Badges */}
                    {ann.isPinned && (
                      <span className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[9px] font-bold text-amber-400 flex items-center gap-0.5">
                        <Pin className="w-2.5 h-2.5" />
                        <span>置顶</span>
                      </span>
                    )}

                    {isCountdown ? (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        isImminent 
                          ? 'bg-rose-500/20 border border-rose-500/30 text-rose-400 animate-pulse' 
                          : 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
                      }`}>
                        {isImminent ? '🔥 即将到来' : '⏳ 倒计时'}
                      </span>
                    ) : (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        isTodayAnniversary 
                          ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 animate-bounce' 
                          : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
                      }`}>
                        {isTodayAnniversary ? '🎉 周年今日！' : '🗓️ 纪念日'}
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-500 font-mono">
                    目标点: {formatDate(ann.dateTime)}
                  </p>


                </div>
              </div>

              {/* Dynamic Duration Box */}
              <div className="mt-4 p-3 bg-slate-950/40 rounded-2xl border border-white/5 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">
                    {isCountdown ? '距离目标倒计时' : '事件已经度过'}
                  </span>
                  
                  {/* Years, months, days detail */}
                  <div className="text-xs text-slate-300 mt-1 flex gap-1 font-mono">
                    {diff.years > 0 && <span>{diff.years}年</span>}
                    {diff.months > 0 && <span>{diff.months}月</span>}
                    <span>{diff.days}天</span>
                  </div>
                </div>

                {/* Big days count display */}
                <div className="text-right">
                  <span className={`text-2xl font-black font-mono leading-none ${
                    isCountdown ? 'text-purple-400' : 'text-indigo-400'
                  }`}>
                    {diff.totalDays}
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold ml-0.5">天</span>
                </div>
              </div>

              {/* Drawer Action buttons (Edit, Share, Delete, Pin) */}
              <div className="mt-4 pt-3 border-t border-white/5 flex gap-1.5 justify-end">
                <button
                  onClick={() => onTogglePin(ann.id)}
                  className={`p-1.5 rounded-xl text-xs flex items-center gap-1 transition-all ${
                    ann.isPinned 
                      ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' 
                      : 'bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white'
                  }`}
                  title={ann.isPinned ? '取消置顶' : '置顶'}
                >
                  <Pin className="w-3.5 h-3.5" />
                  <span>{ann.isPinned ? '已置顶' : '置顶'}</span>
                </button>

                <button
                  onClick={() => handleSharePoster(ann)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs text-indigo-400 flex items-center gap-1 transition-all"
                  title="生成海报"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>海报</span>
                </button>

                <button
                  onClick={() => onOpenAnniversaryModal(ann)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs text-emerald-400 flex items-center gap-1 transition-all"
                  title="编辑"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>编辑</span>
                </button>

                {deleteConfirmId === ann.id ? (
                  <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 rounded-xl px-2 py-1">
                    <span className="text-[10px] text-rose-400 font-medium mr-1">确认删除？</span>
                    <button
                      onClick={() => {
                        onDeleteAnniversary(ann.id);
                        setDeleteConfirmId(null);
                      }}
                      className="text-[10px] bg-rose-500 hover:bg-rose-600 text-white px-2 py-0.5 rounded-lg transition-all cursor-pointer font-semibold"
                    >
                      确定
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="text-[10px] bg-white/10 hover:bg-white/20 text-slate-300 px-2 py-0.5 rounded-lg transition-all cursor-pointer"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(ann.id)}
                    className="p-1.5 bg-white/5 hover:bg-rose-500/10 border border-white/5 rounded-xl text-xs text-rose-400 flex items-center gap-1 transition-all"
                    title="删除"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>删除</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
