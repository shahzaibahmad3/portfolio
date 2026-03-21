import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('api client', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  it('submits contact data to versioned endpoint using VITE_API_URL', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.com')
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'ok', message: 'sent' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { submitContact } = await import('./client')
    const payload = {
      name: 'Shahzaib',
      email: 'shahzaib@example.com',
      message: 'Hello',
    }

    await submitContact(payload)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/api/v1/contact',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    )
  })

  it('silently ignores analytics failures', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.com')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

    const { trackPageView } = await import('./client')

    await expect(
      trackPageView({
        page: 'portfolio-v2',
        mode: 'normal',
        sessionId: 'session-123',
      }),
    ).resolves.toBeUndefined()
  })
})
