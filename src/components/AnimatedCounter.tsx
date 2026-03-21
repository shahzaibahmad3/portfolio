import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface AnimatedCounterProps {
  target: string
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export default function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 2000,
  className = '',
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState('0')
  const [done, setDone] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const frameRef = useRef<number | null>(null)
  const isInView = useInView(ref, { once: true })
  const numericPart = parseFloat(target.replace(/[^0-9.]/g, ''))

  useEffect(() => {
    if (!isInView) return
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      const current = numericPart * eased
      setDisplay(
        target.includes('.') ? current.toFixed(1) : Math.floor(current).toLocaleString(),
      )
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        setDone(true)
      }
    }
    frameRef.current = requestAnimationFrame(tick)

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }
  }, [isInView, target, numericPart, duration])

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ filter: 'blur(8px)', scale: 0.9 }}
      animate={
        isInView
          ? { filter: 'blur(0px)', scale: done ? [1.05, 1] : 1 }
          : {}
      }
      transition={{ duration: 0.6, scale: { duration: 0.3 } }}
    >
      {prefix}{display}{suffix}
    </motion.span>
  )
}
