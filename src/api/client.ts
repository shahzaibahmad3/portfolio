const API_BASE = import.meta.env.VITE_API_URL || ''

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!API_BASE) throw new Error('API not configured')
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function submitContact(data: {
  name: string
  email: string
  message: string
}) {
  return request<{ status: string; message: string }>('/api/v1/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function trackPageView(data: {
  page: string
  mode: string
  sessionId: string
}) {
  if (!API_BASE) return
  return request<void>('/api/v1/analytics/track', {
    method: 'POST',
    body: JSON.stringify(data),
  }).catch(() => {})
}
