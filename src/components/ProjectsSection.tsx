import { motion } from 'framer-motion'
import { projects } from '../data/projects'
import { Phone, Map, Shield } from 'lucide-react'
import GlassCard from './GlassCard'
import { ScrollTextReveal } from './TextGenerateEffect'
import type { Project } from '../types'

const projectIcons: Record<string, typeof Phone> = {
  'calling-platform': Phone,
  atlas: Map,
  kavach: Shield,
}

const backendContexts: Record<string, React.ReactNode> = {
  'calling-platform': (
    <div className="space-y-1 whitespace-pre">
      {`@PostMapping("/api/v1/calls")
public ResponseEntity<Call>
  initiate(CallRequest req) {
  VirtualNumber vn =
    vnPool.allocate(req.getBu());
  Call call = provider
    .connect(vn, req.getCallee());
  kafka.send("call-events",
    CallEvent.initiated(call));
  return ok(call);
}

// Circuit breaker: Exotel → Airtel
@CircuitBreaker(name = "telephony",
  fallbackMethod = "fallback")

// 100K+ calls/day across 5 BUs`}
    </div>
  ),
  atlas: (
    <div className="space-y-1 whitespace-pre">
      {`// Multi-tenant event ingestion
pubsub.subscribe("events",
  (event) -> {
    String key = event.getTenant()
      + ":" + event.getUserId();
    orchestrator.ingest(
      event, OrderingKey.of(key));
  });

// Parallel CTA fetching
CompletableFuture.allOf(
  fetchHomeCTAs(userId),
  fetchNudges(userId),
  fetchActivity(userId)
).thenCombine(...);`}
    </div>
  ),
  kavach: (
    <div className="space-y-1 whitespace-pre">
      {`// Revenue: ~₹4 Cr/month
@PostMapping("/api/v1/kavach/enroll")
public Policy enroll(
    EnrollRequest req) {
  Policy policy = policyService
    .create(req.getSellerId(),
      req.getTransactionId());
  billingService.charge(policy);
  kafka.send("kavach-events",
    PolicyCreated.of(policy));
  return policy;
}

// Independent service, clean APIs`}
    </div>
  ),
}

function ProjectCard({ project, index, featured }: { project: Project; index: number; featured?: boolean }) {
  const Icon = projectIcons[project.id] ?? Phone

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className={featured ? 'sm:col-span-2' : ''}
    >
      <GlassCard
        className="glass-surface h-full"
        backContent={backendContexts[project.id]}
      >
        <div className="p-7 sm:p-9">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-primary-dim border border-primary/20 flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-colors">
                <Icon size={18} className="text-primary-light" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text">{project.title}</h3>
                <p className="text-sm text-text-muted">{project.subtitle}</p>
              </div>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-primary-dim border border-primary/20 text-base font-bold font-mono text-primary-light shrink-0">
              {project.metric}
              <span className="text-xs font-normal ml-1.5 text-text-muted">{project.metricLabel}</span>
            </div>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed mb-6">{project.problem}</p>

          <div className={`grid gap-5 mb-6 ${featured ? 'sm:grid-cols-2' : ''}`}>
            <div>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Architecture</h4>
              <p className="text-sm text-text-secondary leading-relaxed">{project.design}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Scale & Impact</h4>
              <p className="text-sm text-text-secondary leading-relaxed">{project.scale} {project.impact}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="text-xs font-mono px-3 py-1.5 rounded-lg bg-bg/60 text-text-muted border border-border hover:border-border-hover transition-colors">
                {t}
              </span>
            ))}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-24 sm:py-32">
      <div className="container">
        <div className="mb-14">
          <ScrollTextReveal text="Flagship Projects" className="text-3xl sm:text-4xl font-bold text-text tracking-tight mb-4" />
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-text-secondary max-w-lg text-base">
            Platforms built at CARS24. Toggle X-Ray to see the code running behind each project.
          </motion.p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}
