import { media } from '@wix/sdk';

/** Resolve Wix media URIs or pass through absolute URLs. */
export function imgSrc(value: unknown, w = 1200, h = 800): string {
  if (!value) return '';
  if (typeof value === 'string') {
    if (value.startsWith('wix:image://')) {
      return media.getScaledToFillImageUrl(value, w, h, {});
    }
    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) return value;
    return '';
  }
  if (typeof value === 'object' && value && 'url' in value) {
    return String((value as { url?: string }).url ?? '');
  }
  return '';
}

/**
 * CMS RICH_TEXT may be an HTML string (seeded) or a Ricos tree.
 * Render safely for SSR section bodies.
 */
export function richToHtml(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') {
    // Already HTML from seed, or plain text
    if (value.trim().startsWith('<')) return value;
    return `<p>${escapeHtml(value)}</p>`;
  }
  if (typeof value === 'object' && value && 'nodes' in value) {
    return ricosToHtml(value as RicosDoc);
  }
  return '';
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

type RicosNode = {
  type?: string;
  id?: string;
  nodes?: RicosNode[];
  textData?: { text?: string; decorations?: Array<{ type?: string; linkData?: { link?: { url?: string } } }> };
  headingData?: { level?: number };
};

type RicosDoc = { nodes?: RicosNode[] };

function textFromNode(node: RicosNode): string {
  if (node.type === 'TEXT') {
    let t = escapeHtml(node.textData?.text ?? '');
    for (const d of node.textData?.decorations ?? []) {
      if (d.type === 'BOLD') t = `<strong>${t}</strong>`;
      if (d.type === 'ITALIC') t = `<em>${t}</em>`;
      if (d.type === 'LINK' && d.linkData?.link?.url) {
        t = `<a href="${escapeHtml(d.linkData.link.url)}">${t}</a>`;
      }
    }
    return t;
  }
  return (node.nodes ?? []).map(textFromNode).join('');
}

function ricosToHtml(doc: RicosDoc): string {
  return (doc.nodes ?? [])
    .map((n) => {
      const inner = textFromNode(n);
      switch (n.type) {
        case 'HEADING': {
          const level = Math.min(Math.max(n.headingData?.level ?? 2, 2), 4);
          return `<h${level}>${inner}</h${level}>`;
        }
        case 'BLOCKQUOTE':
          return `<blockquote>${inner}</blockquote>`;
        case 'BULLETED_LIST':
          return `<ul>${(n.nodes ?? []).map((li) => `<li>${textFromNode(li)}</li>`).join('')}</ul>`;
        case 'ORDERED_LIST':
          return `<ol>${(n.nodes ?? []).map((li) => `<li>${textFromNode(li)}</li>`).join('')}</ol>`;
        case 'PARAGRAPH':
        default:
          return `<p>${inner}</p>`;
      }
    })
    .join('');
}

/** Parse featureGrid / pricing `items` JSON-in-text defensively. */
export function parseItemsJson<T = unknown>(raw: unknown): T[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as T[];
  if (typeof raw !== 'string') return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
