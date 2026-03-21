import { motion } from 'framer-motion'
import { traceSteps } from '../data/trace'
import { Smartphone, DoorOpen, Scale, Cog, Waves, Database, CheckCircle2 } from 'lucide-react'
import { ScrollTextReveal } from './TextGenerateEffect'
import { useXRayStore } from '../store/xrayStore'

const stepIcons: Record<string, typeof Smartphone> = {
  client: Smartphone,
  'api-gateway': DoorOpen,
  'load-balancer': Scale,
  microservice: Cog,
  kafka: Waves,
  database: Database,
  response: CheckCircle2,
}

const codeSnippets: Record<string, string> = {
  client: 'fetch("/api/v1/calls", { method: "POST" })',
  'api-gateway': 'gateway.route("/api/**").filter(auth, rateLimit)',
  'load-balancer': 'upstream.selectInstance(roundRobin, healthCheck)',
  microservice: 'callService.initiate(req) → kafka.produce(event)',
  kafka: 'consumer.poll("call-events") → process(batch)',
  database: 'INSERT INTO calls (...) VALUES (?); COMMIT;',
  response: 'return ResponseEntity.ok(call); // latency: 23ms',
}

export default function ArchitectureFlow() {
  const xray = useXRayStore((s) => s.xray)

  return (
    <section id="architecture" className="py-24 sm:py-32">
      <div className="container">
        <div className="mb-14">
          <ScrollTextReveal text="Trace a Request" className="text-3xl sm:text-4xl font-bold text-text tracking-tight mb-4" />
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-text-secondary max-w-lg text-base">
            Follow a request through the distributed systems I've built.
          </motion.p>
        </div>

        <div className="relative max-w-2xl mx-auto">
          {traceSteps.map((step, i) => {
            const Icon = stepIcons[step.id] ?? Cog
            const isLast = i === traceSteps.length - 1
            const isFirst = i === 0
            const snippet = codeSnippets[step.id]

            return (
              <div key={step.id} className="relative">
                {!isLast && (
                  <div className="absolute left-6 sm:left-7 top-14 bottom-0 w-px overflow-hidden" aria-hidden="true">
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: '100%' }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="w-full bg-gradient-to-b from-primary/40 to-accent/20"
                    />
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative flex gap-5 sm:gap-6 pb-8 sm:pb-10"
                >
                  <div className="relative shrink-0 z-10">
                    <motion.div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all ${
                        isLast ? 'bg-green-dim border-2 border-green/30'
                          : isFirst ? 'bg-primary-dim border-2 border-primary/30'
                          : 'bg-surface-elevated border border-border'
                      }`}
                      whileInView={
                        isFirst || isLast
                          ? { boxShadow: ['0 0 0 0 rgba(99,102,241,0)', '0 0 20px 4px rgba(99,102,241,0.15)', '0 0 0 0 rgba(99,102,241,0)'] }
                          : {}
                      }
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      viewport={{ once: false }}
                    >
                      <Icon size={20} className={isLast ? 'text-green' : isFirst ? 'text-primary-light' : 'text-text-muted'} />
                    </motion.div>
                  </div>

                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="text-lg font-semibold text-text">{step.label}</h3>
                      {step.metric && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          className="text-xs font-mono text-green px-2.5 py-1 rounded-lg bg-green-dim border border-green/20"
                        >
                          {step.metric}
                        </motion.span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed max-w-md">{step.description}</p>

                    {xray && snippet && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 font-mono text-[11px] text-primary-light/50 bg-bg/40 border border-border rounded-lg px-3 py-2"
                      >
                        {snippet}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
