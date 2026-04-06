import Link from "next/link";

const navItems = [
  { label: "How it works", href: "#" },
  { label: "Support", href: "#" },
];

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-neutral-900/15"
        >
          <span className="flex size-8 items-center justify-center rounded-xl bg-neutral-900 text-xs font-semibold tracking-tight text-white shadow-[var(--shadow-soft)] sm:size-9">
            VR
          </span>
          <span className="text-sm font-semibold tracking-tight text-neutral-900 sm:text-base">
            VAREM
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
          {navItems.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="rounded-full px-3 py-2 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 sm:px-4 sm:text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
