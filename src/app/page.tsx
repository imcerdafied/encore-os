import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-navy-dark">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="font-display text-xl font-bold text-cream">
          Encore<span className="text-gold">OS</span>
        </div>
        <Link
          href="/assess"
          className="text-sm text-gold hover:text-gold-light transition-colors"
        >
          Start Assessment →
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
        <h1 className="font-display text-5xl md:text-7xl font-bold text-cream leading-tight mb-6 animate-fade-in">
          Where should you
          <br />
          <span className="text-gold">go next?</span>
        </h1>
        <p className="text-lg md:text-xl text-slate max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up">
          The world is changing fast. AI is reshaping work, economies are
          shifting, and the place that made sense five years ago might not be the
          right fit anymore. Tell us about your life and we&apos;ll find your
          next chapter.
        </p>
        <Link
          href="/assess"
          className="inline-block bg-gold hover:bg-gold-dark text-navy-dark font-semibold text-lg px-10 py-4 rounded-lg transition-all hover:shadow-lg hover:shadow-gold/20 animate-slide-up"
        >
          Start Your Assessment →
        </Link>

        {/* Value props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
          <div className="bg-navy/50 border border-navy-light rounded-xl p-6">
            <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 text-gold"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="font-display text-lg text-cream mb-2">
              Personalized to your life
            </h3>
            <p className="text-slate text-sm leading-relaxed">
              Not generic lists. Recommendations based on your income, family,
              career, and what actually matters to you.
            </p>
          </div>
          <div className="bg-navy/50 border border-navy-light rounded-xl p-6">
            <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 text-gold"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="font-display text-lg text-cream mb-2">
              AI-powered analysis
            </h3>
            <p className="text-slate text-sm leading-relaxed">
              Advanced AI evaluates hundreds of factors — cost of living, safety,
              climate, healthcare, and AI economy resilience.
            </p>
          </div>
          <div className="bg-navy/50 border border-navy-light rounded-xl p-6">
            <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 text-gold"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
            </div>
            <h3 className="font-display text-lg text-cream mb-2">
              Honest tradeoffs included
            </h3>
            <p className="text-slate text-sm leading-relaxed">
              Every place has downsides. We tell you what you might miss and what
              to watch out for — no rose-colored glasses.
            </p>
          </div>
        </div>

        {/* Social proof */}
        <div className="mt-20 text-slate text-sm">
          Join{" "}
          <span className="text-cream font-semibold">12,400+ people</span> who
          have found their next act
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-light py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-slate">
          <div className="font-display text-cream">
            Encore<span className="text-gold">OS</span>
          </div>
          <div className="mt-4 md:mt-0">Your next act starts here.</div>
        </div>
      </footer>
    </main>
  );
}
