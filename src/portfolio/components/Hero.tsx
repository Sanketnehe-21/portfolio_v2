import reactLogo from '../assets/stack/react-original.svg'
import expoLogo from '../assets/stack/expo-original.svg'
import typescriptLogo from '../assets/stack/typescript-original.svg'
import javascriptLogo from '../assets/stack/javascript-original.svg'
import firebaseLogo from '../assets/stack/firebase-original.svg'
import mapsLogo from '../assets/stack/google-maps.svg'
import mongodbLogo from '../assets/stack/mongodb-original.svg'
import mysqlLogo from '../assets/stack/mysql-original.svg'
import pythonLogo from '../assets/stack/python-original.svg'
import javaLogo from '../assets/stack/java-original.svg'
import phpLogo from '../assets/stack/php-original.svg'
import awsLogo from '../assets/stack/amazonwebservices-original-wordmark.svg'
import googlecloudLogo from '../assets/stack/googlecloud-original.svg'
import threejsLogo from '../assets/stack/threejs-original.svg'
import gitLogo from '../assets/stack/git-original.svg'
import figmaLogo from '../assets/stack/figma-original.svg'

const STACK_ITEMS = [
  { label: 'React Native', logo: reactLogo },
  { label: 'Expo', logo: expoLogo, monochrome: true },
  { label: 'TypeScript', logo: typescriptLogo },
  { label: 'JavaScript', logo: javascriptLogo },
  { label: 'React', logo: reactLogo },
  { label: 'Firebase Firestore', logo: firebaseLogo },
  { label: 'Google Maps API', logo: mapsLogo },
  { label: 'MongoDB', logo: mongodbLogo },
  { label: 'MySQL', logo: mysqlLogo },
  { label: 'Python', logo: pythonLogo },
  { label: 'Java', logo: javaLogo },
  { label: 'PHP', logo: phpLogo },
  { label: 'AWS', logo: awsLogo },
  { label: 'Google Cloud Platform', logo: googlecloudLogo },
  { label: 'Three.js & GLSL', logo: threejsLogo, monochrome: true },
  { label: 'Git', logo: gitLogo },
  { label: 'Figma', logo: figmaLogo },
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
                aria-hidden={idx >= STACK_ITEMS.length}
              >
                <div className="stack-tile w-12 h-12 rounded-[14px] flex items-center justify-center transition-transform group-hover:scale-110">
                  <img
                    src={item.logo}
                    alt={item.label}
                    className={item.monochrome ? 'size-7 object-contain stack-logo-monochrome' : 'size-7 object-contain'}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
