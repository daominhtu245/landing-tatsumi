'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Send, CheckCircle2, Loader2, AlertTriangle, Phone, Mail } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { SITE } from '@/lib/site-config';

const schema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.enum(['coop', 'system', 'other']),
  message: z.string().min(10),
  /** Honeypot — ẩn với người dùng, bot thường tự điền. */
  website: z.string().optional()
});

type FormValues = z.infer<typeof schema>;
type Status = 'idle' | 'sent' | 'error';

export function ContactForm() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<Status>('idle');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { subject: 'coop' }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      // Chỉ báo thành công khi server thực sự đã gửi được mail.
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-primary-100 bg-primary-50 p-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-primary-600" />
        <p className="text-base font-semibold text-primary-900">{t('submitted')}</p>
      </div>
    );
  }

  const labelCls = 'mb-1.5 block text-sm font-semibold text-slate-800';
  const inputCls =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100';
  const errCls = 'mt-1 text-xs text-rose-600';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {status === 'error' && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" aria-hidden />
            <div className="space-y-3">
              <p className="text-sm font-semibold text-rose-900">{t('errorTitle')}</p>
              <p className="text-sm leading-relaxed text-rose-800">{t('errorBody')}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
                <a href={SITE.telHref} className="inline-flex items-center gap-1.5 text-rose-900 underline underline-offset-4">
                  <Phone className="h-4 w-4" />
                  {SITE.tel}
                </a>
                <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-1.5 text-rose-900 underline underline-offset-4">
                  <Mail className="h-4 w-4" />
                  {SITE.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="cf-name">
            {t('fields.name')} <span className="text-rose-500">*</span>
          </label>
          <input id="cf-name" className={inputCls} autoComplete="name" {...register('name')} />
          {errors.name && <p className={errCls}>{t('fields.required')}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="cf-company">{t('fields.company')}</label>
          <input id="cf-company" className={inputCls} autoComplete="organization" {...register('company')} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="cf-email">
            {t('fields.email')} <span className="text-rose-500">*</span>
          </label>
          <input id="cf-email" type="email" className={inputCls} autoComplete="email" {...register('email')} />
          {errors.email && <p className={errCls}>{t('fields.required')}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="cf-phone">{t('fields.phone')}</label>
          <input id="cf-phone" type="tel" className={inputCls} autoComplete="tel" {...register('phone')} />
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="cf-subject">
          {t('fields.subject')} <span className="text-rose-500">*</span>
        </label>
        <select id="cf-subject" className={inputCls} {...register('subject')}>
          <option value="coop">{t('subjectOptions.coop')}</option>
          <option value="system">{t('subjectOptions.system')}</option>
          <option value="other">{t('subjectOptions.other')}</option>
        </select>
      </div>

      <div>
        <label className={labelCls} htmlFor="cf-message">
          {t('fields.message')} <span className="text-rose-500">*</span>
        </label>
        <textarea id="cf-message" rows={6} className={inputCls} {...register('message')} />
        {errors.message && <p className={errCls}>{t('fields.required')}</p>}
      </div>

      {/* Honeypot — ẩn với người dùng và trình đọc màn hình */}
      <div className="hidden" aria-hidden>
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        {t('consent')}{' '}
        <Link href="/privacy" className="font-semibold text-primary-700 underline underline-offset-2">
          {t('privacyLink')}
        </Link>
      </p>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto">
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Send className="mr-2 h-4 w-4" />
        )}
        {isSubmitting ? t('sending') : t('submit')}
      </button>
    </form>
  );
}
