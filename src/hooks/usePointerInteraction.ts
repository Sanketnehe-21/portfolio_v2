import { useCallback, useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const TRAIL_LEN = 10
const DECAY_TAU_SECONDS = 1.05 // ~95% return in ~3.0 seconds

export interface PointerUniformState {
  rayOrigin: THREE.Vector3
  rayDir: THREE.Vector3
  strength: number
  trailRays: THREE.Vector4[] // xyz = ray direction, w = decaying strength
}

/**
 * Single shared pointer/touch ray tracker per Canvas.
 * Attached once at SceneContent level and passed via ref to particle components.
 */
export function usePointerInteraction(active = true) {
  const { camera, gl } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const ndc = useRef(new THREE.Vector2(99, 99))
  const pointerActiveRef = useRef(false)
  const lastEmitTime = useRef(0)
  const trailHead = useRef(0)

  const stateRef = useRef<PointerUniformState>({
    rayOrigin: new THREE.Vector3(0, 0, 3.65),
    rayDir: new THREE.Vector3(0, 0, -1),
    strength: 0,
    trailRays: Array.from({ length: TRAIL_LEN }, () => new THREE.Vector4(0, 0, -1, 0)),
  })

  const updatePointer = useCallback(
    (clientX: number, clientY: number) => {
      const rect = gl.domElement.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return
      ndc.current.x = ((clientX - rect.left) / rect.width) * 2 - 1
      ndc.current.y = -((clientY - rect.top) / rect.height) * 2 + 1
      pointerActiveRef.current = true
    },
    [gl.domElement]
  )

  useEffect(() => {
    const dom = gl.domElement

    const onPointerMove = (e: PointerEvent) => {
      updatePointer(e.clientX, e.clientY)
    }
    const onPointerDown = (e: PointerEvent) => {
      updatePointer(e.clientX, e.clientY)
    }
    const onPointerLeave = () => {
      pointerActiveRef.current = false
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY)
      }
    }
    const onTouchEnd = () => {
      pointerActiveRef.current = false
    }

    dom.addEventListener('pointermove', onPointerMove, { passive: true })
    dom.addEventListener('pointerdown', onPointerDown, { passive: true })
    dom.addEventListener('pointerleave', onPointerLeave, { passive: true })
    dom.addEventListener('touchmove', onTouchMove, { passive: true })
    dom.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      dom.removeEventListener('pointermove', onPointerMove)
      dom.removeEventListener('pointerdown', onPointerDown)
      dom.removeEventListener('pointerleave', onPointerLeave)
      dom.removeEventListener('touchmove', onTouchMove)
      dom.removeEventListener('touchend', onTouchEnd)
    }
  }, [gl.domElement, updatePointer])

  useFrame((state, delta) => {
    if (!active) return
    const dt = Math.min(delta, 0.05)
    const st = stateRef.current

    const decay = Math.exp(-dt / DECAY_TAU_SECONDS)
    for (let i = 0; i < TRAIL_LEN; i++) {
      st.trailRays[i].w *= decay
      if (st.trailRays[i].w < 0.002) st.trailRays[i].w = 0
    }

    if (pointerActiveRef.current) {
      raycaster.current.setFromCamera(ndc.current, camera)
      st.rayOrigin.copy(raycaster.current.ray.origin)
      st.rayDir.lerp(raycaster.current.ray.direction, 1 - Math.exp(-dt * 22)).normalize()
      st.strength += (1 - st.strength) * (1 - Math.exp(-dt * 14))

      if (state.clock.elapsedTime - lastEmitTime.current > 0.055) {
        lastEmitTime.current = state.clock.elapsedTime
        const idx = trailHead.current % TRAIL_LEN
        st.trailRays[idx].set(st.rayDir.x, st.rayDir.y, st.rayDir.z, 0.85)
        trailHead.current += 1
      }
    } else {
      st.strength *= Math.exp(-dt / 0.65)
      if (st.strength < 0.002) st.strength = 0
    }
  })

  return stateRef
}
