import { type FormEvent, useState } from 'react'
import type { ThemeMode } from './Navbar'

interface CtaAndFooterProps {
  themeMode: ThemeMode
  onCycleTheme: () => void
  onReplayIntro: () => void
  onShowToast: (msg: string) => void
}

const CAPABILITY_BADGES = [
  { primary: 'React Native', secondary: 'Expo' },
  { primary: 'TypeScript', secondary: 'Strict' },
  { primary: 'Firebase', secondary: 'Firestore' },
  { primary: 'Google Maps API', secondary: '' },
  { primary: 'MySQL & MongoDB', secondary: '' },
  { primary: 'AWS & GCP', secondary: 'Cloud' },
  { primary: 'Three.js', secondary: 'GLSL' },
]

export function CtaAndFooter({
  themeMode,
  onCycleTheme,
  onReplayIntro,
  onShowToast,
}: CtaAndFooterProps) {
  const [emailInput, setEmailInput] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    const email = 'sanketnehe21@gmail.com'
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).catch(() => {})
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
    onShowToast(`Copied ${email}`)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!emailInput.trim()) return
    const sender = emailInput.trim()
    setEmailInput('')
    onShowToast(`Recorded ${sender} — reach me anytime at sanketnehe21@gmail.com`)
  }

  const themeLabel = themeMode.charAt(0).toUpperCase() + themeMode.slice(1)

  return (
    <>
      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="theme-surface rounded-3xl border p-5 sm:p-16 text-center space-y-6">
          <h2 className="text-3xl sm:text-6xl font-bold tracking-tight theme-text">
            Let&apos;s build something
            <br />
            thoughtful
          </h2>
          <p className="text-sm sm:text-base theme-muted">
            Mumbai, India · +91 93093 67739 · Open to impactful Mobile &amp; Full-Stack roles
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href="mailto:sanketnehe21@gmail.com"
              className="theme-btn-primary inline-flex max-w-full px-4 sm:px-8 py-3.5 rounded-full font-semibold text-sm transition-all shadow-xl"
            >
              Email sanketnehe21@gmail.com
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="theme-pill inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-medium text-sm transition-all cursor-pointer"
            >
              <span>{copied ? 'Copied!' : 'Copy email address'}</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>

          {/* Scrolling Capabilities Marquee */}
          <div className="pt-8 border-t theme-border overflow-hidden mask-carousel">
            <div className="badge-track items-center gap-6">
              {[...CAPABILITY_BADGES, ...CAPABILITY_BADGES].map((b, idx) => (
                <span
                  key={`${b.primary}-${idx}`}
                  className="theme-pill shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                >
                  <span className="text-xs font-semibold theme-text whitespace-nowrap">
                    {b.primary}
                  </span>
                  {b.secondary && (
                    <span className="text-xs font-medium theme-muted whitespace-nowrap">
                      {b.secondary}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer & Quick Contact */}
      <footer id="contact" className="theme-footer border-t pt-16 pb-12 theme-muted text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b theme-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase theme-subtle-text mb-1">Say hello</p>
            <p className="text-base font-medium theme-text">
              Drop your email{' '}
              <span className="max-sm:hidden">or call +91 93093 67739</span>
            </p>
          </div>
          <form className="flex flex-col sm:flex-row w-full md:w-auto max-w-md gap-2" onSubmit={handleSubmit}>
            <input
              id="contact-email"
              aria-label="Your email address"
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="you@company.com"
              required
              className="theme-input min-w-0 flex-1 px-4 py-3 rounded-full text-base focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="theme-btn-primary px-5 py-2 rounded-full font-semibold text-xs transition-colors cursor-pointer"
            >
              Send intro
            </button>
          </form>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="space-y-3">
            <h5 className="theme-text font-semibold text-sm">Projects</h5>
            <ul className="space-y-2">
              <li>
                <a href="#projects" className="hover:text-[var(--text-default)] transition-colors">
                  Urban Hive
                </a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/expo-location-keepalive"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[var(--text-default)] transition-colors"
                >
                  expo-location-keepalive
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-[var(--text-default)] transition-colors">
                  rn-whiteboard-kit
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-[var(--text-default)] transition-colors">
                  Play Store Suite
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="theme-text font-semibold text-sm">Architecture</h5>
            <ul className="space-y-2">
              <li>
                <a href="#workflow" className="hover:text-[var(--text-default)] transition-colors">
                  Engineering Process
                </a>
              </li>
              <li>
                <a href="#craft" className="hover:text-[var(--text-default)] transition-colors">
                  Experience &amp; Craft
                </a>
              </li>
              <li>
                <a href="#focus" className="hover:text-[var(--text-default)] transition-colors">
                  Credentials
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="theme-text font-semibold text-sm">Navigation</h5>
            <ul className="space-y-2">
              <li>
                <a href="#top" className="hover:text-[var(--text-default)] transition-colors">
                  Back to top
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onReplayIntro}
                  className="hover:text-[var(--text-default)] transition-colors cursor-pointer text-left"
                >
                  Replay intro
                </button>
              </li>
              <li>
                <a href="#notes" className="hover:text-[var(--text-default)] transition-colors">
                  Skills &amp; Education
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="theme-text font-semibold text-sm">Connect</h5>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/Sanketnehe-21"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[var(--text-default)] transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="mailto:sanketnehe21@gmail.com"
                  className="hover:text-[var(--text-default)] transition-colors"
                >
                  sanketnehe21@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919309367739"
                  className="hover:text-[var(--text-default)] transition-colors"
                >
                  +91 93093 67739
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="theme-text font-semibold text-sm">Location</h5>
            <ul className="space-y-2">
              <li>Mumbai, India</li>
              <li>B.E. Computer Engg</li>
              <li>21 Sept 2003 · ♍ Virgo</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t theme-border flex flex-col sm:flex-row items-center justify-between gap-4 theme-subtle-text text-[11px]">
          <div className="flex items-center gap-4">
            <span>© 2026 Sanket Nehe</span>
            <span className="inline-flex items-center gap-1.5 theme-muted">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Made of stardust. Driven by curiosity.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              id="footer-theme-btn"
              onClick={onCycleTheme}
              className="theme-pill inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-colors text-[11px] cursor-pointer"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span id="theme-label" className="truncate">
                {themeLabel}
              </span>
            </button>
          </div>
        </div>
      </footer>
    </>
  )
}
