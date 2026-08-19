import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] items-center">
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="mb-7 flex items-center gap-4">
          <span className="h-1.5 w-1.5 rotate-45 bg-ember" />
          <span className="font-display text-xs uppercase tracking-[0.3em] text-fog">
            404
          </span>
        </div>

        <h1 className="max-w-3xl font-display text-[clamp(2.5rem,8vw,6.5rem)] font-bold leading-[0.94] tracking-[-0.035em]">
          That page
          <span className="text-fog"> does not exist.</span>
        </h1>

        <p className="mt-8 max-w-md text-lg leading-relaxed text-fog">
          Either it moved or the link was wrong. The work and the writing are
          both still where you would expect.
        </p>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/"
            className="group relative overflow-hidden rounded-full bg-bone px-8 py-4 font-display font-semibold text-ink"
          >
            <span className="relative z-10">Back home</span>
            <span className="absolute inset-0 origin-left scale-x-0 bg-volt transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
          </Link>
          <Link
            href="/work"
            className="rounded-full border border-line px-8 py-4 font-display font-medium text-bone transition-colors duration-400 hover:border-bone/60 hover:bg-bone/5"
          >
            See the work
          </Link>
        </div>
      </div>
    </main>
  );
}
