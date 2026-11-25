import { useState } from 'react'

type StageKey = 'architect' | 'build' | 'automate' | 'scale'

const STAGES: {
  key: StageKey
  title: string
  badge: string
  description: string
}[] = [
  {
    key: 'architect',
    title: 'Architect',
    badge: 'Stage: Architect (System Design)',
    description:
      'Designing strict TypeScript contracts, offline-first data models, and modular UI primitives across web, iOS, and Android before writing the first screen.',
  },
  {
    key: 'build',
    title: 'Build',
    badge: 'Stage: Build (Web, Mobile & 3D)',
    description:
      'Shipping full-stack features rapidly with React, Expo, Next.js, and Three.js/GLSL. Obsessing over 60fps animations, accessibility, and clean ergonomics.',
  },
  {
    key: 'automate',
    title: 'Automate',
    badge: 'Stage: Automate (CI/CD & E2E)',
    description:
      'Setting up automated browser tests, type checks, and reproducible build pipelines so every commit ships cleanly with zero regressions.',
  },
  {
    key: 'scale',
    title: 'Scale',
    badge: 'Stage: Scale (Performance)',
    description:
      'Profiling GPU budgets, adaptive DPR, and memory disposal so interactive experiences stay responsive across desktop and mobile hardware.',
  },
]

export function WorkflowTimeline() {
  const [activeStage, setActiveStage] = useState<StageKey>('architect')
  const current = STAGES.find((s) => s.key === activeStage) ?? STAGES[0]

  return (
    <section id="workflow" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="theme-surface rounded-[32px] lg:rounded-[40px] border p-6 sm:p-10 lg:p-12 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Side: Interactive Timeline (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight theme-text leading-tight">
                How I take products
                <br />
                <span className="theme-muted">from idea to scale</span>
              </h2>
            </div>

            <div className="relative pl-8 space-y-8">
              <div className="timeline-line" />

              {STAGES.map((stage) => {
                const isActive = stage.key === activeStage
                return (
                  <div
                    key={stage.key}
                    id={`step-${stage.key}`}
                    className={`timeline-step ${isActive ? 'active' : ''} cursor-pointer group`}
                    onClick={() => setActiveStage(stage.key)}
                  >
                    <div className="step-indicator absolute -left-8 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveStage(stage.key)
                      }}
                      className="step-title text-xl font-semibold group-hover:text-[var(--text-default)] transition-colors text-left cursor-pointer"
                    >
                      {stage.title}
                    </button>
                    <p className="step-desc mt-2 text-sm theme-muted leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Side: Animated Isometric SVG System Diagram (7 cols) */}
          <div className="theme-inner lg:col-span-7 flex items-center justify-center rounded-3xl p-6 sm:p-10 border relative overflow-hidden min-h-[440px]">
            <svg
              className="w-full h-auto max-w-[550px]"
              viewBox="0 0 600 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M428 324L300 388L172 324L300 260L428 324Z" stroke="#334155" strokeLinejoin="bevel" />
              <path
                d="M428 324L300 388L172 324L300 260L428 324Z"
                stroke="#3b82f6"
                strokeWidth={2}
                pathLength={1000}
                strokeDasharray="100 900"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="-1000" dur="4.2s" repeatCount="indefinite" />
              </path>

              <circle cx={300} cy={244} r={26} fill="#0b0d0e" stroke="#3b82f6" strokeWidth={2}>
                <animateTransform
                  attributeName="transform"
                  additive="sum"
                  type="translate"
                  values="0 0; 0 -4; 0 0"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx={300} cy={244} r={10} fill="#3b82f6">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
              </circle>

              <path opacity={0.6} d="M246 74L118 138V284L246 220V74Z" stroke="#475569" />
              <path
                d="M246 74L118 138V284L246 220V74Z"
                stroke="#60a5fa"
                strokeWidth={1.5}
                pathLength={1000}
                strokeDasharray="80 920"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="-1000" dur="5.5s" repeatCount="indefinite" />
              </path>

              <path d="M236 210L172 178V324L300 388V315" stroke="#334155" strokeLinejoin="bevel" />
              <path d="M364 210L428 178L300 114L172 178L236 210" stroke="#334155" strokeLinejoin="bevel" />

              <path
                d="M440 115.2L300 188L160 117L301.7 46L440 115.2Z"
                fill="#1e3a8a"
                fillOpacity={0.25}
                stroke="#3b82f6"
              >
                <animate attributeName="fill-opacity" values="0.15;0.45;0.15" dur="3.5s" repeatCount="indefinite" />
              </path>
              <path
                d="M440 115.2L300 188L160 117L301.7 46L440 115.2Z"
                stroke="#93c5fd"
                strokeWidth={2}
                pathLength={1000}
                strokeDasharray="90 910"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="-1000" dur="4.8s" repeatCount="indefinite" />
              </path>

              <g>
                <animateTransform
                  attributeName="transform"
                  additive="sum"
                  type="translate"
                  values="0 0; 0 -6; 0 0"
                  dur="5s"
                  repeatCount="indefinite"
                />
                <path d="M353 426L300 454L247 426L300 398L353 426Z" stroke="#64748b" />
                <path d="M299 404V438L269 423V389L299 404Z" fill="#1e293b" stroke="#64748b" />
                <path d="M330 388L299 403V438L330 423V388Z" fill="#0f172a" stroke="#64748b" />
              </g>

              <circle cx={300} cy={350} r={6} fill="none" stroke="#3b82f6">
                <animate attributeName="r" values="6;22" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur="2.4s" repeatCount="indefinite" />
              </circle>

              <foreignObject x={170} y={445} width={260} height={40}>
                <div className="flex items-center justify-center">
                  <span
                    id="diagram-badge"
                    className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 text-xs font-mono font-medium backdrop-blur whitespace-nowrap"
                  >
                    {current.badge}
                  </span>
                </div>
              </foreignObject>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
