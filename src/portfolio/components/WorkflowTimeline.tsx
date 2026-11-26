import { useState } from 'react'

type StageKey = 'architect' | 'build' | 'automate' | 'scale'

interface WorkflowStage {
  key: StageKey
  step: string
  title: string
  badge: string
  layerLabel: string
  description: string
  deliverables: string[]
  accentHex: string
  accentGlow: string
}

const STAGES: WorkflowStage[] = [
  {
    key: 'architect',
    step: '01',
    title: 'Architect',
    badge: 'Stage: Architect (System Design)',
    layerLabel: 'Schemas, TypeScript & Cross-Platform Flows',
    description:
      'Structuring TypeScript data contracts, offline-safe Firestore/MongoDB/SQL schemas, and modular React Native & React.js navigation before writing the first screen.',
    deliverables: ['TypeScript Contracts', 'Firestore / SQL', 'REST API Spec'],
    accentHex: '#60a5fa',
    accentGlow: 'rgba(96, 165, 250, 0.28)',
  },
  {
    key: 'build',
    step: '02',
    title: 'Build',
    badge: 'Stage: Build (Mobile, Web & APIs)',
    layerLabel: 'Expo UI, Maps Tracking & Barcode Workflows',
    description:
      'Shipping responsive UIs and real-time modules with React Native, Expo, React.js, Google Maps live tracking, OneSignal alerts, barcode/QR scanners, and Meta WhatsApp API.',
    deliverables: ['React Native + Expo', 'Google Maps + QR', 'OneSignal Push'],
    accentHex: '#38bdf8',
    accentGlow: 'rgba(56, 189, 248, 0.28)',
  },
  {
    key: 'automate',
    step: '03',
    title: 'Automate',
    badge: 'Stage: Automate (EAS Build & E2E)',
    layerLabel: 'Expo EAS Releases, Git Workflows & Testing',
    description:
      'Managing repeatable Android & iOS builds with Expo EAS, strict typechecks, Bitbucket/Git review flows, and Playwright E2E verification for zero-regression releases.',
    deliverables: ['Expo EAS Build', 'Playwright E2E', 'Play Store Release'],
    accentHex: '#818cf8',
    accentGlow: 'rgba(129, 140, 248, 0.28)',
  },
  {
    key: 'scale',
    step: '04',
    title: 'Scale',
    badge: 'Stage: Scale (Production Reliability)',
    layerLabel: 'Background Keepalive, UI Speed & Monitoring',
    description:
      'Optimizing UI rendering efficiency, maintaining Android background tracking across OEM battery limits (expo-location-keepalive), and resolving issues via log analysis.',
    deliverables: ['OEM Keepalive', 'UI Optimization', 'Log Troubleshooting'],
    accentHex: '#34d399',
    accentGlow: 'rgba(52, 211, 153, 0.28)',
  },
]

