import { create } from 'zustand'

interface BootState {
  booted: boolean
  setBooted: (booted: boolean) => void
  toggleBoot: () => void
}

export const MOBILE_BOOT_MEDIA_QUERY = '(max-width: 767px)'

export function shouldAutoBootOnMobile() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia(MOBILE_BOOT_MEDIA_QUERY).matches
}

export const useBootStore = create<BootState>((set) => ({
  booted: shouldAutoBootOnMobile(),
  setBooted: (booted) => set({ booted }),
  toggleBoot: () => set((s) => ({ booted: !s.booted })),
}))
