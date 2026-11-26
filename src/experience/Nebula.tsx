import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { motionState } from '../animation/deconstruction'

let cachedNebulaTexture: THREE.DataTexture | null = null

function hash2D(ix: number, iy: number): number {
  const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453123
  return n - Math.floor(n)
}

function valueNoise2D(x: number, y: number): number {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)

  const a = hash2D(ix, iy)
  const b = hash2D(ix + 1, iy)
  const c = hash2D(ix, iy + 1)
  const d = hash2D(ix + 1, iy + 1)

  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy
}

function getNebulaTexture(): THREE.DataTexture {
  if (cachedNebulaTexture) return cachedNebulaTexture

  const width = 256
  const height = 192
  const data = new Uint8Array(width * height * 4)

  for (let py = 0; py < height; py++) {
    const v = py / height
    for (let px = 0; px < width; px++) {
      const u = px / width
      const sx = u * 3.0
      const sy = v * 2.0

      // Multi-octave organic cosmic dust baked once at startup (zero per-frame noise shader stall)
      let cloud = valueNoise2D(sx * 2.1 + 1.3, sy * 2.1 + 0.7) * 2.0 - 1.0
      cloud += 0.5 * (valueNoise2D(sx * 4.3 + 5.2, sy * 4.3 + 2.9) * 2.0 - 1.0)
      cloud += 0.25 * (valueNoise2D(sx * 8.7 + 11.4, sy * 8.7 + 6.1) * 2.0 - 1.0)
      cloud += 0.125 * (valueNoise2D(sx * 16.5 + 19.8, sy * 16.5 + 13.7) * 2.0 - 1.0)

      const t = Math.max(0, Math.min(1, (cloud + 0.85) / 1.9))
      const dust = t * t * (3 - 2 * t)
      const grain = (hash2D(px * 1.7 + 3, py * 1.9 + 7) - 0.5) * 3.5

      // Atmospheric dark slate/teal gradient visible immediately across Low, Balanced & Ultra tiers
      const r = Math.max(4, Math.min(48, Math.round(6 + dust * 22 + grain)))
      const g = Math.max(6, Math.min(58, Math.round(10 + dust * 30 + grain)))
      const b = Math.max(8, Math.min(62, Math.round(12 + dust * 32 + grain)))

      const idx = (py * width + px) * 4
      data[idx] = r
      data[idx + 1] = g
      data[idx + 2] = b
      data[idx + 3] = 255
    }
  }

  const tex = new THREE.DataTexture(data, width, height, THREE.RGBAFormat)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.needsUpdate = true

  cachedNebulaTexture = tex
  return tex
}

export function Nebula() {
  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: getNebulaTexture(),
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    })
  }, [])

  useEffect(() => {
    return () => {
      material.dispose()
    }
  }, [material])

  useFrame(() => {
    // Keep nebula immediately present on landing; only fade cleanly during interstellar warp
    material.opacity = 0.9 * (1 - motionState.warpSpeed * 0.55)
  })

  return (
    <mesh position={[0, 0, -30]} scale={[100, 70, 1]} material={material}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  )
}
