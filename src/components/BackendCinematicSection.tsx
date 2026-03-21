import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'

const chipBlocks = Array.from({ length: 54 }, (_, i) => ({
  id: i,
  intensity: ((i * 37) % 100) / 100,
}))

const tracePaths = [
  { id: 'gateway', label: 'API GATEWAY', top: '16%', left: '8%', width: '36%', angle: -6, delay: '0.1s' },
  { id: 'exchange', label: 'RABBIT EXCHANGE', top: '30%', left: '15%', width: '44%', angle: 3, delay: '0.35s' },
  { id: 'partition', label: 'KAFKA PARTITIONS', top: '45%', left: '18%', width: '52%', angle: -2, delay: '0.55s' },
  { id: 'retry', label: 'RETRY / DLQ', top: '60%', left: '25%', width: '40%', angle: 7, delay: '0.75s' },
  { id: 'sink', label: 'DATABASE SINK', top: '75%', left: '36%', width: '34%', angle: -4, delay: '0.95s' },
] as const

const logLines = [
  { level: 'INFO', service: 'gateway', msg: 'request accepted trace=7f3c5a', ms: '12ms' },
  { level: 'INFO', service: 'rabbit', msg: 'route matched key=call.bridge', ms: '4ms' },
  { level: 'INFO', service: 'kafka', msg: 'partition assigned p3 offset=28491', ms: '2ms' },
  { level: 'WARN', service: 'worker', msg: 'retry policy invoked attempt=2', ms: '128ms' },
  { level: 'INFO', service: 'mysql', msg: 'commit successful tx=4e8abf', ms: '18ms' },
  { level: 'INFO', service: 'datadog', msg: 'trace flushed span_count=14', ms: '6ms' },
] as const

const chapters = [
  'Chip Arrival',
  'Core Reveal',
  'Signal Routing',
  'Observability',
] as const

const orbitPackets = [
  { id: 'pk1', top: '22%', left: '18%', size: 8, delay: 0.2, duration: 4.1 },
  { id: 'pk2', top: '36%', left: '78%', size: 10, delay: 0.6, duration: 4.8 },
  { id: 'pk3', top: '68%', left: '24%', size: 7, delay: 1, duration: 3.6 },
  { id: 'pk4', top: '58%', left: '72%', size: 9, delay: 1.4, duration: 4.5 },
] as const

function levelClass(level: (typeof logLines)[number]['level']) {
  if (level === 'WARN') return 'text-amber'
  return 'text-accent'
}

