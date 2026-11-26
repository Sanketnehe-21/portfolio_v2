import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import noiseGlsl from '../shaders/noise.glsl?raw'
import { motionState } from '../animation/deconstruction'

const NEBULA_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const NEBULA_FRAG = `
varying vec2 vUv;
uniform float uTime;
uniform float uReveal;
uniform float uOpacity;

void main() {
  vec2 sky = vUv * vec2(3.0, 2.0);
  float cloud = snoise(vec3(sky * 2.0, 0.3));
  cloud += 0.5 * snoise(vec3(sky * 4.5, 1.7));
  cloud += 0.22 * sin(sky.x * 16.0 + cloud * 2.4) * cos(sky.y * 14.0 - cloud * 1.9);
  float dust = smoothstep(-0.75, 1.05, cloud);
  float grain = fract(sin(dot(vUv * 1700.0, vec2(12.9898, 78.233))) * 43758.5453);
  float speck = pow(grain, 85.0) * 0.12;
  vec3 col = mix(vec3(0.015, 0.025, 0.028), vec3(0.10, 0.16, 0.17), dust);
  col += (grain - 0.5) * 0.025 + speck;
  gl_FragColor = vec4(col * 0.12, uReveal * uOpacity * 0.9);
}
`

export function Nebula() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: NEBULA_VERT,
      fragmentShader: `${noiseGlsl}\n${NEBULA_FRAG}`,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uReveal: { value: 0.65 },
        uOpacity: { value: 1 },
      },
    })
  }, [])

  useEffect(() => {
    return () => {
      material.dispose()
    }
  }, [material])

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uReveal.value = Math.min(1, 0.55 + motionState.cosmicReveal * 1.1)
    material.uniforms.uOpacity.value = 1 - motionState.warpSpeed * 0.45
  })

  return (
    <mesh position={[0, 0, -30]} scale={[100, 70, 1]} material={material}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  )
}
