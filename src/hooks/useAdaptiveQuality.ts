import { useEffect } from 'react'
import {
  QUALITY_PROFILES,
  useExperienceStore,
  type QualityTier,
} from '../stores/experienceStore'

interface AdaptiveConfig {
  tier: QualityTier
  humanPoints: number
  namePoints: number
  starCount: number
  dpr: number
  enableBloom: boolean
  qualityUniform: number
}

export function useAdaptiveQuality(): AdaptiveConfig {
  const qualityTier = useExperienceStore((s) => s.qualityTier)
  const setQualityTier = useExperienceStore((s) => s.setQualityTier)
  const setReducedMotion = useExperienceStore((s) => s.setReducedMotion)
  const setWebglSupported = useExperienceStore((s) => s.setWebglSupported)

  useEffect(() => {
    // 1. Reduced motion detection
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', onMotionChange)

    // 2. WebGL capability probe
    try {
      const probe = document.createElement('canvas')
      const gl = probe.getContext('webgl2') || probe.getContext('webgl')
      setWebglSupported(Boolean(gl))
    } catch {
      setWebglSupported(false)
    }

    // 3. Hardware-aware initial profile (optional ?quality=low|balanced|ultra override)
    const paramTier = new URLSearchParams(window.location.search).get('quality')
    if (paramTier === 'low' || paramTier === 'balanced' || paramTier === 'ultra') {
      setQualityTier(paramTier)
    } else {
      const cores = navigator.hardwareConcurrency || 4
      const isMobile = window.innerWidth < 768
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8

      if (isMobile || cores <= 4 || memory <= 4) {
        setQualityTier('low')
      } else if (cores >= 8 && memory >= 8) {
        setQualityTier('ultra')
      } else {
        setQualityTier('balanced')
      }
    }

    return () => {
      mq.removeEventListener('change', onMotionChange)
    }
  }, [setQualityTier, setReducedMotion, setWebglSupported])

  const profile = QUALITY_PROFILES[qualityTier]
  const rawDpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  // Hard cap DPR at 1.5 across all profiles to prevent fill-rate saturation
  const dpr = Math.min(rawDpr, profile.maxDpr, 1.5)

  return {
    tier: qualityTier,
    humanPoints: profile.humanPoints,
    namePoints: profile.namePoints,
    starCount: profile.starCount,
    dpr,
    enableBloom: profile.enableBloom,
    qualityUniform: profile.qualityUniform,
  }
}
