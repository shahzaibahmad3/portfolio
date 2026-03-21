import { useXRayStore } from '../store/xrayStore'

const codeStreams = [
  {
    left: '3%',
    lines: [
      '@RestController',
      '@RequestMapping("/api/v1")',
      'public class CallController {',
      '  @PostMapping("/calls")',
      '  public ResponseEntity<Call>',
      '    initiateCall(@RequestBody',
      '      CallRequest req) {',
      '    return callService',
      '      .initiate(req);',
      '  }',
      '}',
      '',
      'spring.datasource.url=',
      '  jdbc:mysql://primary:3306',
      'spring.redis.host=cache-01',
      'kafka.bootstrap-servers=',
      '  broker-1:9092,broker-2:9092',
    ],
  },
  {
    left: '18%',
    lines: [
      'SELECT c.id, c.caller_id,',
      '  c.status, c.duration',
      'FROM calls c',
      'JOIN virtual_numbers vn',
      '  ON c.vn_id = vn.id',
      'WHERE c.created_at > NOW()',
      '  - INTERVAL 1 DAY',
      'AND c.bu_id IN (1,2,3,4,5)',
      'ORDER BY c.created_at DESC',
      'LIMIT 1000;',
      '',
      'INSERT INTO call_logs',
      '  (call_id, event, ts)',
      'VALUES (?, ?, NOW());',
      '',
      'COMMIT;',
    ],
  },
  {
    left: '38%',
    lines: [
      'kafka.produce("call-events",',
      '  key: "user:12345",',
      '  value: {',
      '    type: "CALL_INITIATED",',
      '    callId: "c-98765",',
      '    bu: "auto_sales",',
      '    provider: "exotel",',
      '    timestamp: 1708934521',
      '  }',
      ');',
      '',
      'consumer.subscribe(',
      '  "call-events",',
      '  "state-changes",',
      '  "webhook-triggers"',
      ');',
    ],
  },
  {
    left: '58%',
    lines: [
      'redis> SET session:u123',
      '  "{token: abc, role: SDE3}"',
      '  EX 3600',
      'redis> GET rate:api:v1:calls',
      '  "847"',
      'redis> INCR rate:api:v1:calls',
      'redis> HSET metrics:daily',
      '  calls_total 104832',
      '  avg_duration_ms 45200',
      '  p99_latency_ms 120',
      '',
      'redis> PUBLISH channel:alerts',
      '  "circuit-breaker:OPEN"',
      'redis> ZADD leaderboard 425',
      '  "shahzaib"',
    ],
  },
  {
    left: '78%',
    lines: [
      'INFO  [main] Application',
      '  Started in 3.2 seconds',
      'INFO  [http-8080-1]',
      '  POST /api/v1/calls 201',
      '  latency=23ms',
      'INFO  [kafka-consumer-1]',
      '  Processed: CALL_INITIATED',
      '  partition=3 offset=847291',
      'WARN  [circuit-breaker]',
      '  Exotel: 3/5 failures',
      '  Switching to Airtel...',
      'INFO  [scheduler]',
      '  VN cleanup: released 12',
      '  numbers back to pool',
      'INFO  [health] All systems',
      '  operational ✓',
    ],
  },
]

const systemNodes = [
  { label: 'API Gateway', x: '12%', y: '15%', delay: '0.3s' },
  { label: 'Load Balancer', x: '45%', y: '8%', delay: '1.1s' },
  { label: 'Call Service', x: '75%', y: '20%', delay: '2.4s' },
  { label: 'MySQL Primary', x: '20%', y: '40%', delay: '0.8s' },
  { label: 'Redis Cache', x: '55%', y: '35%', delay: '1.7s' },
  { label: 'Kafka Broker', x: '82%', y: '45%', delay: '2.9s' },
  { label: 'MongoDB', x: '15%', y: '65%', delay: '0.5s' },
  { label: 'Atlas Engine', x: '48%', y: '60%', delay: '1.4s' },
  { label: 'Webhook Delivery', x: '78%', y: '70%', delay: '2.2s' },
  { label: 'Kavach Service', x: '30%', y: '85%', delay: '0.9s' },
  { label: 'Pub/Sub', x: '60%', y: '82%', delay: '1.9s' },
  { label: 'Monitoring', x: '85%', y: '90%', delay: '3.1s' },
]

export default function SystemLayer() {
  const xray = useXRayStore((s) => s.xray)

  return (
    <div
      className="fixed inset-0 -z-5 overflow-hidden pointer-events-none select-none transition-opacity duration-700"
      style={{ opacity: xray ? 0.22 : 0.015 }}
      aria-hidden="true"
    >
      {codeStreams.map((stream, i) => (
        <div
          key={i}
          className="absolute top-0 w-40 font-mono text-[10px] leading-[1.8] text-primary-light/70 whitespace-pre overflow-hidden"
          style={{
            left: stream.left,
            height: '200vh',
            animation: `code-scroll ${28 + i * 4}s linear infinite`,
          }}
        >
          {[...stream.lines, ...stream.lines, ...stream.lines].map((line, j) => (
            <div key={j} className="opacity-80">{line}</div>
          ))}
        </div>
      ))}

      {systemNodes.map((node) => (
        <div
          key={node.label}
          className="absolute font-mono text-[9px] tracking-wider uppercase text-accent/50 px-2 py-0.5 rounded border border-accent/10"
          style={{
            left: node.x,
            top: node.y,
            animation: 'node-pulse 4s ease-in-out infinite',
            animationDelay: node.delay,
          }}
        >
          [{node.label}]
        </div>
      ))}

      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }}>
        <line x1="12%" y1="15%" x2="45%" y2="8%" stroke="var(--color-primary)" strokeWidth="0.5" strokeDasharray="4 8" className="system-line" />
        <line x1="45%" y1="8%" x2="75%" y2="20%" stroke="var(--color-accent)" strokeWidth="0.5" strokeDasharray="4 8" className="system-line" />
        <line x1="20%" y1="40%" x2="55%" y2="35%" stroke="var(--color-primary)" strokeWidth="0.5" strokeDasharray="4 8" className="system-line" />
        <line x1="55%" y1="35%" x2="82%" y2="45%" stroke="var(--color-green)" strokeWidth="0.5" strokeDasharray="4 8" className="system-line" />
        <line x1="48%" y1="60%" x2="78%" y2="70%" stroke="var(--color-accent)" strokeWidth="0.5" strokeDasharray="4 8" className="system-line" />
        <line x1="15%" y1="65%" x2="48%" y2="60%" stroke="var(--color-primary)" strokeWidth="0.5" strokeDasharray="4 8" className="system-line" />
        <line x1="30%" y1="85%" x2="60%" y2="82%" stroke="var(--color-amber)" strokeWidth="0.5" strokeDasharray="4 8" className="system-line" />
      </svg>
    </div>
  )
}
