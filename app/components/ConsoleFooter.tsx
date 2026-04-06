import Link from "next/link";

const links = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Security", href: "#" },
];

export function ConsoleFooter() {
  return (
    <footer className="mt-auto border-t border-white/[0.07] px-6 py-4">
      <div className="mx-auto flex max-w-[672px] flex-col items-center justify-between gap-3 text-xs text-neutral-600 sm:flex-row">
        <p>© {new Date().getFullYear()} VAREM</p>
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1">
          {links.map((l) => (
            <Link key={l.label} href={l.href} className="link-console text-neutral-600">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
