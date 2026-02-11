export type FestivalCategory = 'eid' | 'fasting' | 'hajj' | 'remembrance' | 'night_worship' | 'sacred_month';
export type FestivalImportance = 'major' | 'significant' | 'observance';

export interface Festival {
  name: string;
  arabic_name?: string;
  hijri_month: number;
  hijri_day: number;
  hijri_month_name: string;
  gregorian_date: string;
  category: FestivalCategory;
  importance: FestivalImportance;
  description: string;
  traditions?: string[];
  duration_days?: number;
  day_of_event?: number;
}

export interface UpcomingFestival extends Festival {
  days_until: number;
}
