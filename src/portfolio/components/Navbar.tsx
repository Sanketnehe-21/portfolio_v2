export type ThemeMode = 'auto' | 'light' | 'dark'

interface NavbarProps {
  isLight: boolean
  onToggleTheme: () => void
  onReplayIntro: () => void
  onShowToast: (msg: string) => void
}

export function Navbar({
  isLight,
  onToggleTheme,
  onReplayIntro,
  onShowToast: _onShowToast,
}: NavbarProps) {
  return (
    <header className="theme-header sticky top-0 z-40 w-full border-b backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Left Menu */}
        <div className="flex items-center gap-8">
          <a href="#top" className="flex items-center gap-2.5 group">
            <svg className="w-7 h-7 theme-text" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.5L2.2 20.8h19.6L12 2.5zm0 4.2l6.2 11.8H5.8L12 6.7z" />
            </svg>
            <span className="font-bold text-lg tracking-tight theme-text">sanket.dev</span>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium theme-muted">
            <a
              href="#workflow"
              className="px-3 py-1.5 rounded-3xl hover:text-[var(--text-default)] transition-colors"
            >
              Workflow
            </a>

            {/* Projects Dropdown */}
            <div className="relative dropdown-trigger">
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-1.5 rounded-3xl hover:text-[var(--text-default)] transition-colors"
              >
                Projects
                <svg className="w-3 h-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="dropdown-panel absolute left-0 top-full pt-2 w-[520px] opacity-0 translate-y-1 invisible transition-all duration-150 z-50 pointer-events-none">
                <div className="theme-dropdown rounded-2xl border p-5 shadow-2xl backdrop-blur-xl grid grid-cols-3 gap-5">
                  <div>
                    <p className="text-[11px] font-semibold theme-subtle-text uppercase tracking-wider mb-2">
                      Focus Areas
                    </p>
                    <ul className="space-y-1 text-xs">
                      <li>
                        <a href="#projects" className="block p-1.5 rounded hover:bg-[var(--expo-pill-bg)] theme-muted hover:text-[var(--text-default)]">
                          Mobile Systems
                        </a>
                      </li>
                      <li>
                        <a href="#projects" className="block p-1.5 rounded hover:bg-[var(--expo-pill-bg)] theme-muted hover:text-[var(--text-default)]">
                          Full-Stack Web
                        </a>
                      </li>
                      <li>
                        <a href="#projects" className="block p-1.5 rounded hover:bg-[var(--expo-pill-bg)] theme-muted hover:text-[var(--text-default)]">
                          Creative WebGL
                        </a>
                      </li>
                      <li>
                        <a href="#projects" className="block p-1.5 rounded hover:bg-[var(--expo-pill-bg)] theme-muted hover:text-[var(--text-default)]">
                          Developer Tools
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold theme-subtle-text uppercase tracking-wider mb-2">
                      Architecture
                    </p>
                    <ul className="space-y-1 text-xs">
                      <li>
                        <a href="#craft" className="block p-1.5 rounded hover:bg-[var(--expo-pill-bg)] theme-muted hover:text-[var(--text-default)]">
                          React + TypeScript
                        </a>
                      </li>
                      <li>
                        <a href="#craft" className="block p-1.5 rounded hover:bg-[var(--expo-pill-bg)] theme-muted hover:text-[var(--text-default)]">
                          Three.js + GLSL
                        </a>
                      </li>
                      <li>
                        <a href="#craft" className="block p-1.5 rounded hover:bg-[var(--expo-pill-bg)] theme-muted hover:text-[var(--text-default)]">
                          Native &amp; Cross-Platform
                        </a>
                      </li>
                      <li>
                        <a href="#projects" className="block p-1.5 rounded hover:bg-[var(--expo-pill-bg)] theme-muted hover:text-[var(--text-default)] flex items-center gap-1.5">
                          Observable Self{' '}
                          <span className="px-1 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/15 text-emerald-400 leading-none">
                            live
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold theme-subtle-text uppercase tracking-wider mb-2">
                      Explore
                    </p>
                    <ul className="space-y-1 text-xs">
                      <li>
                        <a href="#craft" className="block p-1.5 rounded hover:bg-[var(--expo-pill-bg)] theme-muted hover:text-[var(--text-default)]">
                          Core Craft
                        </a>
                      </li>
                      <li>
                        <a href="#focus" className="block p-1.5 rounded hover:bg-[var(--expo-pill-bg)] theme-muted hover:text-[var(--text-default)]">
                          Engineering Focus
                        </a>
                      </li>
                      <li>
                        <a href="#contact" className="block p-1.5 rounded hover:bg-[var(--expo-pill-bg)] theme-muted hover:text-[var(--text-default)]">
                          Contact
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Dropdown */}
            <div className="relative dropdown-trigger">
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-1.5 rounded-3xl hover:text-[var(--text-default)] transition-colors"
              >
                Capabilities
                <svg className="w-3 h-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="dropdown-panel absolute left-0 top-full pt-2 w-[230px] opacity-0 translate-y-1 invisible transition-all duration-150 z-50 pointer-events-none">
                <div className="theme-dropdown rounded-2xl border p-4 shadow-2xl backdrop-blur-xl">
                  <ul className="space-y-1 text-xs">
                    <li>
                      <a href="#craft" className="block p-1.5 rounded hover:bg-[var(--expo-pill-bg)] theme-muted hover:text-[var(--text-default)]">
                        Full-Stack Product Eng
                      </a>
                    </li>
                    <li>
                      <a href="#craft" className="block p-1.5 rounded hover:bg-[var(--expo-pill-bg)] theme-muted hover:text-[var(--text-default)]">
                        Mobile &amp; Cross-Platform
                      </a>
                    </li>
                    <li>
                      <a href="#projects" className="block p-1.5 rounded hover:bg-[var(--expo-pill-bg)] theme-muted hover:text-[var(--text-default)]">
                        Interactive 3D &amp; Shaders
                      </a>
                    </li>
                    <li>
                      <a href="#workflow" className="block p-1.5 rounded hover:bg-[var(--expo-pill-bg)] theme-muted hover:text-[var(--text-default)]">
                        CI/CD &amp; Testing
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <a
              href="#craft"
              className="px-3 py-1.5 rounded-3xl hover:text-[var(--text-default)] transition-colors"
            >
              Experience
            </a>
            <a
              href="#notes"
              className="px-3 py-1.5 rounded-3xl hover:text-[var(--text-default)] transition-colors"
            >
              Skills &amp; Edu
            </a>
            <a
              href="#contact"
              className="px-3 py-1.5 rounded-3xl hover:text-[var(--text-default)] transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Replay Intro Button */}
          <button
            type="button"
            onClick={onReplayIntro}
            className="theme-pill hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-3xl text-xs whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            title="Replay 3D cosmic intro"
          >
            <span>Replay intro</span>
          </button>

          {/* GitHub Pill */}
          <a
            href="https://github.com/Sanketnehe-21"
            target="_blank"
            rel="noreferrer"
            className="theme-pill hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-3xl text-xs whitespace-nowrap shrink-0 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="font-medium">GitHub</span>
          </a>

          {/* Theme Toggle */}
          <button
            type="button"
            id="theme-toggle"
            aria-label="Toggle color theme"
            onClick={onToggleTheme}
            className="p-2 rounded-full theme-muted hover:text-[var(--text-default)] hover:bg-[var(--expo-pill-bg)] shrink-0 transition-colors cursor-pointer"
            title="Toggle Theme"
          >
            {isLight ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          {/* Resume quick info */}
          <a
            href="#notes"
            className="text-sm font-medium theme-muted hover:text-[var(--text-default)] px-3 py-1.5 transition-colors cursor-pointer"
          >
            Resume
          </a>

          {/* Contact CTA */}
          <a
            href="#contact"
            className="theme-btn-primary text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm transition-all"
          >
            Contact
          </a>
        </div>
      </div>
    </header>
  )
}
