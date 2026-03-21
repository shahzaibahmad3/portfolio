import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { GripHorizontal, RotateCcw } from 'lucide-react'
import { timeline } from '../data/timeline'

type FlowStage = 'connecting' | 'queued' | 'processing' | 'saving' | 'saved'
type PanelState = 'normal' | 'minimized' | 'closed'
const WHEEL_STEP_THRESHOLD = 70
const TOUCH_STEP_THRESHOLD = 56
const WHEEL_STEP_COOLDOWN_MS = 380
const BOUNDARY_HOLD_MS = 720

function stageTone(stage: FlowStage) {
  if (stage === 'processing') return 'text-accent'
  if (stage === 'saving' || stage === 'saved') return 'text-green'
  if (stage === 'queued') return 'text-primary-light'
  return 'text-text-secondary'
}

function getPipelineSnapshot(activeIndex: number, total: number) {
  const normalizedProgress = total <= 1 ? 1 : activeIndex / (total - 1)

  if (normalizedProgress <= 0) {
    return { stage: 'connecting' as const, savedCount: 0, stageRail: 0.08 }
  }

  if (normalizedProgress < 0.34) {
    return { stage: 'queued' as const, savedCount: 0, stageRail: 0.3 }
  }

  if (normalizedProgress < 0.68) {
    return {
      stage: 'processing' as const,
      savedCount: Math.max(0, activeIndex - 1),
      stageRail: Math.max(0.44, normalizedProgress),
    }
  }

  if (normalizedProgress < 1) {
    return { stage: 'saving' as const, savedCount: activeIndex, stageRail: Math.max(0.76, normalizedProgress) }
  }

  return { stage: 'saved' as const, savedCount: total, stageRail: 1 }
}

interface JsonToken {
  text: string
  type: 'key' | 'string' | 'number' | 'boolean' | 'null' | 'bracket' | 'punctuation' | 'indent'
}

function tokenizeLine(line: string): JsonToken[] {
  const tokens: JsonToken[] = []
  const leadingSpaces = line.match(/^(\s*)/)?.[1] ?? ''
  if (leadingSpaces) tokens.push({ text: leadingSpaces, type: 'indent' })

  const rest = line.slice(leadingSpaces.length)
  const regex = /("(?:[^"\\]|\\.)*")\s*:\s*|("(?:[^"\\]|\\.)*")|(-?\d+(?:\.\d+)?)|(\btrue\b|\bfalse\b)|(\bnull\b)|([{}[\]])|([,:])|\s+/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(rest)) !== null) {
    if (match[1] !== undefined) {
      tokens.push({ text: match[1], type: 'key' })
      tokens.push({ text: ': ', type: 'punctuation' })
    } else if (match[2] !== undefined) {
      tokens.push({ text: match[2], type: 'string' })
    } else if (match[3] !== undefined) {
      tokens.push({ text: match[3], type: 'number' })
    } else if (match[4] !== undefined) {
      tokens.push({ text: match[4], type: 'boolean' })
    } else if (match[5] !== undefined) {
      tokens.push({ text: match[5], type: 'null' })
    } else if (match[6] !== undefined) {
      tokens.push({ text: match[6], type: 'bracket' })
    } else if (match[7] !== undefined) {
      tokens.push({ text: match[7], type: 'punctuation' })
    }
  }

  return tokens
}

const tokenColorMap: Record<JsonToken['type'], string> = {
  key: '#42e8ff',
  string: '#34d399',
  number: '#fbbf24',
  boolean: '#818cf8',
  null: '#64748b',
  bracket: '#94a3b8',
  punctuation: '#64748b',
  indent: 'transparent',
}

function JsonLine({ tokens, lineNum, delay }: { tokens: JsonToken[]; lineNum: number; delay: number }) {
  return (
    <motion.div
      className="json-viewer-line"
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22, delay }}
    >
      <span className="json-viewer-linenum">{lineNum}</span>
      <span className="json-viewer-code">
        {tokens.map((tok, i) => (
          <span key={i} style={{ color: tokenColorMap[tok.type] }}>
            {tok.text}
          </span>
        ))}
      </span>
    </motion.div>
  )
}

