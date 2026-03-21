import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2, CheckCircle2, Clock3, ShieldCheck, Sparkles } from 'lucide-react'
import { submitContact } from '../api/client'

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      await submitContact(form)
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch {
      const subject = encodeURIComponent(`Portfolio contact from ${form.name}`)
      const body = encodeURIComponent(`Hi Shahzaib,\n\n${form.message}\n\nFrom: ${form.name} (${form.email})`)
      window.location.href = `mailto:shazaibahmad3@gmail.com?subject=${subject}&body=${body}`
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    }
  }

  return (
    <section id="contact" className="py-16 sm:py-20 relative">
      <div className="container">
        <div className="mb-10 sm:mb-12 max-w-4xl relative z-10">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-accent/80 mb-4">Contact Signal</p>
          <h2 className="text-3xl sm:text-5xl font-semibold text-text tracking-tight mb-4 leading-[1.15]">
            Let's Build Something
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-2xl"
          >
            Have an interesting systems problem? Let's talk.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-[0.9fr_1.3fr] gap-12 xl:gap-16 relative z-10 items-start"
        >
          <aside className="pt-4">
            <h3 className="text-2xl sm:text-3xl font-semibold mb-6 leading-snug">
              Fast and practical collaboration
            </h3>
            <p className="text-text-secondary leading-relaxed mb-8">
              Share context, expected outcomes, and constraints. I will reply with a concrete plan and
              working implementation details.
            </p>

            <div className="space-y-4">
              <div className="contact-highlight-item">
                <Clock3 size={16} className="text-accent shrink-0" />
                <span>Quick response with implementation-first approach</span>
              </div>
              <div className="contact-highlight-item">
                <ShieldCheck size={16} className="text-green shrink-0" />
                <span>Production-minded decisions with quality checks</span>
              </div>
              <div className="contact-highlight-item">
                <Sparkles size={16} className="text-primary-light shrink-0" />
                <span>Design + engineering balance for premium UX</span>
              </div>
            </div>
          </aside>

          <div className="rounded-3xl border border-border/70 bg-surface/35 backdrop-blur-sm p-8 sm:p-10 shadow-[0_12px_46px_rgba(0,0,0,0.16)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-name" className="contact-field-label">Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="contact-field-input"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="contact-field-label">Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="contact-field-input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="contact-field-label">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  placeholder="Tell me about your project, timeline, and constraints..."
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="contact-field-input resize-none"
                />
              </div>

              <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
                <button
                  type="submit"
                  disabled={status === 'sending' || status === 'sent'}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] text-sm min-w-[180px] justify-center"
                >
                  {status === 'sending' && <Loader2 size={16} className="animate-spin" />}
                  {status === 'sent' && <CheckCircle2 size={16} className="text-green" />}
                  {status === 'idle' && <Send size={16} />}
                  {status === 'error' && <Send size={16} />}
                  <span>
                    {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Message Sent!' : status === 'error' ? 'Retry' : 'Send Message'}
                  </span>
                </button>

                <span className="text-sm text-text-muted" aria-live="polite" role="status">
                  {status === 'sent' ? 'Thanks, your message has been sent.' : ''}
                  {status === 'error' ? 'Could not send message. Please try again.' : ''}
                </span>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
