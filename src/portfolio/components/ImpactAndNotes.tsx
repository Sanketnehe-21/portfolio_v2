const SKILL_GROUPS = [
  { title: 'Mobile & frontend', skills: ['React Native', 'Expo', 'React', 'Android / iOS native modules', 'HTML', 'CSS'] },
  { title: 'Languages', skills: ['JavaScript', 'TypeScript', 'PHP', 'Python', 'Java', 'C'] },
  { title: 'Data & APIs', skills: ['Firebase Firestore', 'MySQL', 'MongoDB', 'REST APIs', 'Google Maps API'] },
  { title: 'Cloud & collaboration', skills: ['AWS', 'Google Cloud', 'Firebase', 'Git', 'GitHub', 'Bitbucket', 'Figma', 'npm'] },
  { title: 'Operations', skills: ['Application troubleshooting', 'Log analysis', 'Incident & problem management'] },
]

const CERTIFICATIONS = [
  'Google Ads Certification',
  'Azure DevOps Boards',
  'WordPress Development',
  'CISCO IT Essentials',
  'C & C++ · SITH Foundation',
]

export function ImpactAndNotes() {
  return (
    <>
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
            <div className="text-2xl sm:text-3xl font-extrabold theme-text font-mono">2 npm Libs</div>
            <div className="mt-1 text-xs theme-muted uppercase tracking-wider font-medium">
              published open source
            </div>
          </div>
        </div>
      </section>

      <section id="notes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight theme-text">
              Background, skills &amp; education
            </h2>
            <p className="mt-3 text-base theme-muted max-w-xl leading-relaxed">
              Building mobile products, publishing developer tools, and putting a computer engineering foundation into practice.
            </p>
          </div>
          <a href="#projects" className="theme-pill self-start shrink-0 px-5 py-2.5 rounded-full font-medium text-sm">
            See the work →
          </a>
        </div>

        <div className="background-grid">
          <article className="expo-card background-journey">
            <h3 className="text-xl font-semibold theme-text">Experience &amp; education</h3>
            <ol className="background-timeline">
              <li>
                <p className="background-date"><span className="background-current" />Oct 2025 – Present</p>
                <h4>React Native Developer</h4>
                <p className="background-place">Binnys Management</p>
                <p className="background-description">Shipping end-to-end features, REST API integrations, UI polish, and rendering optimizations across five Play Store apps.</p>
                <ul className="background-apps" aria-label="Production apps">
                  {['Create', 'Vision', 'Scan', 'MyBinnyst', 'Track'].map((app) => <li key={app}>{app}</li>)}
                </ul>
              </li>
              <li>
                <p className="background-date">2021 – 2025</p>
                <h4>B.E. Computer Engineering</h4>
                <p className="background-place">A. P. Shah Institute of Technology, Thane</p>
                <p className="background-description">University of Mumbai. Studied software systems, mobile engineering, and algorithms.</p>
                <p className="background-result">8.08 <span>/ 10 CGPA</span></p>
              </li>
              <li>
                <p className="background-date">May 2018 – May 2020</p>
                <h4>Senior Secondary · Science</h4>
                <p className="background-place">N.E.S High School &amp; Junior College, Bhandup</p>
                <p className="background-description">A foundation in mathematics and computing.</p>
                <p className="background-result">86% <span>Class XII</span></p>
              </li>
            </ol>
          </article>

          <article className="expo-card background-toolkit">
            <h3 className="text-xl font-semibold theme-text">Technical toolkit</h3>
            <p className="mt-2 text-sm theme-muted leading-relaxed">From mobile interfaces to the services behind them.</p>
            <div className="background-skills">
              {SKILL_GROUPS.map((group) => (
                <div key={group.title}>
                  <h4>{group.title}</h4>
                  <ul className="background-tags">
                    {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </article>

          <article className="expo-card background-support">
            <h3 className="text-xl font-semibold theme-text">Certifications</h3>
            <ul className="background-certifications">
              {CERTIFICATIONS.map((certificate) => (
                <li key={certificate}><span aria-hidden="true">↗</span>{certificate}</li>
              ))}
            </ul>
          </article>

          <article className="expo-card background-support">
            <h3 className="text-xl font-semibold theme-text">Beyond the day job</h3>
            <div className="background-recognition">
              <div><h4>EXALT 2023–24 winner</h4><p>APSIT · Hackathon participant</p></div>
              <div>
                <h4>Open-source author</h4>
                <p>Creator of rn-whiteboard-kit and expo-location-keepalive.</p>
                <a href="https://github.com/Sanketnehe-21" target="_blank" rel="noreferrer" className="inline-block mt-2 text-sm text-blue-400">Explore my repositories →</a>
              </div>
              <div><h4>Languages</h4><p>Fluent in English, Hindi, and Marathi.</p></div>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}