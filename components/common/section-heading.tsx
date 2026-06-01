import { cn } from '@/lib/utils';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className
}: Props) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className
      )}
    >
      {eyebrow && <span className="heading-eyebrow">{eyebrow}</span>}
      <h2 className="max-w-2xl text-3xl font-bold text-slate-900 sm:text-4xl lg:text-[40px] lg:leading-[1.2]">
        {title}
      </h2>
      {subtitle && (
        <p className={cn('max-w-2xl text-base text-slate-600', align === 'center' && 'mx-auto')}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
