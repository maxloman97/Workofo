/** Locales for the SaaS marketing site. Localization is CMS-driven via Pages.language — no translation-key files. */
export const LOCALES = ['lt', 'en', 'se'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'lt';

export const LOCALE_LABELS: Record<Locale, string> = {
  lt: 'LT',
  en: 'EN',
  se: 'SE',
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export function htmlLang(locale: Locale): string {
  // Swedish uses ISO 639-1 "sv"; we keep URL segment as "se" per product brief.
  if (locale === 'se') return 'sv';
  return locale;
}
