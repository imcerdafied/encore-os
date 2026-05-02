import Link from "next/link";

const signals = [
  ["847", "life and market signals"],
  ["4", "next-chapter paths"],
  ["$29", "full report"],
];

const steps = [
  {
    number: "01",
    title: "Map the life you actually have",
    body: "Income, family, work constraints, fears, climate preferences, healthcare needs, and appetite for change all go into the model.",
  },
  {
    number: "02",
    title: "Weigh places against your tradeoffs",
    body: "Encore OS compares cost, resilience, stability, culture, and practical move paths instead of handing you a generic city list.",
  },
  {
    number: "03",
    title: "Leave with an actionable shortlist",
    body: "Each recommendation explains the upside, the catch, and the next concrete move to validate it in real life.",
  },
];

const reportHighlights = [
  "Cost delta vs. current city",
  "AI economy resilience score",
  "Neighborhood and visa prompts",
  "Honest tradeoffs before the honeymoon phase",
];

const included = [
  "Full 5-minute assessment",
  "One top recommendation",
  "Core cost comparison",
];

const proIncluded = [
  "All 4 recommendation archetypes",
  "Deep-dive city reports",
  "Unlimited reassessments",
  "Shareable results link",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-text">
      <section className="relative min-h-[88vh] overflow-hidden bg-night text-white">
        <div className="absolute inset-0 bg-[url('/images/encore-hero-map.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,20,31,0.98)_0%,rgba(16,20,31,0.86)_38%,rgba(16,20,31,0.34)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,rgba(16,20,31,0)_0%,rgba(251,247,239,1)_100%)]" />

        <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Link href="/" className="font-mono text-sm text-white">
            encore-os
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="#pricing"
              className="hidden rounded-[8px] border border-white/25 px-4 py-2 text-sm text-white/80 transition hover:border-white/50 hover:text-white sm:inline-flex"
            >
              Pricing
            </a>
            <Link
              href="/assess"
              className="rounded-[8px] bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-dark"
            >
              Start
            </Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col px-6 pb-24 pt-16 md:pb-28 md:pt-28">
          <p className="mb-5 max-w-xl font-mono text-xs uppercase text-white/70">
            relocation intelligence for uncertain times
          </p>
          <h1 className="max-w-4xl text-5xl font-black leading-[1.02] text-white md:text-7xl">
            AI relocation advisor for your next chapter.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78">
            Encore OS turns your finances, household, priorities, and AI-era
            career outlook into a practical shortlist of places worth taking
            seriously.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/assess"
              className="rounded-[8px] bg-white px-6 py-4 text-center text-sm font-bold text-night transition hover:bg-bg-subtle"
            >
              Start the assessment
            </Link>
            <a
              href="#how-it-works"
              className="rounded-[8px] border border-white/30 px-6 py-4 text-center text-sm font-bold text-white transition hover:border-white/60 hover:bg-white/10"
            >
              See the method
            </a>
          </div>

          <dl className="mt-16 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {signals.map(([value, label]) => (
              <div
                key={label}
                className="rounded-[8px] border border-white/16 bg-white/10 p-4 backdrop-blur"
              >
                <dt className="text-3xl font-black text-white">{value}</dt>
                <dd className="mt-1 text-sm text-white/68">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase text-accent">
            how it works
          </p>
          <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            A decision tool for people who are between old maps.
          </h2>
          <p className="mt-5 max-w-2xl text-text-secondary">
            The product is built for relocation choices that are emotional,
            financial, and strategic at the same time.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.number}
              className="rounded-[8px] border border-border bg-surface p-6 shadow-soft"
            >
              <span className="font-mono text-sm text-accent">
                {step.number}
              </span>
              <h3 className="mt-8 text-xl font-black">{step.title}</h3>
              <p className="mt-4 text-sm leading-7 text-text-secondary">
                {step.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-night px-6 py-20 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase text-gold">
              inside the report
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              Recommendations that show the catch before you fall in love.
            </h2>
            <p className="mt-5 max-w-2xl text-white/68">
              Each destination is framed as a different risk posture: safe move,
              adventurous but realistic, sleeper pick, and wildcard.
            </p>
          </div>

          <div className="rounded-[8px] border border-white/14 bg-white/8 p-6 shadow-soft backdrop-blur">
            <div className="flex items-start justify-between border-b border-white/12 pb-5">
              <div>
                <p className="font-mono text-xs text-white/54">
                  sample destination
                </p>
                <h3 className="mt-2 text-3xl font-black">Lisbon</h3>
                <p className="text-sm text-white/62">Portugal</p>
              </div>
              <div className="rounded-[8px] bg-teal px-3 py-2 text-sm font-bold text-white">
                8/10
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {reportHighlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gold" />
                  <span className="text-white/76">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 max-w-2xl">
          <p className="font-mono text-xs uppercase text-accent">pricing</p>
          <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            Start free. Upgrade when you want the full map.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-[8px] border border-border bg-surface p-7 shadow-soft">
            <h3 className="text-2xl font-black">Free</h3>
            <p className="mt-2 text-text-secondary">
              A serious first read on your best-fit move.
            </p>
            <p className="mt-8 text-4xl font-black">$0</p>
            <ul className="mt-6 space-y-3">
              {included.map((item) => (
                <li key={item} className="flex gap-3 text-sm">
                  <span className="text-teal">+</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/assess"
              className="mt-8 inline-flex w-full justify-center rounded-[8px] border border-text px-5 py-3 text-sm font-bold transition hover:bg-text hover:text-white"
            >
              Start free
            </Link>
          </article>

          <article className="rounded-[8px] border border-accent bg-[#fff3df] p-7 shadow-soft">
            <div className="inline-flex rounded-[8px] bg-accent px-3 py-1 font-mono text-xs text-white">
              popular
            </div>
            <h3 className="mt-5 text-2xl font-black">Encore Pro</h3>
            <p className="mt-2 text-text-secondary">
              The complete four-path relocation report.
            </p>
            <p className="mt-8 text-4xl font-black">$29</p>
            <p className="mt-1 text-sm text-text-secondary">
              one-time purchase
            </p>
            <ul className="mt-6 space-y-3">
              {proIncluded.map((item) => (
                <li key={item} className="flex gap-3 text-sm">
                  <span className="text-accent">+</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/assess"
              className="mt-8 inline-flex w-full justify-center rounded-[8px] bg-text px-5 py-3 text-sm font-bold text-white transition hover:bg-night"
            >
              Get the full report
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
