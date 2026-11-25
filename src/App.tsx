import { useEffect } from 'react'
import { Experience } from './experience/Experience'
import { Portfolio } from './portfolio/Portfolio'
import { useExperienceStore } from './stores/experienceStore'

export function App() {
  const phase = useExperienceStore((s) => s.phase)
  const initExperience = useExperienceStore((s) => s.initExperience)
  const syncRouteFromLocation = useExperienceStore((s) => s.syncRouteFromLocation)
  const cleanup = useExperienceStore((s) => s.cleanup)

  useEffect(() => {
    initExperience()
    window.addEventListener('popstate', syncRouteFromLocation)
    return () => {
      window.removeEventListener('popstate', syncRouteFromLocation)
      cleanup()
    }
  }, [initExperience, syncRouteFromLocation, cleanup])

  // Lock page scroll only while intro overlay is active; restore immediately on reveal/arrival
  useEffect(() => {
    const locked = phase !== 'PORTFOLIO_ACTIVE' && phase !== 'PORTFOLIO_REVEAL'
    document.documentElement.style.overflow = locked ? 'hidden' : ''
    document.body.style.overflow = locked ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [phase])

  return (
    <>
      <Portfolio />
      <Experience />
    </>
  )
}

export default App