function PanelDots({ onClose, onMinimize, onMaxToggle }: { onClose: () => void; onMinimize: () => void; onMaxToggle: () => void }) {
  return (
    <div className="flex items-center gap-[7px] group/dots" role="group" aria-label="Window controls" onDoubleClick={(e) => e.stopPropagation()}>
      <button onClick={(e) => { e.stopPropagation(); onClose() }} className="w-[11px] h-[11px] rounded-full bg-[#ff5f57] hover:brightness-110 transition-all flex items-center justify-center" aria-label="Close">
        <span className="text-[8px] font-black leading-none text-black/70 opacity-0 group-hover/dots:opacity-100 transition-opacity select-none">×</span>
      </button>
      <button onClick={(e) => { e.stopPropagation(); onMinimize() }} className="w-[11px] h-[11px] rounded-full bg-[#febd2e] hover:brightness-110 transition-all flex items-center justify-center" aria-label="Minimize">
        <span className="text-[9px] font-black leading-none text-black/70 opacity-0 group-hover/dots:opacity-100 transition-opacity select-none">−</span>
      </button>
      <button onClick={(e) => { e.stopPropagation(); onMaxToggle() }} className="w-[11px] h-[11px] rounded-full bg-[#28c940] hover:brightness-110 transition-all flex items-center justify-center" aria-label="Maximize">
        <span className="text-[6px] font-black leading-none text-black/70 opacity-0 group-hover/dots:opacity-100 transition-opacity select-none">↗</span>
      </button>
    </div>
  )
}

function PanelTitlebar({
  title,
  onClose,
  onMinimize,
  onMaxToggle,
  badge,
}: {
  title: string
  onClose: () => void
  onMinimize: () => void
  onMaxToggle: () => void
  badge?: string
}) {
  return (
    <div className="panel-titlebar">
      <div className="panel-titlebar-left">
        <PanelDots onClose={onClose} onMinimize={onMinimize} onMaxToggle={onMaxToggle} />
        <span className="panel-titlebar-title">{title}</span>
      </div>
      <div className="panel-titlebar-right">
        {badge && <span className="panel-titlebar-badge">{badge}</span>}
        <GripHorizontal size={12} className="text-text-muted/30 cursor-grab active:cursor-grabbing" />
      </div>
    </div>
  )
}

function JsonViewer({ json, id, onClose, onMinimize, onMaxToggle, isMinimized }: {
  json: string; id: string; onClose: () => void; onMinimize: () => void; onMaxToggle: () => void; isMinimized: boolean
}) {
  const lines = json.split('\n')

  return (
    <div className="json-viewer">
      <div className="json-viewer-titlebar">
        <div className="panel-titlebar-left">
          <PanelDots onClose={onClose} onMinimize={onMinimize} onMaxToggle={onMaxToggle} />
          <span className="json-viewer-filename">experience_event.json</span>
        </div>
        <div className="panel-titlebar-right">
          <span className="json-viewer-badge">JSON</span>
          <GripHorizontal size={12} className="text-text-muted/30 cursor-grab active:cursor-grabbing" />
        </div>
      </div>
      {!isMinimized && (
        <div className="json-viewer-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {lines.map((line, i) => (
                <JsonLine key={`${id}-${i}`} tokens={tokenizeLine(line)} lineNum={i + 1} delay={i * 0.025} />
              ))}
            </motion.div>
          </AnimatePresence>
          <span className="json-viewer-cursor" />
        </div>
      )}
    </div>
  )
}

