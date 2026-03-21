import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin = ''
  readonly thresholds: ReadonlyArray<number> = []

  disconnect() {}

  observe() {}

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  unobserve() {}
}

globalThis.IntersectionObserver = MockIntersectionObserver

afterEach(() => {
  cleanup()
})
