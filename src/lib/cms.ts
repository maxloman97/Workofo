import { items } from '@wix/data';
import type { Locale } from './locales';
import { DEFAULT_LOCALE, LOCALES } from './locales';

export const SITE_PAGES = 'SitePages';
export const SITE_SECTIONS = 'SiteSections';

export type CmsPage = {
  _id: string;
  title?: string;
  slug?: string;
  language?: string;
  navLabel?: string;
  navOrder?: number;
};

export type CmsSection = {
  _id: string;
  page?: string | CmsPage;
  order?: number;
  type?: string;
  heading?: string;
  subheading?: string;
  body?: unknown;
  image?: unknown;
  ctaLabel?: string;
  ctaUrl?: string;
  items?: unknown;
};

export type CmsError = {
  kind: 'missing_collection' | 'query_failed';
  collection: string;
  message: string;
  detail?: string;
};

export type PageLoadResult =
  | { status: 'ok'; page: CmsPage; sections: CmsSection[] }
  | { status: 'not_translated'; slug: string; locale: Locale }
  | { status: 'cms_error'; error: CmsError }
  | { status: 'not_found'; slug: string; locale: Locale };

function isMissingCollection(err: unknown): boolean {
  const msg = String((err as Error)?.message ?? err ?? '');
  return /WDE0027|collection.*(not found|does not exist)|does not exist/i.test(msg);
}

/**
 * SSR fetch against SitePages / SiteSections (new redesign CMS).
 * Dashboard edits appear on the next request without a code redeploy.
 */
export async function loadPageBySlug(locale: Locale, slug: string): Promise<PageLoadResult> {
  let pageRows: CmsPage[] = [];
  try {
    const result = await items
      .query(SITE_PAGES)
      .eq('slug', slug)
      .eq('language', locale)
      .limit(1)
      .find();
    pageRows = (result.items ?? []) as CmsPage[];
  } catch (err) {
    if (isMissingCollection(err)) {
      return {
        status: 'cms_error',
        error: {
          kind: 'missing_collection',
          collection: SITE_PAGES,
          message: `CMS collection "${SITE_PAGES}" is missing. Run scripts/seed.mjs to create SitePages / SiteSections.`,
          detail: String((err as Error)?.message ?? err),
        },
      };
    }
    return {
      status: 'cms_error',
      error: {
        kind: 'query_failed',
        collection: SITE_PAGES,
        message: `Failed to query ${SITE_PAGES}. Check fields and permissions (read: Anyone).`,
        detail: String((err as Error)?.message ?? err),
      },
    };
  }

  const page = pageRows[0];
  if (!page) {
    // Check whether this slug exists in any other language (prefer default EN).
    try {
      for (const other of [DEFAULT_LOCALE, ...LOCALES.filter((l) => l !== locale && l !== DEFAULT_LOCALE)]) {
        if (other === locale) continue;
        const fallback = await items
          .query(SITE_PAGES)
          .eq('slug', slug)
          .eq('language', other)
          .limit(1)
          .find();
        if ((fallback.items ?? []).length > 0) {
          return { status: 'not_translated', slug, locale };
        }
      }
    } catch {
      /* ignore */
    }
    return { status: 'not_found', slug, locale };
  }

  let sections: CmsSection[] = [];
  try {
    const sec = await items
      .query(SITE_SECTIONS)
      .eq('page', page._id)
      .ascending('order')
      .limit(100)
      .find();
    sections = (sec.items ?? []) as CmsSection[];
  } catch (err) {
    if (isMissingCollection(err)) {
      return {
        status: 'cms_error',
        error: {
          kind: 'missing_collection',
          collection: SITE_SECTIONS,
          message: `CMS collection "${SITE_SECTIONS}" is missing. Run scripts/seed.mjs.`,
          detail: String((err as Error)?.message ?? err),
        },
      };
    }
    return {
      status: 'cms_error',
      error: {
        kind: 'query_failed',
        collection: SITE_SECTIONS,
        message: `Failed to query ${SITE_SECTIONS}.`,
        detail: String((err as Error)?.message ?? err),
      },
    };
  }

  return { status: 'ok', page, sections };
}

export async function listNavPages(locale: Locale): Promise<CmsPage[]> {
  try {
    const result = await items
      .query(SITE_PAGES)
      .eq('language', locale)
      .ascending('navOrder')
      .limit(50)
      .find();
    return (result.items ?? []) as CmsPage[];
  } catch {
    return [];
  }
}
