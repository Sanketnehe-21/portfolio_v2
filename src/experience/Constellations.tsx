import { type MutableRefObject, useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { motionState } from '../animation/deconstruction'

interface ConstellationNode {
  x: number
  y: number
  z: number
}

export interface VirgoStarInfo {
  id: string
  name: string
  bayer: string
  mag: string
  /** Normalized Virgo coordinates around center before scene placement */
  nx: number
  ny: number
  sizeScale: number
}

/**
 * Classic IAU Virgo asterism (Spica, Porrima, Vindemiatrix, Auva, Heze, Zaniah, Zavijava, Syrma...)
 * positioned right behind the 3D human bust and starfield sky.
 */
const VIRGO_STARS: VirgoStarInfo[] = [
  { id: 'vindemiatrix', name: 'Vindemiatrix', bayer: 'ε Virginis', mag: '+2.85', nx: -0.36, ny: 0.96, sizeScale: 1.15 },
  { id: 'auva', name: 'Auva', bayer: 'δ Virginis', mag: '+3.38', nx: -0.20, ny: 0.36, sizeScale: 1.0 },
  { id: 'zavijava', name: 'Zavijava', bayer: 'β Virginis', mag: '+3.61', nx: 0.72, ny: 0.50, sizeScale: 1.0 },
  { id: 'zaniah', name: 'Zaniah', bayer: 'η Virginis', mag: '+3.89', nx: 0.30, ny: 0.20, sizeScale: 0.92 },
  { id: 'porrima', name: 'Porrima', bayer: 'γ Virginis', mag: '+2.74', nx: 0.00, ny: -0.02, sizeScale: 1.2 },
  { id: 'heze', name: 'Heze', bayer: 'ζ Virginis', mag: '+3.37', nx: -0.58, ny: 0.16, sizeScale: 1.02 },
  { id: 'spica', name: 'Spica', bayer: 'α Virginis · Primary Star', mag: '+0.97', nx: -0.26, ny: -0.64, sizeScale: 1.65 },
  { id: 'syrma', name: 'Syrma', bayer: 'ι Virginis', mag: '+4.07', nx: 0.24, ny: -0.56, sizeScale: 0.92 },
  { id: 'rijl', name: 'Rijl al Awwa', bayer: 'μ Virginis', mag: '+3.88', nx: 0.54, ny: -0.84, sizeScale: 0.95 },
  { id: 'tau', name: 'Tau Virginis', bayer: 'τ Virginis', mag: '+4.23', nx: -0.80, ny: 0.48, sizeScale: 0.88 },
  { id: '109vir', name: '109 Virginis', bayer: '109 Virginis', mag: '+3.72', nx: -0.96, ny: -0.06, sizeScale: 0.95 },
]

const VIRGO_EDGES: [number, number][] = [
  [0, 1], // Vindemiatrix -> Auva
  [1, 4], // Auva -> Porrima
  [4, 6], // Porrima -> Spica
  [6, 5], // Spica -> Heze
  [5, 1], // Heze -> Auva
  [4, 3], // Porrima -> Zaniah
  [3, 2], // Zaniah -> Zavijava
  [4, 7], // Porrima -> Syrma
  [7, 8], // Syrma -> Rijl al Awwa
  [5, 9], // Heze -> Tau Vir
  [5, 10], // Heze -> 109 Vir
]

const AMBIENT_CONSTELLATION_SETS: ConstellationNode[][] = []

export interface VirgoHoverDomState {
  active: boolean
  screenX: number
  screenY: number
  star: VirgoStarInfo
}

interface ConstellationsProps {
  isMobile: boolean
  onVirgoHoverChange: (state: VirgoHoverDomState) => void
  forceHighlightRef: MutableRefObject<boolean>
}

export function Constellations({
  isMobile,
  onVirgoHoverChange,
  forceHighlightRef,
}: ConstellationsProps) {
  const { size, camera } = useThree()

  const pointerNdcRef = useRef({ x: 99, y: 99, active: false })
  const lastHoverKeyRef = useRef('')
  const hoverBlendRef = useRef(0)

  // Track pointer in NDC for zero-React-overhead constellation hover detection
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerNdcRef.current.x = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1
      pointerNdcRef.current.y = -((e.clientY / Math.max(1, window.innerHeight)) * 2 - 1)
      pointerNdcRef.current.active = true
    }
    const onLeave = () => {
      pointerNdcRef.current.active = false
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  // Compact, delicate Virgo constellation framed in the focal celestial region
  const virgoWorldStars = useMemo(() => {
    const scaleX = isMobile ? 0.86 : 1.26
    const scaleY = isMobile ? 0.84 : 1.04
    const offsetX = isMobile ? 0.12 : 1.55
    const offsetY = isMobile ? 0.02 : 0.04
    const zDepth = -5.4

    return VIRGO_STARS.map((star) => ({
      ...star,
      worldPos: new THREE.Vector3(
        offsetX + star.nx * scaleX,
        offsetY + star.ny * scaleY,
        zDepth
      ),
    }))
  }, [isMobile])

  const {
    ambientLineObj,
    ambientPointGeo,
    ambientLineMat,
    ambientPointMat,
    virgoLineObj,
    virgoPointGeo,
    spicaHaloGeo,
    virgoLineMat,
    virgoPointMat,
    spicaHaloMat,
    reticleObj,
    reticleMat,
  } = useMemo(() => {
    // 1. Subtle peripheral stars & lines
    const ambSeg: number[] = []
    const ambPts: number[] = []
    for (const set of AMBIENT_CONSTELLATION_SETS) {
      for (let i = 0; i < set.length; i++) {
        const cur = set[i]
        ambPts.push(cur.x, cur.y, cur.z)
        if (i < set.length - 1) {
          const next = set[i + 1]
          ambSeg.push(cur.x, cur.y, cur.z, next.x, next.y, next.z)
        }
      }
    }
    const aLGeo = new THREE.BufferGeometry()
    aLGeo.setAttribute('position', new THREE.Float32BufferAttribute(ambSeg, 3))
    const aPGeo = new THREE.BufferGeometry()
    aPGeo.setAttribute('position', new THREE.Float32BufferAttribute(ambPts, 3))

    const aLMat = new THREE.LineBasicMaterial({
      color: '#9296A6',
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
    const aPMat = new THREE.PointsMaterial({
      color: '#E4E6ED',
      size: 0.032,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      sizeAttenuation: true,
    })

    // 2. Hero Virgo Constellation behind silhouette
    const vSeg: number[] = []
    for (const [aIdx, bIdx] of VIRGO_EDGES) {
      const a = virgoWorldStars[aIdx].worldPos
      const b = virgoWorldStars[bIdx].worldPos
      vSeg.push(a.x, a.y, a.z, b.x, b.y, b.z)
    }

    const vPts = new Float32Array(virgoWorldStars.length * 3)
    const vColors = new Float32Array(virgoWorldStars.length * 3)
    const brightColor = new THREE.Color('#DCE7FF')
    const baseStarColor = new THREE.Color('#B8C2DC')

    virgoWorldStars.forEach((s, idx) => {
      vPts[idx * 3] = s.worldPos.x
      vPts[idx * 3 + 1] = s.worldPos.y
      vPts[idx * 3 + 2] = s.worldPos.z
      const c = s.id === 'spica' ? brightColor : baseStarColor
      vColors[idx * 3] = c.r
      vColors[idx * 3 + 1] = c.g
      vColors[idx * 3 + 2] = c.b
    })

    const vLGeo = new THREE.BufferGeometry()
    vLGeo.setAttribute('position', new THREE.Float32BufferAttribute(vSeg, 3))
    const vPGeo = new THREE.BufferGeometry()
    vPGeo.setAttribute('position', new THREE.BufferAttribute(vPts, 3))
    vPGeo.setAttribute('color', new THREE.BufferAttribute(vColors, 3))

    const spica = virgoWorldStars.find((s) => s.id === 'spica')!
    const sHaloGeo = new THREE.RingGeometry(0.062, 0.078, 32)
    sHaloGeo.translate(spica.worldPos.x, spica.worldPos.y, spica.worldPos.z)

    const vLMat = new THREE.LineBasicMaterial({
      color: '#8DA2CE',
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
    const vPMat = new THREE.PointsMaterial({
      size: 0.058,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      sizeAttenuation: true,
    })
    const sHaloMat = new THREE.MeshBasicMaterial({
      color: '#B8CEFF',
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    })

    // 3. Hover reticle ring around active Virgo star
    const retGeo = new THREE.RingGeometry(0.088, 0.105, 36)
    const retMat = new THREE.MeshBasicMaterial({
      color: '#E4ECFF',
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    const retMesh = new THREE.Mesh(retGeo, retMat)
    retMesh.visible = false

    return {
      ambientLineObj: new THREE.LineSegments(aLGeo, aLMat),
      ambientPointGeo: aPGeo,
      ambientLineMat: aLMat,
      ambientPointMat: aPMat,
      virgoLineObj: new THREE.LineSegments(vLGeo, vLMat),
      virgoPointGeo: vPGeo,
      spicaHaloGeo: sHaloGeo,
      virgoLineMat: vLMat,
      virgoPointMat: vPMat,
      spicaHaloMat: sHaloMat,
      reticleObj: retMesh,
      reticleMat: retMat,
    }
  }, [virgoWorldStars])

  useEffect(() => {
    return () => {
      ambientLineObj.geometry.dispose()
      ambientPointGeo.dispose()
      ambientLineMat.dispose()
      ambientPointMat.dispose()
      virgoLineObj.geometry.dispose()
      virgoPointGeo.dispose()
      spicaHaloGeo.dispose()
      virgoLineMat.dispose()
      virgoPointMat.dispose()
      spicaHaloMat.dispose()
      reticleObj.geometry.dispose()
      reticleMat.dispose()
    }
  }, [
    ambientLineObj,
    ambientPointGeo,
    ambientLineMat,
    ambientPointMat,
    virgoLineObj,
    virgoPointGeo,
    spicaHaloGeo,
    virgoLineMat,
    virgoPointMat,
    spicaHaloMat,
    reticleObj,
    reticleMat,
  ])

  const tmpProjRef = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const form = THREE.MathUtils.smoothstep(state.clock.elapsedTime, 0.35, 2.2)
    const visibility = form * motionState.cosmicReveal * motionState.secondaryUiOpacity

    // Subtle peripheral constellations
    ambientLineMat.opacity = 0.14 * visibility
    ambientPointMat.opacity = 0.45 * visibility

    // Detect pointer hover anywhere across the whole Virgo constellation (stars, edges, or bounding region)
    let hoveredStar: (typeof virgoWorldStars)[number] | null = null
    let hoverPx = 0
    let hoverPy = 0

    const canHover = visibility > 0.35 && pointerNdcRef.current.active
    if (canHover) {
      const mx = (pointerNdcRef.current.x * 0.5 + 0.5) * size.width
      const my = (-pointerNdcRef.current.y * 0.5 + 0.5) * size.height

      let minX = Infinity
      let maxX = -Infinity
      let minY = Infinity
      let maxY = -Infinity
      let nearestStar = virgoWorldStars[6]
      let nearestStarDist = Infinity

      for (const star of virgoWorldStars) {
        const p = tmpProjRef.current.copy(star.worldPos).project(camera)
        const sx = (p.x * 0.5 + 0.5) * size.width
        const sy = (-p.y * 0.5 + 0.5) * size.height
        if (sx < minX) minX = sx
        if (sx > maxX) maxX = sx
        if (sy < minY) minY = sy
        if (sy > maxY) maxY = sy

        const d = Math.hypot(mx - sx, my - sy)
        if (d < nearestStarDist) {
          nearestStarDist = d
          nearestStar = star
        }
      }

      const regionPad = isMobile ? 28 : 34
      const insideWholeSign =
        mx >= minX - regionPad &&
        mx <= maxX + regionPad &&
        my >= minY - regionPad &&
        my <= maxY + regionPad

      if (insideWholeSign) {
        hoveredStar = nearestStar
        hoverPx = mx
        hoverPy = my
      }
    }

    const isHighlighted = Boolean(hoveredStar) || forceHighlightRef.current
    const targetBlend = isHighlighted ? 1 : 0
    hoverBlendRef.current += (targetBlend - hoverBlendRef.current) * (1 - Math.exp(-dt * 8))

    // Virgo constellation luminosity boosts smoothly on hover across the whole sign
    virgoLineMat.opacity = (0.28 + hoverBlendRef.current * 0.48) * visibility
    virgoPointMat.opacity = (0.76 + hoverBlendRef.current * 0.24) * visibility
    virgoPointMat.size = 0.058 + hoverBlendRef.current * 0.020

    const pulse = 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 2.2)
    spicaHaloMat.opacity = (0.24 + pulse * 0.18 + hoverBlendRef.current * 0.35) * visibility

    const focusStar = hoveredStar ?? (forceHighlightRef.current ? virgoWorldStars[6] : null)
    if (focusStar && visibility > 0.2) {
      reticleObj.visible = true
      reticleObj.position.copy(focusStar.worldPos)
      const s = 1 + pulse * 0.14
      reticleObj.scale.set(s, s, 1)
      reticleMat.opacity = (0.55 + pulse * 0.25) * visibility
    } else {
      reticleObj.visible = false
    }

    // Notify DOM ref only when hover state or nearest star actually changes
    const nextKey = hoveredStar ? `${hoveredStar.id}:${Math.round(hoverPx / 6)}:${Math.round(hoverPy / 6)}` : 'none'
    if (nextKey !== lastHoverKeyRef.current) {
      lastHoverKeyRef.current = nextKey
      onVirgoHoverChange({
        active: Boolean(hoveredStar) && visibility > 0.35,
        screenX: hoverPx,
        screenY: hoverPy,
        star: hoveredStar ?? VIRGO_STARS[6],
      })
    }
  })

  return (
    <group>
      <primitive object={ambientLineObj} />
      <points geometry={ambientPointGeo} material={ambientPointMat} />

      <primitive object={virgoLineObj} />
      <points geometry={virgoPointGeo} material={virgoPointMat} />
      <mesh geometry={spicaHaloGeo} material={spicaHaloMat} />
      <primitive object={reticleObj} />
    </group>
  )
}
