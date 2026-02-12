'use client';

import { useTranslations } from 'next-intl';
import InfoSection from '@/components/about/InfoSection';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div className="space-y-4 pt-2">
      <h2 className="text-xl font-semibold">{t('title')}</h2>

      <InfoSection title={t('prayerTimesTitle')}>
        <p>{t('prayerTimesBody')}</p>
        <table className="mt-3 w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--accent)]/10">
              <th className="pb-1 text-left font-medium">{t('convention')}</th>
              <th className="pb-1 text-left font-medium">{t('fajrAngle')}</th>
              <th className="pb-1 text-left font-medium">{t('ishaAngle')}</th>
            </tr>
          </thead>
          <tbody className="[&_td]:py-0.5">
            <tr><td>MWL</td><td>18&deg;</td><td>17&deg;</td></tr>
            <tr><td>ISNA</td><td>15&deg;</td><td>15&deg;</td></tr>
            <tr><td>Egypt</td><td>19.5&deg;</td><td>17.5&deg;</td></tr>
            <tr><td>Umm al-Qura</td><td>18.5&deg;</td><td>90 min</td></tr>
            <tr><td>Karachi</td><td>18&deg;</td><td>18&deg;</td></tr>
            <tr><td>Tehran</td><td>17.7&deg;</td><td>14&deg;</td></tr>
            <tr><td>Jafari</td><td>16&deg;</td><td>14&deg;</td></tr>
          </tbody>
        </table>
      </InfoSection>

      <InfoSection title={t('asrTitle')}>
        <p>{t('asrBody')}</p>
      </InfoSection>

      <InfoSection title={t('crescentTitle')}>
        <p>{t('crescentBody')}</p>
      </InfoSection>

      <InfoSection title={t('hijriTitle')}>
        <p>{t('hijriBody')}</p>
      </InfoSection>

      <p className="px-1 text-center text-xs text-[var(--text-2)]/70">
        {t('disclaimer')}
      </p>
    </div>
  );
}
