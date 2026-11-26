import { useEffect, useRef } from 'react'
import { addAfterEffect, useThree } from '@react-three/fiber'
import Stats from 'stats-gl'
import { useExperienceStore } from '../stores/experienceStore'
import { motionState } from '../animation/deconstruction'

export interface PerfSnapshot {
  fps: number
  frameTimeMs: number
  cpuMs: number
  gpuMs: number
  drawCalls: number
  points: number
  triangles: number
  geometries: number
  textures: number
  programs: number
  pixelRatio: number
  qualityTier: string
  humanPoints: number
  jsHeapMB: number | null
}

declare global {
  interface Window {
    __perfSnapshot?: () => PerfSnapshot
  }
}

export function PerfProfiler({ visible = false }: { visible?: boolean }) {
  const { gl } = useThree()
  const qualityTier = useExperienceStore((s) => s.qualityTier)
  const particleCount = useExperienceStore((s) => s.particleCount)

  const statsRef = useRef<Stats | null>(null)
  const hudElRef = useRef<HTMLDivElement | null>(null)
  const lastHudUpdateRef = useRef(0)
  const tierRef = useRef(qualityTier)
  const ptsRef = useRef(particleCount)

  tierRef.current = qualityTier
  ptsRef.current = particleCount

  const latestRef = useRef<PerfSnapshot>({
    fps: 0,
    frameTimeMs: 0,
    cpuMs: 0,
    gpuMs: 0,
    drawCalls: 0,
    points: 0,
    triangles: 0,
    geometries: 0,
    textures: 0,
    programs: 0,
    pixelRatio: 1,
    qualityTier,
    humanPoints: particleCount,
    jsHeapMB: null,
  })

  useEffect(() => {
    const stats = new Stats({
      trackGPU: true,
      trackFPS: true,
      horizontal: true,
      logsPerSecond: 4,
      samplesLog: 30,
    })
    void stats.init(gl)
    statsRef.current = stats

    const prevAutoReset = gl.info.autoReset
    gl.info.autoReset = false

    let hudEl: HTMLDivElement | null = null
    const isNarrow = window.innerWidth < 640
    if (visible) {
      stats.dom.style.position = 'fixed'
      stats.dom.style.top = isNarrow ? '68px' : '10px'
      stats.dom.style.left = '0'
      stats.dom.style.right = '0'
      stats.dom.style.marginInline = 'auto'
      stats.dom.style.display = 'flex'
      stats.dom.style.justifyContent = 'center'
      stats.dom.style.width = '270px'
      stats.dom.style.maxWidth = 'calc(100vw - 16px)'
      stats.dom.style.transform = isNarrow ? 'translate3d(0, 0, 0) scale(0.92)' : 'translate3d(0, 0, 0)'
      stats.dom.style.transformOrigin = 'top center'
      stats.dom.style.willChange = 'transform, opacity'
      stats.dom.style.zIndex = '9999'
      document.body.appendChild(stats.dom)

      hudEl = document.createElement('div')
      hudEl.id = 'perf-telemetry-readout'
      hudEl.style.cssText = isNarrow
        ? 'position:fixed;top:118px;left:8px;right:8px;max-width:calc(100vw - 16px);z-index:9999;background:rgba(2,3,6,0.84);border:1px solid rgba(146,150,166,0.28);border-radius:8px;padding:5px 8px;color:#E4E6ED;font:10px/1.35 monospace;white-space:normal;word-break:break-word;pointer-events:none;text-align:center;will-change:transform,opacity;'
        : 'position:fixed;top:66px;left:50%;transform:translate3d(-50%, 0, 0);max-width:calc(100vw - 24px);z-index:9999;background:rgba(2,3,6,0.82);border:1px solid rgba(146,150,166,0.28);border-radius:8px;padding:4px 10px;color:#E4E6ED;font:9.5px monospace;white-space:nowrap;pointer-events:none;will-change:transform,opacity;'
      document.body.appendChild(hudEl)
      hudElRef.current = hudEl
    }

    const frameSamples: number[] = []
    let lastFrameTs = performance.now()

    const unsubscribeAfter = addAfterEffect(() => {
      const now = performance.now()
      const frameDt = now - lastFrameTs
      lastFrameTs = now

      if (frameDt > 0 && frameDt < 250) {
        frameSamples.push(frameDt)
        if (frameSamples.length > 40) frameSamples.shift()
      }

      stats.update()

      const avgFrame =
        frameSamples.length > 0
          ? frameSamples.reduce((a, b) => a + b, 0) / frameSamples.length
          : 16.67

      const fpsLogs = stats.averageFps?.logs
      const cpuLogs = stats.averageCpu?.logs
      const gpuLogs = stats.averageGpu?.logs

      const avg = (arr?: number[]) =>
        arr && arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : null

      const measuredFps = avg(fpsLogs) ?? 1000 / Math.max(1, avgFrame)
      const measuredCpu = avg(cpuLogs) ?? 0
      const measuredGpu = avg(gpuLogs) ?? 0

      const mem = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory
      const heapMB = mem ? Number((mem.usedJSHeapSize / (1024 * 1024)).toFixed(2)) : null

      const snap: PerfSnapshot = {
        fps: Number(measuredFps.toFixed(1)),
        frameTimeMs: Number(avgFrame.toFixed(2)),
        cpuMs: Number(measuredCpu.toFixed(2)),
        gpuMs: Number(measuredGpu.toFixed(2)),
        drawCalls: gl.info.render.calls,
        points: gl.info.render.points,
        triangles: gl.info.render.triangles,
        geometries: gl.info.memory.geometries,
        textures: gl.info.memory.textures,
        programs: gl.info.programs?.length ?? 0,
        pixelRatio: Number(gl.getPixelRatio().toFixed(2)),
        qualityTier: tierRef.current,
        humanPoints: ptsRef.current,
        jsHeapMB: heapMB,
      }
      latestRef.current = snap
      gl.info.reset()

      if (visible) {
        const uiAlpha = motionState.secondaryUiOpacity
        const liftY = (1 - uiAlpha) * 140
        stats.dom.style.opacity = String(uiAlpha)
        stats.dom.style.transform = isNarrow
          ? `translate3d(0, ${-liftY}px, 0) scale(0.92)`
          : `translate3d(0, ${-liftY}px, 0)`
        stats.dom.style.pointerEvents = uiAlpha > 0.2 ? 'auto' : 'none'

        if (hudElRef.current) {
          hudElRef.current.style.opacity = String(uiAlpha)
          hudElRef.current.style.transform = isNarrow
            ? `translate3d(0, ${-liftY}px, 0)`
            : `translate3d(-50%, ${-liftY}px, 0)`
        }
      }

      if (hudElRef.current && now - lastHudUpdateRef.current > 250) {
        lastHudUpdateRef.current = now
        hudElRef.current.textContent = `${snap.qualityTier.toUpperCase()} (${snap.humanPoints}) | FPS ${snap.fps} | frame ${snap.frameTimeMs}ms | CPU ${snap.cpuMs}ms | GPU ${snap.gpuMs}ms | calls ${snap.drawCalls} | pts ${snap.points} | dpr ${snap.pixelRatio} | heap ${snap.jsHeapMB ?? 'n/a'}MB`
      }
    })

    window.__perfSnapshot = () => {
      const mem = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory
      return {
        ...latestRef.current,
        jsHeapMB: mem ? Number((mem.usedJSHeapSize / (1024 * 1024)).toFixed(2)) : null,
      }
    }

    return () => {
      unsubscribeAfter()
      gl.info.autoReset = prevAutoReset
      if (stats.dom.parentNode) {
        stats.dom.parentNode.removeChild(stats.dom)
      }
      if (hudEl && hudEl.parentNode) {
        hudEl.parentNode.removeChild(hudEl)
      }
      hudElRef.current = null
      stats.dispose()
      statsRef.current = null
      delete window.__perfSnapshot
    }
  }, [gl, visible])

  return null
}
