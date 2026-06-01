'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';

const schema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.enum(['company', 'candidate', 'other']),
  message: z.string().min(10)
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const t = useTranslations('contact');
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { subject: 'company' }
  });

  const onSubmit = async (data: FormValues) => {
    await new Promise((r) => setTimeout(r, 800));
    // eslint-disable-next-line no-console
    console.log('Contact submission:', data);
    setSubmitted(true);
  };

  if (submitted) {
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
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>
            {t('fields.name')} <span className="text-rose-500">*</span>
          </label>
          <input className={inputCls} {...register('name')} />
          {errors.name && <p className={errCls}>{t('fields.required')}</p>}
        </div>
        <div>
          <label className={labelCls}>{t('fields.company')}</label>
          <input className={inputCls} {...register('company')} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>
            {t('fields.email')} <span className="text-rose-500">*</span>
          </label>
          <input type="email" className={inputCls} {...register('email')} />
          {errors.email && <p className={errCls}>email</p>}
        </div>
        <div>
          <label className={labelCls}>{t('fields.phone')}</label>
          <input className={inputCls} {...register('phone')} />
        </div>
      </div>
      <div>
        <label className={labelCls}>
          {t('fields.subject')} <span className="text-rose-500">*</span>
        </label>
        <select className={inputCls} {...register('subject')}>
          <option value="company">{t('subjectOptions.company')}</option>
          <option value="candidate">{t('subjectOptions.candidate')}</option>
          <option value="other">{t('subjectOptions.other')}</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>
          {t('fields.message')} <span className="text-rose-500">*</span>
        </label>
        <textarea rows={6} className={inputCls} {...register('message')} />
        {errors.message && <p className={errCls}>{t('fields.required')}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full sm:w-auto"
      >
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Send className="mr-2 h-4 w-4" />
        )}
        {t('submit')}
      </button>
    </form>
  );
}