export default function BackendCinematicSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const progress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 24,
    mass: 0.3,
  })

  const chipScale = useTransform(
    progress,
    [0, 0.2, 0.48],
    reduceMotion ? [1, 1, 1] : [1.82, 1.24, 1],
  )
  const chipRotateX = useTransform(
    progress,
    [0, 0.3, 0.6],
    reduceMotion ? [0, 0, 0] : [-20, -8, 0],
  )
  const chipRotateZ = useTransform(
    progress,
    [0, 0.25, 0.5],
    reduceMotion ? [0, 0, 0] : [-10, -3, 0],
  )
  const chipX = useTransform(progress, [0, 0.38], reduceMotion ? [0, 0] : [140, 0])
  const chipY = useTransform(progress, [0, 0.38], reduceMotion ? [0, 0] : [108, 0])
  const chipOpacity = useTransform(progress, [0, 0.18, 0.55], [0.72, 0.86, 1])

  const heroOpacity = useTransform(progress, [0.02, 0.24, 0.38], [1, 1, 0])
  const internalsOpacity = useTransform(progress, [0.24, 0.46, 0.9], [0, 1, 1])
  const chipGlowOpacity = useTransform(progress, [0, 0.28, 0.6], [0.4, 0.75, 1])
  const telemetryOpacity = useTransform(progress, [0.52, 0.72, 1], [0, 1, 1])
  const telemetryX = useTransform(
    progress,
    [0.52, 0.72],
    reduceMotion ? [0, 0] : [36, 0],
  )
  const traceStrength = useTransform(progress, [0.3, 0.75, 1], [0.15, 1, 0.75])
  const metricFill = useTransform(progress, [0.58, 0.9], [0, 1])
  const chapter1 = useTransform(progress, [0, 0.12, 0.22], [0.35, 1, 0.35])
  const chapter2 = useTransform(progress, [0.18, 0.32, 0.48], [0.35, 1, 0.35])
  const chapter3 = useTransform(progress, [0.42, 0.58, 0.74], [0.35, 1, 0.35])
  const chapter4 = useTransform(progress, [0.68, 0.84, 1], [0.35, 1, 0.35])
  const chapterValues = [chapter1, chapter2, chapter3, chapter4]

  return (
    <section id="architecture" ref={sectionRef} className="relative h-[320vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 backend-cinematic-layer" aria-hidden="true">
          <div className="backend-cinematic-radial backend-cinematic-radial-a" />
          <div className="backend-cinematic-radial backend-cinematic-radial-b" />
          <div className="backend-cinematic-grid" />
        </div>

        <div className="container relative h-full py-14 sm:py-20">
          <div className="backend-chapter-rail" aria-hidden="true">
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter}
                className="backend-chapter-item"
                style={{ opacity: chapterValues[index] }}
              >
                <span className="backend-chapter-dot" />
                <span>{chapter}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="max-w-xl relative z-20 backend-hero-copy-shell"
            style={{ opacity: heroOpacity }}
          >
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.32em] text-accent/80 mb-5">
              Backend Silicon Narrative
            </p>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-text mb-6">
              Watch requests become
              <span className="backend-gradient-text block">system intelligence</span>
            </h2>
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              Scroll down to dive from a macro chip view into neon circuit internals where
              gateway routes, queue lanes, and event streams pulse in real time.
            </p>
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center pt-16 sm:pt-24">
            <motion.div
              className="backend-chip-shell"
              style={{
                scale: chipScale,
                rotateX: chipRotateX,
                rotateZ: chipRotateZ,
                x: chipX,
                y: chipY,
                opacity: chipOpacity,
              }}
            >
              <motion.div className="backend-chip-aura" style={{ opacity: chipGlowOpacity }} />

              <div className="backend-chip-plate">
                <div className="backend-chip-topline">
                  <span className="backend-chip-badge">Backend Core v2</span>
                  <span className="text-text-muted/70 text-[10px] sm:text-xs font-mono">
                    TRACE • QUEUE • STREAM • OBSERVE
                  </span>
                </div>

                <div className="backend-chip-gridcells" aria-hidden="true">
                  {chipBlocks.map((block) => (
                    <div
                      key={block.id}
                      className="backend-chip-cell"
                      style={{
                        opacity: 0.2 + block.intensity * 0.7,
                      }}
                    />
                  ))}
                </div>

                <motion.div className="backend-chip-internals" style={{ opacity: internalsOpacity }}>
                  {tracePaths.map((path) => (
                    <motion.div
                      key={path.id}
                      className="backend-trace-line"
                      style={{
                        top: path.top,
                        left: path.left,
                        width: path.width,
                        transform: `rotate(${path.angle}deg)`,
                        opacity: traceStrength,
                      }}
                    >
                      <span className="backend-trace-pulse" style={{ animationDelay: path.delay }} />
                      <span className="backend-trace-label">{path.label}</span>
                    </motion.div>
                  ))}

                  {orbitPackets.map((packet) => (
                    <motion.span
                      key={packet.id}
                      className="backend-orbit-packet"
                      style={{
                        top: packet.top,
                        left: packet.left,
                        width: packet.size,
                        height: packet.size,
                      }}
                      animate={reduceMotion ? undefined : { y: [0, -10, 0], opacity: [0.45, 1, 0.45] }}
                      transition={{
                        repeat: Infinity,
                        duration: packet.duration,
                        delay: packet.delay,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </motion.div>

                <span className="backend-chip-scanline" aria-hidden="true" />
              </div>
            </motion.div>
          </div>

          <motion.aside
            className="backend-observability-panel"
            style={{ opacity: telemetryOpacity, x: telemetryX }}
          >
            <div className="backend-observability-head">
              <p className="text-[10px] uppercase tracking-[0.24em] text-accent/85">Live Trace Tail</p>
              <p className="text-[11px] text-text-muted font-mono">env: production-like-sim</p>
            </div>

            <div className="space-y-2.5 mt-4">
              {logLines.map((line, idx) => (
                <motion.div
                  key={idx}
                  className="backend-log-row"
                  initial={{ opacity: 0.35, x: -4 }}
                  animate={{ opacity: [0.4, 1, 0.7], x: [0, 2, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 3.1,
                    delay: idx * 0.22,
                    ease: 'easeInOut',
                  }}
                >
                  <span className={`font-semibold ${levelClass(line.level)}`}>{line.level}</span>
                  <span className="text-[#7ea4be]">{line.service}</span>
                  <span className="text-[#bfd7eb]">{line.msg}</span>
                  <span className="text-primary-light">{line.ms}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-text-muted">
                <span>Pipeline Health</span>
                <span className="font-mono text-text-secondary">99.94%</span>
              </div>
              <div className="backend-metric-track">
                <motion.span className="backend-metric-fill" style={{ scaleX: metricFill }} />
              </div>
            </div>
          </motion.aside>

          <motion.div
            className="absolute left-0 right-0 bottom-12 sm:bottom-16 max-w-3xl mx-auto px-6"
            style={{ opacity: internalsOpacity }}
          >
            <p className="text-center text-sm sm:text-base text-text-secondary leading-relaxed">
              The scene transitions from macro compute hardware to fine-grained backend lanes,
              making queues, streams, and observability feel like one coherent silicon system.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
