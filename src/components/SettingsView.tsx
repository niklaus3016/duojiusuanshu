import React, { useState } from 'react';
import { 
  Settings, Shield, Trash2, HelpCircle, 
  Sparkles, Check, ChevronRight, User
} from 'lucide-react';
import { AppSettings, Anniversary } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  anniversaries: Anniversary[];
  onClearAllData: () => void;
  fontSizeClass: string;
  onOpenPrivacyPolicy: () => void;
}

export default function SettingsView({
  settings,
  onUpdateSettings,
  anniversaries,
  onClearAllData,
  fontSizeClass,
  onOpenPrivacyPolicy,
}: SettingsViewProps) {
  const [nicknameInput, setNicknameInput] = useState(settings.nickname || '时光旅人');
  const [watermarkInput, setWatermarkInput] = useState(settings.watermark || '多久算数');
  const [showGuide, setShowGuide] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showEraseConfirm, setShowEraseConfirm] = useState(false);

  const savePersonalConfig = () => {
    onUpdateSettings({
      nickname: nicknameInput.trim() || '时光旅人',
      watermark: watermarkInput.trim() || '多久算数',
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  const guides = [
    {
      q: '如何生成漂亮的分享海报？',
      a: '在首页的各个计算模块、或者「我的纪念日」列表中，点击「海报」图标按钮，即可打开定制界面。您可以实时选择渐变色皮肤、修改落款昵称、添加个性水印，一键导出高清大图保存到相册，发朋友圈或分享给亲友。'
    },
    {
      q: '“虚岁年龄”是如何计算的？',
      a: '虚岁是中华传统民俗年龄，算法为「当前年份 - 出生年份 + 1」。民俗中出生即算一岁，且每次过完农历大年初一（年关）即长一岁，代表生命走过的年份长度。'
    }
  ];

  return (
    <div className={`space-y-6 pb-20 ${fontSizeClass}`}>
      
      {/* Page Header */}
      <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-1.5">
            <span>应用设置</span>
            <Settings className="w-5 h-5 text-indigo-400" />
          </h2>
          <p className="text-[10px] text-slate-400">深度定制你的个性化时间体验</p>
        </div>
        <span className="text-[9px] font-bold text-indigo-400 uppercase bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
          SETTINGS PRO
        </span>
      </div>

      {/* 1. Personalization Config */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 space-y-5 shadow-xl">
        <div className="flex items-center">
          <span className="bg-indigo-500/10 text-indigo-300 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span>海报落款与水印个性化</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">默认落款昵称</label>
            <input 
              type="text" 
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value.slice(0, 15))}
              className="w-full text-xs px-3.5 py-2.5 bg-[#050510] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              placeholder="如：时光旅人"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">海报防伪水印</label>
            <input 
              type="text" 
              value={watermarkInput}
              onChange={(e) => setWatermarkInput(e.target.value.slice(0, 15))}
              className="w-full text-xs px-3.5 py-2.5 bg-[#050510] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              placeholder="如：多久算数"
            />
          </div>
        </div>

        <button
          onClick={savePersonalConfig}
          className={`w-full py-3 active:scale-98 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isSaved
              ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10'
              : 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/10'
          }`}
        >
          <Check className="w-4 h-4" />
          <span>{isSaved ? '保存成功！' : '保存配置修改'}</span>
        </button>
      </div>

      {/* 2. Secure sandboxed cache clean */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 space-y-3 shadow-xl">
        <div className="space-y-3">
          {/* Privacy Policy Button */}
          <button
            onClick={onOpenPrivacyPolicy}
            className="w-full py-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>查看完整隐私政策</span>
          </button>

          {/* Delete All Reset */}
          {showEraseConfirm ? (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-center space-y-3">
              <p className="text-xs text-rose-400 font-bold leading-relaxed">
                ⚠️ 极其危险警告：确定要彻底清空本地所有配置、人生、恋爱记录以及您创建的所有纪念日吗？此操作完全在本地发生，不可逆转，且无法撤销！
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    onClearAllData();
                    setShowEraseConfirm(false);
                  }}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all"
                >
                  确定清空
                </button>
                <button
                  onClick={() => setShowEraseConfirm(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowEraseConfirm(true)}
              className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>擦除本地所有缓存记录数据</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Instructions Guide (Accordion) */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 space-y-5 shadow-xl">
        <div className="flex items-center">
          <span className="bg-amber-500/10 text-amber-300 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>使用手册与操作指南</span>
          </span>
        </div>

        <div className="space-y-2.5">
          {guides.map((g, idx) => (
            <div 
              key={idx}
              className="bg-white/5 border border-white/10 rounded-[20px] overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setShowGuide(showGuide === idx ? null : idx)}
                className="w-full px-4 py-3.5 text-left text-xs font-semibold text-white flex justify-between items-center hover:bg-white/5 transition-all cursor-pointer"
              >
                <span>{g.q}</span>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showGuide === idx ? 'rotate-90' : ''}`} />
              </button>
              {showGuide === idx && (
                <div className="px-4 pb-4 pt-1.5 text-xs text-slate-300 leading-relaxed border-t border-white/10 bg-[#050510]/50">
                  {g.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. About us */}
      <div className="text-center py-6 space-y-2 select-none">
        <div className="flex items-center justify-center gap-1.5 text-white">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-bold tracking-wider">多久算数 V1.0</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed max-w-[280px] mx-auto">
          让每一份美好的回忆，在光阴中泛起涟漪
        </p>
      </div>

    </div>
  );
}
