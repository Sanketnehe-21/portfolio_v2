import { useCallback, useEffect, useRef, useState } from 'react'
import './portfolio.css'
import { Navbar, type ThemeMode } from './components/Navbar'
import { Hero } from './components/Hero'
import { WorkflowTimeline } from './components/WorkflowTimeline'
import { CoreCraft } from './components/CoreCraft'
import { ProjectsSection } from './components/ProjectsSection'
import { ImpactAndNotes } from './components/ImpactAndNotes'
import { CtaAndFooter } from './components/CtaAndFooter'
import { useExperienceStore } from '../stores/experienceStore'
import { motionState } from '../animation/deconstruction'

export function Portfolio() {
  const phase = useExperienceStore((s) => s.phase)
  const replayIntro = useExperienceStore((s) => s.replayIntro)

  const [themeMode, setThemeMode] = useState<ThemeMode>('dark')
  const [isLightResolved, setIsLightResolved] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const toastTimerRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const resolveIsLight = useCallback((mode: ThemeMode) => {
    if (mode === 'light') return true
    if (mode === 'dark') return false
    return !window.matchMedia('(prefers-color-scheme: dark)').matches
  }, [])

  useEffect(() => {
    const light = resolveIsLight(themeMode)
    setIsLightResolved(light)
    const root = document.documentElement
    if (light) {
      root.classList.add('light')
      root.classList.remove('dark')
    } else {
      root.classList.remove('light')
      root.classList.add('dark')
    }
  }, [themeMode, resolveIsLight])

  const handleToggleTheme = useCallback(() => {
    setThemeMode((prev) => {
      const currentlyLight = resolveIsLight(prev)
      return currentlyLight ? 'dark' : 'light'
    })
  }, [resolveIsLight])

  const handleCycleTheme = useCallback(() => {
    const order: ThemeMode[] = ['auto', 'light', 'dark']
    setThemeMode((prev) => order[(order.indexOf(prev) + 1) % order.length])
  }, [])

  const showToast = useCallback((message: string) => {
    setToastMsg(message)
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current)
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMsg(null)
    }, 2400)
  }, [])

  // Sync smooth GSAP portfolio reveal opacity when transitioning into PORTFOLIO_REVEAL / ACTIVE
  useEffect(() => {
    if (phase === 'PORTFOLIO_ACTIVE') {
      if (containerRef.current) {
        containerRef.current.style.opacity = '1'
      }
      return
    }
    if (phase === 'PORTFOLIO_REVEAL') {
      let raf = 0
      const tick = () => {
        if (containerRef.current) {
          containerRef.current.style.opacity = String(motionState.portfolioOpacity)
        }
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(raf)
    }
    if (containerRef.current) {
      containerRef.current.style.opacity = '0'
    }
  }, [phase])

  const isRevealed = phase === 'PORTFOLIO_REVEAL' || phase === 'PORTFOLIO_ACTIVE'

  return (
    <div
      ref={containerRef}
      aria-hidden={!isRevealed}
      className="portfolio-shell relative min-h-screen transition-colors duration-200 antialiased selection:bg-blue-500/20"
      style={{
        opacity: phase === 'PORTFOLIO_ACTIVE' ? 1 : 0,
        pointerEvents: isRevealed ? 'auto' : 'none',
      }}
    >
      <div className="hero-glow" />

      <Navbar
        isLight={isLightResolved}
        onToggleTheme={handleToggleTheme}
      />

      <main>
        <Hero />
        <WorkflowTimeline />
        <CoreCraft />
        <ProjectsSection />
        <ImpactAndNotes />
      </main>

      <CtaAndFooter
        themeMode={themeMode}
        onCycleTheme={handleCycleTheme}
        onReplayIntro={replayIntro}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-full bg-blue-600 text-white text-xs font-medium shadow-xl transition-all duration-200 ${
          toastMsg
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        {toastMsg ?? ''}
      </div>
    </div>
  )
}
