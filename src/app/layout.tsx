import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { LogoHome } from "@/components/LogoHome";

export const metadata: Metadata = {
  title: "JJBJJ",
  description: "AI-automated technical library from training footage",
};

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex flex-col items-center text-sm font-medium text-slate-100 transition-colors duration-200 ease-out hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:text-red-500"
    >
      <span className="relative z-10 transition-transform duration-150 ease-out group-active:scale-95">
        {label}
      </span>
      <span className="mt-1 h-0.5 w-0 rounded-full bg-red-500 transition-all duration-200 ease-out group-hover:w-full group-active:bg-red-600" />
    </Link>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <div className="min-h-screen bg-slate-950">
          <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur flex items-center justify-between px-4 py-3">
            <LogoHome className="h-9 w-auto" />
            <nav className="flex items-center gap-6">
              <NavLink href="/" label="Library" />
              <NavLink href="/about" label="About" />
              <NavLink href="/contact" label="Contact" />
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
