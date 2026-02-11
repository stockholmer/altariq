import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ar', 'ur', 'bn', 'ms', 'hi', 'fa', 'tr', 'id'],
  defaultLocale: 'en',
});
