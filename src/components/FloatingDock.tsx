import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { Layers, Briefcase, Code2, Activity, Mail, FileDown } from 'lucide-react'
import { useBootStore } from '../store/bootStore'

const resumeUrl = `${import.meta.env.BASE_URL}resume.pdf`

const dockItems = [
  { id: 'projects', label: 'Projects', icon: Layers, href: '#projects' },
  { id: 'experience', label: 'Experience', icon: Briefcase, href: '#experience' },
  { id: 'skills', label: 'Skills', icon: Code2, href: '#skills' },
  { id: 'architecture', label: 'Architecture', icon: Activity, href: '#architecture' },
  { id: 'contact', label: 'Contact', icon: Mail, href: '#contact' },
  { id: 'resume', label: 'Resume', icon: FileDown, href: resumeUrl, download: true },
]

function DockIcon({
  item,
  mouseX,
}: {
  item: (typeof dockItems)[0]
  mouseX: ReturnType<typeof useMotionValue<number>>
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const distance = useTransform(mouseX, (val: number) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return 200
    return val - rect.left - rect.width / 2
  })

  const size = useTransform(distance, [-150, 0, 150], [40, 56, 40])
  const springSize = useSpring(size, { mass: 0.2, stiffness: 200, damping: 15 })

  return (
    <motion.div
      ref={ref}
      style={{ width: springSize, height: springSize }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center justify-center"
    >
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-surface-elevated border border-border text-xs text-text whitespace-nowrap font-medium"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      <a
        href={item.href}
        download={item.download}
        className="w-full h-full rounded-xl bg-surface-elevated border border-border hover:border-primary/30 flex items-center justify-center text-text-muted hover:text-primary-light transition-colors"
        aria-label={item.label}
      >
        <item.icon size={18} />
      </a>
    </motion.div>
  )
}

export default function FloatingDock() {
  const mouseX = useMotionValue(Infinity)
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)
  const booted = useBootStore((s) => s.booted)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const atBottom = y + window.innerHeight >= document.body.scrollHeight - 100
      if (atBottom) {
        setVisible(false)
      } else if (y > lastScrollY.current && y > 200) {
        setVisible(false)
      } else {
        setVisible(true)
      }
      lastScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && booted && (
        <motion.nav
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-end gap-2 px-4 py-3 rounded-2xl bg-bg/80 backdrop-blur-xl border border-border shadow-2xl shadow-black/40"
          role="navigation"
          aria-label="Quick navigation"
        >
          {dockItems.map((item) => (
            <DockIcon key={item.id} item={item} mouseX={mouseX} />
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
