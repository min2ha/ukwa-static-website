import { NavLink } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';

export default function MobileMenu({ lang, onClose }) {
  return (
    <div className="md:hidden bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700 py-4 px-6 animate-in">
      <nav className="flex flex-col gap-1 mb-4">
        {lang.menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.slug === ''}
            onClick={onClose}
            className={({ isActive }) =>
              `nav-link block ${isActive ? 'active' : ''}`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="pt-4 border-t border-gray-200 dark:border-dark-700">
        <LanguageSwitcher />
      </div>
    </div>
  );
}
