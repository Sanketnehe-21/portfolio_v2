import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { motionState } from '../animation/deconstruction'
import { useExperienceStore } from '../stores/experienceStore'

export function CameraRig() {
  const { camera } = useThree()
  const reducedMotion = useExperienceStore((s) => s.reducedMotion)
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const persp = camera as THREE.PerspectiveCamera

    // Gentle parallax only when idle and reduced motion is off
    const idleMix = motionState.secondaryUiOpacity * (reducedMotion ? 0 : 1)
    const targetX = pointer.current.x * 0.09 * idleMix
    const targetY = 0.06 + pointer.current.y * 0.06 * idleMix

    // Subtle forward lunge + FOV expansion during interstellar warp
    const targetZ = 3.65 - motionState.warpSpeed * 0.55
    const targetFov = 42 + motionState.warpTrail * 12

    camera.position.x += (targetX - camera.position.x) * (1 - Math.exp(-dt * 3.5))
    camera.position.y += (targetY - camera.position.y) * (1 - Math.exp(-dt * 3.5))
    camera.position.z += (targetZ - camera.position.z) * (1 - Math.exp(-dt * 4.0))

    if (Math.abs(persp.fov - targetFov) > 0.02) {
      persp.fov += (targetFov - persp.fov) * (1 - Math.exp(-dt * 4.0))
      persp.updateProjectionMatrix()
    }

    camera.lookAt(0, 0.02, 0)
  })

  return null
}
