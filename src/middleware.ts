import { defineMiddleware } from 'astro:middleware';
import { legacyPathRedirect } from './lib/paths';

/**
 * English is the default locale and must not use `/en/…` in public URLs.
 * Legacy industry slugs (`/retail-scheduling-software`, `/solutions/…`) 301 to `/industries/…`.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const target = legacyPathRedirect(pathname);
  if (target != null && target !== pathname) {
    const url = new URL(context.url);
    url.pathname = target;
    return context.redirect(url.pathname + url.search, 301);
  }
  return next();
});
