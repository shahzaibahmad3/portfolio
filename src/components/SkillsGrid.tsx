import { motion } from 'framer-motion'
import { skillCategories } from '../data/skills'
import { Code2, Database, Cloud, MessageSquare, Wrench, Layers } from 'lucide-react'

const categoryIcons: Record<string, typeof Code2> = {
  'Languages': Code2,
  'Frameworks': Layers,
  'Databases': Database,
  'Message Queues': MessageSquare,
  'Cloud & DevOps': Cloud,
  'Tools & Practices': Wrench,
}

const tones: Record<string, string> = {
  'Languages': 'text-primary-light border-primary/30 bg-primary/8',
  'Frameworks': 'text-accent border-accent/30 bg-accent/8',
  'Databases': 'text-green border-green/30 bg-green/8',
  'Message Queues': 'text-amber border-amber/30 bg-amber/8',
  'Cloud & DevOps': 'text-primary-light border-primary/30 bg-primary/8',
  'Tools & Practices': 'text-accent border-accent/30 bg-accent/8',
}

export default function SkillsGrid() {
  return (
    <section id="skills" className="py-16 sm:py-20">
      <div className="container">
        <div className="max-w-4xl mb-10 sm:mb-12">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-accent/80 mb-4">Technology Matrix</p>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.15] mb-4">Tech stack with room to breathe</h2>
          <p className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-3xl">
            A flowing map of languages, infra, queue systems, and tools used in production systems.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {skillCategories.map((category, index) => {
            const Icon = categoryIcons[category.name] ?? Code2
            const tone = tones[category.name] ?? tones['Languages']

            return (
              <motion.article
                key={category.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: index * 0.06, duration: 0.42 }}
                className="tech-ribbon"
              >
                <div className="tech-ribbon-head">
                  <span className={`tech-ribbon-icon ${tone}`}>
                    <Icon size={16} />
                  </span>
                  <h3 className="tech-ribbon-title">{category.name}</h3>
                </div>

                <div className="tech-ribbon-chips">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="tech-chip">
                      <span className="tech-chip-name">{skill.name}</span>
                      <span className="tech-chip-meta">{skill.usedAt.join(' · ')}</span>
                    </div>
                  ))}
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
