import { motion } from 'framer-motion'
import { timeline } from '../data/timeline'
import { Award } from 'lucide-react'
import { ScrollTextReveal } from './TextGenerateEffect'
import GlassCard from './GlassCard'
import { useXRayStore } from '../store/xrayStore'

const narratives: Record<string, string> = {
  cetpa: 'Where it all began. Dove deep into Java fundamentals, design patterns, and enterprise architecture — building the foundation for everything that followed.',
  'monster-intern': 'First taste of production systems. Wrote automation scripts, cleaned up legacy data, and shipped features that real users interacted with daily.',
  'monster-sde': 'Stepped up from intern to engineer. Designed the User Notifications module from scratch — handling both scheduled and event-driven delivery. Won the Exemplary Performance Award in Q1.',
  paytail: 'Joined the fintech world. Owned critical integrations end-to-end — from geospatial store search to Aadhaar-based payment setups. Mentored interns and conducted 30+ interviews.',
  cars24: 'The inflection point. Architected Kavach (~₹4Cr/month revenue), built the calling platform (100K+ calls/day), and created Atlas — a multi-tenant orchestration engine. Went from executing features to designing entire systems.',
}

const kafkaEvents: Record<string, string[]> = {
  cetpa: ['{ type: "CAREER_STARTED", stack: "Java", role: "trainee" }'],
  'monster-intern': ['{ type: "FIRST_JOB", company: "Monster", commits: 247 }', '{ type: "FEATURE_SHIPPED", module: "email-verification" }'],
  'monster-sde': ['{ type: "PROMOTED", to: "SDE", quarter: "Q3-2021" }', '{ type: "MODULE_BUILT", name: "notifications" }', '{ type: "AWARD", name: "Exemplary Performance" }'],
  paytail: ['{ type: "COMPANY_JOINED", name: "Paytail" }', '{ type: "INTEGRATION_BUILT", name: "Aadhaar-NACH" }', '{ type: "MENTORING_STARTED", internsCount: 5 }'],
  cars24: ['{ type: "PROMOTED", to: "SDE-3" }', '{ type: "SYSTEM_ARCHITECTED", name: "Kavach", revenue: "4Cr/mo" }', '{ type: "PLATFORM_BUILT", name: "Call Bridge", scale: "100K/day" }', '{ type: "ENGINE_BUILT", name: "Atlas", tenants: "multi-BU" }'],
}

export default function Timeline() {
  const entries = [...timeline].reverse()
  const xray = useXRayStore((s) => s.xray)

  return (
    <section id="experience" className="py-24 sm:py-32">
      <div className="container">
        <div className="mb-14">
          <ScrollTextReveal text="The Journey So Far" className="text-3xl sm:text-4xl font-bold text-text tracking-tight mb-4" />
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-text-secondary max-w-lg text-base">
            Each chapter shaped the engineer I am today. Toggle X-Ray to see career events as a message stream.
          </motion.p>
        </div>

        <div className="space-y-8 sm:space-y-10">
          {entries.map((entry, i) => {
            const isCurrent = i === 0
            const narrative = narratives[entry.id] ?? ''
            const events = kafkaEvents[entry.id] ?? []

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <GlassCard
                  className={`glass-surface overflow-hidden ${isCurrent ? 'ring-1 ring-primary/15' : ''}`}
                  backContent={
                    <div className="space-y-1">
                      <div className="text-accent/50 mb-2">// kafka.topic: career-events</div>
                      {events.map((evt, j) => (
                        <div key={j} className="text-primary-light/30">
                          producer.send("career-events",{'\n  '}{evt});
                        </div>
                      ))}
                    </div>
                  }
                >
                  <div className="p-7 sm:p-9">
                    {isCurrent && (
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                    )}

                    <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-xl sm:text-2xl font-bold text-text">{entry.company}</h3>
                          {isCurrent && (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-dim border border-primary/30 text-primary-light">Current</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                          <span className={`text-sm font-medium ${isCurrent ? 'text-primary-light' : 'text-text-secondary'}`}>{entry.role}</span>
                          <span className="text-text-muted text-sm">&middot;</span>
                          <span className="text-sm text-text-muted">{entry.period}</span>
                          <span className="text-text-muted text-sm">&middot;</span>
                          <span className="text-sm text-text-muted">{entry.location}</span>
                        </div>
                      </div>
                      {entry.award && (
                        <motion.span
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-amber px-3 py-1.5 rounded-xl bg-amber-dim border border-amber/20"
                          style={{ animation: 'pulse-ring 3s ease-in-out infinite' }}
                        >
                          <Award size={14} />
                          {entry.award}
                        </motion.span>
                      )}
                    </div>

                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="text-base text-text-secondary leading-relaxed mt-4 mb-6 max-w-2xl"
                    >
                      {narrative}
                    </motion.p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {entry.achievements.map((a, j) => (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0, x: 12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + j * 0.06 }}
                          className="flex items-start gap-2.5 p-3.5 rounded-xl bg-bg/40 border border-border text-sm text-text-secondary leading-relaxed"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isCurrent ? 'bg-primary-light' : 'bg-text-muted'}`} />
                          {a}
                        </motion.div>
                      ))}
                    </div>

                    {xray && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-5 pt-5 border-t border-border font-mono text-[11px] text-primary-light/50 space-y-1"
                      >
                        {events.map((evt, j) => (
                          <div key={j}>kafka.send("career-events", {evt});</div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
