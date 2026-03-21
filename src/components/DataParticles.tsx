import { useEffect, useRef, useState } from 'react'
import { useBootStore } from '../store/bootStore'
import { useXRayStore } from '../store/xrayStore'

interface Beam {
  x: number
  y: number
  dx: number
  dy: number
  speed: number
  length: number
  color: string
  opacity: number
}

const beamColors = ['#22d3ee', '#818cf8', '#34d399', '#6366f1', '#f472b6', '#fbbf24']

const GRID_GAP = 70
const BEAM_COUNT = 18
const INTERSECTION_PULSE_COUNT = 8

export default function DataParticles() {
  const booted = useBootStore((s) => s.booted)
  const xray = useXRayStore((s) => s.xray)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const beamsRef = useRef<Beam[]>([])
  const animRef = useRef<number>(0)
  const pulsesRef = useRef<{ x: number; y: number; color: string; phase: number; speed: number }[]>([])
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 })

  useEffect(() => {
    function updateSize() {
      setDimensions({ w: window.innerWidth, h: window.innerHeight })
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    if (!booted || !canvasRef.current || dimensions.w === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = dimensions.w * dpr
    canvas.height = dimensions.h * dpr
    ctx.scale(dpr, dpr)

    const hLines: number[] = []
    const vLines: number[] = []
    for (let y = GRID_GAP; y < dimensions.h; y += GRID_GAP) hLines.push(y)
    for (let x = GRID_GAP; x < dimensions.w; x += GRID_GAP) vLines.push(x)

    function spawnBeam(): Beam {
      const isHorizontal = Math.random() > 0.5
      const color = beamColors[Math.floor(Math.random() * beamColors.length)]
      const speed = 0.4 + Math.random() * 1.2
      const length = 50 + Math.random() * 150

      if (isHorizontal) {
        const y = hLines[Math.floor(Math.random() * hLines.length)]
        const goRight = Math.random() > 0.5
        return {
          x: goRight ? -length : dimensions.w + length,
          y,
          dx: goRight ? 1 : -1,
          dy: 0,
          speed,
          length,
          color,
          opacity: 0.12 + Math.random() * 0.2,
        }
      }
      const x = vLines[Math.floor(Math.random() * vLines.length)]
      const goDown = Math.random() > 0.5
      return {
        x,
        y: goDown ? -length : dimensions.h + length,
        dx: 0,
        dy: goDown ? 1 : -1,
        speed,
        length,
        color,
        opacity: 0.12 + Math.random() * 0.2,
      }
    }

    beamsRef.current = Array.from({ length: BEAM_COUNT }, () => {
      const beam = spawnBeam()
      if (beam.dx !== 0) beam.x = Math.random() * dimensions.w
      else beam.y = Math.random() * dimensions.h
      return beam
    })

    const intersections: { x: number; y: number }[] = []
    for (const x of vLines) {
      for (const y of hLines) {
        intersections.push({ x, y })
      }
    }

    pulsesRef.current = Array.from({ length: INTERSECTION_PULSE_COUNT }, () => {
      const spot = intersections[Math.floor(Math.random() * intersections.length)]
      return {
        x: spot.x,
        y: spot.y,
        color: beamColors[Math.floor(Math.random() * beamColors.length)],
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.015,
      }
    })

    function tick() {
      if (!ctx) return
      ctx.clearRect(0, 0, dimensions.w, dimensions.h)

      const globalMul = xray ? 2.2 : 1

      // Faint grid lines
      ctx.lineWidth = 0.5
      for (const y of hLines) {
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.025 * globalMul})`
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(dimensions.w, y)
        ctx.stroke()
      }
      for (const x of vLines) {
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.025 * globalMul})`
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, dimensions.h)
        ctx.stroke()
      }

      // Pulsing intersection nodes
      for (const p of pulsesRef.current) {
        p.phase += p.speed
        const brightness = 0.5 + 0.5 * Math.sin(p.phase)
        const radius = 1.5 + brightness * 1.5
        const alpha = (0.06 + brightness * 0.12) * globalMul

        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = alpha
        ctx.shadowBlur = 6
        ctx.shadowColor = p.color
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // Traveling beams
      const beams = beamsRef.current
      for (let i = 0; i < beams.length; i++) {
        const b = beams[i]

        b.x += b.dx * b.speed
        b.y += b.dy * b.speed

        const outOfBounds =
          b.dx > 0
            ? b.x - b.length > dimensions.w
            : b.dx < 0
              ? b.x + b.length < 0
              : b.dy > 0
                ? b.y - b.length > dimensions.h
                : b.y + b.length < 0

        if (outOfBounds) {
          beams[i] = spawnBeam()
          continue
        }

        const headX = b.x
        const headY = b.y
        const tailX = b.x - b.dx * b.length
        const tailY = b.y - b.dy * b.length

        const gradient = ctx.createLinearGradient(tailX, tailY, headX, headY)
        gradient.addColorStop(0, 'transparent')
        gradient.addColorStop(0.6, b.color)
        gradient.addColorStop(1, b.color)

        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(headX, headY)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.2
        ctx.globalAlpha = b.opacity * globalMul
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(headX, headY, 1.8, 0, Math.PI * 2)
        ctx.fillStyle = b.color
        ctx.globalAlpha = b.opacity * globalMul * 0.9
        ctx.shadowBlur = 10
        ctx.shadowColor = b.color
        ctx.fill()
        ctx.shadowBlur = 0
      }

      ctx.globalAlpha = 1
      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [booted, dimensions, xray])

  if (!booted) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none"
      style={{
        width: dimensions.w,
        height: dimensions.h,
        maskImage:
          'radial-gradient(ellipse 85% 75% at 50% 50%, black 25%, transparent 75%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 85% 75% at 50% 50%, black 25%, transparent 75%)',
      }}
      aria-hidden="true"
    />
  )
}
