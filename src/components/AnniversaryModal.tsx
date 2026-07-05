import React, { useState, useEffect } from 'react';
import { X, Calendar, Pin, HelpCircle, Heart, Award, Gift, Ship } from 'lucide-react';
import { Anniversary, EventType } from '../types';

interface AnniversaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (anniversary: Omit<Anniversary, 'id'> & { id?: string }) => void;
  editingAnniversary?: Anniversary | null;
}

const EMOJIS = ['🎉', '❤️', '🎂', '💍', '🎓', '✈️', '🗓️', '🏠', '💼', '🏖️', '🚀', '🎮', '🍀', '🔔', '📖', '🌟', '🍼', '🐾', '🏋️', '🚗'];

const CATEGORY_LABELS: { value: EventType; label: string; icon: string }[] = [
  { value: 'custom', label: '自定义纪念', icon: '🗓️' },
  { value: 'countdown', label: '倒计时目标', icon: '⏳' },
  { value: 'life', label: '人生计时', icon: '👶' },
  { value: 'love', label: '恋爱计时', icon: '❤️' },
  { value: 'marriage', label: '结婚计时', icon: '💍' },
];

export default function AnniversaryModal({
  isOpen,
  onClose,
  onSave,
  editingAnniversary,
}: AnniversaryModalProps) {
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [type, setType] = useState<EventType>('custom');
  const [icon, setIcon] = useState('🎉');
  const [isPinned, setIsPinned] = useState(false);
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState<'past' | 'future'>('past');

  useEffect(() => {
    if (editingAnniversary) {
      setTitle(editingAnniversary.title);
      // Standardize input date format for date picker (YYYY-MM-DD)
      const date = new Date(editingAnniversary.dateTime);
      const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
      const localISODate = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 10);
      setDateTime(localISODate);
      setType(editingAnniversary.type);
      setIcon(editingAnniversary.icon);
      setIsPinned(editingAnniversary.isPinned);
      setNotes(editingAnniversary.notes || '');
      setCategory(editingAnniversary.category);
    } else {
      setTitle('');
      // Set default to current local date
      const date = new Date();
      const tzOffset = date.getTimezoneOffset() * 60000;
      const localISODate = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 10);
      setDateTime(localISODate);
      setType('custom');
      setIcon('🎉');
      setIsPinned(false);
      setNotes('');
      setCategory('past');
    }
  }, [editingAnniversary, isOpen]);

  // Automatically determine if the selected date is in the past or future
  useEffect(() => {
    if (!dateTime) return;
    // Parse the date as local midnight to determine past/future
    const selectedMs = new Date(`${dateTime}T00:00:00`).getTime();
    const nowMs = Date.now();
    if (selectedMs > nowMs) {
      setCategory('future');
      if (type === 'custom') setType('countdown');
    } else {
      setCategory('past');
      if (type === 'countdown') setType('custom');
    }
  }, [dateTime]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (!dateTime) return;

    // Save with local midnight converted to UTC
    const localMidnightDate = new Date(`${dateTime}T00:00:00`);

    onSave({
      id: editingAnniversary?.id,
      title: title.trim(),
      dateTime: localMidnightDate.toISOString(),
      type,
      isPinned,
      notes: undefined,
      icon,
      category,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Title and Close */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-950/50">
          <h3 className="font-semibold text-lg text-white">
            {editingAnniversary ? '编辑纪念日/倒计时' : '新增纪念日/倒计时'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
            id="close-anniversary-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              事件名称
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 30))}
              className="w-full text-sm px-4 py-3 bg-slate-950 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="如：高考、相识、买房、三十岁生日..."
              maxLength={30}
              id="event-title-input"
            />
          </div>

          {/* DateTime Picker */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              选择日期
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full text-sm px-4 py-3 bg-slate-950 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                id="event-date-input"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <span>{category === 'past' ? '📅 这是一个过去的日期，将开启[正计时]' : '⏳ 这是一个未来的日期，将开启[倒计时]'}</span>
            </p>
          </div>

          {/* Event Category / Type */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              记录场景分类
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_LABELS.map((cat: any) => {
                // Disable life/love/marriage for future events since they are typically past
                const isDisabled = category === 'future' && (cat.value === 'life' || cat.value === 'love' || cat.value === 'marriage');
                if (isDisabled) return null;

                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setType(cat.value)}
                    className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                      type === cat.value
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-md shadow-indigo-500/10 scale-102'
                        : 'bg-slate-950/40 text-slate-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="mr-1">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Emoji Icon Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              选择图标 (表情符号)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value.slice(0, 2))}
                className="w-12 h-12 text-center text-xl bg-slate-950 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-indigo-500"
                placeholder="🎉"
                maxLength={2}
                title="自定义 Emoji"
              />
              <div className="flex-1 overflow-x-auto whitespace-nowrap p-1 bg-slate-950/40 border border-white/5 rounded-2xl flex items-center gap-2 no-scrollbar">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setIcon(e)}
                    className={`w-10 h-10 flex-shrink-0 flex items-center justify-center text-xl rounded-xl transition-all ${
                      icon === e ? 'bg-indigo-500/20 border border-indigo-400 scale-110' : 'hover:bg-white/5'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pin to Top Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-950/40 border border-white/5 rounded-2xl">
            <div className="flex items-center gap-2">
              <Pin className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-xs font-semibold text-white">置顶显示</p>
                <p className="text-[10px] text-slate-400">优先展示在首页和记录列表顶部</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="sr-only peer"
                id="pin-toggle-checkbox"
              />
              <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-indigo-500 peer-checked:to-purple-500"></div>
            </label>
          </div>



        </form>

        {/* Action Footer */}
        <div className="px-6 py-4 border-t border-white/5 bg-slate-950/50 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-xs font-medium transition-all"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !dateTime}
            className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 active:scale-98 text-white rounded-2xl text-xs font-semibold shadow-lg shadow-indigo-500/10 transition-all disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none"
            id="save-anniversary-btn"
          >
            保存事件
          </button>
        </div>

      </div>
    </div>
  );
}
