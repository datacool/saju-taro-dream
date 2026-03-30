'use client';

import { useEffect, useState } from 'react';
import type { Achievement } from '@/lib/gamification';

interface Props {
  queue: Achievement[];
  onDone: () => void;
}

export default function AchievementToast({ queue, onDone }: Props) {
  const [visible, setVisible] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (queue.length === 0) return;
    setVisible(true);
    setIdx(0);
  }, [queue]);

  useEffect(() => {
    if (!visible || queue.length === 0) return;
    const t = setTimeout(() => {
      if (idx < queue.length - 1) {
        setIdx(i => i + 1);
      } else {
        setVisible(false);
        onDone();
      }
    }, 3200);
    return () => clearTimeout(t);
  }, [visible, idx, queue.length, onDone]);

  if (!visible || queue.length === 0) return null;

  const ach = queue[idx];

  return (
    <div
      className="fixed top-4 right-4 z-[200] fade-up pointer-events-none"
      aria-live="polite"
    >
      <div
        className={`border ${ach.colorClass} px-4 py-3 flex items-center gap-3 shadow-2xl backdrop-blur-sm max-w-xs`}
        style={{ background: 'rgba(11,19,38,0.95)' }}
      >
        <div
          className="w-10 h-10 rounded-full border flex items-center justify-center text-xl shrink-0"
          style={{ borderColor: 'currentColor', opacity: 0.8 }}
        >
          {ach.icon}
        </div>
        <div>
          <div className="text-[9px] font-pixel opacity-50 mb-0.5 tracking-widest">업적 달성 ★</div>
          <div className="text-sm font-semibold font-serif-kr leading-tight">{ach.title}</div>
          <div className="text-[11px] opacity-60 mt-0.5 leading-relaxed">{ach.desc}</div>
        </div>
      </div>
    </div>
  );
}
