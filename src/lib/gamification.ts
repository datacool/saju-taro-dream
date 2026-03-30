// ── 타입 ──────────────────────────────────────────────────────
export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  colorClass: string;
}

export type ServiceKey = 'saju' | 'tarot' | 'dream';
export type StampRecord = Record<string, ServiceKey[]>; // 'YYYY-MM-DD' → 서비스 배열

// ── 업적 정의 ────────────────────────────────────────────────
export const ACHIEVEMENTS: Record<string, Achievement> = {
  first_saju: {
    id: 'first_saju',
    title: '첫 사주 분석',
    desc: '박진인이 처음으로 팔자를 살펴봤습니다',
    icon: '仙',
    colorClass: 'border-violet-500/60 bg-violet-600/20 text-violet-300',
  },
  first_tarot: {
    id: 'first_tarot',
    title: '첫 타로 리딩',
    desc: '마담 셀레스트에게 처음 카드를 받았습니다',
    icon: '✦',
    colorClass: 'border-amber-500/60 bg-amber-500/20 text-amber-300',
  },
  first_dream: {
    id: 'first_dream',
    title: '첫 꿈 해몽',
    desc: '몽신 아라가 처음으로 꿈을 해석했습니다',
    icon: '☽',
    colorClass: 'border-blue-500/60 bg-blue-500/20 text-blue-300',
  },
  all_three: {
    id: 'all_three',
    title: '삼합(三合) 달성',
    desc: '사주·타로·꿈해몽 세 운세를 모두 경험했습니다',
    icon: '◎',
    colorClass: 'border-yellow-400/60 bg-yellow-500/15 text-yellow-300',
  },
};

// ── 날짜 헬퍼 ────────────────────────────────────────────────
export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// ── 스탬프 (데일리 도장) ─────────────────────────────────────
export function loadStamps(): StampRecord {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('fortune_stamps');
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function markStamp(service: ServiceKey): void {
  const stamps = loadStamps();
  const today = todayKey();
  if (!stamps[today]) stamps[today] = [];
  if (!stamps[today].includes(service)) {
    stamps[today].push(service);
    localStorage.setItem('fortune_stamps', JSON.stringify(stamps));
  }
}

export function getTodayStamps(): ServiceKey[] {
  return loadStamps()[todayKey()] ?? [];
}

/** 연속 방문 일수 (오늘 포함) */
export function getStreak(): number {
  const stamps = loadStamps();
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = dateKey(d);
    if (stamps[key]?.length > 0) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

/** 이번 달 날짜별 스탬프 (캘린더용) */
export function getMonthStamps(year: number, month: number): Record<number, ServiceKey[]> {
  const stamps = loadStamps();
  const result: Record<number, ServiceKey[]> = {};
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (stamps[key]?.length > 0) result[d] = stamps[key];
  }
  return result;
}

// ── 업적 ─────────────────────────────────────────────────────
export function loadAchievements(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('fortune_achievements');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

/**
 * 업적을 해금하고, 새로 해금된 Achievement 배열을 반환합니다.
 * 이미 보유한 업적이면 빈 배열 반환.
 * all_three 조건 충족 시 자동 추가.
 */
export function unlockAchievements(id: string): Achievement[] {
  const current = loadAchievements();
  if (current.includes(id)) return [];

  const updated = [...current, id];
  const newOnes: Achievement[] = [];
  if (ACHIEVEMENTS[id]) newOnes.push(ACHIEVEMENTS[id]);

  // 삼합 자동 체크
  if (!updated.includes('all_three')) {
    const hasAll = ['first_saju', 'first_tarot', 'first_dream'].every(a => updated.includes(a));
    if (hasAll) {
      updated.push('all_three');
      newOnes.push(ACHIEVEMENTS['all_three']);
    }
  }

  localStorage.setItem('fortune_achievements', JSON.stringify(updated));
  return newOnes;
}

// ── 타로 카드 도감 ────────────────────────────────────────────
export function saveSeenCards(cardIds: number[]): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('tarot_seen_cards');
    const seen: number[] = raw ? JSON.parse(raw) : [];
    const updated = Array.from(new Set([...seen, ...cardIds]));
    localStorage.setItem('tarot_seen_cards', JSON.stringify(updated));
  } catch { /* noop */ }
}

export function getSeenCards(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('tarot_seen_cards');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
