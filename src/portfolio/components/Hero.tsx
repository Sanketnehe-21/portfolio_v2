const STACK_ITEMS = [
  { label: 'React Native', short: 'RN', color: 'text-cyan-400' },
  { label: 'Expo', short: 'Expo', color: 'theme-text' },
  { label: 'TypeScript', short: 'TS', color: 'text-blue-400' },
  { label: 'JavaScript', short: 'JS', color: 'text-amber-400' },
  { label: 'React', short: 'React', color: 'text-sky-400' },
  { label: 'Firebase Firestore', short: 'Fire', color: 'text-orange-400' },
  { label: 'Google Maps API', short: 'Maps', color: 'text-emerald-400' },
  { label: 'MongoDB', short: 'Mongo', color: 'text-emerald-400' },
  { label: 'MySQL', short: 'MySQL', color: 'text-blue-400' },
  { label: 'Python', short: 'Py', color: 'text-yellow-400' },
  { label: 'Java', short: 'Java', color: 'text-rose-400' },
  { label: 'PHP', short: 'PHP', color: 'text-indigo-400' },
  { label: 'AWS', short: 'AWS', color: 'text-amber-400' },
  { label: 'Google Cloud Platform', short: 'GCP', color: 'text-blue-400' },
  { label: 'Three.js & GLSL', short: '3D', color: 'text-violet-400' },
  { label: 'Figma & Git', short: 'Git', color: 'text-rose-400' },
]

export function Hero() {
  return (
    <>
      {/* Hero Section */}
      <section id="top" className="relative pt-24 pb-16 text-center max-w-5xl mx-auto px-4 sm:px-6 z-10">
        <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight theme-text leading-[1.08]">
          Software engineer &amp; independent builder
        </h1>

        <p className="mt-6 text-lg sm:text-xl theme-muted max-w-2xl mx-auto font-normal leading-relaxed">
          Hi, I&apos;m Sanket Nehe from Mumbai — a React Native &amp; Full-Stack Developer shipping Play Store apps at Binnys Management, open-source npm tooling, and interactive 3D web experiences.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#projects"
            className="theme-btn-primary w-full sm:w-auto px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-lg"
          >
            Explore work
          </a>
          <a
            href="#contact"
            className="theme-pill w-full sm:w-auto px-6 py-3 rounded-full font-medium text-sm transition-all"
          >
            Get in touch
          </a>
        </div>

        {/* Status Pill */}
        <a
          href="#craft"
          className="theme-pill mt-8 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs transition-colors"
        >
          <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-semibold">
            Current
          </span>
          <span>React Native Developer @ Binnys Management · Oct 2025 – Present</span>
          <svg className="w-3 h-3 theme-subtle-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </section>

      {/* Sliding Tech Stack Marquee */}
      <section className="py-12 overflow-hidden border-b theme-border">
        <div className="max-w-7xl mx-auto text-center px-4 mb-6">
          <p className="font-mono text-xs uppercase tracking-wider theme-subtle-text font-semibold">
            Sanket Nehe · Languages, Frameworks, Cloud &amp; Real-Time APIs:
          </p>
        </div>

        <div className="relative w-full overflow-hidden mask-carousel py-4">
          <div className="carousel-track items-center gap-4">
            {[...STACK_ITEMS, ...STACK_ITEMS].map((item, idx) => (
              <div
                key={`${item.label}-${idx}`}
                className="flex flex-col items-center shrink-0 group cursor-pointer"
                title={item.label}
              >
                <div className="stack-tile w-12 h-12 rounded-[14px] flex items-center justify-center transition-transform group-hover:scale-110">
                  <span className={`text-[11px] font-bold font-mono ${item.color}`}>
                    {item.short}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
