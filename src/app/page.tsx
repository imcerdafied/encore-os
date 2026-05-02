import Link from "next/link";
import AnalyticsLink from "@/components/AnalyticsLink";

const steps = [
  {
    number: "01",
    title: "Map the life you actually have",
    body: "Tell us about money, family, work, health, climate, and what would make daily life feel better.",
  },
  {
    number: "02",
    title: "Look for places with room to grow",
    body: "Encore OS weighs cost, taxes, stability, culture, and practical move paths around the life you want next.",
  },
  {
    number: "03",
    title: "Leave with a path you can test",
    body: "Your result explains the upside, the catch, and the next concrete move to validate it in real life.",
  },
];

const reportHighlights = [
  "Cost delta vs. current city",
  "Career resilience notes",
  "Neighborhood and visa prompts",
  "Honest tradeoffs before the honeymoon phase",
];

const included = [
  "Full 5-minute assessment",
  "Four personalized scenario cards",
  "Cost, tax, visa, and career signals",
  "Shareable results link",
];

const laterIncluded = [
  "Honest tradeoffs for one path",
  "Practical next steps",
  "Visa and residency prompts",
  "Neighborhood starting points",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-text">
      <section className="relative overflow-hidden bg-bg text-text">
        <div className="absolute inset-0 bg-[url('/images/encore-hero-map.png')] bg-cover bg-center opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,247,239,0.97)_0%,rgba(251,247,239,0.9)_44%,rgba(251,247,239,0.42)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_55%,rgba(198,90,50,0.24)_0%,rgba(198,90,50,0)_34%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,rgba(251,247,239,0)_0%,rgba(251,247,239,1)_100%)]" />

        <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Link href="/" className="font-mono text-sm text-text">
            encore-os
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="#pricing"
              className="hidden rounded-[8px] border border-text/20 bg-surface/60 px-4 py-2 text-sm text-text-secondary transition hover:border-text/40 hover:text-text sm:inline-flex"
            >
              Beta preview
            </a>
            <AnalyticsLink
              href="/assess"
              eventName="landing_cta_clicked"
              eventProperties={{ cta: "nav_start" }}
              className="rounded-[8px] bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-dark"
            >
              Start
            </AnalyticsLink>
          </div>
        </nav>

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col px-6 pb-16 pt-14 md:pb-20 md:pt-24">
          <h1 className="max-w-4xl text-5xl font-black leading-[1.02] text-text md:text-7xl">
            You got next.
          </h1>
          <h2 className="mt-7 max-w-3xl text-xl font-semibold leading-8 text-text-secondary md:text-2xl md:leading-9">
            EncoreOS helps you explore scenarios that might be more fitting for
            the life you are building.
          </h2>
          <p className="mt-5 inline-flex max-w-3xl rounded-[8px] border border-accent/25 bg-[#fff3df]/90 px-4 py-3 text-sm font-bold text-text shadow-soft">
            Beta preview: explore four scenarios for free while we learn with
            early users.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <AnalyticsLink
              href="/assess"
              eventName="landing_cta_clicked"
              eventProperties={{ cta: "hero_start_assessment" }}
              className="rounded-[8px] bg-text px-6 py-4 text-center text-sm font-bold text-white transition hover:bg-night"
            >
              Start the assessment
            </AnalyticsLink>
            <a
              href="#how-it-works"
              className="rounded-[8px] border border-text/25 bg-surface/60 px-6 py-4 text-center text-sm font-bold text-text transition hover:border-text/45 hover:bg-surface"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-14">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase text-accent">
            how it works
          </p>
          <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            A decision tool to explore what could be.
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
          <p className="font-mono text-xs uppercase text-accent">
            beta preview
          </p>
          <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            Explore the map for free.
          </h2>
          <p className="mt-5 text-text-secondary">
            During beta, Encore OS gives you the scenario map for free. Pay
            only when you want to go deeper on a specific path.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-[8px] border border-accent bg-[#fff3df] p-7 shadow-soft">
            <div className="inline-flex rounded-[8px] bg-accent px-3 py-1 font-mono text-xs text-white">
              limited beta
            </div>
            <h3 className="mt-5 text-2xl font-black">Beta preview</h3>
            <p className="mt-2 text-text-secondary">
              See what is possible across four relocation scenarios.
            </p>
            <p className="mt-8 text-4xl font-black">$0</p>
            <p className="mt-1 text-sm text-text-secondary">
              no card needed
            </p>
            <ul className="mt-6 space-y-3">
              {included.map((item) => (
                <li key={item} className="flex gap-3 text-sm">
                  <span className="text-teal">+</span>
                  {item}
                </li>
              ))}
            </ul>
            <AnalyticsLink
              href="/assess"
              eventName="landing_cta_clicked"
              eventProperties={{ cta: "pricing_start_preview" }}
              className="mt-8 inline-flex w-full justify-center rounded-[8px] bg-text px-5 py-3 text-sm font-bold text-white transition hover:bg-night"
            >
              Start the preview
            </AnalyticsLink>
          </article>

          <article className="rounded-[8px] border border-border bg-surface p-7 shadow-soft">
            <h3 className="text-2xl font-black">Path deep dive</h3>
            <p className="mt-2 text-text-secondary">
              Double-click into one path when you want the practical details.
            </p>
            <p className="mt-8 text-4xl font-black">$9</p>
            <p className="mt-1 text-sm text-text-secondary">
              planned one-time purchase
            </p>
            <ul className="mt-6 space-y-3">
              {laterIncluded.map((item) => (
                <li key={item} className="flex gap-3 text-sm">
                  <span className="text-teal">+</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 rounded-[8px] border border-border px-5 py-3 text-center text-sm font-bold text-text-secondary">
              Available when payments are connected
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
