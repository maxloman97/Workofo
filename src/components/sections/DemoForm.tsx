import { useMemo, useState, type FormEvent } from 'react';
import { DEMO_FORM_ID } from '../../lib/config';
import { ui, type Locale } from '../../lib/locales';

type FieldModel = {
  target: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  format?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  viewFieldType?: string;
  options?: Array<{ value: string; label: string }>;
};

type Props = {
  heading?: string;
  subheading?: string;
  fields: FieldModel[];
  formId?: string;
  loadError?: string;
  locale?: Locale;
};

function fieldError(field: FieldModel, raw: string, locale: Locale): string {
  const v = (raw ?? '').trim();
  if (field.required && !v) {
    return locale === 'lt'
      ? `${field.label} privalomas.`
      : locale === 'se'
        ? `${field.label} krävs.`
        : `${field.label} is required.`;
  }
  if (!v) return '';
  if (field.minLength && v.length < field.minLength) {
    return `${field.label} — min ${field.minLength}`;
  }
  if (field.maxLength && v.length > field.maxLength) {
    return `${field.label} — max ${field.maxLength}`;
  }
  if (field.format === 'EMAIL' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
    return locale === 'lt'
      ? 'Įveskite galiojantį el. paštą.'
      : locale === 'se'
        ? 'Ange en giltig e-postadress.'
        : 'Please enter a valid email address.';
  }
  if (field.pattern && !new RegExp(field.pattern).test(v)) {
    return `${field.label} format`;
  }
  return '';
}

/**
 * Book a Demo — submits to Wix Forms via /api/demo-form.
 * Email notifications: Wix dashboard Automations — not this codebase.
 */
export default function DemoForm({
  heading,
  subheading,
  fields,
  formId,
  loadError,
  locale = 'en',
}: Props) {
  const resolvedFormId = formId || DEMO_FORM_ID;
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  const ordered = useMemo(() => fields.filter((f) => f.target), [fields]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError('');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const nextErrors: Record<string, string> = {};
    for (const f of ordered) {
      const msg = fieldError(f, data[f.target] ?? '', locale);
      if (msg) nextErrors[f.target] = msg;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/demo-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId: resolvedFormId, submissions: data }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.fieldErrors) setErrors(json.fieldErrors);
        setFormError(json.error || ui('formFail', locale));
        setStatus('error');
        return;
      }
      setStatus('success');
      form.reset();
    } catch {
      setFormError(ui('formNetwork', locale));
      setStatus('error');
    }
  }

  if (loadError) {
    return (
      <section className="demo-form">
        <div className="demo-form__inner">
          <p className="dev-msg">{loadError}</p>
        </div>
      </section>
    );
  }

  if (status === 'success') {
    return (
      <section className="demo-form demo-form--success">
        <div className="demo-form__inner">
          <div>
            {heading && <h2>{heading}</h2>}
            <p>{ui('formSuccess', locale)}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="demo-form">
      <div className="demo-form__inner">
        <div className="demo-form__copy">
          {heading && <h2>{heading}</h2>}
          {subheading && <p className="lede">{subheading}</p>}
          <p className="muted t-body2">{ui('formReply', locale)}</p>
        </div>
        <form onSubmit={onSubmit} noValidate>
          {ordered.map((field) => {
            const isTextarea =
              field.viewFieldType === 'TEXT_AREA' ||
              field.target === 'message' ||
              field.target === 'challenges' ||
              field.target === 'systems';
            const fieldClass =
              isTextarea && field.target === 'message' ? 'field field--full' : 'field field--half';
            const type =
              field.format === 'EMAIL'
                ? 'email'
                : field.format === 'PHONE'
                  ? 'tel'
                  : field.format === 'URL'
                    ? 'url'
                    : 'text';
            return (
              <label key={field.target} className={fieldClass}>
                <span>
                  {field.label}
                  {field.required ? ' *' : ''}
                </span>
                {field.options?.length ? (
                  <select name={field.target} required={field.required} defaultValue="">
                    <option value="" disabled>
                      {field.placeholder || 'Select…'}
                    </option>
                    {field.options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : isTextarea ? (
                  <textarea
                    name={field.target}
                    required={field.required}
                    rows={2}
                    minLength={field.minLength}
                    maxLength={field.maxLength}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <input
                    name={field.target}
                    type={type}
                    required={field.required}
                    minLength={field.minLength}
                    maxLength={field.maxLength}
                    pattern={field.pattern}
                    placeholder={field.placeholder}
                  />
                )}
                {errors[field.target] && <em className="field-error">{errors[field.target]}</em>}
              </label>
            );
          })}
          <p className="form-legal">{ui('formLegal', locale)}</p>
          {formError && <p className="form-error">{formError}</p>}
          <button className="btn btn--accent" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? ui('formSending', locale) : ui('bookDemo', locale)}
          </button>
        </form>
      </div>
    </section>
  );
}
