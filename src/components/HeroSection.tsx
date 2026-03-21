import { motion } from 'framer-motion'
import { type LucideIcon, FileDown, Mail, ArrowDown, Power, Sparkles, Cpu, Workflow, ShieldCheck } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'
import MagneticButton from './MagneticButton'
import { useXRayStore } from '../store/xrayStore'
import { useBootStore } from '../store/bootStore'

const metrics = [
  { value: '4.5', suffix: ' yrs', label: 'Experience', color: 'text-primary-light' },
  { value: '100', suffix: 'K+', label: 'Calls/Day', color: 'text-green' },
  { value: '4', suffix: ' Cr+', prefix: '₹', label: 'Revenue/Mo', color: 'text-amber' },
  { value: '590', suffix: '', label: 'Problems Solved', color: 'text-accent' },
]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const bootLines = [
  '> java -jar portfolio.jar --spring.profiles.active=prod',
  '> Initializing shahzaib-service v4.5.0...',
  '> Connected: mysql://primary:3306/portfolio ✓',
  '> Connected: redis://cache-01:6379 ✓',
  '> Connected: kafka://broker-1:9092 ✓',
  '> Health check: all systems operational ✓',
  '> Listening on port 8080... Ready.',
]

const missionCards: Array<{ icon: LucideIcon; eyebrow: string; title: string; detail: string }> = [
  {
    icon: Workflow,
    eyebrow: 'Platform Thinking',
    title: 'Reusable foundations over one-off fixes',
    detail: 'I design libraries, flows, and service patterns that multiple teams can keep shipping on.',
  },
  {
    icon: Cpu,
    eyebrow: 'Scale Discipline',
    title: 'Built for pressure, traffic, and ambiguity',
    detail: 'My comfort zone is messy production systems where performance and correctness both matter.',
  },
  {
    icon: ShieldCheck,
    eyebrow: 'Business Critical',
    title: 'Revenue paths with reliability baked in',
    detail: 'From seller protection to fintech rails, I focus on systems that need calm execution under load.',
  },
]

const focusPills = [
  'Java + Spring Boot',
  'Distributed Systems',
  'Platform Engineering',
  'Queues + Caching',
  'Cost & Latency Optimization',
  'Multi-tenant Libraries',
]

