'use client';

import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/lib/store/settings';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

const CONVENTION_SHORT: Record<string, string> = {
  mwl: 'MWL',
  isna: 'ISNA',
  egypt: 'Egypt',
  makkah: 'Umm al-Qura',
  karachi: 'Karachi',
  tehran: 'Tehran',
  jafari: 'Jafari',
};

const ASR_SHORT: Record<string, string> = {
  shafii: "Shafi'i",
  hanafi: 'Hanafi',
};

const CRITERION_SHORT: Record<string, string> = {
  umm_al_qura: 'Umm al-Qura',
  isna: 'ISNA',
  mabims: 'MABIMS',
  yallop: 'Yallop',
  odeh: 'Odeh',
  pakistan: 'Pakistan',
  turkey: 'Diyanet',
  tabular: 'Tabular',
};

export default function TransparencyFooter() {
  const t = useTranslations('today');
  const locale = useLocale();
  const router = useRouter();
  const convention = useSettingsStore((s) => s.convention);
  const asrMethod = useSettingsStore((s) => s.asrMethod);
  const criterion = useSettingsStore((s) => s.criterion);

  const label = t('trustLine', {
    convention: CONVENTION_SHORT[convention] ?? convention,
    asr: ASR_SHORT[asrMethod] ?? asrMethod,
    criterion: CRITERION_SHORT[criterion] ?? criterion,
  });

  return (
    <button
      onClick={() => router.push(`/${locale}/settings`)}
      className="block w-full py-2 text-center text-xs text-[var(--text-2)] transition-opacity hover:opacity-70"
    >
      {label}
    </button>
  );
}
