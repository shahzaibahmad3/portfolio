import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { useXRayStore } from '../store/xrayStore'

export default function XRayToggle() {
  const { xray, toggle } = useXRayStore()

  return (
    <button
      onClick={toggle}
      className={`fixed top-8 right-8 z-50 flex items-center gap-2.5 rounded-full text-sm font-medium px-5 py-2.5 transition-transform duration-200 ease-out hover:scale-[1.10] active:scale-[0.93] opacity-0 ${
        xray
          ? 'bg-primary/20 border border-primary/40 text-primary-light shadow-lg shadow-primary/20'
          : 'bg-surface/80 backdrop-blur-xl border border-border text-text-muted hover:text-text hover:border-border-hover'
      }`}
      style={{ animation: 'xray-fade-in 0.4s ease 2s forwards' }}
      aria-label={xray ? 'Switch to clean view' : 'Switch to X-Ray view'}
    >
      {xray ? <Eye size={14} /> : <EyeOff size={14} />}
      <span className="hidden sm:inline">{xray ? 'X-Ray: ON' : 'X-Ray'}</span>
      {xray && (
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-primary-light"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </button>
  )
}
