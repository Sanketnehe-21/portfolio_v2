import gsap from 'gsap'
import {
  TIMELINE_DURATIONS,
  motionState,
  resetMotionStateForIntro,
  setMotionStateImmediatePortfolio,
} from './deconstruction'
import type { ExperiencePhase } from '../stores/experienceStore'

let activeTimeline: gsap.core.Timeline | null = null

export function killActiveTimeline() {
  if (activeTimeline) {
    activeTimeline.kill()
    activeTimeline = null
  }
}

export function playBootToIdentityTimeline(
  onPhaseChange: (phase: ExperiencePhase) => void
): gsap.core.Timeline {
  killActiveTimeline()
  resetMotionStateForIntro()

  const tl = gsap.timeline()
  onPhaseChange('COSMIC_IDLE')

  tl.to(motionState, {
    cosmicReveal: 1,
    duration: TIMELINE_DURATIONS.cosmicBootFade,
    ease: 'power2.out',
    onComplete: () => {
      onPhaseChange('IDENTITY_READY')
    },
  })

  activeTimeline = tl
  return tl
}

export function playJourneyTimeline(
  onPhaseChange: (phase: ExperiencePhase) => void,
  onComplete: () => void
): gsap.core.Timeline {
  killActiveTimeline()

  const tl = gsap.timeline({
    onComplete: () => {
      setMotionStateImmediatePortfolio()
      onPhaseChange('PORTFOLIO_ACTIVE')
      onComplete()
      activeTimeline = null
    },
  })

  // 0.0 - 0.6 s: Fade secondary interface and celestial markings
  tl.call(() => onPhaseChange('DECONSTRUCTING'), undefined, 0)
  tl.to(
    motionState,
    {
      secondaryUiOpacity: 0,
      duration: TIMELINE_DURATIONS.secondaryUiFade,
      ease: 'power2.inOut',
    },
    0
  )

  // 0.6 - 2.5 s: Name and human slowly dissolve from edges inward; dust drifts into space
  tl.to(
    motionState,
    {
      deconstructProgress: 1,
      duration: TIMELINE_DURATIONS.deconstructDuration,
      ease: 'power2.inOut',
    },
    0.55
  )

  // 2.5 - 3.5 s: Morph existing particles into shared starfield coordinates; camera starts accelerating
  tl.call(() => onPhaseChange('WARP_ACCELERATION'), undefined, 2.45)
  tl.to(
    motionState,
    {
      morphProgress: 1,
      duration: TIMELINE_DURATIONS.morphDuration,
      ease: 'power3.in',
    },
    2.45
  )
  tl.to(
    motionState,
    {
      warpSpeed: 0.42,
      warpTrail: 0.45,
      duration: TIMELINE_DURATIONS.morphDuration,
      ease: 'power2.in',
    },
    2.55
  )

  // 3.5 - 5.7 s: Perspective-correct forward travel, luminous velocity-dependent trails
  tl.call(() => onPhaseChange('WARP_TRAVEL'), undefined, 3.5)
  tl.to(
    motionState,
    {
      warpSpeed: 1,
      warpTrail: 1,
      duration: 1.0,
      ease: 'power2.out',
    },
    3.5
  )

  // 4.9 - 6.3 s: Gently introduce inner landing linear gradient before warp completes
  tl.to(
    motionState,
    {
      arrivalGradientOpacity: 1,
      duration: 1.4,
      ease: 'power2.inOut',
    },
    4.9
  )

  // 5.7 - 6.8 s: Ease speed down
  tl.call(() => onPhaseChange('WARP_DECELERATION'), undefined, 5.4)
  tl.to(
    motionState,
    {
      warpSpeed: 0.06,
      warpTrail: 0.04,
      duration: TIMELINE_DURATIONS.warpDecelerate,
      ease: 'power3.out',
    },
    5.4
  )

  // 6.2 - 7.1 s: Fade canvas and reveal original portfolio without reload
  tl.call(() => onPhaseChange('PORTFOLIO_REVEAL'), undefined, 6.15)
  tl.to(
    motionState,
    {
      canvasOpacity: 0,
      portfolioOpacity: 1,
      duration: TIMELINE_DURATIONS.portfolioReveal,
      ease: 'power2.inOut',
    },
    6.15
  )

  activeTimeline = tl
  return tl
}

export function playReducedMotionArrival(
  onPhaseChange: (phase: ExperiencePhase) => void,
  onComplete: () => void
): gsap.core.Timeline {
  killActiveTimeline()
  onPhaseChange('PORTFOLIO_REVEAL')

  const tl = gsap.timeline({
    onComplete: () => {
      setMotionStateImmediatePortfolio()
      onPhaseChange('PORTFOLIO_ACTIVE')
      onComplete()
      activeTimeline = null
    },
  })

  tl.to(motionState, {
    secondaryUiOpacity: 0,
    arrivalGradientOpacity: 1,
    canvasOpacity: 0,
    portfolioOpacity: 1,
    duration: 0.45,
    ease: 'power1.out',
  })

  activeTimeline = tl
  return tl
}
