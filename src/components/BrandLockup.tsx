import Link from "next/link";

export default function BrandLockup() {
  return (
    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
      <Link href="/" className="font-mono text-sm text-text">
        encore-os
      </Link>
      <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-border/60 bg-white/70 px-3 py-1 text-[11px] font-semibold leading-none text-text-secondary shadow-soft backdrop-blur">
        powered by
        <span className="ml-1.5 font-black tracking-[-0.01em] text-text">
          BSPG_
        </span>
      </span>
    </div>
  );
}
