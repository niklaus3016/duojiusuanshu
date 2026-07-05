import { Anniversary } from '../types';

export interface TimeDecomposed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  isPast: boolean;
}

// Calculate precise time difference between two date-times
export function calculateTimeDifference(startStr: string, endStr: string): TimeDecomposed {
  const d1 = new Date(startStr);
  const d2 = new Date(endStr);
  
  const isPast = d1.getTime() <= d2.getTime();
  const startDate = isPast ? d1 : d2;
  const endDate = isPast ? d2 : d1;

  const diffMs = endDate.getTime() - startDate.getTime();
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();
  let hours = endDate.getHours() - startDate.getHours();
  let minutes = endDate.getMinutes() - startDate.getMinutes();
  let seconds = endDate.getSeconds() - startDate.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }
  if (minutes < 0) {
    minutes += 60;
    hours--;
  }
  if (hours < 0) {
    hours += 24;
    days--;
  }
  if (days < 0) {
    const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }
  if (months < 0) {
    months += 12;
    years--;
  }

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    isPast,
  };
}

// Calculate age metrics (Completed age, Nominal age, and next birthday countdown)
export interface AgeMetrics {
  completedAge: number; // 周岁
  nominalAge: number; // 虚岁
  birthdayPassedThisYear: boolean;
  nextBirthdayStr: string;
  daysToNextBirthday: number;
}

export function calculateAgeMetrics(birthDateStr: string, nowStr: string): AgeMetrics {
  const birth = new Date(birthDateStr);
  const now = new Date(nowStr);

  // Completed age (周岁)
  let completedAge = now.getFullYear() - birth.getFullYear();
  const birthdayThisYear = new Date(now.getFullYear(), birth.getMonth(), birth.getDate(), birth.getHours(), birth.getMinutes());
  
  const birthdayPassedThisYear = now.getTime() >= birthdayThisYear.getTime();
  if (!birthdayPassedThisYear) {
    completedAge--;
  }

  // Nominal age (虚岁): birth year counts as 1, adds 1 every Chinese Lunar New Year. 
  // Common conversion approximation: completedAge + 1 (if birthday passed) or + 2 (if birthday not passed)
  // Or simply: Current Year - Birth Year + 1. Let's use the standard "Current Year - Birth Year + 1".
  const nominalAge = now.getFullYear() - birth.getFullYear() + 1;

  // Next birthday
  let nextBirthdayYear = now.getFullYear();
  if (birthdayPassedThisYear) {
    nextBirthdayYear++;
  }
  const nextBirthday = new Date(nextBirthdayYear, birth.getMonth(), birth.getDate(), birth.getHours(), birth.getMinutes());
  const msToBirthday = nextBirthday.getTime() - now.getTime();
  const daysToNextBirthday = Math.ceil(msToBirthday / (1000 * 60 * 60 * 24));

  return {
    completedAge,
    nominalAge,
    birthdayPassedThisYear,
    nextBirthdayStr: nextBirthday.toISOString(),
    daysToNextBirthday,
  };
}

// Get standard Chinese traditional lunar holidays and solar high frequency holidays
// Precalculated lunar holiday solar dates for 2026 - 2030 (which fits the timeframe)
const LUNAR_HOLIDAYS_MAP: { [key: number]: { chunjie: string; duanwu: string; zhongqiu: string } } = {
  2026: {
    chunjie: '2026-02-17',
    duanwu: '2026-06-19',
    zhongqiu: '2026-09-25'
  },
  2027: {
    chunjie: '2027-02-06',
    duanwu: '2027-06-09',
    zhongqiu: '2027-09-15'
  },
  2028: {
    chunjie: '2028-01-26',
    duanwu: '2028-05-28',
    zhongqiu: '2028-10-03'
  },
  2029: {
    chunjie: '2029-02-13',
    duanwu: '2029-06-16',
    zhongqiu: '2029-09-22'
  },
  2030: {
    chunjie: '2030-02-03',
    duanwu: '2030-06-05',
    zhongqiu: '2030-09-12'
  },
  2031: {
    chunjie: '2031-01-23',
    duanwu: '2031-06-24',
    zhongqiu: '2031-10-01'
  }
};

export interface HolidayCountdown {
  name: string;
  targetDate: string;
  daysRemaining: number;
}

export function getPresetHolidaysCountdowns(nowStr: string): HolidayCountdown[] {
  const now = new Date(nowStr);
  const currentYear = now.getFullYear();

  const holidays: { name: string; getTargetDate: (year: number) => string }[] = [
    { name: '元旦', getTargetDate: (y) => `${y}-01-01T00:00:00` },
    { name: '春节', getTargetDate: (y) => `${LUNAR_HOLIDAYS_MAP[y]?.chunjie || `${y}-02-05`}T00:00:00` },
    { name: '劳动节', getTargetDate: (y) => `${y}-05-01T00:00:00` },
    { name: '端午节', getTargetDate: (y) => `${LUNAR_HOLIDAYS_MAP[y]?.duanwu || `${y}-06-15`}T00:00:00` },
    { name: '中秋节', getTargetDate: (y) => `${LUNAR_HOLIDAYS_MAP[y]?.zhongqiu || `${y}-09-15`}T00:00:00` },
    { name: '国庆节', getTargetDate: (y) => `${y}-10-01T00:00:00` },
  ];

  return holidays.map(h => {
    let targetYear = currentYear;
    let targetStr = h.getTargetDate(targetYear);
    let targetDate = new Date(targetStr);

    // If holiday already passed this year, point to next year
    if (now.getTime() > targetDate.getTime()) {
      targetYear++;
      targetStr = h.getTargetDate(targetYear);
      targetDate = new Date(targetStr);
    }

    const diffMs = targetDate.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    return {
      name: h.name,
      targetDate: targetStr,
      daysRemaining
    };
  }).sort((a, b) => a.daysRemaining - b.daysRemaining);
}

