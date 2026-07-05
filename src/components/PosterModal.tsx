import React, { useRef, useState, useEffect } from 'react';
import { X, Download, Paintbrush, Quote, Sparkles } from 'lucide-react';

interface PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  countValue: string;
  countUnit: string;
  subText: string;
  quote: string;
  nickname: string;
  watermark: string;
}

const GRADIENTS = [
  { name: '治愈薰衣草', from: '#6366f1', via: '#a855f7', to: '#ec4899' },
  { name: '静谧极光', from: '#0284c7', via: '#0d9488', to: '#10b981' },
  { name: '晨曦微光', from: '#f59e0b', via: '#ef4444', to: '#ec4899' },
  { name: '深海幽蓝', from: '#1e1b4b', via: '#312e81', to: '#4338ca' },
  { name: '森野幽境', from: '#064e3b', via: '#022c22', to: '#111827' },
];

export default function PosterModal({
  isOpen,
  onClose,
  title,
  countValue,
  countUnit,
  subText,
  quote,
  nickname,
  watermark,
}: PosterModalProps) {
  const [selectedGradient, setSelectedGradient] = useState(0);
  const [customWatermark, setCustomWatermark] = useState(watermark || '多久算数');
  const [customNickname, setCustomNickname] = useState(nickname || '时光旅人');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (watermark) setCustomWatermark(watermark);
    if (nickname) setCustomNickname(nickname);
  }, [watermark, nickname]);

  if (!isOpen) return null;

  const gradient = GRADIENTS[selectedGradient];
  const isCountdown = subText.includes('剩余');
  const isPast = subText.includes('已过');
  const prefixText = isCountdown ? '剩余 ' : (isPast ? '已过 ' : '');
  const shouldDrawSubtext = !subText.includes('年') || !subText.includes('月') || !subText.includes('天');

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-res canvas sizes (1200 x 1920, standard 9:16 poster size)
    canvas.width = 1200;
    canvas.height = 1920;

    // 1. Draw beautiful gradient background
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, gradient.from);
    grad.addColorStop(0.5, gradient.via);
    grad.addColorStop(1, gradient.to);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw glowing glass ambient spheres
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.arc(200, 400, 350, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.arc(1000, 1400, 450, 0, Math.PI * 2);
    ctx.fill();

    // 3. Draw frosted glass container card
    const cardX = 120;
    const cardY = 240;
    const cardWidth = 960;
    const cardHeight = 1440;
    const cardRadius = 60;

    ctx.save();
    // Glass card shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 80;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 30;

    // Draw card border path
    ctx.beginPath();
    ctx.roundRect?.(cardX, cardY, cardWidth, cardHeight, cardRadius);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fill();
    ctx.restore();

    // Card white highlight border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect?.(cardX, cardY, cardWidth, cardHeight, cardRadius);
    ctx.stroke();

    // 4. Draw Header / Nickname
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(customNickname, canvas.width / 2, cardY + 150);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '32px sans-serif';
    ctx.fillText('用时间丈量生命的维度', canvas.width / 2, cardY + 210);

    // Thin separator line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + 150, cardY + 280);
    ctx.lineTo(cardX + cardWidth - 150, cardY + 280);
    ctx.stroke();

    // 5. Draw Title of event
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = 'bold 56px sans-serif';
    ctx.fillText(title, canvas.width / 2, cardY + 410);

    // 6. Draw main counting number and unit with prefix (side by side, beautifully aligned)
    ctx.save();
    
    // Measure sizes for exact center alignment
    ctx.font = 'bold 54px sans-serif';
    const prefixWidth = prefixText ? ctx.measureText(prefixText).width : 0;
    
    ctx.font = 'bold 180px sans-serif';
    const valueWidth = ctx.measureText(countValue).width;
    
    ctx.font = 'bold 54px sans-serif';
    const unitWidth = ctx.measureText(countUnit).width;
    
    const gap = 20;
    const totalWidth = prefixWidth + valueWidth + gap + unitWidth;
    const startX = (canvas.width - totalWidth) / 2;
    const baselineY = cardY + 660;
    
    // Draw prefix text if exists
    if (prefixText) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = 'bold 54px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(prefixText, startX, baselineY - 8);
    }

    // Draw huge glowing counting number
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 180px sans-serif';
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
    ctx.shadowBlur = 30;
    ctx.fillText(countValue, startX + prefixWidth, baselineY);
    ctx.shadowBlur = 0; // reset shadow
    
    // Draw unit next to it, slightly smaller and aligned to baseline
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 54px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(countUnit, startX + prefixWidth + valueWidth + gap, baselineY - 8);
    ctx.restore();

    // 7. Draw Sub-breakdowns or milestones (Omit if it contains standard time breakdown to avoid clutter)
    if (shouldDrawSubtext) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.font = '36px sans-serif';
      ctx.fillText(subText, canvas.width / 2, cardY + 840);
    }

    // Decorative quote box
    const quoteY = cardY + 980;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath();
    ctx.roundRect?.(cardX + 100, quoteY, cardWidth - 200, 260, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();

    // Quote icon mark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = 'bold 80px Georgia, serif';
    ctx.fillText('“', cardX + 180, quoteY + 90);

    // Quote text (wrapped dynamically)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.font = 'italic 34px sans-serif';
    
    // Simple wrap text
    const words = quote.split('');
    let line = '';
    let currentY = quoteY + 110;
    const maxWidth = cardWidth - 400;
    const lineHeight = 50;

    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n];
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, canvas.width / 2 + 30, currentY);
        line = words[n];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2 + 30, currentY);

    // 8. Footer Watermark / QR Code placeholder
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '30px sans-serif';
    ctx.fillText(`— @${customWatermark} —`, canvas.width / 2, cardY + cardHeight - 80);

    // Create download link
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `多久算数_${title.replace(/\s+/g, '')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      alert('保存失败，请截屏保存当前海报界面');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      {/* Hidden high-res canvas */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative w-full max-w-md bg-[#050510] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col h-[90vh]">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-lg">生成时间海报</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
            id="close-poster-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Real-time Web Poster Preview */}
          <div className="relative">
            <div className="text-center text-xs text-slate-400 mb-2 flex items-center justify-center gap-1">
              <span>💡 海报预览 (实际生成将为 1200x1920 高清大图)</span>
            </div>
            
            <div
              ref={previewRef}
              style={{
                background: `linear-gradient(135deg, ${gradient.from}, ${gradient.via}, ${gradient.to})`,
              }}
              className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden shadow-xl p-4 flex flex-col justify-between text-white transition-all duration-500 border border-white/10"
            >
              {/* Blur orbs */}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />

              {/* Poster card container */}
              <div className="relative flex-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 flex flex-col justify-between shadow-inner">
                {/* Header info */}
                <div className="text-center mt-2">
                  <p className="text-xs font-semibold tracking-wide text-white/90">{customNickname}</p>
                  <p className="text-[9px] text-white/60 mt-0.5">用时间丈量生命的维度</p>
                  <div className="w-12 h-[1px] bg-white/20 mx-auto mt-2" />
                </div>

                {/* Main countdown displays */}
                <div className="text-center my-auto py-2">
                  <h4 className="text-sm font-medium text-white/80 tracking-wide mb-1.5">{title}</h4>
                  <div className="flex items-baseline justify-center gap-1 mt-1.5 mb-2.5">
                    {prefixText && (
                      <span className="text-sm font-bold text-white/85 mr-1 select-none">
                        {prefixText.trim()}
                      </span>
                    )}
                    <span className="text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent drop-shadow-sm">
                      {countValue}
                    </span>
                    <span className="text-sm font-bold text-white/90 ml-1">
                      {countUnit}
                    </span>
                  </div>
                  {shouldDrawSubtext && (
                    <p className="text-[10px] text-white/70 max-w-[200px] mx-auto line-clamp-2">
                      {subText}
                    </p>
                  )}
                </div>

                {/* Quote box */}
                <div className="bg-black/10 rounded-xl p-3 border border-white/5 text-center my-1 relative">
                  <Quote className="w-3 h-3 text-white/30 absolute left-2 top-2" />
                  <p className="text-[10px] italic text-white/90 leading-relaxed font-sans px-3">
                    {quote}
                  </p>
                </div>

                {/* Footer watermark */}
                <div className="text-center pb-2">
                  <p className="text-[9px] tracking-widest text-white/40 uppercase">
                    — @{customWatermark} —
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customization controls */}
          <div className="space-y-4 bg-white/5 p-5 rounded-[24px] border border-white/10">
            {/* Gradient Selector */}
            <div>
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-2">
                <Paintbrush className="w-3.5 h-3.5 text-indigo-400" />
                <span>海报配色模版</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {GRADIENTS.map((g, idx) => (
                  <button
                    key={g.name}
                    onClick={() => setSelectedGradient(idx)}
                    style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
                    className={`h-8 rounded-lg relative transition-all border-2 cursor-pointer ${
                      selectedGradient === idx ? 'border-white scale-105 shadow-md shadow-indigo-500/20' : 'border-transparent hover:scale-102'
                    }`}
                    title={g.name}
                  />
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">当前选用: {gradient.name}</p>
            </div>

            {/* Inputs for text personalization */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  落款昵称
                </label>
                <input
                  type="text"
                  value={customNickname}
                  onChange={(e) => setCustomNickname(e.target.value.slice(0, 15))}
                  className="w-full text-xs px-3 py-2 bg-[#050510] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  placeholder="如：时光旅人"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  海报水印
                </label>
                <input
                  type="text"
                  value={customWatermark}
                  onChange={(e) => setCustomWatermark(e.target.value.slice(0, 15))}
                  className="w-full text-xs px-3 py-2 bg-[#050510] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  placeholder="如：多久算数"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 rounded-xl text-xs font-medium transition-all cursor-pointer"
          >
            取消
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 active:scale-98 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
            id="download-poster-btn"
          >
            <Download className="w-4 h-4" />
            <span>保存到本地相册</span>
          </button>
        </div>
      </div>
    </div>
  );
}
