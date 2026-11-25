import { create } from 'zustand'
import {
  killActiveTimeline,
  playBootToIdentityTimeline,
  playJourneyTimeline,
  playReducedMotionArrival,
} from '../animation/timeline'
import {
  resetMotionStateForIntro,
  setMotionStateImmediatePortfolio,
} from '../animation/deconstruction'

export type ExperiencePhase =
  | 'BOOT'
  | 'COSMIC_IDLE'
  | 'IDENTITY_READY'
  | 'DECONSTRUCTING'
  | 'WARP_ACCELERATION'
  | 'WARP_TRAVEL'
  | 'WARP_DECELERATION'
  | 'PORTFOLIO_REVEAL'
  | 'PORTFOLIO_ACTIVE'

export type QualityTier = 'low' | 'balanced' | 'ultra'

export const QUALITY_PROFILES: Record<
  QualityTier,
  {
    humanPoints: number
    namePoints: number
    starCount: number
    maxDpr: number
    enableBloom: boolean
    qualityUniform: number
  }
> = {
  low: {
    humanPoints: 24000,
    namePoints: 7000,
    starCount: 650,
    maxDpr: 1.0,
    enableBloom: false,
    qualityUniform: 0.65,
  },
  balanced: {
    humanPoints: 42000,
    namePoints: 10500,
    starCount: 950,
    maxDpr: 1.25,
    enableBloom: false,
    qualityUniform: 0.85,
  },
  ultra: {
    humanPoints: 60000,
    namePoints: 13500,
    starCount: 1250,
    maxDpr: 1.5,
    enableBloom: true,
    qualityUniform: 1.0,
  },
}

const PORTFOLIO_PATH = '/portfolio'

export function isPortfolioRoute(loc?: { pathname: string; search: string; hash: string }): boolean {
  if (typeof window === 'undefined') return false
  const target = loc ?? window.location
  const params = new URLSearchParams(target.search)
  if (params.get('intro') === '1' && target.pathname !== PORTFOLIO_PATH) return false
  if (target.pathname === PORTFOLIO_PATH || target.pathname.startsWith(`${PORTFOLIO_PATH}/`)) {
    return true
  }
  if (params.get('skip') === '1') return true
  if (target.hash && target.hash.length > 1) return true
  return false
}

function navigateRoute(toPortfolio: boolean, replace = false) {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  if (toPortfolio) {
    params.delete('intro')
  } else {
    params.delete('skip')
  }
  const searchStr = params.toString() ? `?${params.toString()}` : ''
  const targetUrl = toPortfolio
    ? `${PORTFOLIO_PATH}${searchStr}${window.location.hash}`
    : `/${searchStr}`
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (currentUrl !== targetUrl) {
    if (replace) {
      window.history.replaceState(null, '', targetUrl)
    } else {
      window.history.pushState(null, '', targetUrl)
    }
  }
}

