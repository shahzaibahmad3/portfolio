import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

export default function TracingBeam({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const height = useTransform(smoothProgress, [0, 1], ['0%', '100%'])
  const dotTop = useTransform(smoothProgress, [0, 1], ['0%', '100%'])
  const dotOpacity = useTransform(smoothProgress, [0, 0.02, 0.98, 1], [0, 1, 1, 0])

  return (
    <div ref={containerRef} className="relative">
      <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px hidden lg:block" aria-hidden="true">
        <div className="sticky top-0 h-screen flex items-start pt-20">
          <div className="relative h-full w-px">
            <div className="absolute inset-0 bg-border" />
            <motion.div
              className="absolute top-0 left-0 w-full origin-top"
              style={{
                height,
                background: 'linear-gradient(to bottom, #6366f1, #22d3ee, #34d399)',
              }}
            />
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary"
              style={{
                top: dotTop,
                opacity: dotOpacity,
                boxShadow: '0 0 12px 4px rgba(99, 102, 241, 0.5)',
              }}
            />
          </div>
        </div>
      </div>

      <div className="lg:pl-20">{children}</div>
    </div>
  )
}
