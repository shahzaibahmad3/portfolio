import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { X, Minus, Maximize2, GripHorizontal } from 'lucide-react'
import { useXRayStore } from '../store/xrayStore'
import { useBootStore } from '../store/bootStore'

interface LogLine {
  id: number
  time: string
  level: 'INFO' | 'WARN' | 'DEBUG' | 'ERROR'
  service: string
  message: string
}

const levelColors: Record<LogLine['level'], string> = {
  INFO: '#22d3ee',
  WARN: '#fbbf24',
  DEBUG: '#818cf8',
  ERROR: '#f87171',
}

type SectionKey = 'hero' | 'projects' | 'experience' | 'skills' | 'contact' | 'architecture'

const contextualLogs: Record<SectionKey, Omit<LogLine, 'id' | 'time'>[]> = {
  hero: [
    { level: 'INFO', service: 'boot', message: 'Application started on port 8080' },
    { level: 'INFO', service: 'spring', message: 'Active profiles: production' },
    { level: 'INFO', service: 'hikari', message: 'Connection pool initialized (10)' },
    { level: 'DEBUG', service: 'redis', message: 'Connected to cache-01:6379' },
    { level: 'INFO', service: 'kafka', message: 'Consumer subscribed: call-events' },
  ],
  projects: [
    { level: 'INFO', service: 'call-svc', message: 'POST /api/v1/calls 201 23ms' },
    { level: 'INFO', service: 'vn-pool', message: 'Allocated VN +91-98765... to BU=auto' },
    { level: 'WARN', service: 'circuit', message: 'Exotel: failure 3/5, monitoring' },
    { level: 'INFO', service: 'kafka', message: 'Produced: call.initiated partition=3' },
    { level: 'INFO', service: 'kavach', message: 'Policy enrolled txn=TXN-4829' },
    { level: 'INFO', service: 'atlas', message: 'CTA fetched for user=u1234 bu=auto' },
  ],
  experience: [
    { level: 'INFO', service: 'pipeline', message: 'Processing career event batch' },
    { level: 'INFO', service: 'kafka', message: 'Consumed: career.PROMOTED offset=12' },
    { level: 'DEBUG', service: 'parser', message: 'Achievement count: 5 extracted' },
    { level: 'INFO', service: 'mysql', message: 'INSERT portfolio_experience... OK' },
    { level: 'INFO', service: 'sink', message: '4/5 records persisted' },
  ],
  skills: [
    { level: 'INFO', service: 'registry', message: 'Scanning tech dependencies...' },
    { level: 'DEBUG', service: 'maven', message: 'Resolved: spring-boot-3.2.1' },
    { level: 'INFO', service: 'docker', message: 'Image pulled: redis:7-alpine' },
    { level: 'DEBUG', service: 'k8s', message: 'Pod healthy: call-service-7f3c5a' },
  ],
  architecture: [
    { level: 'INFO', service: 'gateway', message: 'Request routed to call-service' },
    { level: 'INFO', service: 'lb', message: 'Instance selected: pod-3 (round-robin)' },
    { level: 'INFO', service: 'kafka', message: 'Partition assigned: p3 offset=28491' },
    { level: 'WARN', service: 'retry', message: 'Attempt 2/3 for webhook delivery' },
    { level: 'INFO', service: 'mysql', message: 'COMMIT tx=4e8abf latency=18ms' },
    { level: 'INFO', service: 'datadog', message: 'Trace flushed span_count=14' },
  ],
  contact: [
    { level: 'INFO', service: 'api', message: 'POST /api/v1/contact received' },
    { level: 'INFO', service: 'valid', message: 'Payload validated, no violations' },
    { level: 'INFO', service: 'mysql', message: 'INSERT contact_messages... OK' },
    { level: 'INFO', service: 'email', message: 'Notification queued to admin' },
    { level: 'DEBUG', service: 'kafka', message: 'Produced: contact.received' },
  ],
}

const sectionBaseThroughput: Record<SectionKey, number> = {
  hero: 847,
  projects: 2341,
  experience: 1205,
  skills: 678,
  architecture: 3120,
  contact: 156,
}

function initSparkline() {
  return Array.from({ length: 24 }, () => 40 + Math.random() * 50)
}

function AnimatedSparkline({ data, color }: { data: number[]; color: string }) {
  const viewW = 300
  const viewH = 36
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * viewW},${viewH - ((v - min) / range) * viewH}`)
    .join(' ')

  return (
    <svg width="100%" height={36} viewBox={`0 0 ${viewW} ${viewH}`} preserveAspectRatio="none" className="block">
      <defs>
        <linearGradient id="spark-fill-anim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${viewH} ${points} ${viewW},${viewH}`}
        fill="url(#spark-fill-anim)"
      >
        <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
      </polygon>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ transition: 'all 0.4s ease' }}
      />
      {data.length > 0 && (
        <circle
          cx={viewW}
          cy={viewH - ((data[data.length - 1] - min) / range) * viewH}
          r="2.5"
          fill={color}
        >
          <animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  )
}

function getTimeStr() {
  const d = new Date()
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
}

function detectSection(scrollY: number): SectionKey {
  const sections: { id: SectionKey; el: HTMLElement | null }[] = [
    { id: 'projects', el: document.getElementById('projects') },
    { id: 'experience', el: document.getElementById('experience') },
    { id: 'skills', el: document.getElementById('skills') },
    { id: 'architecture', el: document.getElementById('architecture') },
    { id: 'contact', el: document.getElementById('contact') },
  ]

  for (let i = sections.length - 1; i >= 0; i--) {
    const el = sections[i].el
    if (el && scrollY >= el.offsetTop - 300) {
      return sections[i].id
    }
  }
  return 'hero'
}

