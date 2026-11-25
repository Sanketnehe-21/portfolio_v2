/**
 * Timing and dispersion constants matching Blueprint Section 05 (Cinematic timeline & continuity).
 * Phase durations are relative to CTA ("BEGIN THE JOURNEY") activation.
 */
export const TIMELINE_DURATIONS = {
  cosmicBootFade: 1.4,
  secondaryUiFade: 0.6,     // 0.0 - 0.6 s
  deconstructDuration: 1.9, // 0.6 - 2.5 s (edge-inward dissolution)
  morphDuration: 1.0,       // 2.5 - 3.5 s (morph into shared starfield + accel)
  warpTravel: 2.2,          // 3.5 - 5.7 s (perspective-correct forward travel)
  warpDecelerate: 1.1,      // 5.7 - 6.8 s (ease speed down)
  portfolioReveal: 0.9,     // 6.4 - 7.3 s (fade canvas & reveal portfolio)
} as const

export interface MotionProgressState {
  /** 0 = dark boot, 1 = cosmic idle / identity ready */
  cosmicReveal: number
  /** 1 = visible identity UI & constellations, 0 = faded out */
  secondaryUiOpacity: number
  /** 0 = intact identity, 1 = dissolved edge-inward into drifting dust */
  deconstructProgress: number
  /** 0 = dispersed identity, 1 = morphed into shared starfield targets */
  morphProgress: number
  /** 0 = stationary, 1 = full interstellar warp velocity */
  warpSpeed: number
  /** 0 = point stars, 1 = elongated velocity trails */
  warpTrail: number
  /** 1 = canvas visible, 0 = canvas faded into portfolio arrival */
  canvasOpacity: number
  /** 0 = hidden portfolio, 1 = revealed portfolio DOM */
  portfolioOpacity: number
  /** 0 = deep cosmos, 1 = inner landing linear gradient pre-blend before arrival */
  arrivalGradientOpacity: number
}

export const motionState: MotionProgressState = {
  cosmicReveal: 0,
  secondaryUiOpacity: 1,
  deconstructProgress: 0,
  morphProgress: 0,
  warpSpeed: 0,
  warpTrail: 0,
  canvasOpacity: 1,
  portfolioOpacity: 0,
  arrivalGradientOpacity: 0,
}

export function resetMotionStateForIntro() {
  motionState.cosmicReveal = 0
  motionState.secondaryUiOpacity = 1
  motionState.deconstructProgress = 0
  motionState.morphProgress = 0
  motionState.warpSpeed = 0
  motionState.warpTrail = 0
  motionState.canvasOpacity = 1
  motionState.portfolioOpacity = 0
  motionState.arrivalGradientOpacity = 0
}

export function setMotionStateImmediatePortfolio() {
  motionState.cosmicReveal = 1
  motionState.secondaryUiOpacity = 0
  motionState.deconstructProgress = 1
  motionState.morphProgress = 1
  motionState.warpSpeed = 0
  motionState.warpTrail = 0
  motionState.canvasOpacity = 0
  motionState.portfolioOpacity = 1
  motionState.arrivalGradientOpacity = 1
}
