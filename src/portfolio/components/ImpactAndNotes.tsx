const PROFILE_CARDS = [
  {
    initials: 'EX',
    accent: 'bg-blue-500/20 text-blue-400',
    title: 'Binnys Management · React Native Dev',
    subtitle: 'Oct 2025 – Present · Play Store Suite',
    body: 'Shipped end-to-end features, REST API integrations, UI polish, and rendering optimizations across Create, Vision, Scan, MyBinnyst, and Track.',
  },
  {
    initials: 'TS',
    accent: 'bg-emerald-500/20 text-emerald-400',
    title: 'Technical Skills & Cloud Stack',
    subtitle: 'Languages, Frameworks, DBs & Tools',
    body: '• Languages: JavaScript, TypeScript, HTML, CSS, PHP, Python, Java, C\n• Frameworks & Mobile: React Native, Expo, React, Android/iOS native modules\n• Databases & APIs: MySQL, MongoDB, Firebase Firestore, REST APIs, Google Maps API\n• Cloud & Tools: AWS, Google Cloud Platform, Firebase, Git, GitHub, Bitbucket, Figma, npm\n• Ops: Application troubleshooting, log analysis, incident/problem management',
    tall: true,
  },
  {
    initials: 'BE',
    accent: 'bg-purple-500/20 text-purple-400',
    title: 'B.E. Computer Engineering',
    subtitle: 'APSIT Thane (Mumbai Univ.) · 2021 – 2025',
    body: 'Graduated with 8.08 / 10.0 CGPA at A. P. Shah Institute of Technology, Thane — focusing on software systems, mobile engineering, and algorithms.',
  },
  {
    initials: 'CT',
    accent: 'bg-amber-500/20 text-amber-400',
    title: 'Certifications',
    subtitle: 'Cloud, DevOps & Fundamentals',
    body: 'Google Ads Certification · Azure DevOps Boards · WordPress Development · CISCO IT Essentials · C & C++ (SITH Foundation).',
  },
  {
    initials: 'XII',
    accent: 'bg-cyan-500/20 text-cyan-400',
    title: 'N.E.S High School & Junior College',
    subtitle: 'Bhandup · May 2018 – May 2020',
    body: 'Completed Senior Secondary (XII) in Science with 86%, building an early foundation in mathematics and computing.',
  },
  {
    initials: 'AW',
    accent: 'bg-rose-500/20 text-rose-400',
    title: 'Awards, Hackathons & Languages',
    subtitle: 'EXALT 2023–24 Winner · OSS Author',
    body: 'Winner – EXALT 2023–24 (APSIT) · Hackathon Participant · Open-source contributor (rn-whiteboard-kit). Fluent in English, Hindi, and Marathi.',
  },
]

export function ImpactAndNotes() {
  return (
    <>
      {/* Resume Credentials & Impact Strip */}
      <section id="focus" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-y theme-border">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold theme-text font-mono">5 Apps</div>
            <div className="mt-1 text-xs theme-muted uppercase tracking-wider font-medium">
              play store production
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold theme-text font-mono">8.08 CGPA</div>
            <div className="mt-1 text-xs theme-muted uppercase tracking-wider font-medium">
              b.e. computer engg
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold theme-text font-mono">EXALT &apos;24</div>
            <div className="mt-1 text-xs theme-muted uppercase tracking-wider font-medium">
              apsit winner
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold theme-text font-mono">npm OSS</div>
            <div className="mt-1 text-xs theme-muted uppercase tracking-wider font-medium">
              rn-whiteboard-kit
            </div>
          </div>
        </div>
      </section>

      {/* Education, Skills, Certifications & Experience Breakdown */}
      <section id="notes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold theme-text">
              Background, skills &amp; education
            </h2>
            <p className="mt-2 text-sm sm:text-base theme-muted max-w-xl">
              Production engineering experience, technical toolkit, academic milestones from Mumbai University, and certifications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Sanketnehe-21"
              target="_blank"
              rel="noreferrer"
              className="theme-btn-primary px-5 py-2.5 rounded-full font-semibold text-xs transition-all flex items-center gap-2"
            >
              Follow on GitHub
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROFILE_CARDS.map((item) => (
            <div
              key={item.initials}
              className={`expo-card p-5 flex flex-col justify-between ${
                item.tall ? 'md:row-span-2' : ''
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full ${item.accent} flex items-center justify-center text-xs font-bold font-mono`}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold theme-text leading-tight">
                      {item.title}
                    </div>
                    <div className="text-xs theme-subtle-text">{item.subtitle}</div>
                  </div>
                </div>
                <p className="text-xs theme-muted leading-relaxed whitespace-pre-line">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
