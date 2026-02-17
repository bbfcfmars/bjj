import Link from "next/link";

export function LogoHome({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center shrink-0 text-slate-300 hover:text-slate-100"
      aria-label="JJBJJ home"
    >
      <img src="/jjbjj.svg" alt="JBJJ" className={className} />
    </Link>
  );
}
