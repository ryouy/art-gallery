import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center px-5 py-20 sm:px-8">
      <p className="mb-4 text-xs uppercase tracking-[0.22em] text-muted">404</p>
      <h1 className="text-4xl font-semibold uppercase leading-none tracking-normal text-ink sm:text-6xl">
        Page not found
      </h1>
      <p className="mt-6 max-w-xl text-sm uppercase leading-7 tracking-[0.12em] text-muted">
        The work may have moved, or the URL may be incorrect.
      </p>
      <Link
        href="/"
        className="mt-8 w-fit border border-ink px-5 py-3 text-xs uppercase tracking-[0.16em] text-ink transition hover:bg-ink hover:text-bone"
      >
        Back home
      </Link>
    </section>
  );
}