export default function DatadogPanel() {
  const xray = useXRayStore((s) => s.xray)
  const booted = useBootStore((s) => s.booted)
  const [logs, setLogs] = useState<LogLine[]>([])
  const [section, setSection] = useState<SectionKey>('hero')
  const [minimized, setMinimized] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [sparkData, setSparkData] = useState(initSparkline)
  const [throughput, setThroughput] = useState(847)
  const [p99, setP99] = useState(120)
  const [errRate, setErrRate] = useState(0.06)
  const idCounter = useRef(0)
  const logsEndRef = useRef<HTMLDivElement>(null)

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setSection(detectSection(latest))
  })

  const pushLog = useCallback(() => {
    setSection((currentSection) => {
      const pool = contextualLogs[currentSection]
      const template = pool[idCounter.current % pool.length]
      const newLog: LogLine = {
        id: idCounter.current++,
        time: getTimeStr(),
        ...template,
      }
      setLogs((prev) => [...prev.slice(-18), newLog])
      return currentSection
    })
  }, [])

  useEffect(() => {
    if (!booted || dismissed) return
    pushLog()
    const logTimer = setInterval(pushLog, 2200)

    const sparkTimer = setInterval(() => {
      setSection((currentSection) => {
        const base = sectionBaseThroughput[currentSection]
        const jitter = (Math.random() - 0.5) * base * 0.15
        const newVal = base + jitter
        setThroughput(Math.round(newVal))
        setSparkData((prev) => [...prev.slice(1), 40 + (newVal / 40)])
        setP99(Math.round(80 + Math.random() * 80))
        setErrRate(+(Math.random() * 0.12).toFixed(2))
        return currentSection
      })
    }, 1400)

    return () => {
      clearInterval(logTimer)
      clearInterval(sparkTimer)
    }
  }, [booted, dismissed, pushLog])

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [logs])

  if (!booted || dismissed) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200, damping: 25 }}
      drag
      dragMomentum={false}
      dragElastic={0.05}
      whileDrag={{ scale: 1.02, boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}
      className="fixed bottom-20 right-4 z-40 hidden md:block cursor-grab active:cursor-grabbing"
      style={{
        width: minimized ? 200 : 340,
        opacity: xray ? 1 : 0.6,
        transition: 'opacity 0.4s ease, width 0.3s ease',
      }}
    >
      <div className="rounded-xl border border-border bg-bg/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-surface/50">
          <div className="flex items-center gap-2">
            <GripHorizontal size={10} className="text-text-muted/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-green" style={{ animation: 'pulse-ring 3s infinite' }} />
            <span className="font-mono text-[10px] text-text-muted tracking-wider uppercase">
              Observability
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized(!minimized)}
              className="p-1 text-text-muted hover:text-text transition-colors rounded"
              aria-label={minimized ? 'Expand panel' : 'Minimize panel'}
            >
              {minimized ? <Maximize2 size={10} /> : <Minus size={10} />}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-text-muted hover:text-red transition-colors rounded"
              aria-label="Close panel"
            >
              <X size={10} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {!minimized && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="px-3 py-2 border-b border-border">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[9px] text-text-muted tracking-wider">THROUGHPUT</span>
                  <motion.span
                    key={throughput}
                    initial={{ opacity: 0.5, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono text-[10px] text-accent"
                  >
                    {throughput.toLocaleString()} req/s
                  </motion.span>
                </div>
                <AnimatedSparkline data={sparkData} color="#22d3ee" />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="font-mono text-[8px] text-text-muted block">P99</span>
                      <span className={`font-mono text-[10px] ${p99 < 150 ? 'text-green' : 'text-amber'}`}>
                        {p99}ms
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[8px] text-text-muted block">ERR%</span>
                      <span className={`font-mono text-[10px] ${errRate < 0.1 ? 'text-green' : 'text-amber'}`}>
                        {errRate}%
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[8px] text-text-muted block">SVC</span>
                      <span className="font-mono text-[10px] text-accent">{section}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-[180px] overflow-y-auto px-2 py-1.5 space-y-0.5 scrollbar-thin">
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-1.5 py-0.5 font-mono text-[9px] leading-[1.4]"
                  >
                    <span className="text-text-muted/60 shrink-0 w-[46px]">{log.time}</span>
                    <span
                      className="shrink-0 w-[30px] font-semibold"
                      style={{ color: levelColors[log.level] }}
                    >
                      {log.level}
                    </span>
                    <span className="text-text-muted/70 shrink-0 w-[44px] truncate">{log.service}</span>
                    <span className="text-text-secondary/80 truncate">{log.message}</span>
                  </motion.div>
                ))}
                <div ref={logsEndRef} />
              </div>

              <div className="px-3 py-1.5 border-t border-border flex items-center justify-between">
                <span className="font-mono text-[8px] text-text-muted/50">env: production-sim</span>
                <span className="font-mono text-[8px] text-green/70">● live</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {minimized && (
          <div className="px-3 py-2 flex items-center justify-between">
            <span className="font-mono text-[9px] text-text-muted">{throughput} req/s</span>
            <span className="font-mono text-[9px] text-green">● live</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
