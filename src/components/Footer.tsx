import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter } from 'lucide-react'
import { useXRayStore } from '../store/xrayStore'

const socials = [
  { icon: Github, href: 'https://github.com/shahzaibahmad3', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/shahzaib-ahmad-82102717b', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://x.com/ShahzaibAhma20', label: 'X' },
]

export default function Footer() {
  const xray = useXRayStore((s) => s.xray)
  const year = new Date().getFullYear()

  return (
    <footer className="relative py-14 border-t border-border">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <p className="text-sm text-text-muted">
            &copy; {year} Shahzaib Ahmad
          </p>
          {xray && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] font-mono text-primary-light/30 mt-1"
            >
              shahzaib.sys uptime: {Math.floor(4.5 * 365)}d &middot; pid: 8080 &middot; status: healthy
            </motion.p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {socials.map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="p-2.5 rounded-xl text-text-muted hover:text-text border border-transparent hover:border-border hover:bg-surface-elevated transition-all"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <s.icon size={17} />
            </motion.a>
          ))}
        </div>
      </div>
    </footer>
  )
}
