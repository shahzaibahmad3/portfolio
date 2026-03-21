import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useXRayStore } from '../store/xrayStore'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  backContent?: React.ReactNode
  hoverReveal?: boolean
}

export default function GlassCard({
  children,
  className = '',
  backContent,
  hoverReveal = true,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const xray = useXRayStore((s) => s.xray)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 25 })
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 25 })

  const spotlightBg = useTransform(
    [mouseX, mouseY],
    ([x, y]) =>
      `radial-gradient(500px circle at ${x}px ${y}px, rgba(99, 102, 241, 0.06), transparent 60%)`,
  )

  function handleMouseMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    mouseX.set(x)
    mouseY.set(y)
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    rotateX.set(((y - centerY) / centerY) * -3)
    rotateY.set(((x - centerX) / centerX) * 3)
  }

  function handleMouseLeave() {
    rotateX.set(0)
    rotateY.set(0)
  }

  const blurLevel = xray ? 4 : 12

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 1000,
      }}
      className={`group relative overflow-hidden ${className}`}
    >
      {backContent && (
        <div
          className="absolute inset-0 p-4 font-mono text-[10px] text-primary-light/40 leading-relaxed overflow-hidden pointer-events-none transition-opacity duration-500"
          style={{ opacity: xray ? 0.6 : 0 }}
        >
          {backContent}
        </div>
      )}

      <div
        className="relative z-10 transition-all duration-500"
        style={{
          backdropFilter: `blur(${blurLevel}px) saturate(120%)`,
          WebkitBackdropFilter: `blur(${blurLevel}px) saturate(120%)`,
        }}
      >
        {hoverReveal && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: spotlightBg }}
          />
        )}
        {children}
      </div>

      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500"
        style={{
          boxShadow: xray
            ? 'inset 0 0 30px rgba(99, 102, 241, 0.08), 0 0 40px rgba(99, 102, 241, 0.05)'
            : 'none',
          border: xray ? '1px solid rgba(99, 102, 241, 0.15)' : 'none',
        }}
      />
    </motion.div>
  )
}
