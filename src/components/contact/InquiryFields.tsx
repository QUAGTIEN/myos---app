import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

type FieldCopy = { id: string; label: string; error?: string; hint?: string; required?: boolean };

function FieldFrame({ id, label, error, hint, required, children }: FieldCopy & { children: ReactNode }) {
  return <div className="inquiry-field">
    <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
    {children}
    {hint && <p id={`${id}-hint`} className="inquiry-field-hint">{hint}</p>}
    {error && <p id={`${id}-error`} className="inquiry-field-error">{error}</p>}
  </div>;
}

function descriptions(id: string, hint?: string, error?: string, extra?: string) {
  return [extra, hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;
}

export function InquiryTextField({ id, label, hint, error, required, ...props }: FieldCopy & Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>) {
  return <FieldFrame id={id} label={label} hint={hint} error={error} required={required}><input {...props} id={id} required={required} aria-invalid={!!error} aria-describedby={descriptions(id, hint, error, props['aria-describedby'])} /></FieldFrame>;
}

export function InquirySelectField({ id, label, hint, error, required, children, ...props }: FieldCopy & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'>) {
  return <FieldFrame id={id} label={label} hint={hint} error={error} required={required}><select {...props} id={id} required={required} aria-invalid={!!error} aria-describedby={descriptions(id, hint, error, props['aria-describedby'])}>{children}</select></FieldFrame>;
}

export function InquiryMessageField({ id, label, hint, error, required, ...props }: FieldCopy & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'>) {
  return <FieldFrame id={id} label={label} hint={hint} error={error} required={required}><textarea {...props} id={id} required={required} aria-invalid={!!error} aria-describedby={descriptions(id, hint, error, props['aria-describedby'])} /></FieldFrame>;
}
