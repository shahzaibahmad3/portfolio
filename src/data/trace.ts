import type { TraceStep } from '../types'

export const traceSteps: TraceStep[] = [
  {
    id: 'client',
    label: 'Client Request',
    description: 'A user opens the CARS24 app — their journey begins here.',
    icon: '📱',
  },
  {
    id: 'api-gateway',
    label: 'API Gateway',
    description:
      'Request hits the gateway — authentication, rate limiting, routing. Built with AWS API Gateway.',
    metric: 'Millions of requests routed daily',
    icon: '🚪',
  },
  {
    id: 'load-balancer',
    label: 'Load Balancer',
    description:
      'Traffic distributed across microservices. Each BU gets the right service instance.',
    icon: '⚖️',
  },
  {
    id: 'microservice',
    label: 'Microservice',
    description:
      'Spring Boot microservices handle business logic — Kavach, Atlas, Calling Platform, each independently deployable.',
    metric: '5+ BUs powered by shared services',
    icon: '⚙️',
  },
  {
    id: 'kafka',
    label: 'Kafka / Message Queue',
    description:
      'Async events flow through Kafka — call events, state changes, webhook triggers. Decoupled and resilient.',
    metric: '100K+ calls/day processed async',
    icon: '🌊',
  },
  {
    id: 'database',
    label: 'Database Layer',
    description:
      'MySQL for transactions, MongoDB for documents, Redis for caching and real-time state.',
    icon: '🗄️',
  },
  {
    id: 'response',
    label: 'Response',
    description:
      'Result flows back — optimized with caching, delivering sub-second latency to the user.',
    metric: 'Substantial latency reduction achieved',
    icon: '✅',
  },
]
