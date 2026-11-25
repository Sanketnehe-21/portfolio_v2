export function CoreCraft() {
  return (
    <section id="craft" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t theme-border">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h3 className="text-3xl sm:text-5xl font-bold tracking-tight theme-text">
          Experience &amp; engineering craft
        </h3>
        <p className="mt-3 text-lg sm:text-xl theme-muted">
          Production Play Store delivery, cross-platform mobile architecture, and computer engineering foundations.
        </p>
        <a
          href="https://github.com/Sanketnehe-21"
          target="_blank"
          rel="noreferrer"
          className="theme-pill mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          github.com/Sanketnehe-21
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Current Role */}
        <div className="expo-card p-8 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-semibold mb-6">
              OCT 2025 – PRESENT
            </div>
            <h4 className="text-2xl font-bold theme-text mb-2">
              Binnys Management — React Native Developer
            </h4>
            <p className="text-sm theme-muted leading-relaxed">
              Contributed across 5 Play Store apps (<span className="theme-text font-medium">Create, Vision, Scan, MyBinnyst, Track</span>) — shipping end-to-end features, UI polish, rendering efficiency gains, and REST API integrations.
            </p>
          </div>
          <div className="mt-8 pt-4 border-t theme-border">
            <a
              href="#projects"
              className="text-sm font-medium text-blue-400 hover:text-blue-300 inline-flex items-center gap-1.5 transition-colors"
            >
              See shipped apps →
            </a>
          </div>
        </div>

        {/* Card 2: Mobile, Maps & APIs */}
        <div className="expo-card p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                Android &amp; iOS
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                Real-Time Sync
              </span>
            </div>
            <h4 className="text-2xl font-bold theme-text mb-2">
              Cross-platform mobile{' '}
              <span className="font-normal theme-muted">with</span>{' '}
              <span className="font-mono text-sm px-2 py-0.5 rounded border theme-border bg-[var(--expo-element)]">
                Expo &amp; Maps
              </span>
            </h4>
            <p className="text-sm theme-muted leading-relaxed">
              Native module integration, REST API design, Google Maps API tracking, Firebase Firestore real-time synchronization, and npm packages (<span className="font-mono">rn-whiteboard-kit</span>, <span className="font-mono">expo-location-keepalive</span>).
            </p>
          </div>
          <div className="mt-8 pt-4 border-t theme-border">
            <a
              href="#notes"
              className="text-sm font-medium text-blue-400 hover:text-blue-300 inline-flex items-center gap-1.5 transition-colors"
            >
              View technical skills →
            </a>
          </div>
        </div>

        {/* Card 3: Education & Recognition */}
        <div className="expo-card p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                CGPA 8.08 / 10
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                EXALT Winner
              </span>
            </div>
            <h4 className="text-2xl font-bold theme-text mb-2">
              B.E. Computer Engineering (University of Mumbai)
            </h4>
            <p className="text-sm theme-muted leading-relaxed">
              A. P. Shah Institute of Technology, Thane (2021 – 2025). Winner at EXALT 2023–24 (APSIT), hackathon participant, and open-source contributor with cloud &amp; DevOps credentials.
            </p>
          </div>
          <div className="mt-8 pt-4 border-t theme-border">
            <a
              href="#contact"
              className="text-sm font-medium text-blue-400 hover:text-blue-300 inline-flex items-center gap-1.5 transition-colors"
            >
              Get in touch →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
