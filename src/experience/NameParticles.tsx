import { type MutableRefObject, useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import noiseGlsl from '../shaders/noise.glsl?raw'
import humanVertGlsl from '../shaders/human.vert.glsl?raw'
import humanFragGlsl from '../shaders/human.frag.glsl?raw'
import type { PointerUniformState } from '../hooks/usePointerInteraction'
import { QUALITY_PROFILES, useExperienceStore } from '../stores/experienceStore'
import { motionState } from '../animation/deconstruction'
import { computeStarfieldMorphTarget } from '../animation/particleMorph'

interface NameParticlesProps {
  namePoints: number
  qualityUniform: number
  dpr: number
  isMobile: boolean
  position: [number, number, number]
  worldScale: number
  pointerStateRef: MutableRefObject<PointerUniformState>
}

const MAX_NAME_SAMPLES = QUALITY_PROFILES.ultra.namePoints

function seededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

export function NameParticles({
  namePoints,
  qualityUniform,
  dpr,
  isMobile,
  position,
  worldScale,
  pointerStateRef,
}: NameParticlesProps) {
  const reducedMotion = useExperienceStore((s) => s.reducedMotion)
  const setNameReady = useExperienceStore((s) => s.setNameReady)

  const geometry = useMemo(() => {
    const canvas = document.createElement('canvas')
    const cw = 900
    const ch = 360
    canvas.width = cw
    canvas.height = ch

    const ctx = canvas.getContext('2d')
    if (!ctx) return new THREE.BufferGeometry()

    ctx.clearRect(0, 0, cw, ch)
    ctx.fillStyle = '#ffffff'
    ctx.textBaseline = 'middle'
    ctx.textAlign = isMobile ? 'center' : 'left'

    const anchorX = isMobile ? cw * 0.5 : 16
    ctx.font = '700 132px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    ctx.fillText('SANKET', anchorX, ch * 0.34)
    ctx.font = '300 110px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    ctx.fillText('NEHE', anchorX, ch * 0.69)

    const img = ctx.getImageData(0, 0, cw, ch).data
    const rand = seededRandom(19422108)

    const step = isMobile ? 3 : 2
    const candidates: { x: number; y: number; edge: number }[] = []

    for (let y = 2; y < ch - 2; y += step) {
      for (let x = 2; x < cw - 2; x += step) {
        const idx = (y * cw + x) * 4 + 3
        const alpha = img[idx]
        if (alpha > 110) {
          const up = img[((y - 2) * cw + x) * 4 + 3]
          const down = img[((y + 2) * cw + x) * 4 + 3]
          const left = img[(y * cw + (x - 2)) * 4 + 3]
          const right = img[(y * cw + (x + 2)) * 4 + 3]
          const isEdge = up < 90 || down < 90 || left < 90 || right < 90
          candidates.push({ x, y, edge: isEdge ? 0.92 : 0.25 })
        }
      }
    }

    const keepProb = Math.min(1, MAX_NAME_SAMPLES / Math.max(1, candidates.length))
    const sampled: { x: number; y: number; edge: number }[] = []
    for (let i = 0; i < candidates.length; i++) {
      if (rand() <= keepProb) {
        sampled.push(candidates[i])
      }
    }

    // Shuffle so setDrawRange(0, namePoints) reduces density uniformly
    for (let i = sampled.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1))
      const tmp = sampled[i]
      sampled[i] = sampled[j]
      sampled[j] = tmp
    }

    const count = sampled.length
    const positions = new Float32Array(count * 3)
    const normals = new Float32Array(count * 3)
    const randoms = new Float32Array(count * 3)
    const dispersionWeights = new Float32Array(count)
    const morphTargets = new Float32Array(count * 3)
    const particleIds = new Float32Array(count)

    const xOrigin = isMobile ? cw * 0.5 : 16
    const yCenter = ch * 0.5

    for (let i = 0; i < count; i++) {
      const p = sampled[i]
      const i3 = i * 3
      const jx = (rand() - 0.5) * step * 0.9
      const jy = (rand() - 0.5) * step * 0.9

      positions[i3] = (p.x + jx - xOrigin) * worldScale
      positions[i3 + 1] = -(p.y + jy - yCenter) * worldScale
      positions[i3 + 2] = (rand() - 0.5) * 0.025

      normals[i3] = (rand() - 0.5) * 0.22
      normals[i3 + 1] = (rand() - 0.5) * 0.22
      normals[i3 + 2] = 0.95

      randoms[i3] = rand()
      randoms[i3 + 1] = rand()
      randoms[i3 + 2] = rand()
      dispersionWeights[i] = Math.min(1, p.edge + rand() * 0.12)
      particleIds[i] = i / Math.max(1, count - 1)

      const [mx, my, mz] = computeStarfieldMorphTarget(rand)
      morphTargets[i3] = mx
      morphTargets[i3 + 1] = my
      morphTargets[i3 + 2] = mz
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aNormal', new THREE.BufferAttribute(normals, 3))
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3))
    geo.setAttribute('aDispersionWeight', new THREE.BufferAttribute(dispersionWeights, 1))
    geo.setAttribute('aMorphTarget', new THREE.BufferAttribute(morphTargets, 3))
    geo.setAttribute('aParticleId', new THREE.BufferAttribute(particleIds, 1))
    geo.computeBoundingSphere()

    return geo
  }, [isMobile, worldScale])

  useEffect(() => {
    const pos = geometry.getAttribute('position')
    if (pos) {
      geometry.setDrawRange(0, Math.min(namePoints, pos.count))
    }
  }, [geometry, namePoints])

  useEffect(() => {
    setNameReady(true)
    return () => {
      geometry.dispose()
    }
  }, [geometry, setNameReady])

  const shaderMaterial = useMemo(() => {
    const vertexShader = `${noiseGlsl}\n${humanVertGlsl}`
    const trail = Array.from({ length: 10 }, () => new THREE.Vector4(0, 0, -1, 0))

    return new THREE.ShaderMaterial({
      defines: { NAME_PARTICLES: 1 },
      vertexShader,
      fragmentShader: humanFragGlsl,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uRayOrigin: { value: new THREE.Vector3(0, 0, 3.65) },
        uRayDir: { value: new THREE.Vector3(0, 0, -1) },
        uInteractionStrength: { value: 0 },
        uDeconstructProgress: { value: 0 },
        uTransitionProgress: { value: 0 },
        uWarpSpeed: { value: 0 },
        uQuality: { value: qualityUniform },
        uPixelRatio: { value: Math.min(dpr, 1.5) },
        uReducedMotion: { value: reducedMotion ? 1 : 0 },
        uCosmicReveal: { value: 0 },
        uPointerTrail: { value: trail },
      },
    })
  }, [])

  useEffect(() => {
    shaderMaterial.uniforms.uQuality.value = qualityUniform
    shaderMaterial.uniforms.uReducedMotion.value = reducedMotion ? 1 : 0
    shaderMaterial.uniforms.uPixelRatio.value = Math.min(dpr, 1.5)
  }, [shaderMaterial, qualityUniform, reducedMotion, dpr])

  useEffect(() => {
    return () => {
      shaderMaterial.dispose()
    }
  }, [shaderMaterial])

  const warpOffsetRef = useRef(0)

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    warpOffsetRef.current += motionState.warpSpeed * dt

    const uniforms = shaderMaterial.uniforms
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uCosmicReveal.value = motionState.cosmicReveal
    uniforms.uDeconstructProgress.value = motionState.deconstructProgress
    uniforms.uTransitionProgress.value = motionState.morphProgress
    uniforms.uWarpSpeed.value = warpOffsetRef.current

    const pState = pointerStateRef.current
    ;(uniforms.uRayOrigin.value as THREE.Vector3).copy(pState.rayOrigin)
    ;(uniforms.uRayDir.value as THREE.Vector3).copy(pState.rayDir)
    uniforms.uInteractionStrength.value = pState.strength

    const trailUniform = uniforms.uPointerTrail.value as THREE.Vector4[]
    for (let i = 0; i < 10; i++) {
      trailUniform[i].copy(pState.trailRays[i])
    }
  })

  return (
    <points
      position={position}
      geometry={geometry}
      material={shaderMaterial}
      frustumCulled={false}
    />
  )
}