interface ExperienceState {
  phase: ExperiencePhase
  humanReady: boolean
  nameReady: boolean
  shadersPrecompiled: boolean
  qualityTier: QualityTier
  particleCount: number
  reducedMotion: boolean
  webglSupported: boolean
  isTransitionLocked: boolean
  initExperience: () => void
  syncRouteFromLocation: () => void
  setPhase: (phase: ExperiencePhase) => void
  setHumanReady: (ready: boolean) => void
  setNameReady: (ready: boolean) => void
  setShadersPrecompiled: (ready: boolean) => void
  setQualityTier: (tier: QualityTier) => void
  degradeQuality: () => void
  upgradeQuality: () => void
  setReducedMotion: (reduced: boolean) => void
  setWebglSupported: (supported: boolean) => void
  beginJourney: () => void
  skipIntro: () => void
  replayIntro: () => void
  cleanup: () => void
}

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  phase: 'BOOT',
  humanReady: false,
  nameReady: false,
  shadersPrecompiled: false,
  qualityTier: 'balanced',
  particleCount: QUALITY_PROFILES.balanced.humanPoints,
  reducedMotion: false,
  webglSupported: true,
  isTransitionLocked: false,

  initExperience: () => {
    const { reducedMotion, webglSupported } = get()
    if (!webglSupported || isPortfolioRoute()) {
      killActiveTimeline()
      setMotionStateImmediatePortfolio()
      if (typeof window !== 'undefined' && window.location.pathname === '/' && isPortfolioRoute()) {
        navigateRoute(true, true)
      }
      set({ phase: 'PORTFOLIO_ACTIVE', isTransitionLocked: false })
      return
    }

    if (reducedMotion) {
      resetMotionStateForIntro()
      playBootToIdentityTimeline((phase) => set({ phase }))
      return
    }

    playBootToIdentityTimeline((phase) => set({ phase }))
  },

  syncRouteFromLocation: () => {
    const { webglSupported } = get()
    killActiveTimeline()
    if (!webglSupported || isPortfolioRoute()) {
      setMotionStateImmediatePortfolio()
      set({ phase: 'PORTFOLIO_ACTIVE', isTransitionLocked: false })
    } else {
      resetMotionStateForIntro()
      set({ isTransitionLocked: false })
      playBootToIdentityTimeline((phase) => set({ phase }))
    }
  },

  setPhase: (phase) => set({ phase }),
  setHumanReady: (humanReady) => set({ humanReady }),
  setNameReady: (nameReady) => set({ nameReady }),
  setShadersPrecompiled: (shadersPrecompiled) => set({ shadersPrecompiled }),
  setQualityTier: (qualityTier) =>
    set({
      qualityTier,
      particleCount: QUALITY_PROFILES[qualityTier].humanPoints,
    }),

  degradeQuality: () => {
    const { qualityTier } = get()
    if (qualityTier === 'ultra') {
      set({
        qualityTier: 'balanced',
        particleCount: QUALITY_PROFILES.balanced.humanPoints,
      })
    } else if (qualityTier === 'balanced') {
      set({
        qualityTier: 'low',
        particleCount: QUALITY_PROFILES.low.humanPoints,
      })
    }
  },

  upgradeQuality: () => {
    const { qualityTier } = get()
    if (qualityTier === 'low') {
      set({
        qualityTier: 'balanced',
        particleCount: QUALITY_PROFILES.balanced.humanPoints,
      })
    } else if (qualityTier === 'balanced') {
      set({
        qualityTier: 'ultra',
        particleCount: QUALITY_PROFILES.ultra.humanPoints,
      })
    }
  },

  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setWebglSupported: (webglSupported) => set({ webglSupported }),

  beginJourney: () => {
    const { phase, reducedMotion, isTransitionLocked } = get()
    if (isTransitionLocked) return
    if (phase !== 'IDENTITY_READY' && phase !== 'COSMIC_IDLE') return

    set({ isTransitionLocked: true })

    const onFinish = () => {
      navigateRoute(true)
      set({ isTransitionLocked: false })
    }

    if (reducedMotion) {
      playReducedMotionArrival((nextPhase) => set({ phase: nextPhase }), onFinish)
      return
    }

    playJourneyTimeline((nextPhase) => set({ phase: nextPhase }), onFinish)
  },

  skipIntro: () => {
    const { phase } = get()
    if (phase === 'PORTFOLIO_ACTIVE') return
    killActiveTimeline()
    setMotionStateImmediatePortfolio()
    navigateRoute(true)
    set({ phase: 'PORTFOLIO_ACTIVE', isTransitionLocked: false })
  },

  replayIntro: () => {
    killActiveTimeline()
    resetMotionStateForIntro()
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' })
      navigateRoute(false)
    }
    set({ isTransitionLocked: false })
    playBootToIdentityTimeline((phase) => set({ phase }))
  },

  cleanup: () => {
    killActiveTimeline()
  },
}))
