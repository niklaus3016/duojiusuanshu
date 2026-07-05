export type EventType = 'life' | 'love' | 'marriage' | 'countdown' | 'custom';

export interface Anniversary {
  id: string;
  title: string;
  dateTime: string; // ISO string YYYY-MM-DDTHH:mm:ss
  type: EventType;
  isPinned: boolean;
  notes?: string;
  icon: string; // Emoji or Lucide icon name
  category: 'past' | 'future'; // past for recording (count-up), future for target (countdown)
  isSystem?: boolean; // System pre-set holidays
  themeColor?: string; // Hex or tailwind color name
}

export interface AppSettings {
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  theme: 'dark' | 'light' | 'glass';
  nickname: string;
  watermark: string;
}

export interface LifeData {
  birthDate: string;
  expectedAge: number; // default 80
}

export interface LoveData {
  startDate: string;
  partnerName: string;
}

export interface MarriageData {
  startDate: string;
}
