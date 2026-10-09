import { DEFAULT_LOCALE, type Locale } from './locales';
import { isIndustrySlug, type IndustrySlug } from './solutions';

/** Path relative to locale root, always starting with `/` (e.g. `/home`, `/blog/foo`). */
export function normalizePath(path = '/'): string {
  if (!path || path === '/') return '/';
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Build a locale-aware href. English (default) has no `/en` prefix.
 * Examples: localePath('en','/home') → '/home'; localePath('se','/home') → '/se/home'
 */
export function localePath(locale: Locale, path = '/'): string {
  const p = normalizePath(path);
  if (locale === DEFAULT_LOCALE) {
    return p === '/' ? '/' : p;
  }
  if (p === '/') return `/${locale}/home`;
  return `/${locale}${p}`;
}

/** Canonical industry URLs: `/industries/{slug}` (EN unprefixed). */
export function industryPath(locale: Locale, slug: IndustrySlug): string {
  return localePath(locale, `/industries/${slug}`);
}

/**
 * Map legacy public paths to the current canonical pathname.
 * Returns null when no redirect is needed.
 */
export function legacyPathRedirect(pathname: string): string | null {
  const path = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  if (path === '/retail-scheduling-software') {
    return '/industries/retail';
  }

  // English used to live under `/en/…`; strip and remap.
  if (path === '/en' || path === '/en/') return '/';
  if (path.startsWith('/en/')) {
    const rest = path.slice(3) || '/';
    if (rest === '/home') return '/';
    if (rest === '/retail-scheduling-software') return '/industries/retail';
    const enSolutions = rest.match(/^\/solutions\/([^/]+)$/);
    if (enSolutions && isIndustrySlug(enSolutions[1])) {
      return `/industries/${enSolutions[1]}`;
    }
    const enIndustries = rest.match(/^\/industries\/([^/]+)$/);
    if (enIndustries && isIndustrySlug(enIndustries[1])) {
      return `/industries/${enIndustries[1]}`;
    }
    return rest;
  }

  // Unprefixed EN `/solutions/{slug}` → `/industries/{slug}`
  const enSolutions = path.match(/^\/solutions\/([^/]+)$/);
  if (enSolutions && isIndustrySlug(enSolutions[1])) {
    return `/industries/${enSolutions[1]}`;
  }

  // Prefixed locales: `/se|lt/solutions/{slug}` and ranking slug
  const locSolutions = path.match(/^\/(se|lt)\/solutions\/([^/]+)$/);
  if (locSolutions && isIndustrySlug(locSolutions[2])) {
    return `/${locSolutions[1]}/industries/${locSolutions[2]}`;
  }
  const locRetail = path.match(/^\/(se|lt)\/retail-scheduling-software$/);
  if (locRetail) {
    return `/${locRetail[1]}/industries/retail`;
  }

  return null;
}

/** @deprecated Prefer legacyPathRedirect; kept for callers that only strip `/en`. */
export function stripDefaultLocalePrefix(pathname: string): string | null {
  if (!pathname.startsWith('/en')) return null;
  return legacyPathRedirect(pathname);
}
