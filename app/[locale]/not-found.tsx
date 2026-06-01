import { Link } from '@/lib/navigation';

export default function NotFound() {
  return (
    <section className="container-tight flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-700">404</p>
      <h1 className="mt-4 text-3xl font-black text-slate-900 sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-3 text-base text-slate-600">
        お探しのページは存在しないか、移動された可能性があります。
      </p>
      <Link href="/" className="btn-primary mt-8">
        Back to Home
      </Link>
    </section>
  );
}
