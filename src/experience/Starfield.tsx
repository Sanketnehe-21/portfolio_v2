import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import starfieldVertGlsl from '../shaders/starfield.vert.glsl?raw'
import starfieldFragGlsl from '../shaders/starfield.frag.glsl?raw'
import { motionState } from '../animation/deconstruction'
import { useExperienceStore } from '../stores/experienceStore'

interface StarfieldProps {
  qualityUniform: number
  count?: number
}

function seededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

export function Starfield({ qualityUniform, count = 1200 }: StarfieldProps) {
  const { gl } = useThree()
  const reducedMotion = useExperienceStore((s) => s.reducedMotion)

  const geometry = useMemo(() => {
    const rand = seededRandom(773194)
    const positions = new Float32Array(count * 3)
    const randoms = new Float32Array(count * 3)
    const layers = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Multiple depth layers around a wide cosmic corridor
      const theta = rand() * Math.PI * 2
      const r = 0.65 + Math.pow(rand(), 0.72) * 14.5
      positions[i3] = Math.cos(theta) * r
      positions[i3 + 1] = Math.sin(theta) * r * 0.68
      positions[i3 + 2] = -2.0 - rand() * 44.0

      randoms[i3] = rand()
      randoms[i3 + 1] = rand()
      randoms[i3 + 2] = rand()
      layers[i] = 0.25 + rand() * 0.75
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3))
    geo.setAttribute('aLayer', new THREE.BufferAttribute(layers, 1))
    geo.computeBoundingSphere()
    return geo
  }, [count])

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: starfieldVertGlsl,
      fragmentShader: starfieldFragGlsl,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uWarpSpeed: { value: 0 },
        uWarpTrail: { value: 0 },
        uCosmicReveal: { value: 0 },
        uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
        uQuality: { value: qualityUniform },
        uReducedMotion: { value: reducedMotion ? 1 : 0 },
      },
    })
  }, [gl])

  // Subtle occasional distant shooting star
  const shootingLineRef = useRef<THREE.Line>(null)
  const shootingGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3))
    return g
  }, [])
  const shootingMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: '#E4E6ED',
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    []
  )
  const shootingLineObj = useMemo(() => new THREE.Line(shootingGeo, shootingMat), [shootingGeo, shootingMat])

  useEffect(() => {
    material.uniforms.uQuality.value = qualityUniform
    material.uniforms.uReducedMotion.value = reducedMotion ? 1 : 0
    material.uniforms.uPixelRatio.value = Math.min(gl.getPixelRatio(), 2)
  }, [material, qualityUniform, reducedMotion, gl])

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
      shootingGeo.dispose()
      shootingMat.dispose()
    }
  }, [geometry, material, shootingGeo, shootingMat])

  const warpAccRef = useRef(0)

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    warpAccRef.current += motionState.warpSpeed * dt

    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uWarpSpeed.value = warpAccRef.current
    material.uniforms.uWarpTrail.value = motionState.warpTrail
    material.uniforms.uCosmicReveal.value = motionState.cosmicReveal

    // Occasional distant shooting star every ~8.5 seconds while idle
    if (!reducedMotion && motionState.secondaryUiOpacity > 0.25 && shootingLineRef.current) {
      const cycle = state.clock.elapsedTime % 8.5
      if (cycle > 2.0 && cycle < 3.1) {
        const p = (cycle - 2.0) / 1.1
        const sx = -4.2 + p * 3.4
        const sy = 2.6 - p * 1.4
        const len = 0.45 * Math.sin(p * Math.PI)
        const posArr = shootingGeo.getAttribute('position') as THREE.BufferAttribute
        posArr.setXYZ(0, sx, sy, -14)
        posArr.setXYZ(1, sx - len, sy + len * 0.41, -14)
        posArr.needsUpdate = true
        shootingMat.opacity = Math.sin(p * Math.PI) * 0.28 * motionState.cosmicReveal * motionState.secondaryUiOpacity
      } else {
        shootingMat.opacity = 0
      }
    } else {
      shootingMat.opacity = 0
    }
  })

  return (
    <>
      <points geometry={geometry} material={material} frustumCulled={false} />
      <primitive ref={shootingLineRef} object={shootingLineObj} />
    </>
  )
}
