import { NavLink } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';

export default function MobileMenu({ lang, onClose }) {
  return (
    <div className="border-t border-ink-200/70 px-4 pb-5 pt-2 dark:border-white/10 md:hidden">
      <div className="rounded-[1.75rem] border border-white/80 bg-white/90 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        <nav className="flex flex-col gap-2">
          {lang.menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.slug === ''}
              onClick={onClose}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="mt-4 border-t border-ink-200/70 pt-4 dark:border-white/10">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
