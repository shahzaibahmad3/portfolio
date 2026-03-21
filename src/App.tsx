import { useEffect, useLayoutEffect } from 'react'
import AuroraBackground from './components/AuroraBackground'
import SystemLayer from './components/SystemLayer'
import MessageStream from './components/MessageStream'
import DataParticles from './components/DataParticles'
import DatadogPanel from './components/DatadogPanel'
import XRayToggle from './components/XRayToggle'
import FloatingDock from './components/FloatingDock'
import HeroSection from './components/HeroSection'
import PlatformsSection from './components/PlatformsSection'
import ExperiencePipelineSection from './components/ExperiencePipelineSection'
import SkillsGrid from './components/SkillsGrid'
import EducationSection from './components/EducationSection'
import ContactSection from './components/ContactSection'
import SocialSection from './components/SocialSection'
import Footer from './components/Footer'
import { trackPageView } from './api/client'
import { useBootStore } from './store/bootStore'

export default function App() {
  const booted = useBootStore((s) => s.booted)

  useEffect(() => {
    const analyticsSentKey = 'portfolio-v2-analytics-sent'
    if (sessionStorage.getItem(analyticsSentKey) === '1') return
    sessionStorage.setItem(analyticsSentKey, '1')

    let sessionId = sessionStorage.getItem('portfolio-v2-session-id')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      sessionStorage.setItem('portfolio-v2-session-id', sessionId)
    }

    void trackPageView({
      page: 'portfolio-v2',
      mode: 'normal',
      sessionId,
    })
  }, [])

  useLayoutEffect(() => {
    const root = document.documentElement
    const previousRootOverflow = root.style.overflowY
    const previousBodyOverflow = document.body.style.overflowY
    const previousScrollBehavior = root.style.scrollBehavior

    if (!booted) {
      root.style.scrollBehavior = 'auto'
      root.style.overflowY = 'hidden'
      document.body.style.overflowY = 'hidden'

      const resetScroll = () => {
        window.scrollTo(0, 0)
        root.scrollTop = 0
        document.body.scrollTop = 0
      }

      resetScroll()
      requestAnimationFrame(resetScroll)
    } else {
      root.style.overflowY = 'auto'
      document.body.style.overflowY = 'auto'
    }

    return () => {
      root.style.overflowY = previousRootOverflow
      document.body.style.overflowY = previousBodyOverflow
      root.style.scrollBehavior = previousScrollBehavior
    }
  }, [booted])

  return (
    <>
      <AuroraBackground />
      <SystemLayer />
      <MessageStream />
      <DataParticles />
      <DatadogPanel />
      <XRayToggle />
      <FloatingDock />

      <main className="relative z-10">
        <HeroSection />
        <div className={booted ? '' : 'pointer-events-none opacity-30 blur-[1.4px] transition-all duration-500'}>
          <PlatformsSection />
          <ExperiencePipelineSection />
          <SkillsGrid />
          <EducationSection />
          <ContactSection />
          <SocialSection />
        </div>
      </main>

      <Footer />
    </>
  )
}