export default function HeroSection() {
  const xray = useXRayStore((s) => s.xray)
  const booted = useBootStore((s) => s.booted)
  const setBooted = useBootStore((s) => s.setBooted)
  const bootNote = 'System online. Scroll down to explore the full system map.'
  const resumeUrl = `${import.meta.env.BASE_URL}resume.pdf`

  function handleBootToggle() {
    if (booted) {
      window.location.reload()
      return
    }
    setBooted(true)
  }

  function handleResumeDownload() {
    const link = document.createElement('a')
    link.href = resumeUrl
    link.download = 'Shahzaib-Ahmad-Resume.pdf'
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <section className="relative min-h-screen flex items-start pt-4 pb-10">
      {xray && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        >
          <div className="font-mono text-[10px] sm:text-xs text-primary-light/30 leading-loose text-center space-y-1 max-w-md">
            {bootLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                {line}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="container py-8 sm:py-10 relative z-10 flex flex-col max-w-6xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="text-center">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-3 mt-4 px-8 py-4 rounded-full bg-green-dim/70 border border-green/40 shadow-[0_0_0_1px_rgba(52,211,153,0.18)]">
            <span className="w-2 h-2 rounded-full bg-green" style={{ animation: 'pulse-ring 2s ease-in-out infinite' }} />
            <span className="text-lg sm:text-[1.35rem] leading-normal text-green font-medium tracking-wide">Available for opportunities</span>
          </motion.div>

          <motion.div variants={fadeUp} className="hero-nameplate mt-6">
            <div
              className="hero-nameplate-mark"
              style={{ animation: 'float 4s ease-in-out infinite' }}
              aria-hidden="true"
            >
              <span className="text-3xl font-bold text-white select-none">SA</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-left">
              <span className="text-text">Shahzaib </span>
              <span className="animated-gradient-text">Ahmad</span>
            </h1>
          </motion.div>

          <motion.p variants={fadeUp} className="text-lg sm:text-xl md:text-2xl text-text font-semibold tracking-tight mt-4">
            SDE-3 @Cars24 | Platform &amp; Backend Engineer
          </motion.p>

          {booted && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-7 mt-8"
            >
              {metrics.map((m, i) => (
                <motion.div
                  key={`hero-${m.label}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + i * 0.08 }}
                  className="text-center py-2"
                >
                  <div className={`text-3xl sm:text-4xl font-bold font-mono ${m.color} leading-none`}>
                    <AnimatedCounter target={m.value} suffix={m.suffix} prefix={m.prefix ?? ''} />
                  </div>
                  <div className="text-xs text-text-muted mt-2 font-medium tracking-wide uppercase">{m.label}</div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="hero-mission-shell mt-5 max-w-5xl mx-auto text-left">
            <div className="grid gap-5 lg:grid-cols-[1.2fr_0.95fr]">
              <div className="hero-mission-story">
                <div className="inline-flex flex-wrap items-center gap-2">
                  <span className="hero-signal-pill hero-signal-pill-primary">Mission Control</span>
                  <span className="hero-signal-pill">Backend calm under pressure</span>
                </div>

                <p className="mt-5 text-xl sm:text-2xl md:text-[2rem] font-semibold tracking-tight leading-[1.35] text-text">
                  I build backend systems that can absorb messy business logic, rising scale, and real production pressure without turning teams into firefighters.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="hero-impact-tile">
                    <span className="hero-impact-label">Current lane</span>
                    <span className="hero-impact-value">Core backend and platform systems at CARS24</span>
                  </div>
                  <div className="hero-impact-tile">
                    <span className="hero-impact-label">Operating style</span>
                    <span className="hero-impact-value">Ownership, clarity, and end-to-end delivery</span>
                  </div>
                  <div className="hero-impact-tile">
                    <span className="hero-impact-label">Previous exposure</span>
                    <span className="hero-impact-value">Fintech flows, lender rails, and production reliability</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                {missionCards.map((card) => {
                  const Icon = card.icon
                  return (
                    <div key={card.title} className="hero-brief-card">
                      <div className="hero-brief-icon">
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="hero-brief-eyebrow">{card.eyebrow}</div>
                        <div className="hero-brief-title">{card.title}</div>
                        <p className="hero-brief-detail">{card.detail}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="hero-tech-strip mt-5">
              {focusPills.map((pill) => (
                <span key={pill} className="hero-tech-pill">
                  {pill}
                </span>
              ))}
            </div>
          </motion.div>

          {!booted && (
            <motion.div variants={fadeUp} className="boot-launcher" role="region" aria-label="Boot system launcher">
              <div className="boot-launcher-meta">
                <div className="hero-boot-inline" role="note" aria-label="Boot system note">
                  <Sparkles size={16} className="text-amber" />
                  <span>Boot the system from the launcher below to unlock the full portfolio.</span>
                </div>

                <div className="boot-launcher-header">
                  <span className="hero-boot-eyebrow">Primary action</span>
                  <div className="boot-cta-nudge" aria-hidden="true">
                    <span className="boot-cta-nudge-dot" />
                    <span>Click to activate</span>
                  </div>
                </div>
              </div>

              <div className="boot-cta-shell">
                <span className="boot-cta-halo" aria-hidden="true" />
                <MagneticButton
                  as="button"
                  onClick={handleBootToggle}
                  className="boot-cta boot-launcher-cta relative isolate overflow-hidden w-full sm:w-auto min-w-0 sm:min-w-[380px] inline-flex items-center justify-center gap-3 px-9 sm:px-12 py-3.5 text-white font-semibold rounded-[1.4rem] transition-all text-lg sm:text-[1.85rem]"
                >
                  <span className="boot-cta-gloss" aria-hidden="true" />
                  <Power size={24} />
                  <span>Boot the System</span>
                </MagneticButton>
              </div>
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="flex flex-col items-center justify-center gap-5 mt-6 pb-10">
            {booted && <p className="text-base text-text-secondary leading-relaxed max-w-xl">{bootNote}</p>}
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 transition-all duration-500 ${booted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
              <MagneticButton
                as="button"
                onClick={handleBootToggle}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 border border-accent/35 text-accent rounded-xl hover:bg-accent/10 transition-all text-base"
              >
                <Power size={16} />
                Shut Down System
              </MagneticButton>
              <MagneticButton
                as="button"
                onClick={handleResumeDownload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light hover:shadow-lg hover:shadow-primary/25 transition-all text-base relative overflow-hidden group"
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ animation: 'shimmer 2s infinite' }} />
                </span>
                <FileDown size={16} className="relative z-10" />
                <span className="relative z-10">Download Resume</span>
              </MagneticButton>
              <MagneticButton
                as="a"
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 border border-border text-text rounded-xl hover:bg-surface hover:border-border-hover transition-all text-base"
              >
                <Mail size={16} />
                Get in Touch
              </MagneticButton>
            </div>
          </motion.div>
        </motion.div>

        {!booted && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 pt-0 -mt-6 sm:-mt-8"
          >
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + i * 0.12 }}
                className="text-center py-3"
              >
                <div className={`text-3xl sm:text-4xl font-bold font-mono ${m.color} leading-none`}>
                  <AnimatedCounter target={m.value} suffix={m.suffix} prefix={m.prefix ?? ''} />
                </div>
                <div className="text-xs text-text-muted mt-2.5 font-medium tracking-wide uppercase">{m.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {booted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex justify-center pt-8"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/35 text-accent hover:bg-accent/10 transition-all duration-200 hover:scale-[1.06] active:scale-[0.95]"
              aria-label="Scroll to projects"
              style={{ animation: 'float 2s ease-in-out infinite' }}
            >
              <ArrowDown size={18} />
              <span className="text-sm font-medium">Scroll now</span>
            </a>
          </motion.div>
        )}
      </div>
    </section>
  )
}