// Calculate life progress metrics (based on expected age, e.g., 80)
export interface LifeProgressMetrics {
  totalDaysLived: number;
  progressPercent: number;
  expectedDays: number;
  remainingDays: number;
  remainingHours: number;
  remainingMinutes: number;
  remainingSeconds: number;
}

export function calculateLifeProgress(birthDateStr: string, expectedAge: number, nowStr: string): LifeProgressMetrics {
  const birth = new Date(birthDateStr);
  const now = new Date(nowStr);
  const death = new Date(birth.getFullYear() + expectedAge, birth.getMonth(), birth.getDate(), birth.getHours(), birth.getMinutes());

  const livedMs = now.getTime() - birth.getTime();
  const totalDaysLived = Math.floor(livedMs / (1000 * 60 * 60 * 24));

  const totalExpectedMs = death.getTime() - birth.getTime();
  const progressPercent = Math.min(100, Math.max(0, (livedMs / totalExpectedMs) * 100));

  const remainingMs = Math.max(0, death.getTime() - now.getTime());
  const expectedDays = Math.floor(totalExpectedMs / (1000 * 60 * 60 * 24));
  const remainingDays = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
  const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
  const remainingMinutes = Math.floor(remainingMs / (1000 * 60));
  const remainingSeconds = Math.floor(remainingMs / 1000);

  return {
    totalDaysLived,
    progressPercent,
    expectedDays,
    remainingDays,
    remainingHours,
    remainingMinutes,
    remainingSeconds,
  };
}

// Today's progress (time elapsed today)
export interface DayProgress {
  elapsedSeconds: number;
  remainingSeconds: number;
  progressPercent: number;
  remainingHours: number;
}

export function calculateDayProgress(nowStr: string): DayProgress {
  const now = new Date(nowStr);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);

  const elapsedMs = now.getTime() - startOfDay.getTime();
  const totalMs = endOfDay.getTime() - startOfDay.getTime();
  
  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  const remainingSeconds = Math.floor((totalMs - elapsedMs) / 1000);
  const progressPercent = (elapsedMs / totalMs) * 100;
  const remainingHours = Number((remainingSeconds / 3600).toFixed(1));

  return {
    elapsedSeconds,
    remainingSeconds,
    progressPercent,
    remainingHours,
  };
}

// This year's progress (days elapsed and remaining)
export interface YearProgress {
  elapsedDays: number;
  remainingDays: number;
  progressPercent: number;
}

export function calculateYearProgress(nowStr: string): YearProgress {
  const now = new Date(nowStr);
  const currentYear = now.getFullYear();
  const startOfYear = new Date(currentYear, 0, 1, 0, 0, 0);
  const endOfYear = new Date(currentYear + 1, 0, 1, 0, 0, 0);

  const elapsedMs = now.getTime() - startOfYear.getTime();
  const totalMs = endOfYear.getTime() - startOfYear.getTime();

  const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
  const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const remainingDays = totalDays - elapsedDays;
  const progressPercent = (elapsedMs / totalMs) * 100;

  return {
    elapsedDays,
    remainingDays,
    progressPercent,
  };
}

// Get marriage anniversary name based on years
// Standard Chinese wedding anniversaries names:
export function getMarriageAnniversaryName(years: number): string {
  if (years < 1) return '新婚燕尔';
  const names: { [key: number]: string } = {
    1: '纸婚', 2: '棉婚', 3: '皮婚', 4: '花丝婚/丝婚', 5: '木婚',
    6: '铁婚', 7: '铜婚', 8: '陶婚', 9: '柳婚', 10: '锡婚',
    11: '钢婚', 12: '丝婚', 13: '花边婚', 14: '象牙婚', 15: '水晶婚',
    20: '瓷婚', 25: '银婚', 30: '珍珠婚', 35: '珊瑚婚/珊瑚碧玉婚', 40: '红宝石婚',
    45: '蓝宝石婚', 50: '金婚', 55: '绿宝石婚', 60: '金刚钻婚/钻石婚', 70: '白金婚', 80: '橡树婚'
  };

  if (names[years]) return names[years];
  
  // Return nearest lower wedding name
  const sortedYears = Object.keys(names).map(Number).sort((a, b) => b - a);
  for (const y of sortedYears) {
    if (years > y) {
      return `${names[y]}之后 (${years}周年)`;
    }
  }

  return `${years}周年纪念`;
}
