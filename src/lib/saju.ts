export const STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
export const STEMS_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
export const BRANCHES_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
export const ANIMALS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
export const STEM_ELEMENTS = ['목', '목', '화', '화', '토', '토', '금', '금', '수', '수'];
export const BRANCH_ELEMENTS = ['수', '토', '목', '목', '토', '화', '화', '토', '금', '금', '토', '수'];

// 절기 시작일 (근사값): 인월(입춘)~자월(대설), 축월(소한)
const JEOLGI_DATES: [number, number][] = [
  [2, 4], [3, 6], [4, 5], [5, 6], [6, 6],
  [7, 7], [8, 7], [9, 8], [10, 8], [11, 7], [12, 7], [1, 6],
];

// 월지: 인=2, 묘=3, ..., 해=11, 자=0, 축=1
const SAJU_MONTH_BRANCHES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];

// 오호둔법: 년간 % 5 → 인월 시간 시작 인덱스
const MONTH_STEM_START = [0, 2, 4, 6, 8];

// 오자둔법: 일간 % 5 → 자시 시간 시작 인덱스
const HOUR_STEM_START = [0, 2, 4, 6, 8];

export interface Pillar {
  stem: number;
  branch: number;
  stemKor: string;
  branchKor: string;
  stemHanja: string;
  branchHanja: string;
  stemElement: string;
  branchElement: string;
}

export interface SajuResult {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
  animal: string;
  dayMaster: string;
  elements: Record<string, number>;
  sajuYear: number;
  unknownTime: boolean;
}

function makePillar(stemIdx: number, branchIdx: number): Pillar {
  return {
    stem: stemIdx,
    branch: branchIdx,
    stemKor: STEMS[stemIdx],
    branchKor: BRANCHES[branchIdx],
    stemHanja: STEMS_HANJA[stemIdx],
    branchHanja: BRANCHES_HANJA[branchIdx],
    stemElement: STEM_ELEMENTS[stemIdx],
    branchElement: BRANCH_ELEMENTS[branchIdx],
  };
}

function daysSince1900(year: number, month: number, day: number): number {
  const date = new Date(year, month - 1, day);
  const ref = new Date(1900, 0, 1);
  return Math.floor((date.getTime() - ref.getTime()) / 86400000);
}

function getYearPillar(year: number, month: number, day: number) {
  const [ipMonth, ipDay] = JEOLGI_DATES[0]; // 입춘
  const sajuYear = (month < ipMonth || (month === ipMonth && day < ipDay)) ? year - 1 : year;
  const stemIdx = (((sajuYear - 4) % 10) + 10) % 10;
  const branchIdx = (((sajuYear - 4) % 12) + 12) % 12;
  return { pillar: makePillar(stemIdx, branchIdx), sajuYear };
}

function getSajuMonthIndex(month: number, day: number): number {
  if (month === 1) return day >= 6 ? 11 : 10;
  // 2월~12월: 어느 절기를 지났는지 확인
  let result = 11; // 입춘 이전 = 축월
  for (let i = 0; i <= 10; i++) {
    const [sm, sd] = JEOLGI_DATES[i];
    if (month > sm || (month === sm && day >= sd)) result = i;
  }
  return result;
}

function getMonthPillar(month: number, day: number, yearStemIdx: number): Pillar {
  const sajuMonthIdx = getSajuMonthIndex(month, day);
  const branchIdx = SAJU_MONTH_BRANCHES[sajuMonthIdx];
  const stemStartIdx = MONTH_STEM_START[yearStemIdx % 5];
  const stemIdx = (stemStartIdx + sajuMonthIdx) % 10;
  return makePillar(stemIdx, branchIdx);
}

function getDayPillar(year: number, month: number, day: number): Pillar {
  // 기준: 1900-01-01 = 甲戌 (간=0, 지=10)
  const days = daysSince1900(year, month, day);
  const stemIdx = ((0 + days) % 10 + 10) % 10;
  const branchIdx = ((10 + days) % 12 + 12) % 12;
  return makePillar(stemIdx, branchIdx);
}

function getHourBranchIndex(hour: number): number {
  if (hour >= 23 || hour < 1) return 0;
  if (hour < 3)  return 1;
  if (hour < 5)  return 2;
  if (hour < 7)  return 3;
  if (hour < 9)  return 4;
  if (hour < 11) return 5;
  if (hour < 13) return 6;
  if (hour < 15) return 7;
  if (hour < 17) return 8;
  if (hour < 19) return 9;
  if (hour < 21) return 10;
  return 11;
}

function getHourPillar(hour: number, dayStemIdx: number): Pillar {
  const branchIdx = getHourBranchIndex(hour);
  const stemStartIdx = HOUR_STEM_START[dayStemIdx % 5];
  const stemIdx = (stemStartIdx + branchIdx) % 10;
  return makePillar(stemIdx, branchIdx);
}

export function calculateSaju(
  year: number,
  month: number,
  day: number,
  hour: number = 12,
  unknownTime = false
): SajuResult {
  const { pillar: yearPillar, sajuYear } = getYearPillar(year, month, day);
  const monthPillar = getMonthPillar(month, day, yearPillar.stem);
  const dayPillar = getDayPillar(year, month, day);
  const hourPillar = getHourPillar(hour, dayPillar.stem);

  const elements: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  for (const p of [yearPillar, monthPillar, dayPillar, hourPillar]) {
    elements[p.stemElement]++;
    elements[p.branchElement]++;
  }

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    animal: ANIMALS[yearPillar.branch],
    dayMaster: `${dayPillar.stemKor}(${dayPillar.stemHanja})`,
    elements,
    sajuYear,
    unknownTime,
  };
}

export const HOUR_LABELS: Record<number, string> = {
  0: '자시 (23:00-01:00)', 1: '축시 (01:00-03:00)', 2: '인시 (03:00-05:00)',
  3: '묘시 (05:00-07:00)', 4: '진시 (07:00-09:00)', 5: '사시 (09:00-11:00)',
  6: '오시 (11:00-13:00)', 7: '미시 (13:00-15:00)', 8: '신시 (15:00-17:00)',
  9: '유시 (17:00-19:00)', 10: '술시 (19:00-21:00)', 11: '해시 (21:00-23:00)',
};
