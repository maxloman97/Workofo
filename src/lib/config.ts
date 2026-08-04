/**
 * Public runtime config.
 * PUBLIC_WIX_DEMO_FORM_ID — Wix Forms schema id for "Book a Demo".
 * Override via .env.local or `wix env set --key=PUBLIC_WIX_DEMO_FORM_ID --value=<id>`.
 */
export const DEMO_FORM_ID =
  (typeof import.meta !== 'undefined' &&
    (import.meta as ImportMeta & { env?: Record<string, string> }).env?.PUBLIC_WIX_DEMO_FORM_ID) ||
  '59bbe7d1-bc2b-4575-9091-109371c66216';

export const SITE_NAME = 'Workofo';
