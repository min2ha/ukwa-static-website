export default function FooterLogos() {
  return (
    <section className="px-4 pb-6 pt-12 md:px-6 md:pt-16">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/70 bg-white/78 px-6 py-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:shadow-none md:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_minmax(0,1fr)] lg:items-center">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-brand-700 dark:text-brand-300">
              Partnerships
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-ink-950 dark:text-white md:text-4xl">
              Built with institutions who safeguard the UK&apos;s digital memory
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-ink-600 dark:text-mist-300">
              The archive sits within a wider preservation network of libraries, collections, and public-interest partners. This site keeps that work visible while the underlying service continues to improve.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-ink-200/70 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/95">
            <img
              src="/images/footer/about-logos.png"
              alt="Partner Logos"
              className="mx-auto block h-auto max-w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
