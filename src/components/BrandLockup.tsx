import Link from "next/link";

export default function BrandLockup() {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <Link
        href="/"
        className="group inline-flex items-baseline text-[18px] font-black leading-none tracking-normal text-text transition hover:text-accent"
        aria-label="EncoreOS home"
      >
        <span>encore</span>
        <span className="text-accent transition group-hover:text-text">OS</span>
      </Link>
      <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-border/60 bg-white/78 px-3 py-1.5 text-[11px] font-semibold leading-none text-text-secondary shadow-soft backdrop-blur">
        powered by
        <span className="ml-1.5 font-black tracking-[-0.01em] text-text">
          BSPG_
        </span>
      </span>
    </div>
  );
}
