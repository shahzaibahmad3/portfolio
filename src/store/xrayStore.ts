import { create } from 'zustand'

interface XRayState {
  xray: boolean
  toggle: () => void
}

export const useXRayStore = create<XRayState>((set) => ({
  xray: true,
  toggle: () => set((s) => ({ xray: !s.xray })),
}))
