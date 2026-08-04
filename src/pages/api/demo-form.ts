import type { APIRoute } from 'astro';
import { submissions } from '@wix/forms';
import { DEMO_FORM_ID } from '../../lib/config';

/**
 * Book a Demo submissions → Wix Forms.
 * Email notifications are handled in the Wix dashboard via Automations — NOT here.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const formId = String(body.formId || DEMO_FORM_ID);
    const data = (body.submissions || {}) as Record<string, string>;

    const result = await submissions.createSubmission({
      formId,
      submissions: data,
    });

    return new Response(JSON.stringify({ ok: true, id: result._id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    const violations = err?.details?.validationError?.fieldViolations ?? [];
    const fieldErrors: Record<string, string> = {};
    for (const v of violations) {
      for (const fe of v?.data?.errors ?? []) {
        if (fe.errorPath && !fieldErrors[fe.errorPath]) {
          fieldErrors[fe.errorPath] = fe.errorMessage ?? 'Invalid value';
        }
      }
    }
    return new Response(
      JSON.stringify({
        ok: false,
        error: err?.message || 'Submission failed',
        fieldErrors: Object.keys(fieldErrors).length ? fieldErrors : undefined,
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
