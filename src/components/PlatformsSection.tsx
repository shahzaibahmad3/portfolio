import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projects, libraries } from '../data/projects'
import { Layers3, Cpu, Boxes, GripHorizontal, RotateCcw } from 'lucide-react'
import { MOBILE_BOOT_MEDIA_QUERY, shouldAutoBootOnMobile } from '../store/bootStore'

type WindowState = 'normal' | 'minimized' | 'closed'

function excerpt(text: string, words: number) {
  const items = text.split(' ')
  if (items.length <= words) return text
  return `${items.slice(0, words).join(' ')}...`
}

function WindowDots({
  onClose,
  onMinimize,
  onMaxToggle,
}: {
  onClose: () => void
  onMinimize: () => void
  onMaxToggle: () => void
}) {
  return (
    <div className="flex items-center gap-[7px] group/dots" role="group" aria-label="Window controls" onDoubleClick={(e) => e.stopPropagation()}>
      <button
        onClick={(e) => { e.stopPropagation(); onClose() }}
        className="w-[11px] h-[11px] rounded-full bg-[#ff5f57] hover:brightness-110 transition-all flex items-center justify-center"
        aria-label="Close"
      >
        <span className="text-[8px] font-black leading-none text-black/70 opacity-0 group-hover/dots:opacity-100 transition-opacity select-none">×</span>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onMinimize() }}
        className="w-[11px] h-[11px] rounded-full bg-[#febd2e] hover:brightness-110 transition-all flex items-center justify-center"
        aria-label="Minimize"
      >
        <span className="text-[9px] font-black leading-none text-black/70 opacity-0 group-hover/dots:opacity-100 transition-opacity select-none">−</span>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onMaxToggle() }}
        className="w-[11px] h-[11px] rounded-full bg-[#28c940] hover:brightness-110 transition-all flex items-center justify-center"
        aria-label="Maximize"
      >
        <span className="text-[6px] font-black leading-none text-black/70 opacity-0 group-hover/dots:opacity-100 transition-opacity select-none">↗</span>
      </button>
    </div>
  )
}

const modalSpring = { type: 'spring' as const, stiffness: 320, damping: 28, mass: 0.8 }

