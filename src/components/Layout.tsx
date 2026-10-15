import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { QUESTIONS } from '../data';
import { useStore, type Theme } from '../store/build';
import { Moon, Sigil, Sun } from './Icons';

const NAV = [
  { to: '/origin', label: 'Origin' },
  { to: '/character', label: 'Character' },
  { to: '/progression', label: 'Levels 1–12' },
  { to: '/spells', label: 'Spells' },
  { to: '/gear', label: 'Gear' },
  { to: '/builds', label: 'Builds' },
];

const NEXT_THEME: Record<Theme, Theme> = { system: 'dark', dark: 'light', light: 'system' };

export function Layout() {
  const answered = useStore((s) => Object.keys(s.choices.answers).length);
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const { pathname } = useLocation();

  useEffect(() => {
    if (theme === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => window.scrollTo(0, 0), [pathname]);

  const remaining = QUESTIONS.length - answered;

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand">
            <Sigil />
            Origin Planner
          </Link>
          <nav className="nav" aria-label="Main">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to}>
                {n.label}
                {n.to === '/origin' && remaining > 0 && answered > 0 && <span className="badge">{remaining}</span>}
              </NavLink>
            ))}
          </nav>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setTheme(NEXT_THEME[theme])}
            title={`Theme: ${theme}`}
            aria-label={`Theme: ${theme}. Click to change.`}
          >
            {theme === 'light' ? <Sun width={16} /> : <Moon width={16} />}
            <span className="faint">{theme}</span>
          </button>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        Fan-made planning tool for Baldur’s Gate 3 — not affiliated with Larian Studios or Wizards of the Coast. Game data
        is hand-curated; verify details in game. Spoiler-free by default.
      </footer>
    </div>
  );
}
