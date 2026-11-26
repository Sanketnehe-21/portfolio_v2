import { useState } from 'react'
import { ProjectSpotlight } from './ProjectSpotlight'

type FilterKey = 'all' | 'mobile' | 'web' | '3d' | 'oss'

interface ProjectCardItem {
  id: string
  badge: string
  titleLine1: string
  titleLine2: string
  description: string
  ctaLabel: string
  href: string
  tags: FilterKey[]
  featured?: boolean
}

const PROJECTS: ProjectCardItem[] = [
  {
    id: 'urban-hive',
    badge: 'React Native • Expo • Firebase • Featured',
    titleLine1: 'Urban Hive',
    titleLine2: 'Smart Urban Services',
    description:
      'Developed and deployed a React Native (Expo) app for real-time service provider discovery, request management, and secure payments with Firebase Firestore sync & Google Maps API.',
    ctaLabel: 'GitHub repositories',
    href: 'https://github.com/Sanketnehe-21',
    tags: ['mobile'],
    featured: true,
  },
  {
    id: 'rn-whiteboard-kit',
    badge: 'Open-Source npm Package • Expo',
    titleLine1: 'rn-whiteboard-kit',
    titleLine2: 'useWhiteboard() Kit',
    description:
      'Published an Expo-compatible React Native whiteboard library supporting freehand drawing, pinch-to-zoom, pan, undo/redo, eraser, and PNG export across Android, iOS & Web with zero native linking.',
    ctaLabel: 'Explore open source',
    href: 'https://github.com/Sanketnehe-21',
    tags: ['mobile', 'web', 'oss'],
    featured: true,
  },
  {
    id: 'expo-location-keepalive',
    badge: 'Open-Source npm Package • Android • Featured',
    titleLine1: 'expo-location-keepalive',
    titleLine2: 'Background Location Keepalive',
    description:
      'MIT-licensed npm package (v0.1.0) that keeps expo-location foreground/background tracking alive on Android after swipe-away or OEM battery kills (Xiaomi, Oppo, Vivo, TECNO, Samsung).',
    ctaLabel: 'View on npm',
    href: 'https://www.npmjs.com/package/expo-location-keepalive',
    tags: ['mobile', 'oss'],
    featured: true,
  },
  {
    id: 'binnys-suite',
    badge: 'Play Store Production • Binnys Management',
    titleLine1: 'Create, Vision, Scan,',
    titleLine2: 'MyBinnyst & Track',
    description:
      'Contributed across 5 published Play Store React Native apps—shipping end-to-end features, REST API backend integrations, UI fixes, and rendering performance improvements.',
    ctaLabel: 'Experience details',
    href: '#craft',
    tags: ['mobile'],
  },
  {
    id: 'observable-self',
    badge: 'Three.js • GLSL • Virgo Sky',
    titleLine1: 'The Observable Self',
    titleLine2: 'interactive intro',
    description:
      'Single persistent WebGL canvas combining particle typography, custom GLSL shaders, interactive Virgo birth constellation hover (21 Sept 2003), and continuous starfield warp arrival.',
    ctaLabel: 'Architecture workflow',
    href: '#workflow',
    tags: ['web', '3d'],
  },
  {
    id: 'agent-tracking',
    badge: 'Web + Mobile • Google Maps API',
    titleLine1: 'Agent Live Tracking',
    titleLine2: 'Delivery & Task Platform',
    description:
      'Cross-platform web and mobile platform for live agent & delivery tracking with task assignment, real-time map coordinate updates, and REST API-driven completion reporting.',
    ctaLabel: 'Discuss architecture',
    href: '#contact',
    tags: ['mobile', 'web'],
  },
  {
    id: 'ev-charging-finder',
    badge: 'React Native • Expo • Maps API',
    titleLine1: 'EV Charging Station',
    titleLine2: 'Finder App',
    description:
      'Mobile application powered by Expo and Google Maps API delivering real-time, location-based discovery and routing to nearby electric vehicle charging stations.',
    ctaLabel: 'View on GitHub',
    href: 'https://github.com/Sanketnehe-21',
    tags: ['mobile'],
  },
  {
    id: 'brewtech-exhibition',
    badge: 'React Native • Expo • Full CRUD REST',
    titleLine1: 'Brewtech & Exhibition',
    titleLine2: 'Operations Suite',
    description:
      'Built Brewtech (coffee shop inventory, orders & staff workflow app) alongside the cross-platform Exhibition Tracking System managing global exhibition records via REST APIs.',
    ctaLabel: 'Explore stack',
    href: '#notes',
    tags: ['mobile', 'web'],
  },
  {
    id: 'arcal',
    badge: 'Web + React Native • Gati REST API',
    titleLine1: 'Arcal',
    titleLine2: 'Live Rate Calculator',
    description:
      'Cross-platform Web and React Native utility calculator integrating third-party Gati REST APIs for instant live freight rate and logistics data lookups.',
    ctaLabel: 'Start a conversation',
    href: '#contact',
    tags: ['mobile', 'web'],
  },
]

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'web', label: 'Web' },
  { key: '3d', label: '3D / Shaders' },
  { key: 'oss', label: 'Open Source' },
]

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')

  const visibleProjects = PROJECTS.filter(
    (p) => activeFilter === 'all' || p.tags.includes(activeFilter)
  )

  return (
    <section id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t theme-border">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight theme-text">
            Shipped apps &amp; open source
          </h2>
          <p className="mt-3 text-base theme-muted">
            Production React Native apps, published npm tooling, full-stack platforms, and real-time 3D work.
          </p>
        </div>

        {/* Interactive Category Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap" id="project-filters">
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.key
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveFilter(f.key)}
                className={`filter-pill px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  isActive ? 'active border theme-border' : 'theme-pill'
                }`}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      </div>

      {(activeFilter === 'all' || activeFilter === 'mobile') && <ProjectSpotlight />}

      {/* Action button */}
      <div className="mb-8">
        <a
          href="https://github.com/Sanketnehe-21"
          target="_blank"
          rel="noreferrer"
          className="theme-btn-primary inline-flex px-5 py-2.5 rounded-full font-semibold text-sm transition-all"
        >
          View GitHub
        </a>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="projects-grid">
        {visibleProjects.map((project) => (
          <div
            key={project.id}
            className={`project-card expo-card p-8 flex flex-col justify-between ${
              project.featured ? 'expo-card-featured' : ''
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                    project.featured
                      ? 'bg-blue-500/15 text-blue-400 border-blue-500/25'
                      : 'bg-[var(--expo-element)] theme-muted theme-border'
                  }`}
                >
                  {project.badge}
                </span>
              </div>
              <h3 className="text-xl font-bold theme-text mb-2">
                {project.titleLine1}
                <br />
                {project.titleLine2}
              </h3>
              <p className="text-sm theme-muted leading-relaxed">{project.description}</p>
            </div>
            <div className="mt-6 pt-4 border-t theme-border">
              <a
                href={project.href}
                target={project.href.startsWith('http') ? '_blank' : undefined}
                rel={project.href.startsWith('http') ? 'noreferrer' : undefined}
                className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                {project.ctaLabel} <span>→</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
