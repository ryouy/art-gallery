"use client";

import Link from "next/link";

export default function ErrorPage({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center px-5 py-20 sm:px-8">
      <p className="mb-4 text-xs uppercase tracking-[0.22em] text-muted">Error</p>
      <h1 className="text-4xl font-semibold uppercase leading-none tracking-normal text-ink sm:text-6xl">
        Something went wrong
      </h1>
      <p className="mt-6 max-w-xl text-sm uppercase leading-7 tracking-[0.12em] text-muted">
        There was a problem loading this page. Try again, or return home.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.16em]">
        <button
          type="button"
          onClick={reset}
          className="border border-ink bg-ink px-5 py-3 text-bone transition hover:bg-transparent hover:text-ink"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border border-ink px-5 py-3 text-ink transition hover:bg-ink hover:text-bone"
        >
          Back home
        </Link>
      </div>
    </section>
  );
}
