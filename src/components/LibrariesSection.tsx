import { motion } from 'framer-motion'
import { libraries } from '../data/projects'
import { Package, Code2 } from 'lucide-react'
import GlassCard from './GlassCard'
import { ScrollTextReveal } from './TextGenerateEffect'

const codeExamples: Record<string, string> = {
  'action-orchestrator': `sdk.ingest(BuEvent.builder()
    .userId("user123")
    .bu("auto_sales")
    .eventName("payment_overdue")
    .build());

List<CtaItem> ctas = sdk.fetch(
    "user123", "tenant_a", "auto_sales");`,
  'webhook-library': `@WebhookTrigger(
    configId = "#{#result.clientId}",
    eventType = "call.log.saved",
    condition = "#{#result.successful}")
public CallLog saveCallLog(
    CreateCallLogRequest req) {
    // Webhook fires automatically
}`,
  'taskweaver': `@Weave("payment-saga")
public class PaymentSagaWeave {
    @Step(order = 1, retry = @Retry(3))
    public void reservePayment(
        PaymentRequest req) {
        ctx.setVariable("id", "RES-123");
    }
    @Compensate("reservePayment")
    public void cancel(PaymentRequest req) {
        // Auto-called on failure
    }
}`,
}

const backendContexts: Record<string, React.ReactNode> = {
  'action-orchestrator': <div className="whitespace-pre">{`// SDK internals
EventStore.persist(event,
  IdempotencyKey.of(eventId));
StateMachine.transition(
  currentState, event);
WeightEngine.expel(
  actionsOverThreshold);
TemporalWorkflow.schedule(
  reminder, delay);`}</div>,
  'webhook-library': <div className="whitespace-pre">{`// Delivery pipeline
HmacSigner.sign(payload,
  SHA256, secret);
RetryPolicy.exponentialBackoff(
  maxAttempts: 5,
  initialDelay: 1s);
SpEL.evaluate(condition,
  context);`}</div>,
  'taskweaver': <div className="whitespace-pre">{`// Task persistence
OutboxPattern.persist(task);
StepExecutor.run(step,
  compensateOnFailure: true);
SignalStore.park(taskId,
  awaitingEvent: "webhook");
DistributedLock.acquire(
  taskId, ttl: 30s);`}</div>,
}

export default function LibrariesSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container">
        <div className="mb-14">
          <ScrollTextReveal text="Internal Libraries" className="text-3xl sm:text-4xl font-bold text-text tracking-tight mb-4" />
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-text-secondary max-w-lg text-base">
            Reusable libraries built from scratch, powering services across CARS24.
          </motion.p>
        </div>

        <div className="space-y-6">
          {libraries.map((lib, i) => {
            const code = codeExamples[lib.id]
            return (
              <motion.div
                key={lib.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <GlassCard
                  className="glass-surface"
                  backContent={backendContexts[lib.id]}
                >
                  <div className="p-7 sm:p-9">
                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-11 h-11 rounded-xl bg-accent-dim border border-accent/20 flex items-center justify-center shrink-0">
                        <Package size={18} className="text-accent" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold font-mono text-text">{lib.name}</h3>
                        <p className="text-sm text-text-secondary leading-relaxed mt-1.5">{lib.description}</p>
                      </div>
                    </div>

                    <div className={`grid gap-7 ${code ? 'lg:grid-cols-2' : ''}`}>
                      <div>
                        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Key Features</h4>
                        <ul className="space-y-2.5">
                          {lib.features.map((f, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {code && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Code2 size={12} className="text-text-muted" />
                            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Usage</h4>
                          </div>
                          <pre className="text-xs font-mono text-text-secondary bg-bg/60 rounded-xl p-5 overflow-x-auto leading-relaxed border border-border">{code}</pre>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border">
                      {lib.tech.map((t) => (
                        <span key={t} className="text-xs font-mono px-3 py-1.5 rounded-lg bg-bg/60 text-text-muted border border-border">{t}</span>
                      ))}
                    </div>
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
