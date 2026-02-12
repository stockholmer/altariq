/** Ramadan is Hijri month 9 */
export function isRamadan(hijriMonth: number): boolean {
  return hijriMonth === 9;
}

/** Last 10 nights: days 21-30 */
export function isLast10(hijriDay: number): boolean {
  return hijriDay >= 21 && hijriDay <= 30;
}

/** Odd nights in last 10: 21, 23, 25, 27, 29 */
export function isOddNight(hijriDay: number): boolean {
  return isLast10(hijriDay) && hijriDay % 2 === 1;
}

/** Get day number within Ramadan (1-30) */
export function getRamadanDay(hijriDay: number): number {
  return hijriDay;
}
