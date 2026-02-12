export interface HijriDate {
  hijri_year: number;
  hijri_month: number;
  hijri_day: number;
  hijri_month_name: string;
  weekday: string;
  gregorian_date: string;
  criterion: string;
  events?: HijriEvent[];
}

export interface HijriEvent {
  name: string;
  hijri_month: number;
  hijri_day: number;
  category: string;
  importance: string;
  description?: string;
}

export interface HijriMonthDay {
  hijri_day: number;
  gregorian_date: string;
  weekday: string;
  events?: HijriEvent[];
}

export interface HijriMonth {
  hijri_year: number;
  hijri_month: number;
  hijri_month_name: string;
  days: HijriMonthDay[];
  criterion: string;
}

export type CalendarViewMode = 'hijri' | 'gregorian';

export interface GregorianMonthDay {
  gregorian_date: string;
  gregorian_day: number;
  weekday: string;
  hijri_year: number;
  hijri_month: number;
  hijri_day: number;
  hijri_month_name: string;
  events?: HijriEvent[];
}

export interface GregorianMonth {
  year: number;
  month: number; // 1-12
  days: GregorianMonthDay[];
}
