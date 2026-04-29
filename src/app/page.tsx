import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-[680px] mx-auto border-b border-border">
        <Link href="/" className="font-mono text-sm text-text tracking-tight">
          encore-os
        </Link>
        <div className="flex items-center gap-6">
          <span className="text-sm text-text-secondary hidden sm:inline">
            Sign In
          </span>
          <Link
            href="/assess"
            className="text-sm bg-text text-white px-4 py-2 hover:bg-black transition-colors"
          >
            Start Assessment &rarr;
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-[680px] mx-auto px-6 pt-20 pb-24">
        <p className="font-mono text-xs text-text-secondary tracking-wide mb-8">
          &bull; encore-os / home
        </p>

        <h1 className="text-[clamp(48px,8vw,96px)] font-black leading-[1.0] tracking-tight text-text mb-10">
          Where should
          <br />
          you go next?
        </h1>

        <div className="max-w-[560px] space-y-5 mb-12">
          <p className="text-text-secondary leading-[1.7]">
            The world is shifting. AI is reshaping work, economies are moving,
            and the place that made sense five years ago might not be the right
            fit anymore.
          </p>
          <p className="text-text-secondary leading-[1.7]">
            Tell us about your life &mdash; your finances, your priorities, your
            openness to change &mdash; and we will find your next chapter.
          </p>
          <p className="text-text leading-[1.7] font-medium">
            Personalized to you. Honest about tradeoffs. No fluff.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-32">
          <Link
            href="/assess"
            className="inline-block bg-text text-white font-medium text-sm px-8 py-4 hover:bg-black transition-colors text-center"
          >
            START ASSESSMENT &rarr;
          </Link>
          <a
            href="#how-it-works"
            className="inline-block border border-text text-text font-medium text-sm px-8 py-4 hover:bg-bg-subtle transition-colors text-center"
          >
            SEE HOW IT WORKS
          </a>
        </div>

        {/* How it works */}
        <div id="how-it-works" className="border-t border-border pt-16 mb-24">
          <p className="font-mono text-xs text-text-secondary tracking-wide mb-8">
            &bull; encore-os / how it works
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-text mb-10">
            Three steps.
          </h2>

          <div className="space-y-8">
            <div className="flex gap-6">
              <span className="font-mono text-text-secondary text-sm mt-0.5 flex-shrink-0">
                01
              </span>
              <div>
                <h3 className="font-semibold text-text mb-1">
                  Tell us about your life
                </h3>
                <p className="text-text-secondary leading-[1.7]">
                  A 5-minute assessment covering your finances, family, career,
                  and what matters most to you.
                </p>
              </div>
            </div>

            <div className="border-t border-border" />

            <div className="flex gap-6">
              <span className="font-mono text-text-secondary text-sm mt-0.5 flex-shrink-0">
                02
              </span>
              <div>
                <h3 className="font-semibold text-text mb-1">
                  We analyze 200+ factors for your situation
                </h3>
                <p className="text-text-secondary leading-[1.7]">
                  Cost of living, safety, climate, healthcare, AI economy
                  resilience &mdash; all weighted to your priorities.
                </p>
              </div>
            </div>

            <div className="border-t border-border" />

            <div className="flex gap-6">
              <span className="font-mono text-text-secondary text-sm mt-0.5 flex-shrink-0">
                03
              </span>
              <div>
                <h3 className="font-semibold text-text mb-1">
                  Get 4 personalized recommendations with honest tradeoffs
                </h3>
                <p className="text-text-secondary leading-[1.7]">
                  No rose-colored glasses. Every place has downsides &mdash; we
                  tell you what they are.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social proof */}
        <div className="text-center mb-24">
          <p className="text-text-secondary text-sm">
            Join{" "}
            <span className="text-text font-semibold">12,400+ people</span> who
            have found their next act
          </p>
        </div>

        {/* Pricing */}
        <div className="border-t border-border pt-16">
          <p className="font-mono text-xs text-text-secondary tracking-wide mb-8">
            &bull; encore-os / pricing
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-text mb-3">
            Simple pricing.
          </h2>
          <p className="text-text-secondary mb-10">
            Start free. Upgrade when you want the full picture.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free tier */}
            <div className="border border-border p-8">
              <h3 className="font-bold text-xl text-text mb-1">Free</h3>
              <p className="text-text-secondary text-sm mb-6">
                One recommendation, free.
              </p>
              <p className="text-3xl font-black text-text mb-6">$0</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-text">
                  <span className="text-text-secondary flex-shrink-0">
                    &check;
                  </span>
                  Full 5-minute assessment
                </li>
                <li className="flex items-start gap-2 text-sm text-text">
                  <span className="text-text-secondary flex-shrink-0">
                    &check;
                  </span>
                  1 top recommendation with full details
                </li>
                <li className="flex items-start gap-2 text-sm text-text">
                  <span className="text-text-secondary flex-shrink-0">
                    &check;
                  </span>
                  Basic cost comparison
                </li>
                <li className="flex items-start gap-2 text-sm text-text/40">
                  <span className="flex-shrink-0">&mdash;</span>
                  3 more recommendations (locked)
                </li>
                <li className="flex items-start gap-2 text-sm text-text/40">
                  <span className="flex-shrink-0">&mdash;</span>
                  Deep-dive city reports
                </li>
              </ul>
              <Link
                href="/assess"
                className="block text-center border border-text text-text font-medium px-6 py-3 hover:bg-bg-subtle transition-colors text-sm"
              >
                Start Free Assessment
              </Link>
            </div>

            {/* Pro tier */}
            <div className="border border-text p-8 relative">
              <span className="absolute -top-3 left-6 text-xs font-mono px-2 py-0.5 bg-text text-white">
                popular
              </span>
              <h3 className="font-bold text-xl text-text mb-1">Encore Pro</h3>
              <p className="text-text-secondary text-sm mb-6">
                All four recommendations.
              </p>
              <p className="text-3xl font-black text-text mb-1">$29</p>
              <p className="text-text-secondary text-xs mb-6">
                one-time &mdash; no subscription
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-text">
                  <span className="text-accent flex-shrink-0">&check;</span>
                  Everything in Free
                </li>
                <li className="flex items-start gap-2 text-sm text-text">
                  <span className="text-accent flex-shrink-0">&check;</span>
                  All 4 personalized recommendations
                </li>
                <li className="flex items-start gap-2 text-sm text-text">
                  <span className="text-accent flex-shrink-0">&check;</span>
                  Deep-dive city reports with neighborhoods &amp; visa paths
                </li>
                <li className="flex items-start gap-2 text-sm text-text">
                  <span className="text-accent flex-shrink-0">&check;</span>
                  Unlimited reassessments
                </li>
              </ul>
              <Link
                href="/assess"
                className="block text-center bg-text text-white font-medium px-6 py-3 hover:bg-black transition-colors text-sm"
              >
                Get Started &mdash; $29
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-[680px] mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-text-secondary">
          <span className="font-mono text-text text-xs">encore-os</span>
          <span className="mt-4 md:mt-0">Your next act starts here.</span>
        </div>
      </footer>
    </main>
  );
}
