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
    id: 'binnys-fab',
    badge: 'React Native • Expo • React.js • Maps API • Featured',
    titleLine1: 'Binnys FAB',
    titleLine2: 'Field-Agent Tracking Platform',
    description:
      'Production field-agent tracking platform featuring live location updates, task assignment, OneSignal push alerts, and REST API-driven delivery completion reporting across mobile and web.',
    ctaLabel: 'Experience details',
    href: '#craft',
    tags: ['mobile', 'web'],
    featured: true,
  },
  {
    id: 'expo-location-keepalive',
    badge: 'Open-Source npm Package • Android • Featured',
    titleLine1: 'expo-location-keepalive',
    titleLine2: 'Background Location Keepalive',
    description:
      'MIT-licensed npm package (v0.1.0) designed to maintain background location tracking after app dismissal and mitigate OEM battery-management restrictions (Xiaomi, Oppo, Vivo, TECNO, Samsung).',
    ctaLabel: 'View on npm',
    href: 'https://www.npmjs.com/package/expo-location-keepalive',
    tags: ['mobile', 'oss'],
    featured: true,
  },
  {
    id: 'urban-hive',
    badge: 'React Native • Expo • Firebase • Featured',
    titleLine1: 'Urban Hive',
    titleLine2: 'Smart Urban Services',
    description:
      'Service discovery and request management mobile app built with React Native, Expo, Firebase Firestore real-time synchronization, Google Maps API, and secure payments.',
    ctaLabel: 'GitHub repositories',
    href: 'https://github.com/Sanketnehe-21',
    tags: ['mobile'],
    featured: true,
  },
  {
    id: 'binnys-whatsup',
    badge: 'React.js • Meta API • MongoDB • Ongoing',
    titleLine1: 'Binnys Whatsup',
    titleLine2: 'WhatsApp Business Platform',
    description:
      'Business messaging web platform built with React.js, Meta API, and MongoDB—enabling WhatsApp API integration and structured internal communication workflows.',
    ctaLabel: 'Discuss architecture',
    href: '#contact',
    tags: ['web'],
  },
  {
    id: 'binnys-scan',
    badge: 'React Native • Expo • Barcode & QR',
    titleLine1: 'Binnys Scan',
    titleLine2: 'Warehouse & Inventory App',
    description:
      'Published warehouse barcode & QR scanning application supporting inventory operations alongside the Play Store suite (Create, Vision, Scan, MyBinnyst, Track).',
    ctaLabel: 'See Play Store suite',
    href: '#notes',
    tags: ['mobile'],
  },
  {
    id: 'exhibition-tracking',
    badge: 'React.js • React Native • REST API',
    titleLine1: 'Exhibition Tracking',
    titleLine2: 'System (Web + Mobile)',
    description:
      'Cross-platform web and mobile full CRUD application built for tracking worldwide exhibitions and maintaining historical company records via REST APIs.',
    ctaLabel: 'Explore stack',
    href: '#notes',
    tags: ['mobile', 'web'],
  },
  {
    id: 'rn-whiteboard-kit',
    badge: 'Open-Source npm Package • Expo',
    titleLine1: 'rn-whiteboard-kit',
    titleLine2: 'useWhiteboard() Kit',
    description:
      'Expo-compatible React Native whiteboard component supporting freehand drawing, pinch-to-zoom, pan, undo/redo, eraser, and PNG export across Android, iOS & Web with zero native linking.',
    ctaLabel: 'View on npm',
    href: 'https://www.npmjs.com/package/rn-whiteboard-kit',
    tags: ['mobile', 'web', 'oss'],
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
    id: 'portfolio-v1-gaming',
    badge: 'Portfolio Archive • Multi-World Gaming',
    titleLine1: 'Portfolio v1',
    titleLine2: 'Multi-World Gaming Edition',
    description:
      'My first interactive portfolio featuring Tsushima, Minecraft & Los Santos world switchers, a Crafting Table UI, RPG quest logs, leveled inventory skills, and XP meters.',
    ctaLabel: 'Launch Gaming Edition',
    href: 'https://sanketnehe-21.github.io/portfolio/',
    tags: ['web', '3d'],
  },
  {
    id: 'additional-suite',
    badge: 'React Native • Expo • REST APIs',
    titleLine1: 'Brewtech, EV Finder',
    titleLine2: '& Arcal Calculator',
    description:
      'Additional builds: Brewtech (coffee shop management), EV Charging Station Finder (Google Maps API live station discovery), and Arcal (cross-platform calculator with Gati REST API lookups).',
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
