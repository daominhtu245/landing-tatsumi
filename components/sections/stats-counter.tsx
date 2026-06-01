'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

const stats = [
  { key: 'companies', value: 120 },
  { key: 'trainees', value: 850 },
  { key: 'countries', value: 5 },
  { key: 'years', value: 12 }
] as const;

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return val;
}

function StatItem({ k, value, suffix, label }: { k: string; value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const display = useCountUp(value, visible);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
        {display}
        <span className="ml-1 text-2xl font-bold text-accent-300">{suffix}</span>
      </div>
      <div className="mt-2 text-sm font-medium uppercase tracking-wider text-primary-100">
        {label}
      </div>
    </div>
  );
}

export function StatsCounter() {
  const t = useTranslations('stats');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 py-20 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.2),transparent_60%)]" />
      <div className="container-wide relative">
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-300">
            {t('eyebrow')}
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{t('title')}</h2>
        </div>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <StatItem
              key={s.key}
              k={s.key}
              value={s.value}
              suffix={t(`suffix.${s.key}`)}
              label={t(`items.${s.key}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
