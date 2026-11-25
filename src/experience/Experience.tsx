import { type MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
// Temporarily paused per user request ("comment him for now"):
// import { HumanParticles } from './HumanParticles'
import { NameParticles } from './NameParticles'
import { Starfield } from './Starfield'
import { Constellations, type VirgoHoverDomState } from './Constellations'
import { CameraRig } from './CameraRig'
import { PerfProfiler } from './PerfProfiler'
import { useAdaptiveQuality } from '../hooks/useAdaptiveQuality'
import { usePointerInteraction } from '../hooks/usePointerInteraction'
import { useExperienceStore, type ExperiencePhase } from '../stores/experienceStore'
import { motionState } from '../animation/deconstruction'

const PHASE_LABELS: Record<ExperiencePhase, string> = {
  BOOT: '01 / COSMIC IDLE',
  COSMIC_IDLE: '01 / COSMIC IDLE',
  IDENTITY_READY: '02 / DIGITAL IDENTITY',
  DECONSTRUCTING: '03 / DECONSTRUCTION',
  WARP_ACCELERATION: '04 / STARFIELD',
  WARP_TRAVEL: '04 / STARFIELD',
  WARP_DECELERATION: '04 / STARFIELD',
  PORTFOLIO_REVEAL: '05 / ARRIVAL',
  PORTFOLIO_ACTIVE: '05 / ARRIVAL',
}

interface SceneContentProps {
  isMobile: boolean
  isCanvasActive: boolean
  humanPoints: number
  namePoints: number
  starCount: number
  dpr: number
  qualityUniform: number
  enableBloom: boolean
  showPerf: boolean
  onMissingModel: (msg: string) => void
  onVirgoHoverChange: (state: VirgoHoverDomState) => void
  forceVirgoHighlightRef: MutableRefObject<boolean>
}

function SceneContent({
  isMobile,
  isCanvasActive,
  humanPoints,
  namePoints,
  starCount,
  dpr,
  qualityUniform,
  enableBloom,
  showPerf,
  onMissingModel,
  onVirgoHoverChange,
  forceVirgoHighlightRef,
}: SceneContentProps) {
  const { size, gl, scene, camera } = useThree()
  const humanReady = useExperienceStore((s) => s.humanReady)
  const nameReady = useExperienceStore((s) => s.nameReady)
  const setHumanReady = useExperienceStore((s) => s.setHumanReady)
  const setShadersPrecompiled = useExperienceStore((s) => s.setShadersPrecompiled)
  const degradeQuality = useExperienceStore((s) => s.degradeQuality)
  const upgradeQuality = useExperienceStore((s) => s.upgradeQuality)

  // Single shared pointer ray tracker for particle hover dispersion
  const pointerStateRef = usePointerInteraction(isCanvasActive)

  // Mark human step ready while HumanParticles is commented out so shader precompilation proceeds
  useEffect(() => {
    setHumanReady(true)
  }, [setHumanReady])

  // Precompile all GLSL shader programs once scene meshes are ready before transitions start
  useEffect(() => {
    if (!humanReady || !nameReady) return
    gl.compile(scene, camera)
    setShadersPrecompiled(true)
  }, [humanReady, nameReady, gl, scene, camera, setShadersPrecompiled])

  const baseHeight = 2 * 3.65 * Math.tan((42 * Math.PI) / 360)
  const baseWidth = baseHeight * (size.width / Math.max(1, size.height))
  const qWidth = Math.round(baseWidth * 20) / 20

  const worldScale = useMemo(() => {
    return isMobile
      ? Math.min(0.00245, (qWidth * 0.88) / 560)
      : Math.min(0.00295, (qWidth * 0.44) / 560)
  }, [isMobile, qWidth])

  const namePos = useMemo<[number, number, number]>(
    () => (isMobile ? [0, 0.78, 0] : [-qWidth * 0.375, 0.25, 0]),
    [isMobile, qWidth]
  )

  const humanPos = useMemo<[number, number, number]>(
    () => (isMobile ? [0, -0.05, 0] : [Math.min(1.06, qWidth * 0.24), -0.10, 0]),
    [isMobile, qWidth]
  )

  const humanScale = isMobile ? 0.54 : 0.88
  // Retained for when HumanParticles is re-enabled
  void humanPoints
  void humanPos
  void humanScale
  void onMissingModel

  const qualityLocked =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('quality')

  return (
    <>
      <color attach="background" args={['#020306']} />
      <PerfProfiler visible={showPerf && isCanvasActive} />

      <PerformanceMonitor
        bounds={() => [45, 60]}
        flipflops={3}
        onDecline={() => {
          if (!qualityLocked) degradeQuality()
        }}
        onIncline={() => {
          if (!qualityLocked) upgradeQuality()
        }}
      />

      <CameraRig />
      <Starfield qualityUniform={qualityUniform} count={starCount} />
      <Constellations
        isMobile={isMobile}
        onVirgoHoverChange={onVirgoHoverChange}
        forceHighlightRef={forceVirgoHighlightRef}
      />

      <NameParticles
        namePoints={namePoints}
        qualityUniform={qualityUniform}
        dpr={dpr}
        isMobile={isMobile}
        position={namePos}
        worldScale={worldScale}
        pointerStateRef={pointerStateRef}
      />

      {/* Temporarily commented out per user request:
      <HumanParticles
        modelUrl="/models/human.glb"
        particleCount={humanPoints}
        qualityUniform={qualityUniform}
        dpr={dpr}
        position={humanPos}
        scale={humanScale}
        pointerStateRef={pointerStateRef}
        onMissingModel={onMissingModel}
      />
      */}

      {enableBloom && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.16}
            luminanceThreshold={0.82}
            luminanceSmoothing={0.35}
            levels={3}
            resolutionScale={0.5}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </>
  )
}

export function Experience() {
  const { humanPoints, namePoints, starCount, dpr, enableBloom, qualityUniform, tier } =
    useAdaptiveQuality()
  const phase = useExperienceStore((s) => s.phase)
  const webglSupported = useExperienceStore((s) => s.webglSupported)
  const humanReady = useExperienceStore((s) => s.humanReady)
  const isTransitionLocked = useExperienceStore((s) => s.isTransitionLocked)
  const beginJourney = useExperienceStore((s) => s.beginJourney)
  const skipIntro = useExperienceStore((s) => s.skipIntro)

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )
  const [missingModelNote, setMissingModelNote] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)

  const overlayRef = useRef<HTMLDivElement>(null)
  const hudRef = useRef<HTMLDivElement>(null)
  const arrivalGradientRef = useRef<HTMLDivElement>(null)
  const virgoCardRef = useRef<HTMLDivElement>(null)
  const virgoStarLabelRef = useRef<HTMLSpanElement>(null)
  const forceVirgoHighlightRef = useRef(false)
  const sceneVirgoActiveRef = useRef(false)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    const onVis = () => setPaused(document.hidden)
    window.addEventListener('resize', onResize, { passive: true })
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  const positionVirgoCard = useCallback((x: number, y: number, starLabel: string, visible: boolean) => {
    const card = virgoCardRef.current
    if (!card) return
    if (!visible) {
      card.style.opacity = '0'
      card.style.pointerEvents = 'none'
      return
    }
    if (virgoStarLabelRef.current) {
      virgoStarLabelRef.current.textContent = starLabel
    }
    const cardW = Math.min(312, window.innerWidth - 24)
    const cardH = 148
    const minY = window.innerWidth < 640 ? 168 : 112
    const clampedX = Math.max(12, Math.min(window.innerWidth - cardW - 12, x + 16))
    const clampedY = Math.max(minY, Math.min(window.innerHeight - cardH - 16, y - 24))
    card.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0)`
    card.style.opacity = '1'
  }, [])

  const handleVirgoHoverChange = useCallback(
    (hoverState: VirgoHoverDomState) => {
      sceneVirgoActiveRef.current = hoverState.active
      if (hoverState.active) {
        positionVirgoCard(
          hoverState.screenX,
          hoverState.screenY,
          `${hoverState.star.name.toUpperCase()} · ${hoverState.star.bayer.toUpperCase()} (${hoverState.star.mag})`,
          true
        )
      } else if (!forceVirgoHighlightRef.current) {
        positionVirgoCard(0, 0, '', false)
      }
    },
    [positionVirgoCard]
  )

  const showBadgeVirgoCard = useCallback(
    (active: boolean) => {
      forceVirgoHighlightRef.current = active
      if (active) {
        const left = window.innerWidth < 640 ? 12 : 40
        const top = window.innerWidth < 640 ? 172 : 114
        positionVirgoCard(left, top, 'SPICA · α VIRGINIS · BRIGHTEST STAR (+0.97)', true)
      } else if (!sceneVirgoActiveRef.current) {
        positionVirgoCard(0, 0, '', false)
      }
    },
    [positionVirgoCard]
  )

  const isCanvasActive = phase !== 'PORTFOLIO_ACTIVE'

  // Sync smooth GSAP motionState opacities directly to DOM without React re-renders
  useEffect(() => {
    if (phase !== 'COSMIC_IDLE' && phase !== 'IDENTITY_READY') {
      forceVirgoHighlightRef.current = false
      sceneVirgoActiveRef.current = false
      if (virgoCardRef.current) {
        virgoCardRef.current.style.opacity = '0'
      }
    }
    if (!isCanvasActive) return
    let raf = 0
    const syncOpacity = () => {
      if (overlayRef.current) {
        overlayRef.current.style.opacity = String(motionState.canvasOpacity)
      }
      if (hudRef.current) {
        hudRef.current.style.opacity = String(motionState.secondaryUiOpacity)
      }
      if (arrivalGradientRef.current) {
        arrivalGradientRef.current.style.opacity = String(motionState.arrivalGradientOpacity)
      }
      raf = requestAnimationFrame(syncOpacity)
    }
    raf = requestAnimationFrame(syncOpacity)
    return () => cancelAnimationFrame(raf)
  }, [isCanvasActive, phase])

  const handleMissingModel = useCallback((msg: string) => {
    setMissingModelNote(msg)
  }, [])

  if (!webglSupported) {
    return null
  }

  const showPerf =
    typeof window === 'undefined' ||
    new URLSearchParams(window.location.search).get('perf') !== '0'

  const showInteractiveControls =
    phase === 'COSMIC_IDLE' || phase === 'IDENTITY_READY'

  // Keep single Canvas mounted across Replay/Portfolio transitions (prevent WebGL recreation),
  // while stopping the frameloop completely when PORTFOLIO_ACTIVE or tab is hidden.
  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal={isCanvasActive && phase !== 'PORTFOLIO_REVEAL'}
      aria-hidden={!isCanvasActive}
      aria-label="Digital identity introduction"
      className="fixed inset-0 z-50 overflow-hidden bg-[#020306] text-[#E4E6ED] select-none"
      style={{
        visibility: isCanvasActive ? 'visible' : 'hidden',
        pointerEvents:
          !isCanvasActive || phase === 'PORTFOLIO_REVEAL' ? 'none' : 'auto',
      }}
    >
      <Canvas
        dpr={dpr}
        shadows={false}
        frameloop={paused || !isCanvasActive ? 'never' : 'always'}
        style={{ background: '#020306' }}
        onCreated={({ gl }) => {
          gl.setClearColor('#020306', 1)
        }}
        camera={{ position: [0, 0.06, 3.65], fov: 42, near: 0.1, far: 120 }}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
        }}
      >
        <SceneContent
          isMobile={isMobile}
          isCanvasActive={isCanvasActive}
          humanPoints={humanPoints}
          namePoints={namePoints}
          starCount={starCount}
          dpr={dpr}
          qualityUniform={qualityUniform}
          enableBloom={enableBloom}
          showPerf={showPerf}
          onMissingModel={handleMissingModel}
          onVirgoHoverChange={handleVirgoHoverChange}
          forceVirgoHighlightRef={forceVirgoHighlightRef}
        />
      </Canvas>

      {/* Subtle pre-arrival linear gradient matching the inner portfolio sky */}
      <div
        ref={arrivalGradientRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          opacity: 0,
          background:
            'linear-gradient(180deg, rgba(28, 56, 114, 0.34) 0%, rgba(16, 24, 46, 0.28) 38%, rgba(13, 15, 18, 0.84) 76%, #0d0f12 100%)',
        }}
      />

      {/* Top celestial coordinates & skip control */}
      {isCanvasActive && (
        <>
          <div
            ref={hudRef}
            className="pointer-events-none fixed inset-0 flex flex-col justify-between p-6 sm:p-10"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1 font-mono text-[11px] tracking-[0.22em] text-[#9296A6]">
                <p className="truncate text-[#E4E6ED]/90">SN / THE OBSERVABLE SELF</p>
                <button
                  type="button"
                  onPointerEnter={(e) => {
                    if (e.pointerType !== 'touch') showBadgeVirgoCard(true)
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType !== 'touch') showBadgeVirgoCard(false)
                  }}
                  onFocus={() => showBadgeVirgoCard(true)}
                  onBlur={() => showBadgeVirgoCard(false)}
                  onClick={() => showBadgeVirgoCard(!forceVirgoHighlightRef.current)}
                  className="pointer-events-auto inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#B8CEFF]/20 bg-[#101320]/55 px-2.5 py-0.5 text-[10px] tracking-[0.16em] text-[#B8C8EB]/85 transition hover:border-[#B8CEFF]/55 hover:text-[#E4E6ED] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E4E6ED]"
                  title="Hover Virgo constellation or click to inspect birth sign"
                >
                  <span aria-hidden="true">♍</span>
                  <span className="sm:hidden">VIRGO · 21 SEP 2003</span>
                  <span className="hidden sm:inline">VIRGO · RA 13h 25m · DEC −11° 09&apos;</span>
                </button>
              </div>

              <button
                type="button"
                onClick={skipIntro}
                className="pointer-events-auto shrink-0 whitespace-nowrap rounded-full border border-[#9296A6]/25 bg-[#101320]/60 px-4 py-2 font-mono text-[11px] tracking-[0.18em] text-[#9296A6] transition hover:border-[#E4E6ED]/50 hover:text-[#E4E6ED] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E4E6ED]"
              >
                SKIP INTRO
              </button>
            </div>

            {/* Center-left (desktop) or lower-center (mobile) identity subtitle & CTA */}
            <div
              className={
                isMobile
                  ? 'mx-auto mb-9 flex max-w-sm flex-col items-center rounded-2xl bg-[#020306]/55 px-4 py-3 text-center backdrop-blur-sm'
                  : 'mb-[16vh] ml-2 flex max-w-md flex-col items-start text-left sm:ml-[8vw]'
              }
            >
              <p className="font-mono text-xs tracking-[0.18em] text-[#E4E6ED]/90 uppercase">
                Software Engineer / Independent Builder
              </p>
              <p className="mt-2 font-mono text-[11px] tracking-[0.2em] text-[#9296A6]">
                MADE OF STARDUST. DRIVEN BY CURIOSITY.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={!showInteractiveControls || isTransitionLocked}
                  onClick={beginJourney}
                  className="pointer-events-auto cursor-pointer rounded-full border border-[#9296A6]/45 bg-[#101320]/75 px-6 py-3 font-mono text-xs tracking-[0.18em] text-[#E4E6ED] backdrop-blur-md transition hover:border-[#E4E6ED]/80 hover:bg-[#28253C]/65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E4E6ED] disabled:cursor-default disabled:opacity-50"
                >
                  BEGIN THE JOURNEY ↗
                </button>
              </div>
            </div>
          </div>

          {/* Virgo constellation hover birthday tooltip (ref-driven, zero frame re-renders) */}
          <div
            ref={virgoCardRef}
            role="status"
            aria-live="polite"
            className="pointer-events-none fixed top-0 left-0 z-[10000] w-[min(312px,calc(100vw-24px))] rounded-2xl border border-[#B8CEFF]/28 bg-[#070910]/94 px-4 py-3 text-left shadow-[0_14px_40px_rgba(0,0,0,0.75)] backdrop-blur-md transition-opacity duration-200"
            style={{ opacity: 0, transform: 'translate3d(24px, 114px, 0)' }}
          >
            <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.18em] text-[#B8CEFF]">
              <span>♍ VIRGO · BIRTH SIGN</span>
              <span>21 SEPT 2003</span>
            </div>
            <p className="mt-1.5 text-sm font-medium tracking-tight text-[#E4E6ED]">
              Born 21 September 2003
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-[#9BA3BA]">
              Under the Virgo sky (Aug 23 – Sep 22) — an analytical Mercury-ruled Earth sign shaped by curiosity, precision, and structuring complex systems.
            </p>
            <div className="mt-2 border-t border-[#9296A6]/15 pt-1.5 font-mono text-[9px] tracking-[0.16em] text-[#9296A6]/90">
              <span ref={virgoStarLabelRef}>SPICA · α VIRGINIS (+0.97)</span>
            </div>
          </div>

          {/* Persistent subtle bottom status indicator */}
          <div className="pointer-events-none fixed bottom-5 left-6 right-6 flex items-center justify-between gap-4 font-mono text-[10px] tracking-[0.18em] text-[#9296A6]/80">
            <span>
              {PHASE_LABELS[phase]} · {tier.toUpperCase()}
            </span>
            {missingModelNote && !humanReady && (
              <span className="hidden sm:inline opacity-65">
                [HUMAN MESH DEFERRED · ADD public/models/human.glb]
              </span>
            )}
          </div>
        </>
      )}
    </div>
  )
}