export function WorkflowTimeline() {
  const [activeStage, setActiveStage] = useState<StageKey>('architect')
  const current = STAGES.find((s) => s.key === activeStage) ?? STAGES[0]

  const isArchitect = activeStage === 'architect'
  const isBuild = activeStage === 'build'
  const isAutomate = activeStage === 'automate'
  const isScale = activeStage === 'scale'

  return (
    <section id="workflow" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="theme-surface rounded-[32px] lg:rounded-[40px] border p-6 sm:p-10 lg:p-12 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Side: Interactive Timeline (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] theme-subtle-text">
                Engineering workflow
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight theme-text leading-tight">
                How I take products
                <br />
                <span className="theme-muted">from idea to scale</span>
              </h2>
            </div>

            <div className="relative pl-8 space-y-6">
              <div className="timeline-line" />

              {STAGES.map((stage) => {
                const isActive = stage.key === activeStage
                return (
                  <div
                    key={stage.key}
                    id={`step-${stage.key}`}
                    className={`relative timeline-step ${isActive ? 'active' : ''} cursor-pointer group`}
                    onClick={() => setActiveStage(stage.key)}
                  >
                    <div
                      className="step-indicator absolute -left-8 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                      style={
                        isActive
                          ? {
                              backgroundColor: stage.accentHex,
                              borderColor: stage.accentHex,
                              boxShadow: `0 0 14px ${stage.accentGlow}`,
                            }
                          : undefined
                      }
                    >
                      <div
                        className={`w-2 h-2 rounded-full transition-colors ${
                          isActive ? 'bg-white' : 'bg-[var(--text-tertiary)]'
                        }`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveStage(stage.key)
                      }}
                      className="step-title flex items-center gap-2.5 text-xl font-semibold group-hover:text-[var(--text-default)] transition-colors text-left cursor-pointer"
                    >
                      <span className="font-mono text-xs theme-subtle-text">{stage.step}</span>
                      <span>{stage.title}</span>
                    </button>
                    <p className="step-desc mt-2 text-sm theme-muted leading-relaxed">
                      {stage.description}
                    </p>
                    {isActive && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {stage.deliverables.map((item) => (
                          <span
                            key={item}
                            className="theme-pill rounded-full px-2.5 py-0.5 text-[11px] font-mono"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Side: Stage-Reactive Isometric System Architecture (7 cols) */}
          <div className="theme-inner lg:col-span-7 flex flex-col justify-between rounded-3xl p-4 sm:p-8 border relative overflow-hidden min-h-[340px] sm:min-h-[470px]">
            {/* Top live layer header */}
            <div className="flex items-center justify-between gap-3 px-2 pt-1 pb-2 border-b theme-border/60 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0 transition-colors"
                  style={{ backgroundColor: current.accentHex }}
                />
                <span className="font-mono theme-text truncate">{current.step} · {current.layerLabel}</span>
              </div>
              <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-wider theme-subtle-text shrink-0">
                Click stage or layer
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center py-2">
              <svg
                className="w-full h-auto max-w-[530px]"
                viewBox="0 0 600 450"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Layer 4 Base Platform: Scale & Reliability */}
                <g
                  className="cursor-pointer"
                  onClick={() => setActiveStage('scale')}
                  opacity={isScale ? 1 : 0.45}
                >
                  <path
                    d="M442 324L300 395L158 324L300 253L442 324Z"
                    fill={isScale ? '#064e3b' : 'transparent'}
                    fillOpacity={isScale ? 0.25 : 0}
                    stroke={isScale ? '#34d399' : '#334155'}
                    strokeWidth={isScale ? 2 : 1.2}
                    strokeLinejoin="bevel"
                  />
                  <path
                    d="M442 324L300 395L158 324L300 253L442 324Z"
                    stroke="#34d399"
                    strokeWidth={isScale ? 2.5 : 1.2}
                    pathLength={1000}
                    strokeDasharray="110 890"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="-1000"
                      dur={isScale ? '2.6s' : '4.5s'}
                      repeatCount="indefinite"
                    />
                  </path>
                  <g>
                    <animateTransform
                      attributeName="transform"
                      additive="sum"
                      type="translate"
                      values="0 0; 0 -5; 0 0"
                      dur="4.6s"
                      repeatCount="indefinite"
                    />
                    <path d="M353 402L300 430L247 402L300 374L353 402Z" stroke={isScale ? '#34d399' : '#64748b'} />
                    <path d="M299 380V414L269 399V365L299 380Z" fill="#1e293b" stroke={isScale ? '#34d399' : '#64748b'} />
                    <path d="M330 364L299 379V414L330 399V364Z" fill="#0f172a" stroke={isScale ? '#34d399' : '#64748b'} />
                  </g>
                  <circle cx={300} cy={328} r={6} fill="none" stroke="#34d399">
                    <animate attributeName="r" values="6;24" dur={isScale ? '1.7s' : '2.8s'} repeatCount="indefinite" />
                    <animate attributeName="opacity" values={isScale ? '0.9;0' : '0.45;0'} dur={isScale ? '1.7s' : '2.8s'} repeatCount="indefinite" />
                  </circle>
                </g>

                {/* Structural Vertical Connectors */}
                <path d="M236 206L172 174V314L300 378V308" stroke="#334155" strokeLinejoin="bevel" />
                <path d="M364 206L428 174L300 110L172 174L236 206" stroke="#334155" strokeLinejoin="bevel" />

                {/* Layer 3 Side Pipeline Plane: Automate / EAS & E2E */}
                <g
                  className="cursor-pointer"
                  onClick={() => setActiveStage('automate')}
                  opacity={isAutomate ? 1 : 0.45}
                >
                  <path
                    d="M246 70L118 134V276L246 212V70Z"
                    fill={isAutomate ? '#312e81' : 'transparent'}
                    fillOpacity={isAutomate ? 0.25 : 0}
                    stroke={isAutomate ? '#818cf8' : '#475569'}
                    strokeWidth={isAutomate ? 2 : 1.2}
                  />
                  <path
                    d="M246 70L118 134V276L246 212V70Z"
                    stroke="#a5b4fc"
                    strokeWidth={isAutomate ? 2.4 : 1.3}
                    pathLength={1000}
                    strokeDasharray="90 910"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="-1000"
                      dur={isAutomate ? '2.8s' : '5.5s'}
                      repeatCount="indefinite"
                    />
                  </path>
                </g>

                {/* Layer 2 Center Sync Node: Build / Real-Time Mobile & Web APIs */}
                <g
                  className="cursor-pointer"
                  onClick={() => setActiveStage('build')}
                  opacity={isBuild ? 1 : 0.58}
                >
                  <circle
                    cx={300}
                    cy={236}
                    r={isBuild ? 30 : 25}
                    fill="#0b0d0e"
                    stroke={isBuild ? '#38bdf8' : '#3b82f6'}
                    strokeWidth={isBuild ? 2.5 : 1.8}
                  >
                    <animateTransform
                      attributeName="transform"
                      additive="sum"
                      type="translate"
                      values="0 0; 0 -4; 0 0"
                      dur="3.6s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx={300} cy={236} r={11} fill={isBuild ? '#38bdf8' : '#3b82f6'}>
                    <animate attributeName="opacity" values="0.45;1;0.45" dur="2.1s" repeatCount="indefinite" />
                  </circle>
                </g>

                {/* Layer 1 Top Blueprint Plate: Architect / Schemas & UI Contracts */}
                <g
                  className="cursor-pointer"
                  onClick={() => setActiveStage('architect')}
                  opacity={isArchitect ? 1 : 0.45}
                >
                  <path
                    d="M440 109.2L300 182L160 111L301.7 40L440 109.2Z"
                    fill="#1e3a8a"
                    fillOpacity={isArchitect ? 0.36 : 0.16}
                    stroke={isArchitect ? '#60a5fa' : '#3b82f6'}
                    strokeWidth={isArchitect ? 2 : 1.2}
                  >
                    <animate
                      attributeName="fill-opacity"
                      values={isArchitect ? '0.24;0.52;0.24' : '0.12;0.24;0.12'}
                      dur="3.2s"
                      repeatCount="indefinite"
                    />
                  </path>
                  <path
                    d="M440 109.2L300 182L160 111L301.7 40L440 109.2Z"
                    stroke="#93c5fd"
                    strokeWidth={isArchitect ? 2.5 : 1.4}
                    pathLength={1000}
                    strokeDasharray="100 900"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="-1000"
                      dur={isArchitect ? '2.8s' : '4.8s'}
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              </svg>
            </div>

            {/* Bottom interactive stage selector & live diagram badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t theme-border/60">
              <span
                id="diagram-badge"
                className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/35 text-xs font-mono font-medium whitespace-nowrap"
              >
                {current.badge}
              </span>

              <div className="flex items-center gap-1.5" aria-label="Workflow quick stage switch">
                {STAGES.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setActiveStage(s.key)}
                    aria-pressed={s.key === activeStage}
                    className={`px-2.5 py-1 rounded-full font-mono text-[11px] transition-colors cursor-pointer ${
                      s.key === activeStage
                        ? 'theme-btn-primary font-semibold'
                        : 'theme-pill'
                    }`}
                  >
                    {s.step}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
