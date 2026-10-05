/** Locales for the SaaS marketing site. Localization is CMS-driven via SitePages.language — no translation-key files. */
export const LOCALES = ['en', 'lt', 'se'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  lt: 'LT',
  se: 'SE',
};

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  lt: 'Lietuvių',
  se: 'Svenska',
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export function htmlLang(locale: Locale): string {
  // Swedish uses ISO 639-1 "sv"; we keep URL segment as "se" per product brief.
  if (locale === 'se') return 'sv';
  return locale;
}

/** Hard-coded chrome / UI strings (CMS still owns page content). */
export const UI = {
  skip: {
    lt: 'Pereiti prie turinio',
    en: 'Skip to content',
    se: 'Hoppa till innehåll',
  },
  blog: {
    lt: 'Blogas',
    en: 'Blog',
    se: 'Blogg',
  },
  solutions: {
    lt: 'Sprendimai',
    en: 'Solutions',
    se: 'Lösningar',
  },
  bookDemo: {
    lt: 'Užsisakyti demo',
    en: 'Book a demo',
    se: 'Boka en demo',
  },
  login: {
    lt: 'Prisijungti',
    en: 'Login',
    se: 'Logga in',
  },
  watchVideo: {
    lt: 'Žiūrėti video',
    en: 'Watch a video',
    se: 'Titta på video',
  },
  heroEyebrow: {
    lt: 'AI darbo jėgos planavimas',
    en: 'AI workforce scheduling',
    se: 'AI-schemaläggning för personal',
  },
  footerCopy: {
    lt: 'Turinys valdomas Wix CMS.',
    en: 'Content managed in Wix CMS.',
    se: 'Innehåll hanteras i Wix CMS.',
  },
  footerLegal: {
    lt: 'Workofo Europe ApS · 42015784 · Amager Strandvej 230, 2300 Copenhagen',
    en: 'Workofo Europe ApS · 42015784 · Amager Strandvej 230, 2300 Copenhagen',
    se: 'Workofo Europe ApS · 42015784 · Amager Strandvej 230, 2300 Copenhagen',
  },
  notTranslated: {
    lt: 'Dar neišversta',
    en: 'Not translated yet',
    se: 'Inte översatt ännu',
  },
  viewLt: {
    lt: 'Žiūrėti anglišką versiją',
    en: 'View English version',
    se: 'Visa engelsk version',
  },
  pageNotFound: {
    lt: 'Puslapis nerastas',
    en: 'Page not found',
    se: 'Sidan hittades inte',
  },
  backHome: {
    lt: 'Į pradžią',
    en: 'Back home',
    se: 'Till startsidan',
  },
  blogIntro: {
    lt: 'Naujienos iš Workofo komandos — redaguojama Wix Blog.',
    en: 'Updates from the Workofo team — managed in the Wix Blog editor.',
    se: 'Uppdateringar från Workofo-teamet — hanteras i Wix Blog.',
  },
  blogEmpty: {
    lt: 'Dar nėra paskelbtų įrašų.',
    en: 'No published posts yet. Publish one in the Wix dashboard Blog app.',
    se: 'Inga publicerade inlägg ännu.',
  },
  formSending: {
    lt: 'Siunčiama…',
    en: 'Sending…',
    se: 'Skickar…',
  },
  formSuccess: {
    lt: 'Ačiū — gavome užklausą ir greitai susisieksime.',
    en: 'Thanks — we received your request and will be in touch shortly.',
    se: 'Tack — vi har mottagit din förfrågan och återkommer snart.',
  },
  formFail: {
    lt: 'Nepavyko išsiųsti. Bandykite dar kartą.',
    en: 'Submission failed. Please try again.',
    se: 'Det gick inte att skicka. Försök igen.',
  },
  formNetwork: {
    lt: 'Tinklo klaida. Bandykite dar kartą.',
    en: 'Network error. Please try again.',
    se: 'Nätverksfel. Försök igen.',
  },
  formLegal: {
    lt: 'Pateikdamas užklausą patvirtinu, kad Workofo Europe ApS, 42015784, Amager Strandvej 230, 2300 Copenhagen, tvarkys mano duomenis komunikacijai. Duomenys saugomi 6 mėn. nuo pateikimo.',
    en: 'I am informed that when submitting this request, Workofo Europe ApS, 42015784, Amager Strandvej 230, 2300 Copenhagen, will process my data for communication and response purposes. These data will be stored for 6 months from the date of their submission.',
    se: 'Jag är informerad om att Workofo Europe ApS, 42015784, Amager Strandvej 230, 2300 Copenhagen, behandlar mina uppgifter för kommunikation. Uppgifterna lagras i 6 månader från inlämningsdatumet.',
  },
  formReply: {
    lt: 'Paprastai atsakome per 1 darbo dieną.',
    en: 'We usually respond within 1 business day.',
    se: 'Vi svarar vanligtvis inom 1 arbetsdag.',
  },
} as const;

export function ui(key: keyof typeof UI, locale: Locale): string {
  return UI[key][locale] ?? UI[key].en;
}
