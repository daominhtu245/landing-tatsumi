import { cn } from '@/lib/utils';

export function Logo({ className, mark }: { className?: string; mark?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <span className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary-600 via-primary-400 to-accent-500 shadow-lg shadow-primary-600/20">
        <svg
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7 text-white"
          aria-hidden="true"
        >
          <path
            d="M6 28 C 12 8, 28 32, 34 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="33.5" cy="12.5" r="2.2" fill="currentColor" />
        </svg>
      </span>
      {!mark && (
        <span className="flex flex-col leading-none">
          <span className="text-base font-bold tracking-wider text-slate-900">辰巳協同組合</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary-600">
            Tatsumi&nbsp;Coop
          </span>
        </span>
      )}
    </span>
  );
}
