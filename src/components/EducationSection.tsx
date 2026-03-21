import { motion } from 'framer-motion'
import { GraduationCap, Award } from 'lucide-react'
import { education } from '../data/education'

export default function EducationSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container">
        <div className="max-w-4xl mb-10 sm:mb-12">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-accent/80 mb-4">
            Education
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.15] mb-4">
            Academic Foundation
          </h2>
          <p className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-3xl">
            Formal training in computer science and engineering fundamentals.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 sm:gap-6">
          {education.map((entry, index) => (
            <motion.article
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="rounded-2xl border border-border/45 p-6 sm:p-7 bg-surface/25 hover:border-border-hover transition-colors shadow-[0_10px_32px_rgba(0,0,0,0.16)]"
            >
              <div className="w-10 h-10 rounded-xl border border-border bg-bg/70 flex items-center justify-center mb-5">
                {entry.id === 'btech' ? (
                  <GraduationCap size={17} className="text-accent" />
                ) : (
                  <Award size={17} className="text-primary-light" />
                )}
              </div>
              <h3 className="text-base font-semibold leading-snug">{entry.degree}</h3>
              <p className="text-sm text-text-secondary mt-2 leading-relaxed">{entry.institution}</p>
              {entry.board && (
                <p className="text-xs text-text-muted mt-1">Board: {entry.board}</p>
              )}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
                <span className="text-sm font-mono font-semibold text-accent">{entry.score}</span>
                <span className="text-xs text-text-muted">{entry.period}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
