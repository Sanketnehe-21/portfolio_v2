import { useState } from 'react'

const SERVICES = ['Cleaning', 'Plumbing', 'Electrical'] as const

export function ProjectSpotlight() {
  const [service, setService] = useState<string>('Cleaning')
  const [screen, setScreen] = useState<'discover' | 'details' | 'request'>('discover')

  return (
    <section id="urban-hive-demo" className="spotlight expo-card overflow-hidden mb-12">
      <div className="spotlight-story">
        <p className="text-xs font-mono uppercase tracking-widest theme-muted">Inside a project</p>
        <h3 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight theme-text">Urban Hive</h3>
        <p className="mt-4 text-lg theme-muted leading-relaxed max-w-lg">From finding local help to managing a service request, in one mobile experience.</p>
        <div className="flex flex-wrap gap-2 mt-6" aria-label="Project technologies">
          {['React Native', 'Expo', 'Firestore', 'Google Maps'].map((tech) => (
            <span key={tech} className="theme-pill rounded-full px-3 py-1 text-xs">{tech}</span>
          ))}
        </div>
        <div className="spotlight-facts">
          <div><h4>The problem</h4><p>Bring service provider discovery, request management, and payments into a connected mobile flow.</p></div>
          <div><h4>My contribution</h4><p>Developed and deployed the React Native app with Expo, Firebase Firestore sync, Google Maps API, and secure payments.</p></div>
          <div><h4>How it connects</h4><p>Google Maps supports provider discovery. Firestore keeps application data in sync as users manage their requests.</p></div>
        </div>
        <details className="spotlight-details">
          <summary>Explore the project flow <span aria-hidden="true">↗</span></summary>
          <div className="pt-4 text-sm theme-muted leading-relaxed">
            <p>Discovery is the starting point. Users find service providers, create requests, and manage the service through the app.</p>
            <p className="mt-3">The mobile interface connects those steps with real-time data and payment capabilities. Try the concept preview to explore the discovery and request journey.</p>
            <a href="https://github.com/Sanketnehe-21" target="_blank" rel="noreferrer" className="inline-block mt-4 text-blue-400">Explore my GitHub repositories →</a>
          </div>
        </details>
      </div>

      <div className="spotlight-demo">
        <div className="demo-phone" aria-label="Urban Hive interactive concept demo">
          <div className="demo-phone-top" aria-hidden="true"><span>9:41</span><span className="demo-camera" /><span>•••</span></div>
          <div className="demo-app">
            <div className="demo-brand"><span className="demo-brand-mark" aria-hidden="true">u.</span>urban hive<span className="demo-preview">Preview</span></div>
            {screen === 'discover' && (
              <>
                <p className="demo-eyebrow">Your neighbourhood, connected</p>
                <h4>A little help.<br />A better day.</h4>
                <p className="demo-copy">Find the right people for your home.</p>
                <div className="demo-categories" aria-label="Service category">
                  {SERVICES.map((item) => <button key={item} type="button" aria-pressed={service === item} onClick={() => setService(item)}>{item}</button>)}
                </div>
                <div className="demo-provider">
                  <div className="demo-provider-icon" aria-hidden="true">{service === 'Cleaning' ? '✧' : service === 'Plumbing' ? '≈' : 'ϟ'}</div>
                  <p className="demo-eyebrow">Sample provider</p>
                  <h5>Neighbourhood {service.toLowerCase()}</h5>
                  <p className="demo-copy">Home services · Mumbai</p>
                  <button type="button" className="demo-primary" onClick={() => setScreen('details')}>View service <span aria-hidden="true">↗</span></button>
                </div>
              </>
            )}
            {screen === 'details' && (
              <>
                <button type="button" className="demo-back" onClick={() => setScreen('discover')}>← All services</button>
                <p className="demo-eyebrow">Service details</p>
                <h4>{service} for<br />your home.</h4>
                <p className="demo-copy">A sample service to explore the request experience.</p>
                <div className="demo-service-info"><p>Service <strong>{service}</strong></p><p>Location <strong>Mumbai</strong></p><p>Provider <strong>Sample provider</strong></p></div>
                <p className="demo-copy">Create a demo request to see the next step.</p>
                <button type="button" className="demo-primary" onClick={() => setScreen('request')}>Try a service request →</button>
              </>
            )}
            {screen === 'request' && (
              <div className="demo-confirmation" role="status">
                <div className="demo-check" aria-hidden="true">✓</div>
                <p className="demo-eyebrow">Preview complete</p>
                <h4>One step closer<br />to sorted.</h4>
                <p className="demo-copy">You explored a {service.toLowerCase()} request. This demonstration uses sample data and sends no booking.</p>
                <button type="button" className="demo-primary" onClick={() => setScreen('discover')}>Explore another service ↗</button>
              </div>
            )}
          </div>
          <div className="demo-home-bar" aria-hidden="true" />
        </div>
        <p className="mt-5 text-xs theme-muted text-center max-w-xs">Interactive concept · Sample data<br />Select a service and follow the request flow.</p>
      </div>
    </section>
  )
}
