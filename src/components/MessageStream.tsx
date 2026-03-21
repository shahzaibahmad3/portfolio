import { useXRayStore } from '../store/xrayStore'
import { useBootStore } from '../store/bootStore'

const typeColors: Record<string, string> = {
  kafka: '#22d3ee',
  rabbit: '#fbbf24',
  redis: '#f87171',
  mysql: '#34d399',
  api: '#818cf8',
}

const messagePool = [
  { text: 'call.initiated', type: 'kafka' },
  { text: 'vn.allocated', type: 'kafka' },
  { text: 'payment.captured', type: 'rabbit' },
  { text: 'session:u1234', type: 'redis' },
  { text: 'INSERT calls', type: 'mysql' },
  { text: 'POST /api/v1/calls', type: 'api' },
  { text: 'circuit.open', type: 'kafka' },
  { text: 'policy.enrolled', type: 'rabbit' },
  { text: 'cache:hit rate=97%', type: 'redis' },
  { text: 'SELECT orders', type: 'mysql' },
  { text: 'webhook.fired', type: 'kafka' },
  { text: 'GET /health', type: 'api' },
  { text: 'cta.delivered', type: 'rabbit' },
  { text: 'rate_limit:api', type: 'redis' },
  { text: 'UPDATE vn_pool', type: 'mysql' },
  { text: 'state.changed', type: 'kafka' },
]

const sinkNodes = [
  { icon: '⛁', label: 'DB', x: 4, y: '25%', type: 'db' },
  { icon: '◆', label: 'Cache', x: 4, y: '50%', type: 'cache' },
  { icon: '≋', label: 'Queue', x: 4, y: '75%', type: 'queue' },
]

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

const shuffled = (() => {
  const arr = messagePool.map((msg, i) => ({ ...msg, origIndex: i }))
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(i * 31 + 17) * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
})()

const FALL_DURATION = 22

const delays = (() => {
  const result: number[] = []
  let cumulative = 0
  for (let i = 0; i < shuffled.length; i++) {
    result.push(cumulative)
    const gap = 1.6 + seededRandom(i * 41 + 53) * 2.8
    cumulative += gap
  }
  return result
})()

export default function MessageStream() {
  const xray = useXRayStore((s) => s.xray)
  const booted = useBootStore((s) => s.booted)

  if (!booted) return null

  return (
    <div
      className="fixed left-0 top-0 bottom-0 z-30 pointer-events-none select-none hidden lg:block"
      style={{
        width: 90,
        opacity: xray ? 0.85 : 0.35,
        transition: 'opacity 0.5s ease',
      }}
      aria-hidden="true"
    >
      <div className="absolute left-[28px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

      {sinkNodes.map((node) => (
        <div
          key={node.type}
          className="absolute font-mono text-[9px] flex items-center gap-1"
          style={{ left: node.x, top: node.y, color: 'var(--color-text-muted)' }}
        >
          <span className="text-[11px]">{node.icon}</span>
          <span className="tracking-wider">{node.label}</span>
        </div>
      ))}

      {shuffled.map((msg, i) => {
        const color = typeColors[msg.type]
        return (
          <div
            key={msg.origIndex}
            className="absolute flex items-center gap-1.5 message-fall"
            style={{
              left: 22,
              animationDuration: `${FALL_DURATION}s`,
              animationDelay: `${delays[i]}s`,
            }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                backgroundColor: color,
                boxShadow: `0 0 8px ${color}60`,
              }}
            />
            <span
              className="font-mono text-[8px] tracking-wide whitespace-nowrap"
              style={{ color: `${color}cc` }}
            >
              {msg.text}
            </span>
          </div>
        )
      })}

      <div className="absolute left-2 bottom-4 font-mono text-[7px] text-text-muted tracking-widest uppercase">
        <span className="text-accent/60">KAFKA</span>
        <span className="text-text-muted/30 mx-0.5">|</span>
        <span className="text-amber/60">RABBIT</span>
      </div>
    </div>
  )
}
