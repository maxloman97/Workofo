import { posts } from '@wix/blog';
import { imgSrc } from './rich';

export type BlogPostSummary = {
  _id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  firstPublishedDate?: string | Date;
  coverImageUrl?: string;
};

export async function listBlogPosts(limit = 20): Promise<{ posts: BlogPostSummary[]; error?: string }> {
  try {
    const result = await posts
      .queryPosts({ fieldsets: ['RICH_CONTENT', 'URL'] })
      .descending('firstPublishedDate')
      .limit(limit)
      .find();

    const list: BlogPostSummary[] = (result.items ?? []).map((p: any) => ({
      _id: p._id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || p.plainContent?.slice?.(0, 160) || '',
      firstPublishedDate: p.firstPublishedDate,
      coverImageUrl: imgSrc(p.media?.wixMedia?.image || p.coverImage || p.media?.image, 800, 500),
    }));
    return { posts: list };
  } catch (err) {
    return {
      posts: [],
      error: `Blog query failed. Ensure the Wix Blog app is installed. Detail: ${String((err as Error)?.message ?? err)}`,
    };
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const result = await posts
      .queryPosts({ fieldsets: ['RICH_CONTENT', 'URL'] })
      .eq('slug', slug)
      .limit(1)
      .find();
    const post = result.items?.[0];
    if (!post) return { post: null as null };
    return { post };
  } catch (err) {
    return {
      post: null as null,
      error: `Blog post query failed: ${String((err as Error)?.message ?? err)}`,
    };
  }
}

export function formatPostDate(value: unknown, locale: string): string {
  if (!value) return '';
  try {
    const d = value instanceof Date ? value : new Date(String(value));
    return d.toLocaleDateString(locale === 'se' ? 'sv' : locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}
