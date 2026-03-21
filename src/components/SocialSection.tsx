import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Twitter } from 'lucide-react'

const socials = [
  {
    name: 'GitHub',
    href: 'https://github.com/shahzaibahmad3',
    subtitle: 'Code and experiments',
    icon: Github,
    tone: 'from-primary/20 via-primary-dim to-transparent',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/shahzaib-ahmad-82102717b',
    subtitle: 'Professional updates',
    icon: Linkedin,
    tone: 'from-accent/20 via-accent-dim to-transparent',
  },
  {
    name: 'X',
    href: 'https://x.com/ShahzaibAhma20',
    subtitle: 'Thoughts and threads',
    icon: Twitter,
    tone: 'from-green/20 via-green-dim to-transparent',
  },
  {
    name: 'Email',
    href: 'mailto:shazaibahmad3@gmail.com',
    subtitle: 'Direct conversation',
    icon: Mail,
    tone: 'from-amber/20 via-amber-dim to-transparent',
  },
] as const

export default function SocialSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container">
        <div className="max-w-4xl mb-10 sm:mb-12">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-accent/80 mb-4">
            Social Presence
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.15] mb-4">Find me across channels</h2>
          <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
            Reach out where you already are. Open profile links, updates, and direct contact in one place.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-7">
          {socials.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.href}
              target={social.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              className={`rounded-3xl border border-border/45 p-7 sm:p-8 bg-gradient-to-br ${social.tone} bg-surface/25 hover:border-border-hover transition-colors min-h-[186px] shadow-[0_10px_32px_rgba(0,0,0,0.16)]`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              whileHover={{ y: -6 }}
            >
              <div className="w-10 h-10 rounded-xl border border-border bg-bg/70 flex items-center justify-center mb-5">
                <social.icon size={17} className="text-text" />
              </div>
              <p className="text-lg font-semibold">{social.name}</p>
              <p className="text-sm text-text-secondary mt-1.5">{social.subtitle}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
