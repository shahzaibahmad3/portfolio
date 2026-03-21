import { motion } from 'framer-motion'

interface TextGenerateEffectProps {
  text: string
  className?: string
  delay?: number
  as?: 'p' | 'h1' | 'h2' | 'span'
}

export default function TextGenerateEffect({
  text,
  className = '',
  delay = 0,
  as: Tag = 'p',
}: TextGenerateEffectProps) {
  const words = text.split(' ')

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, filter: 'blur(8px)', y: 4 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{
            duration: 0.4,
            delay: delay + i * 0.06,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  )
}

interface ScrollTextRevealProps {
  text: string
  className?: string
  as?: 'p' | 'h2' | 'h3' | 'span'
}

export function ScrollTextReveal({ text, className = '', as: Tag = 'h2' }: ScrollTextRevealProps) {
  const words = text.split(' ')

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, filter: 'blur(6px)', y: 8 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{
            duration: 0.35,
            delay: i * 0.04,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  )
}
