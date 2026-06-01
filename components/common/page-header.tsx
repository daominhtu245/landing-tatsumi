import { cn } from '@/lib/utils';

export function PageHeader({
  title,
  subtitle,
  className
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <section className={cn('relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-primary-50 via-white to-accent-50', className)}>
      <div className="absolute -right-32 -top-24 h-80 w-80 rounded-full bg-primary-200/30 blur-3xl" aria-hidden />
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-accent-200/30 blur-3xl" aria-hidden />
      <div className="container-wide relative py-20 lg:py-28">
        <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-base text-slate-600 lg:text-lg">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
