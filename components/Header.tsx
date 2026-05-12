import Link from "next/link";

const navItems = [
  { href: "/paintings", label: "Paintings" },
  { href: "/photos", label: "Photos" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-30">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:flex-nowrap sm:px-8">
        <Link
          href="/"
          className="text-base font-medium tracking-normal text-ink"
          aria-label="Art Index home"
        >
          Atelier Index
        </Link>
        <nav className="flex items-center gap-1 text-sm text-muted">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-2 py-2 transition-colors hover:text-ink sm:px-3"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/admin" className="px-1.5 py-2 text-xs text-muted/60 transition-colors hover:text-ink sm:px-2">
            Admin
          </Link>
          <a
            href="https://ryouyplayground.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="ml-1 border border-line px-3 py-2 text-ink transition hover:border-ink sm:ml-2 sm:px-4"
          >
            Profile
          </a>
        </nav>
      </div>
    </header>
  );
}
