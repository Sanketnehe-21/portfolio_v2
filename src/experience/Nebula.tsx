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
  vec2 centered = vUv - vec2(0.5);
  float radial = 1.0 - smoothstep(0.05, 0.68, length(centered * vec2(1.0, 1.25)));
  if (radial <= 0.005) discard;

  float n1 = snoise(vec3(vUv * 2.4, uTime * 0.018));
  float n2 = 0.5 * sin(vUv.x * 11.0 + n1 * 2.5 - uTime * 0.02) * cos(vUv.y * 9.0 - n1 * 2.0);
  float mist = smoothstep(-0.35, 0.75, n1 * 0.72 + n2 * 0.28) * radial;

  vec3 charcoal = vec3(0.063, 0.075, 0.125); // #101320
  vec3 faintViolet = vec3(0.157, 0.145, 0.235); // #28253C

  vec3 col = mix(charcoal, faintViolet, smoothstep(0.15, 0.85, n1 * 0.5 + 0.5));
  float alpha = mist * 0.38 * uReveal * uOpacity;
  if (alpha < 0.004) discard;

  gl_FragColor = vec4(col, alpha);
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
        uReveal: { value: 0 },
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
    material.uniforms.uReveal.value = motionState.cosmicReveal
    material.uniforms.uOpacity.value = 1 - motionState.warpSpeed * 0.45
  })

  return (
    <mesh position={[0.4, 0.15, -14]} scale={[22, 14, 1]} material={material}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  )
}
