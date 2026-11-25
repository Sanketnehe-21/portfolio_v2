import { type MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import noiseGlsl from '../shaders/noise.glsl?raw'
import humanVertGlsl from '../shaders/human.vert.glsl?raw'
import humanFragGlsl from '../shaders/human.frag.glsl?raw'
import type { PointerUniformState } from '../hooks/usePointerInteraction'
import { QUALITY_PROFILES, useExperienceStore } from '../stores/experienceStore'
import { motionState } from '../animation/deconstruction'
import { computeStarfieldMorphTarget } from '../animation/particleMorph'

interface HumanParticlesProps {
  modelUrl?: string
  particleCount: number
  qualityUniform: number
  dpr: number
  position: [number, number, number]
  scale?: number
  pointerStateRef: MutableRefObject<PointerUniformState>
  onMissingModel?: (message: string) => void
}

const MAX_HUMAN_SAMPLES = QUALITY_PROFILES.ultra.humanPoints
const sampledGeometryCache = new Map<string, Promise<THREE.BufferGeometry | null>>()

function seededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

function computeMeshSurfaceArea(geometry: THREE.BufferGeometry): number {
  const pos = geometry.getAttribute('position')
  if (!pos) return 0
  const index = geometry.getIndex()
  const tri = new THREE.Triangle()
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const c = new THREE.Vector3()
  let area = 0

  if (index) {
    for (let i = 0; i < index.count; i += 3) {
      a.fromBufferAttribute(pos, index.getX(i))
      b.fromBufferAttribute(pos, index.getX(i + 1))
      c.fromBufferAttribute(pos, index.getX(i + 2))
      tri.set(a, b, c)
      area += tri.getArea()
    }
  } else {
    for (let i = 0; i < pos.count; i += 3) {
      a.fromBufferAttribute(pos, i)
      b.fromBufferAttribute(pos, i + 1)
      c.fromBufferAttribute(pos, i + 2)
      tri.set(a, b, c)
      area += tri.getArea()
    }
  }
  return area
}

function bakeToStaticWorldMesh(source: THREE.Mesh): THREE.Mesh {
  const sourceGeo = source.geometry
  const posAttr = sourceGeo.getAttribute('position')
  const worldPositions = new Float32Array(posAttr.count * 3)
  const v = new THREE.Vector3()

  if (source instanceof THREE.SkinnedMesh && source.skeleton) {
    source.skeleton.update()
    for (let i = 0; i < posAttr.count; i++) {
      v.fromBufferAttribute(posAttr, i)
      source.applyBoneTransform(i, v)
      v.applyMatrix4(source.matrixWorld)
      worldPositions[i * 3] = v.x
      worldPositions[i * 3 + 1] = v.y
      worldPositions[i * 3 + 2] = v.z
    }
  } else {
    for (let i = 0; i < posAttr.count; i++) {
      v.fromBufferAttribute(posAttr, i).applyMatrix4(source.matrixWorld)
      worldPositions[i * 3] = v.x
      worldPositions[i * 3 + 1] = v.y
      worldPositions[i * 3 + 2] = v.z
    }
  }

  // Build an unquantized Float32 BufferGeometry so quantized GLB attributes (Int16/UInt16)
  // never truncate world-space floats when transforming or sampling triangles.
  const bakedGeo = new THREE.BufferGeometry()
  bakedGeo.setAttribute('position', new THREE.BufferAttribute(worldPositions, 3))
  const index = sourceGeo.getIndex()
  if (index) {
    bakedGeo.setIndex(index.clone())
  }
  bakedGeo.computeVertexNormals()
  bakedGeo.computeBoundingBox()

  return new THREE.Mesh(bakedGeo)
}

function loadAndSampleHumanOnce(modelUrl: string): Promise<THREE.BufferGeometry | null> {
  const cached = sampledGeometryCache.get(modelUrl)
  if (cached) return cached

  const promise = fetch(modelUrl)
    .then(async (res) => {
      const ct = res.headers.get('content-type') || ''
      if (!res.ok || ct.includes('text/html')) {
        return null
      }
      const buffer = await res.arrayBuffer()
      if ('ready' in MeshoptDecoder && MeshoptDecoder.ready) {
        await MeshoptDecoder.ready
      }
      const loader = new GLTFLoader()
      loader.setMeshoptDecoder(MeshoptDecoder)

      return await new Promise<THREE.BufferGeometry | null>((resolve, reject) => {
        loader.parse(
          buffer,
          '',
          (gltf: GLTF) => {
            const root = gltf.scene
            root.updateMatrixWorld(true)

            const bakedMeshes: { mesh: THREE.Mesh; area: number }[] = []
            let totalArea = 0

            root.traverse((obj) => {
              if (obj instanceof THREE.Mesh && obj.visible && obj.geometry) {
                obj.visible = false
                const baked = bakeToStaticWorldMesh(obj)
                const area = computeMeshSurfaceArea(baked.geometry)
                if (area > 1e-6) {
                  bakedMeshes.push({ mesh: baked, area })
                  totalArea += area
                } else {
                  baked.geometry.dispose()
                }
              }
            })

            if (bakedMeshes.length === 0 || totalArea <= 0) {
              resolve(null)
              return
            }

            const rand = seededRandom(20261125)
            const positions = new Float32Array(MAX_HUMAN_SAMPLES * 3)
            const normals = new Float32Array(MAX_HUMAN_SAMPLES * 3)
            const randoms = new Float32Array(MAX_HUMAN_SAMPLES * 3)
            const dispersionWeights = new Float32Array(MAX_HUMAN_SAMPLES)
            const morphTargets = new Float32Array(MAX_HUMAN_SAMPLES * 3)
            const particleIds = new Float32Array(MAX_HUMAN_SAMPLES)

            const samplePos = new THREE.Vector3()
            const sampleNrm = new THREE.Vector3()

            let cursorIdx = 0
            for (let m = 0; m < bakedMeshes.length; m++) {
              const { mesh, area } = bakedMeshes[m]
              const share =
                m === bakedMeshes.length - 1
                  ? MAX_HUMAN_SAMPLES - cursorIdx
                  : Math.round((area / totalArea) * MAX_HUMAN_SAMPLES)

              if (share <= 0) {
                mesh.geometry.dispose()
                continue
              }

              const sampler = new MeshSurfaceSampler(mesh).build()
              for (let i = 0; i < share && cursorIdx < MAX_HUMAN_SAMPLES; i++) {
                sampler.sample(samplePos, sampleNrm)
                const i3 = cursorIdx * 3
                positions[i3] = samplePos.x
                positions[i3 + 1] = samplePos.y
                positions[i3 + 2] = samplePos.z

                sampleNrm.normalize()
                normals[i3] = sampleNrm.x
                normals[i3 + 1] = sampleNrm.y
                normals[i3 + 2] = sampleNrm.z

                randoms[i3] = rand()
                randoms[i3 + 1] = rand()
                randoms[i3 + 2] = rand()
                particleIds[cursorIdx] = cursorIdx / Math.max(1, MAX_HUMAN_SAMPLES - 1)
                cursorIdx += 1
              }
              mesh.geometry.dispose()
            }

            let minX = Infinity, maxX = -Infinity
            let minY = Infinity, maxY = -Infinity
            let minZ = Infinity, maxZ = -Infinity

            for (let i = 0; i < cursorIdx; i++) {
              const i3 = i * 3
              const x = positions[i3]
              const y = positions[i3 + 1]
              const z = positions[i3 + 2]
              if (x < minX) minX = x
              if (x > maxX) maxX = x
              if (y < minY) minY = y
              if (y > maxY) maxY = y
              if (z < minZ) minZ = z
              if (z > maxZ) maxZ = z
            }

            const height = Math.max(1e-4, maxY - minY)
            const targetHeight = 1.95
            const normScale = targetHeight / height
            const cx = (minX + maxX) * 0.5
            const cy = (minY + maxY) * 0.5
            const cz = (minZ + maxZ) * 0.5

            const yaw = -0.31
            const cosY = Math.cos(yaw)
            const sinY = Math.sin(yaw)

            for (let i = 0; i < cursorIdx; i++) {
              const i3 = i * 3
              const nx = (positions[i3] - cx) * normScale
              const ny = (positions[i3 + 1] - cy) * normScale
              const nz = (positions[i3 + 2] - cz) * normScale

              const rx = nx * cosY + nz * sinY
              const rz = -nx * sinY + nz * cosY

              positions[i3] = rx
              positions[i3 + 1] = ny
              positions[i3 + 2] = rz

              const nrmX = normals[i3]
              const nrmZ = normals[i3 + 2]
              normals[i3] = nrmX * cosY + nrmZ * sinY
              normals[i3 + 2] = -nrmX * sinY + nrmZ * cosY

              const normH = (ny + targetHeight * 0.5) / targetHeight
              const headBoost = THREE.MathUtils.smoothstep(normH, 0.58, 0.96) * 0.55
              const shoulderBand = Math.exp(-Math.pow((normH - 0.35) / 0.16, 2)) * 0.35
              const radialEdge = THREE.MathUtils.clamp(Math.hypot(rx, rz) / 0.52, 0, 1) * 0.45
              dispersionWeights[i] = THREE.MathUtils.clamp(
                0.12 + headBoost + shoulderBand + radialEdge * 0.5,
                0.05,
                1.0
              )

              const [mx, my, mz] = computeStarfieldMorphTarget(rand)
              morphTargets[i3] = mx
              morphTargets[i3 + 1] = my
              morphTargets[i3 + 2] = mz
            }

            // Deterministic Fisher-Yates shuffle so setDrawRange(0, N) stays uniform across Low/Balanced/Ultra
            for (let i = cursorIdx - 1; i > 0; i--) {
              const j = Math.floor(rand() * (i + 1))
              if (i !== j) {
                const i3 = i * 3
                const j3 = j * 3
                for (let k = 0; k < 3; k++) {
                  const tp = positions[i3 + k]
                  positions[i3 + k] = positions[j3 + k]
                  positions[j3 + k] = tp

                  const tn = normals[i3 + k]
                  normals[i3 + k] = normals[j3 + k]
                  normals[j3 + k] = tn

                  const tr = randoms[i3 + k]
                  randoms[i3 + k] = randoms[j3 + k]
                  randoms[j3 + k] = tr

                  const tm = morphTargets[i3 + k]
                  morphTargets[i3 + k] = morphTargets[j3 + k]
                  morphTargets[j3 + k] = tm
                }
                const tw = dispersionWeights[i]
                dispersionWeights[i] = dispersionWeights[j]
                dispersionWeights[j] = tw

                const tid = particleIds[i]
                particleIds[i] = particleIds[j]
                particleIds[j] = tid
              }
            }

            const bufferGeo = new THREE.BufferGeometry()
            bufferGeo.setAttribute('position', new THREE.BufferAttribute(positions.subarray(0, cursorIdx * 3), 3))
            bufferGeo.setAttribute('aNormal', new THREE.BufferAttribute(normals.subarray(0, cursorIdx * 3), 3))
            bufferGeo.setAttribute('aRandom', new THREE.BufferAttribute(randoms.subarray(0, cursorIdx * 3), 3))
            bufferGeo.setAttribute(
              'aDispersionWeight',
              new THREE.BufferAttribute(dispersionWeights.subarray(0, cursorIdx), 1)
            )
            bufferGeo.setAttribute(
              'aMorphTarget',
              new THREE.BufferAttribute(morphTargets.subarray(0, cursorIdx * 3), 3)
            )
            bufferGeo.setAttribute(
              'aParticleId',
              new THREE.BufferAttribute(particleIds.subarray(0, cursorIdx), 1)
            )
            bufferGeo.computeBoundingSphere()
            resolve(bufferGeo)
          },
          (err) => reject(err)
        )
      })
    })
    .catch((err) => {
      console.error('[HumanParticles] GLB load/parse failed:', err)
      return null
    })

  sampledGeometryCache.set(modelUrl, promise)
  return promise
}

export function HumanParticles({
  modelUrl = '/models/human.glb',
  particleCount,
  qualityUniform,
  dpr,
  position,
  scale = 1,
  pointerStateRef,
  onMissingModel,
}: HumanParticlesProps) {
  const { gl } = useThree()
  const reducedMotion = useExperienceStore((s) => s.reducedMotion)
  const setHumanReady = useExperienceStore((s) => s.setHumanReady)

  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null)
  const pointsRef = useRef<THREE.Points>(null)

  const shaderMaterial = useMemo(() => {
    const vertexShader = `${noiseGlsl}\n${humanVertGlsl}`
    const trail = Array.from({ length: 10 }, () => new THREE.Vector4(0, 0, -1, 0))

    return new THREE.ShaderMaterial({
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
  }, [gl])

  useEffect(() => {
    shaderMaterial.uniforms.uQuality.value = qualityUniform
    shaderMaterial.uniforms.uReducedMotion.value = reducedMotion ? 1 : 0
    shaderMaterial.uniforms.uPixelRatio.value = Math.min(dpr, 1.5)
  }, [shaderMaterial, qualityUniform, reducedMotion, dpr])

  // Load & sample GLB strictly ONCE into cached BufferGeometry
  useEffect(() => {
    let cancelled = false

    loadAndSampleHumanOnce(modelUrl).then((geo) => {
      if (cancelled) return
      if (!geo) {
        onMissingModel?.(`Model not found at ${modelUrl}.`)
        return
      }
      setGeometry(geo)
      setHumanReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [modelUrl, setHumanReady, onMissingModel])

  // Instantaneous zero-allocation particle count adjustment via setDrawRange
  useEffect(() => {
    if (!geometry) return
    const pos = geometry.getAttribute('position')
    if (pos) {
      geometry.setDrawRange(0, Math.min(particleCount, pos.count))
    }
  }, [geometry, particleCount])

  useEffect(() => {
    return () => {
      // Cached geometry lives in sampledGeometryCache for zero-cost replay; dispose only material on unmount
      shaderMaterial.dispose()
    }
  }, [shaderMaterial])

  const warpOffsetRef = useRef(0)

  useFrame((state, delta) => {
    if (!geometry) return
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

  if (!geometry) return null

  return (
    <points
      ref={pointsRef}
      position={position}
      scale={scale}
      geometry={geometry}
      material={shaderMaterial}
      frustumCulled={false}
    />
  )
}
