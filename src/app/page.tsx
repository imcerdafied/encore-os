import AnalyticsLink from "@/components/AnalyticsLink";
import BrandLockup from "@/components/BrandLockup";

const steps = [
  {
    number: "01",
    title: "Map the life you actually have",
    body: "Capture what matters most: work, cost, family, lifestyle, pace, and the kind of future you want to build.",
  },
  {
    number: "02",
    title: "Compare places with real upside",
    body: "Explore cities and regions through the lens of affordability, opportunity, resilience, and personal fit.",
  },
  {
    number: "03",
    title: "Leave with a move you can test",
    body: "Turn a big decision into a practical plan, with scenarios you can compare before you commit.",
  },
];

const reportHighlights = [
  "Cost",
  "Opportunity",
  "Lifestyle",
  "Resilience",
  "Family fit",
];

const scenarioPreview = [
  {
    label: "Best fit",
    place: "Lisbon",
    score: "86%",
    note: "balanced cost, work, and family rhythm",
  },
  {
    label: "Sleeper pick",
    place: "Bologna",
    score: "78%",
    note: "quality of life with room to explore",
  },
  {
    label: "Wildcard",
    place: "Medellin",
    score: "72%",
    note: "upside if opportunity is the priority",
  },
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
        <div className="absolute inset-0 bg-[url('/images/encore-hero-map.png')] bg-cover bg-center opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,247,239,0.96)_0%,rgba(251,247,239,0.78)_48%,rgba(251,247,239,0.18)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_52%,rgba(198,90,50,0.32)_0%,rgba(201,162,79,0.18)_24%,rgba(198,90,50,0)_44%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,rgba(251,247,239,0)_0%,rgba(251,247,239,1)_100%)]" />

        <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <BrandLockup />
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
            When work, cost, and opportunity are shifting fast, where you live
            matters more than ever.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary md:text-lg">
            EncoreOS helps you understand where your life, work, and future
            opportunities may fit best.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <AnalyticsLink
              href="/assess"
              eventName="landing_cta_clicked"
              eventProperties={{ cta: "hero_start_assessment" }}
              className="rounded-[8px] bg-accent px-6 py-4 text-center text-sm font-bold text-white shadow-soft transition hover:bg-accent-dark"
            >
              Run your scenarios
            </AnalyticsLink>
            <a
              href="#how-it-works"
              className="rounded-[8px] border border-accent/30 bg-surface/70 px-6 py-4 text-center text-sm font-bold text-text shadow-soft transition hover:border-accent hover:bg-[#fff3df]"
            >
              See how it works
            </a>
          </div>
          <p className="mt-4 text-sm font-semibold text-text-secondary">
            Start with 4 free scenarios during beta.
          </p>

          <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            {scenarioPreview.map((scenario) => (
              <div
                key={scenario.place}
                className="rounded-[8px] border border-accent/18 bg-surface/76 p-4 shadow-soft backdrop-blur"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono text-[11px] uppercase text-accent">
                    {scenario.label}
                  </p>
                  <p className="font-mono text-xs font-bold text-teal">
                    {scenario.score}
                  </p>
                </div>
                <h3 className="mt-3 text-lg font-black text-text">
                  {scenario.place}
                </h3>
                <p className="mt-1 text-xs leading-5 text-text-secondary">
                  {scenario.note}
                </p>
              </div>
            ))}
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
            Built for relocation choices that are emotional, financial, and
            strategic at the same time.
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

      <section className="relative overflow-hidden px-6 py-20 text-text">
        <div className="absolute inset-0 bg-[url('/images/encore-hero-map.png')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,243,223,0.96)_0%,rgba(251,247,239,0.9)_46%,rgba(234,247,244,0.92)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_26%,rgba(15,139,141,0.16)_0%,rgba(15,139,141,0)_32%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase text-accent">
              inside the report
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              See the tradeoffs and upside before a move gets real.
            </h2>
            <p className="mt-5 max-w-2xl text-text-secondary">
              Each scenario combines personal priorities with practical signals
              so the shortlist feels useful, not generic.
            </p>
          </div>

          <div className="rounded-[8px] border border-accent/20 bg-surface/82 p-6 shadow-soft backdrop-blur">
            <div className="flex items-start justify-between border-b border-border pb-5">
              <div>
                <p className="font-mono text-xs text-text-secondary">
                  scenario match
                </p>
                <h3 className="mt-2 text-3xl font-black">Lisbon</h3>
                <p className="text-sm text-text-secondary">
                  Portugal, balanced fit
                </p>
              </div>
              <div className="rounded-[8px] bg-teal px-3 py-2 text-right text-sm font-bold text-white">
                86%
                <span className="block font-mono text-[10px] font-normal uppercase text-white/78">
                  fit score
                </span>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              {reportHighlights.map((item, index) => (
                <div key={item}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase text-text-secondary">
                      {item}
                    </span>
                    <span className="font-mono text-[11px] text-text-secondary">
                      {index === 0 ? "lower" : index === 1 ? "strong" : "high"}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-bg-subtle">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),var(--gold),var(--teal))]"
                      style={{ width: `${72 + index * 4}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 max-w-2xl">
          <p className="font-mono text-xs uppercase text-accent">
            beta preview
          </p>
          <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            Start with the map.
          </h2>
          <p className="mt-5 text-text-secondary">
            During beta, Encore OS gives you 4 free scenarios. Go deeper on a
            specific path when you want the practical details.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-[8px] border border-accent bg-[#fff3df] p-7 shadow-soft">
            <div className="inline-flex rounded-[8px] bg-accent px-3 py-1 font-mono text-xs text-white">
              limited beta
            </div>
            <h3 className="mt-5 text-2xl font-black">Beta preview</h3>
            <p className="mt-2 text-text-secondary">
              Start with 4 free scenarios during beta.
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
              className="mt-8 inline-flex w-full justify-center rounded-[8px] bg-accent px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-accent-dark"
            >
              Run your scenarios
            </AnalyticsLink>
          </article>

          <article className="rounded-[8px] border border-border bg-surface p-7 shadow-soft">
            <h3 className="text-2xl font-black">Path deep dive</h3>
            <p className="mt-2 text-text-secondary">
              Go deeper on one path when you want the practical details.
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
