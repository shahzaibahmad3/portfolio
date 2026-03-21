import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: 'calling-platform',
    title: 'Call Bridge',
    subtitle: 'Scalable Communication Middleware',
    problem:
      'The car pickup flow urgently needed a calling solution. Built the first version in just one week to unblock operations.',
    design:
      'Spring Boot middleware connecting LMS with telephony providers (Exotel, Airtel). Manages virtual number allocation/deallocation, call routing by caller type, call logging across MySQL and MongoDB, and event-driven notifications via RabbitMQ.',
    scale:
      '5+ business units across CARS24 India, handling 100K+ calls/day. Multi-vendor telephony with Resilience4j circuit breakers.',
    impact:
      'Evolved from a single-use solution into a shared, out-of-the-box calling platform with plug-and-play webhooks, replacing fragmented calling solutions across the org.',
    tech: ['Java 21', 'Spring Boot 3', 'RabbitMQ', 'MySQL', 'MongoDB', 'Redis', 'GCP Pub/Sub'],
    metric: '100K+',
    metricLabel: 'calls/day',
    icon: '📞',
  },
  {
    id: 'atlas',
    title: 'Atlas',
    subtitle: 'Action Orchestration Engine',
    problem:
      'Multiple business units needed dynamic, state-aware homepage experiences — CTAs, snackbars, and activity pages — but each was building custom solutions in silos.',
    design:
      'Multi-tenant event ingestion service with API-key-based auth. Events flow through GCP Pub/Sub with ordering keys (tenant+BU+userId+entityId), processed by the c24-action-orchestrator SDK into scored, weighted CTA lists. Parallel CTA fetching via CompletableFuture.',
    scale:
      'Multi-BU platform across CARS24 powering super-homepage CTAs, nudges, snackbars, and activity pages for millions of users.',
    impact:
      'Improved UX and visibility with targeted, state-aware experiences across all business units.',
    tech: ['Java 21', 'Spring Boot 3', 'GCP Pub/Sub', 'MongoDB', 'Gradle'],
    metric: 'Multi-BU',
    metricLabel: 'platform',
    icon: '🗺️',
  },
  {
    id: 'kavach',
    title: 'Kavach',
    subtitle: 'Seller Protection Policy',
    problem:
      'CARS24 needed a revenue-generating protection service for sellers to safeguard transactions and build trust.',
    design:
      'Architected as an independent service with clean API boundaries — designed for seamless integration across existing flows without disrupting core systems.',
    scale:
      'Deployed across CARS24 India operations, serving thousands of transactions daily.',
    impact: '~₹4 Cr/month revenue contribution.',
    tech: ['Java', 'Spring Boot', 'MySQL', 'Kafka'],
    metric: '₹4Cr+',
    metricLabel: '/month revenue',
    icon: '🛡️',
  },
]

export interface Library {
  id: string
  name: string
  description: string
  features: string[]
  tech: string[]
}

export const libraries: Library[] = [
  {
    id: 'action-orchestrator',
    name: 'c24-action-orchestrator',
    description:
      'Config-driven SDK that transforms domain events into scored, ordered CTA lists. Uses event sourcing with state management — events are ingested, persisted with idempotency, and transformed into CTA states with weight-based expulsion, contextual scoring, and recency decay.',
    features: [
      'State-centric YAML configuration with inheritance',
      'Temporal workflows for ingestion, retries, reminders, and expiry',
      'Weight-based and cross-actionType expulsion engine',
      'Pre/post hooks for validation and enrichment',
    ],
    tech: ['Java 21', 'Spring Boot 3', 'MongoDB', 'Temporal'],
  },
  {
    id: 'webhook-library',
    name: 'c24-webhook-library',
    description:
      'Highly configurable webhook delivery library enabling reliable, event-driven integrations across internal platforms. Supports @WebhookTrigger annotation, dynamic {{VARIABLE}} substitution, HMAC signatures, and SpEL-based conditional triggers.',
    features: [
      'Annotation-driven: @EnableC24Webhooks + @WebhookTrigger',
      'Reliable delivery with exponential backoff retries',
      'HMAC signatures (SHA256/384/512) for security',
      'Built-in management UI and REST API for webhook CRUD',
    ],
    tech: ['Java 21', 'Spring Boot 3', 'MongoDB', 'Apache HTTP Client 5'],
  },
  {
    id: 'taskweaver',
    name: 'TaskWeaver',
    description:
      'Lightweight, persistent, step-based task execution library. Tasks survive restarts and crashes — inspired by the Outbox pattern and Temporal. Supports compensation (Saga pattern), signals for external event parking, and distributed-safe execution.',
    features: [
      'Persistent tasks with ordered step execution',
      'Saga-style compensation: @Compensate rollback on failure',
      'Signals: park tasks waiting for external events (e.g. webhooks)',
      'Configurable retries: exponential, linear, fixed, or custom',
    ],
    tech: ['Java 17+', 'Spring Boot 3', 'MongoDB', 'Micrometer'],
  },
]
