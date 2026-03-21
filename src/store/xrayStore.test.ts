import { beforeEach, describe, expect, it } from 'vitest'
import { useXRayStore } from './xrayStore'

describe('xrayStore', () => {
  beforeEach(() => {
    useXRayStore.setState({ xray: false })
  })

  it('toggles xray state', () => {
    expect(useXRayStore.getState().xray).toBe(false)
    useXRayStore.getState().toggle()
    expect(useXRayStore.getState().xray).toBe(true)
    useXRayStore.getState().toggle()
    expect(useXRayStore.getState().xray).toBe(false)
  })
})