export default function PlatformsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [states, setStates] = useState<Record<string, WindowState>>({})
  const [maximizedId, setMaximizedId] = useState<string | null>(null)
  const [isMobileViewport, setIsMobileViewport] = useState(() => shouldAutoBootOnMobile())

  const get = (id: string): WindowState => states[id] ?? 'normal'

  const close = (id: string) => {
    setStates(p => ({ ...p, [id]: 'closed' }))
    if (maximizedId === id) setMaximizedId(null)
  }
  const minimize = (id: string) =>
    setStates(p => ({ ...p, [id]: (p[id] ?? 'normal') === 'minimized' ? 'normal' : 'minimized' }))
  const maxToggle = (id: string) =>
    setMaximizedId(prev => prev === id ? null : id)
  const resetAll = () => { setStates({}); setMaximizedId(null) }

  useEffect(() => {
    if (!maximizedId) return
    document.body.style.overflow = 'hidden'
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setMaximizedId(null) }
    window.addEventListener('keydown', onEsc)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onEsc)
    }
  }, [maximizedId])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    const mediaQuery = window.matchMedia(MOBILE_BOOT_MEDIA_QUERY)
    const updateViewport = (matches: boolean) => setIsMobileViewport(matches)
    updateViewport(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => updateViewport(event.matches)

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  const anyModified = Object.values(states).some(s => s && s !== 'normal') || maximizedId !== null
  const allProjectsClosed = projects.every(p => get(p.id) === 'closed')
  const allLibsClosed = libraries.every(l => get(l.id) === 'closed')

  const maxProject = maximizedId ? projects.find(p => p.id === maximizedId) : null
  const maxLib = maximizedId ? libraries.find(l => l.id === maximizedId) : null

  return (
    <section id="projects" className="py-16 sm:py-20">
      <div className="container" ref={containerRef}>
        <div className="max-w-4xl mb-10 sm:mb-12">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-accent/80 mb-4">
            Platforms and Libraries
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.15] mb-4">
            Built for scale, kept readable
          </h2>
          <p className="text-text-secondary text-base sm:text-lg leading-[1.75] max-w-3xl">
            Flagship backend platforms and reusable internal libraries with clean interfaces.
          </p>
        </div>

        <div className="flex justify-end mb-4 h-[32px]">
          <button
            onClick={resetAll}
            className={`flex items-center gap-1.5 text-[11px] font-mono text-accent/80 hover:text-accent px-3 py-1.5 rounded-lg border border-accent/20 hover:border-accent/40 bg-accent/5 transition-all duration-200 hover:scale-[1.06] active:scale-[0.95] ${anyModified ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <RotateCcw size={11} />
            Restore All
          </button>
        </div>

        {/* ── Flagship Platforms ── */}
        <div className="space-y-5 mb-10 sm:mb-12">
          <div className="flex items-center gap-2.5">
            <Layers3 size={18} className="text-primary-light" />
            <h3 className="text-xl sm:text-2xl font-semibold">Flagship Platforms</h3>
          </div>

          {allProjectsClosed ? (
            <p className="text-sm text-text-muted italic py-6 text-center">
              All platform windows closed.{' '}
              <button onClick={resetAll} className="text-accent hover:underline">Restore all</button>
            </p>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 items-start">
              <AnimatePresence>
                {projects.map((project, index) => {
                  const state = get(project.id)
                  if (state === 'closed') return null
                  const isMin = state === 'minimized'

                  return (
                    <motion.article
                      key={project.id}
                      className="platform-window"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                      transition={{ delay: index * 0.06, duration: 0.4 }}
                      drag={!isMobileViewport}
                      dragConstraints={containerRef}
                      dragElastic={0.06}
                      dragMomentum={false}
                      whileDrag={isMobileViewport ? undefined : { zIndex: 50, scale: 1.02, boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}
                    >
                      <div className="platform-window-titlebar cursor-default" onDoubleClick={() => maxToggle(project.id)}>
                        <div className="flex items-center gap-2.5">
                          <WindowDots
                            onClose={() => close(project.id)}
                            onMinimize={() => minimize(project.id)}
                            onMaxToggle={() => maxToggle(project.id)}
                          />
                          <span className="font-mono text-[10px] text-text-muted/60 tracking-wider uppercase ml-1">
                            {project.title.toLowerCase().replace(/\s+/g, '-')}.service
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-primary-dim text-primary-light border border-primary/20">
                            {project.metric}
                          </span>
                          <GripHorizontal size={12} className="text-text-muted/30" />
                        </div>
                      </div>

                      {!isMin && (
                        <div className="platform-window-body">
                          <div className="mb-2.5">
                            <h4 className="text-base font-bold">{project.title}</h4>
                            <p className="text-sm text-text-muted mt-1">{project.subtitle}</p>
                          </div>
                          <p className="text-[0.82rem] text-text-secondary leading-[1.7] mb-3">
                            {excerpt(project.impact, 28)}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {project.tech.slice(0, 4).map((tech) => (
                              <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-border/50 bg-bg/60 text-text-muted">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.article>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ── Internal Libraries ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-2.5">
            <Boxes size={18} className="text-accent" />
            <h3 className="text-xl sm:text-2xl font-semibold">Internal Libraries</h3>
          </div>

          {allLibsClosed ? (
            <p className="text-sm text-text-muted italic py-6 text-center">
              All library windows closed.{' '}
              <button onClick={resetAll} className="text-accent hover:underline">Restore all</button>
            </p>
          ) : (
            <div className="grid lg:grid-cols-3 gap-5 sm:gap-6 items-start">
              <AnimatePresence>
                {libraries.map((lib, index) => {
                  const state = get(lib.id)
                  if (state === 'closed') return null
                  const isMin = state === 'minimized'

                  return (
                    <motion.article
                      key={lib.id}
                      className="platform-window"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                      transition={{ delay: index * 0.06, duration: 0.4 }}
                      drag={!isMobileViewport}
                      dragConstraints={containerRef}
                      dragElastic={0.06}
                      dragMomentum={false}
                      whileDrag={isMobileViewport ? undefined : { zIndex: 50, scale: 1.02, boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}
                    >
                      <div className="platform-window-titlebar cursor-default" onDoubleClick={() => maxToggle(lib.id)}>
                        <div className="flex items-center gap-2.5">
                          <WindowDots
                            onClose={() => close(lib.id)}
                            onMinimize={() => minimize(lib.id)}
                            onMaxToggle={() => maxToggle(lib.id)}
                          />
                          <span className="font-mono text-[10px] text-text-muted/60 tracking-wider ml-1">{lib.name}</span>
                        </div>
                        <GripHorizontal size={12} className="text-text-muted/30" />
                      </div>

                      {!isMin && (
                        <div className="platform-window-body">
                          <div className="flex items-center gap-2 mb-2">
                            <Cpu size={14} className="text-accent shrink-0" />
                            <h4 className="text-sm font-bold font-mono">{lib.name}</h4>
                          </div>
                          <p className="text-[0.82rem] text-text-secondary leading-[1.7] mb-3">
                            {excerpt(lib.description, 25)}
                          </p>
                          <ul className="space-y-2 mb-3">
                            {lib.features.slice(0, 2).map((feature) => (
                              <li key={feature} className="text-[0.8rem] text-text-secondary leading-relaxed flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="flex flex-wrap gap-1.5">
                            {lib.tech.slice(0, 3).map((tech) => (
                              <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-border/50 bg-bg/60 text-text-muted">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.article>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ── Maximize Modal ── */}
      <AnimatePresence>
        {maximizedId && (maxProject || maxLib) && (
          <motion.div
            key="modal-backdrop"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMaximizedId(null)} />

            <motion.div
              className="relative z-10 w-full max-w-4xl max-h-[85vh] overflow-y-auto platform-window shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
              initial={{ scale: 0.82, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 30 }}
              transition={modalSpring}
              onClick={(e) => e.stopPropagation()}
            >
              {maxProject && (
                <>
                  <div className="platform-window-titlebar sticky top-0 z-10 backdrop-blur-xl">
                    <div className="flex items-center gap-2.5">
                      <WindowDots
                        onClose={() => close(maxProject.id)}
                        onMinimize={() => { minimize(maxProject.id); setMaximizedId(null) }}
                        onMaxToggle={() => setMaximizedId(null)}
                      />
                      <span className="font-mono text-[10px] text-text-muted/60 tracking-wider uppercase ml-1">
                        {maxProject.title.toLowerCase().replace(/\s+/g, '-')}.service
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-primary-dim text-primary-light border border-primary/20">
                      {maxProject.metric}
                    </span>
                  </div>
                  <div className="platform-window-body">
                    <div className="mb-5">
                      <h4 className="text-xl sm:text-2xl font-bold">{maxProject.title}</h4>
                      <p className="text-base text-text-muted mt-2">{maxProject.subtitle}</p>
                    </div>
                    <p className="text-[0.9rem] text-text-secondary leading-[1.85] mb-6">
                      {maxProject.impact}
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {maxProject.tech.map((tech) => (
                        <span key={tech} className="text-[11px] font-mono px-3 py-1.5 rounded-md border border-border/50 bg-bg/60 text-text-muted">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {maxLib && (
                <>
                  <div className="platform-window-titlebar sticky top-0 z-10 backdrop-blur-xl">
                    <div className="flex items-center gap-2.5">
                      <WindowDots
                        onClose={() => close(maxLib.id)}
                        onMinimize={() => { minimize(maxLib.id); setMaximizedId(null) }}
                        onMaxToggle={() => setMaximizedId(null)}
                      />
                      <span className="font-mono text-[10px] text-text-muted/60 tracking-wider ml-1">{maxLib.name}</span>
                    </div>
                  </div>
                  <div className="platform-window-body">
                    <div className="flex items-center gap-2.5 mb-4">
                      <Cpu size={17} className="text-accent shrink-0" />
                      <h4 className="text-lg font-bold font-mono">{maxLib.name}</h4>
                    </div>
                    <p className="text-[0.9rem] text-text-secondary leading-[1.85] mb-6">
                      {maxLib.description}
                    </p>
                    <ul className="space-y-3 mb-6">
                      {maxLib.features.map((feature) => (
                        <li key={feature} className="text-[0.85rem] text-text-secondary leading-relaxed flex items-start gap-2.5">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2.5">
                      {maxLib.tech.map((tech) => (
                        <span key={tech} className="text-[11px] font-mono px-3 py-1.5 rounded-md border border-border/50 bg-bg/60 text-text-muted">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
