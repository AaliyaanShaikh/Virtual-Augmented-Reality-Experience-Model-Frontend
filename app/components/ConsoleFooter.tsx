import Link from "next/link";

const links = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Security", href: "#" },
];

export function ConsoleFooter() {
  return (
    <footer className="mt-auto border-t border-white/[0.07] px-6 py-4 md:px-8">
      <div className="flex w-full flex-wrap items-center justify-between gap-x-8 gap-y-3">
        <p className="max-w-[min(100%,28rem)] text-left text-xs leading-snug text-neutral-600">
          © {new Date().getFullYear()} VAREM, Designed by Ezor, Managed by Ocra IT Solutions
        </p>
        <nav
          className="flex flex-wrap items-center gap-x-6 gap-y-1 sm:justify-end"
          aria-label="Legal"
        >
          {links.map((l) => (
            <Link key={l.label} href={l.href} className="link-console text-xs text-neutral-600">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