export default function ExperiencePipelineSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const wheelDeltaRef = useRef(0)
  const lastStepAtRef = useRef(0)
  const boundaryHoldUntilRef = useRef(0)
  const activeIndexRef = useRef(0)
  const touchStartYRef = useRef<number | null>(null)
  const reduceMotion = useReducedMotion()
  const experiences = useMemo(() => timeline.slice().reverse(), [])
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [activeIndex, setActiveIndex] = useState(0)

  const [panelStates, setPanelStates] = useState<Record<string, PanelState>>({})
  const [maximizedPanel, setMaximizedPanel] = useState<string | null>(null)
  const getPState = (id: string): PanelState => panelStates[id] ?? 'normal'
  const closePanel = useCallback((id: string) => {
    setPanelStates(p => ({ ...p, [id]: 'closed' }))
    setMaximizedPanel(prev => prev === id ? null : prev)
  }, [])
  const minimizePanel = useCallback((id: string) =>
    setPanelStates(p => ({ ...p, [id]: (p[id] ?? 'normal') === 'minimized' ? 'normal' : 'minimized' })), [])
  const maxTogglePanel = useCallback((id: string) =>
    setMaximizedPanel(prev => prev === id ? null : id), [])
  const resetPanels = useCallback(() => { setPanelStates({}); setMaximizedPanel(null) }, [])

  useEffect(() => {
    if (!maximizedPanel) return
    document.body.style.overflow = 'hidden'
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setMaximizedPanel(null) }
    window.addEventListener('keydown', onEsc)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onEsc)
    }
  }, [maximizedPanel])

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  useEffect(() => {
    const canPinViewport = () => {
      const section = sectionRef.current
      if (!section) return false

      const rect = section.getBoundingClientRect()
      const topLockBoundary = 96
      const bottomLockBoundary = window.innerHeight - 96

      return rect.top <= topLockBoundary && rect.bottom >= bottomLockBoundary
    }

    const releaseViewport = (step: -1 | 1) => {
      lastStepAtRef.current = window.performance.now()
      boundaryHoldUntilRef.current = 0
      wheelDeltaRef.current = 0
      touchStartYRef.current = null

      window.scrollBy({
        top: step > 0 ? Math.max(window.innerHeight * 0.78, 320) : -Math.max(window.innerHeight * 0.78, 320),
        behavior: 'smooth',
      })
    }

    const advanceExperience = (step: -1 | 1) => {
      setDirection(step > 0 ? 'forward' : 'backward')
      setActiveIndex((current) => {
        const next = Math.min(experiences.length - 1, Math.max(0, current + step))
        boundaryHoldUntilRef.current =
          next === 0 || next === experiences.length - 1
            ? window.performance.now() + BOUNDARY_HOLD_MS
            : 0
        activeIndexRef.current = next
        return next
      })
      lastStepAtRef.current = window.performance.now()
      wheelDeltaRef.current = 0
    }

    const handleWheel = (event: WheelEvent) => {
      if (maximizedPanel || !canPinViewport()) {
        wheelDeltaRef.current = 0
        return
      }

      if (Math.abs(event.deltaY) < 1) return

      const stepDirection = event.deltaY > 0 ? 1 : -1
      const currentIndex = activeIndexRef.current
      const nextIndex = Math.min(experiences.length - 1, Math.max(0, currentIndex + stepDirection))
      const canMove = nextIndex !== currentIndex

      if (!canMove) {
        event.preventDefault()
        const now = window.performance.now()
        if (now < boundaryHoldUntilRef.current) {
          wheelDeltaRef.current = 0
          return
        }

        if (now - lastStepAtRef.current >= WHEEL_STEP_COOLDOWN_MS) {
          releaseViewport(stepDirection as -1 | 1)
        }
        wheelDeltaRef.current = 0
        return
      }

      event.preventDefault()

      const now = window.performance.now()
      if (now - lastStepAtRef.current < WHEEL_STEP_COOLDOWN_MS) return

      if (wheelDeltaRef.current !== 0 && Math.sign(wheelDeltaRef.current) !== stepDirection) {
        wheelDeltaRef.current = 0
      }

      wheelDeltaRef.current += event.deltaY

      if (Math.abs(wheelDeltaRef.current) < WHEEL_STEP_THRESHOLD) return

      advanceExperience(stepDirection as -1 | 1)
    }

    const handleTouchStart = (event: TouchEvent) => {
      if (!canPinViewport()) {
        touchStartYRef.current = null
        return
      }

      touchStartYRef.current = event.touches[0]?.clientY ?? null
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (maximizedPanel || !canPinViewport() || touchStartYRef.current === null) return

      const currentTouchY = event.touches[0]?.clientY
      if (typeof currentTouchY !== 'number') return

      const deltaY = touchStartYRef.current - currentTouchY
      if (Math.abs(deltaY) < TOUCH_STEP_THRESHOLD) return

      const stepDirection = deltaY > 0 ? 1 : -1
      const currentIndex = activeIndexRef.current
      const nextIndex = Math.min(experiences.length - 1, Math.max(0, currentIndex + stepDirection))

      if (nextIndex === currentIndex) {
        event.preventDefault()
        const now = window.performance.now()
        if (now < boundaryHoldUntilRef.current) {
          touchStartYRef.current = currentTouchY
          return
        }

        if (now - lastStepAtRef.current >= WHEEL_STEP_COOLDOWN_MS) {
          releaseViewport(stepDirection as -1 | 1)
        }
        touchStartYRef.current = currentTouchY
        return
      }

      event.preventDefault()
      advanceExperience(stepDirection as -1 | 1)
      touchStartYRef.current = currentTouchY
    }

    const handleTouchEnd = () => {
      touchStartYRef.current = null
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [experiences.length, maximizedPanel])

  const { stage, savedCount, stageRail } = useMemo(
    () => getPipelineSnapshot(activeIndex, experiences.length),
    [activeIndex, experiences.length],
  )

  const activeExperience = experiences[activeIndex]
  const queuedItems = experiences.filter((_, i) => i > activeIndex)
  const consumedItems = experiences.filter((_, i) => i <= activeIndex)

  const jsonPayload = useMemo(() => {
    const e = activeExperience
    const obj = {
      event: 'career.process',
      status: stage,
      payload: {
        company: e.company,
        role: e.role,
        period: e.period,
        location: e.location,
        achievements: e.achievements.length,
        ...(e.award ? { award: e.award } : {}),
      },
      meta: {
        partition: activeIndex % 3,
        offset: activeIndex + 101,
        saved: `${savedCount}/${experiences.length}`,
        latency_ms: 8 + activeIndex * 3 + Math.floor(e.achievements.length * 1.5),
      },
    }
    return JSON.stringify(obj, null, 2)
  }, [activeExperience, stage, activeIndex, savedCount, experiences.length])

  const showQueue = getPState('queue') !== 'closed'
  const showProcessor = getPState('processor') !== 'closed'
  const showJson = getPState('json') !== 'closed'
  const isQueueMin = getPState('queue') === 'minimized'
  const isProcessorMin = getPState('processor') === 'minimized'
  const isJsonMin = getPState('json') === 'minimized'
  const anyModified = Object.values(panelStates).some(s => s && s !== 'normal') || maximizedPanel !== null

  return (
    <section id="experience" ref={sectionRef} className="relative min-h-screen py-16 sm:py-20">
      <div id="architecture" className="absolute -top-24" aria-hidden="true" />

      <div className="min-h-screen overflow-hidden">
        <div className="container relative flex min-h-screen flex-col justify-center gap-6 py-14 sm:py-16">
          {/* Header */}
          <div className="max-w-4xl">
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-accent/80 mb-4">
              Experience Processing Pipeline
            </p>
            <h2 className="text-2xl sm:text-3xl xl:text-4xl font-semibold tracking-tight leading-[1.18] mb-4">
              Career events flow through the pipeline
            </h2>
            <p className="text-text-secondary text-sm sm:text-base max-w-3xl leading-relaxed">
              Scroll to process events. Drag panels to rearrange. Close and restore with the reset button.
            </p>
          </div>

          {/* Stage strip + reset */}
          <div className="flex items-center gap-3">
            <div className="exp-stage-strip flex-1">
              <span className="exp-stage-label">
                {direction === 'forward' ? '▶' : '◀'} {direction.toUpperCase()}
              </span>
              <span className={`exp-stage-badge ${stageTone(stage)}`}>{stage.toUpperCase()}</span>
              <div className="exp-stage-rail" aria-hidden="true">
                <span className="exp-stage-rail-track" />
                <motion.span className="exp-stage-rail-fill" style={{ scaleX: stageRail }} />
              </div>
            </div>
            {anyModified && (
              <motion.button
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={resetPanels}
                className="flex items-center gap-1.5 text-[11px] font-mono text-accent/80 hover:text-accent px-3 py-1.5 rounded-lg border border-accent/20 hover:border-accent/40 bg-accent/5 transition-all duration-200 hover:scale-[1.06] active:scale-[0.95]"
              >
                <RotateCcw size={11} />
                Reset
              </motion.button>
            )}
          </div>

          {/* 3-column layout: Queue | Processor | JSON View */}
          <div className="exp-pipeline-grid" ref={gridRef}>
            {/* LEFT — Message Queue */}
            <AnimatePresence>
              {showQueue && (
                <motion.div
                  className="exp-col exp-col-queue"
                  drag
                  dragConstraints={gridRef}
                  dragElastic={0.08}
                  dragMomentum={false}
                  whileDrag={{ zIndex: 50, boxShadow: '0 20px 60px rgba(0,0,0,0.45)' }}
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                >
                  <PanelTitlebar title="Message Queue" onClose={() => closePanel('queue')} onMinimize={() => minimizePanel('queue')} onMaxToggle={() => maxTogglePanel('queue')} />
                  {!isQueueMin && (
                    <>
                      <div className="exp-queue-vertical">
                        <AnimatePresence mode="popLayout">
                          {queuedItems.map((item) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 30, scale: 0.85 }}
                              transition={{ duration: 0.35 }}
                              className="exp-queue-card"
                            >
                              <span className="font-medium text-[13px] leading-snug">{item.company}</span>
                              <span className="text-[11px] text-text-muted leading-snug">{item.role}</span>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        {queuedItems.length === 0 && (
                          <p className="text-xs text-text-muted italic py-3 text-center">Queue empty</p>
                        )}
                      </div>
                      <div className="mt-auto pt-2 text-[10px] font-mono text-text-muted">
                        {queuedItems.length} pending · {consumedItems.length} consumed
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* CENTER — Processor */}
            <AnimatePresence>
              {showProcessor && (
                <motion.div
                  className="exp-col exp-col-processor"
                  drag
                  dragConstraints={gridRef}
                  dragElastic={0.08}
                  dragMomentum={false}
                  whileDrag={{ zIndex: 50, boxShadow: '0 20px 60px rgba(0,0,0,0.45)' }}
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                >
                  <PanelTitlebar title="Processor" onClose={() => closePanel('processor')} onMinimize={() => minimizePanel('processor')} onMaxToggle={() => maxTogglePanel('processor')} badge={stage.toUpperCase()} />
                  {!isProcessorMin && (
                    <div className="p-4 sm:p-5">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeExperience.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div>
                              <h3 className="text-xl sm:text-2xl font-bold leading-tight">{activeExperience.company}</h3>
                              <p className="text-base text-text-secondary mt-2">{activeExperience.role}</p>
                            </div>
                            <span className={`text-[10px] font-mono px-2 py-1 rounded-md border border-border/40 bg-surface/50 ${stageTone(stage)} uppercase tracking-wider`}>
                              {stage}
                            </span>
                          </div>
                          <p className="text-sm text-text-muted mb-3">
                            {activeExperience.period} · {activeExperience.location}
                          </p>

                          <div className="space-y-2.5">
                            {activeExperience.achievements.map((achievement) => (
                              <div key={achievement} className="exp-achievement-row">
                                <span className="exp-achievement-dot" />
                                <span>{achievement}</span>
                              </div>
                            ))}
                          </div>

                          {activeExperience.metric && (
                            <div className="mt-5 flex items-center gap-2 text-[11px] font-mono text-accent/90 bg-accent/8 border border-accent/15 rounded-lg px-3 py-2 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                              {activeExperience.metric}
                            </div>
                          )}

                          {activeExperience.award && (
                            <div className="exp-award-chip">{activeExperience.award}</div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* RIGHT — JSON View */}
            <AnimatePresence>
              {showJson && (
                <motion.div
                  className="exp-col exp-col-json"
                  drag
                  dragConstraints={gridRef}
                  dragElastic={0.08}
                  dragMomentum={false}
                  whileDrag={{ zIndex: 50, boxShadow: '0 20px 60px rgba(0,0,0,0.45)' }}
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                >
                  <JsonViewer
                    json={jsonPayload}
                    id={`${activeExperience.id}-${stage}`}
                    onClose={() => closePanel('json')}
                    onMinimize={() => minimizePanel('json')}
                    onMaxToggle={() => maxTogglePanel('json')}
                    isMinimized={isJsonMin}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {reduceMotion && (
            <p className="text-xs text-text-muted">Reduced motion is enabled; animation intensity is minimized.</p>
          )}
        </div>
      </div>

      {/* ── Maximize Modal ── */}
      <AnimatePresence>
        {maximizedPanel && (
          <motion.div
            key="exp-modal-backdrop"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMaximizedPanel(null)} />

            <motion.div
              className="relative z-10 w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border/60 bg-surface shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
              initial={{ scale: 0.82, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              {maximizedPanel === 'queue' && (
                <>
                  <PanelTitlebar title="Message Queue" onClose={() => closePanel('queue')} onMinimize={() => { minimizePanel('queue'); setMaximizedPanel(null) }} onMaxToggle={() => setMaximizedPanel(null)} />
                  <div className="p-5 sm:p-6">
                    <div className="space-y-3">
                      {queuedItems.map((item) => (
                        <div key={item.id} className="exp-queue-card">
                          <span className="font-medium text-[13px] leading-snug">{item.company}</span>
                          <span className="text-[11px] text-text-muted leading-snug">{item.role}</span>
                        </div>
                      ))}
                      {queuedItems.length === 0 && (
                        <p className="text-xs text-text-muted italic py-3 text-center">Queue empty</p>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/30 text-[10px] font-mono text-text-muted">
                      {queuedItems.length} pending · {consumedItems.length} consumed
                    </div>
                  </div>
                </>
              )}

              {maximizedPanel === 'processor' && (
                <>
                  <PanelTitlebar title="Processor" onClose={() => closePanel('processor')} onMinimize={() => { minimizePanel('processor'); setMaximizedPanel(null) }} onMaxToggle={() => setMaximizedPanel(null)} badge={stage.toUpperCase()} />
                  <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-bold leading-tight">{activeExperience.company}</h3>
                        <p className="text-lg text-text-secondary mt-2">{activeExperience.role}</p>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-1 rounded-md border border-border/40 bg-surface/50 ${stageTone(stage)} uppercase tracking-wider`}>
                        {stage}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted mb-5">
                      {activeExperience.period} · {activeExperience.location}
                    </p>
                    <div className="space-y-3">
                      {activeExperience.achievements.map((achievement) => (
                        <div key={achievement} className="exp-achievement-row">
                          <span className="exp-achievement-dot" />
                          <span>{achievement}</span>
                        </div>
                      ))}
                    </div>
                    {activeExperience.metric && (
                      <div className="mt-5 flex items-center gap-2 text-[11px] font-mono text-accent/90 bg-accent/8 border border-accent/15 rounded-lg px-3 py-2 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {activeExperience.metric}
                      </div>
                    )}
                    {activeExperience.award && (
                      <div className="exp-award-chip">{activeExperience.award}</div>
                    )}
                  </div>
                </>
              )}

              {maximizedPanel === 'json' && (
                <JsonViewer
                  json={jsonPayload}
                  id={`modal-${activeExperience.id}-${stage}`}
                  onClose={() => closePanel('json')}
                  onMinimize={() => { minimizePanel('json'); setMaximizedPanel(null) }}
                  onMaxToggle={() => setMaximizedPanel(null)}
                  isMinimized={false}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
