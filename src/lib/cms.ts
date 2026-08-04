import { items } from '@wix/data';
import type { Locale } from './locales';

export type CmsPage = {
  _id: string;
  title?: string;
  slug?: string;
  language?: string;
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
 * SSR fetch — no long-lived cache.
 * Dashboard CMS edits appear on the next request without a code redeploy
 * because pages render on the server against live Wix Data.
 */
export async function loadPageBySlug(locale: Locale, slug: string): Promise<PageLoadResult> {
  let pageRows: CmsPage[] = [];
  try {
    const result = await items
      .query('Pages')
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
          collection: 'Pages',
          message:
            'CMS collection "Pages" is missing. In the Wix dashboard create a collection named Pages with fields: title (Text), slug (Text), language (Text).',
          detail: String((err as Error)?.message ?? err),
        },
      };
    }
    return {
      status: 'cms_error',
      error: {
        kind: 'query_failed',
        collection: 'Pages',
        message: 'Failed to query Pages. Check collection fields and permissions (read: Anyone).',
        detail: String((err as Error)?.message ?? err),
      },
    };
  }

  const page = pageRows[0];
  if (!page) {
    // Exists in default language?
    try {
      const fallback = await items
        .query('Pages')
        .eq('slug', slug)
        .eq('language', 'lt')
        .limit(1)
        .find();
      if ((fallback.items ?? []).length > 0) {
        return { status: 'not_translated', slug, locale };
      }
    } catch {
      /* ignore */
    }
    return { status: 'not_found', slug, locale };
  }

  let sections: CmsSection[] = [];
  try {
    const sec = await items
      .query('Sections')
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
          collection: 'Sections',
          message:
            'CMS collection "Sections" is missing. Create Sections with fields: page (Reference→Pages), order (Number), type (Text), heading, subheading, body (Rich Text), image (Image), ctaLabel, ctaUrl, items (Text).',
          detail: String((err as Error)?.message ?? err),
        },
      };
    }
    return {
      status: 'cms_error',
      error: {
        kind: 'query_failed',
        collection: 'Sections',
        message: 'Failed to query Sections. Ensure the page reference field and read permissions are set.',
        detail: String((err as Error)?.message ?? err),
      },
    };
  }

  return { status: 'ok', page, sections };
}

export async function listNavPages(locale: Locale): Promise<CmsPage[]> {
  try {
    const result = await items.query('Pages').eq('language', locale).ascending('slug').limit(50).find();
    return (result.items ?? []) as CmsPage[];
  } catch {
    return [];
  }
}
