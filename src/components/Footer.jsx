import { NavLink } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

export default function Footer() {
  const year = new Date().getFullYear();
  const lang = useLanguage();

  return (
    <footer className="px-4 pb-8 md:px-6 md:pb-10">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-ink-900/80 bg-ink-950 text-mist-100 shadow-[0_28px_90px_rgba(0,0,0,0.24)]">
        <div className="grid gap-8 px-6 py-8 md:px-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-brand-300">
              UK Web Archive
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-white">
              Preserving the web as public record, research material, and cultural memory.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-mist-300">
              This static site is driven by markdown content and designed to present the service clearly while the broader platform continues to evolve.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-mist-300">
              Explore
            </h3>
            <nav className="mt-4 flex flex-col gap-3">
              {lang.menu.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.slug === ''}
                  className="text-sm text-mist-200 transition-colors hover:text-white"
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-mist-300">
              Service Note
            </h3>
            <p className="mt-4 text-sm leading-7 text-mist-300">
              Content remains authored in markdown and loaded from the static site content folders, keeping publishing simple and transparent.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 px-6 py-4 text-sm text-mist-400 md:px-8">
          &copy; {year} UK Web Archive. Preserving the UK web for future generations.
        </div>
      </div>
    </footer>
  );
}
