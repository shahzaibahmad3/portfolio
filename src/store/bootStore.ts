import { create } from 'zustand'

interface BootState {
  booted: boolean
  setBooted: (booted: boolean) => void
  toggleBoot: () => void
}

export const useBootStore = create<BootState>((set) => ({
  booted: false,
  setBooted: (booted) => set({ booted }),
  toggleBoot: () => set((s) => ({ booted: !s.booted })),
}))
