import { useState } from 'react'

export type ThemeMode = 'auto' | 'light' | 'dark'

interface NavbarProps {
  isLight: boolean
  onToggleTheme: () => void
}

const NAV_LINKS = [
  { href: '#projects', label: 'Work' },
  { href: '#craft', label: 'Experience' },
  { href: '#notes', label: 'About' },
]

export function Navbar({ isLight, onToggleTheme }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      className="theme-header sticky top-0 z-40 w-full border-b backdrop-blur-md"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setMenuOpen(false)
          document.getElementById('navigation-toggle')?.focus()
        }
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <a href="#top" onClick={() => setMenuOpen(false)} className="font-bold text-lg tracking-tight theme-text shrink-0">
          Sanket Nehe
        </a>

        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8 text-sm font-medium theme-muted">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="py-2 hover:text-[var(--text-default)] transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            id="theme-toggle"
            aria-label="Toggle color theme"
            onClick={onToggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full theme-muted hover:text-[var(--text-default)] hover:bg-[var(--expo-pill-bg)] transition-colors cursor-pointer"
            title={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
          >
            <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isLight ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              )}
            </svg>
          </button>
          <a href="#contact" onClick={() => setMenuOpen(false)} className="theme-btn-primary text-sm font-semibold px-4 py-2 rounded-full transition-all">
            Contact
          </a>
          <button
            type="button"
            id="navigation-toggle"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full theme-muted hover:bg-[var(--expo-pill-bg)] cursor-pointer"
          >
            <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d={menuOpen ? 'M6 6l12 12M6 18L18 6' : 'M4 8h16M4 16h16'} />
            </svg>
          </button>
        </div>
      </div>
      <nav id="mobile-navigation" aria-label="Mobile navigation" hidden={!menuOpen} className="md:hidden border-t theme-border px-4 py-3">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-medium theme-muted hover:bg-[var(--expo-pill-bg)]">
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
