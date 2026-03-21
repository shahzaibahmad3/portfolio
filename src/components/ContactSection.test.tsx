import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ContactSection from './ContactSection'
import { submitContact } from '../api/client'
import { useXRayStore } from '../store/xrayStore'

vi.mock('../api/client', () => ({
  submitContact: vi.fn(),
}))

describe('ContactSection', () => {
  const submitContactMock = vi.mocked(submitContact)

  beforeEach(() => {
    submitContactMock.mockReset()
    useXRayStore.setState({ xray: false })
  })

  it('renders labeled form fields', () => {
    render(<ContactSection />)

    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Message')).toBeInTheDocument()
  })

  it('submits contact data and shows success status', async () => {
    submitContactMock.mockResolvedValue({ status: 'ok', message: 'sent' })
    render(<ContactSection />)

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Shahzaib' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'shahzaib@example.com' } })
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Testing contact flow' } })
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(submitContactMock).toHaveBeenCalledWith({
        name: 'Shahzaib',
        email: 'shahzaib@example.com',
        message: 'Testing contact flow',
      })
    })

    expect(screen.getByRole('status')).toHaveTextContent('Thanks, your message has been sent.')
  })

  it('shows retry message when submission fails', async () => {
    submitContactMock.mockRejectedValue(new Error('failed'))
    render(<ContactSection />)

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Shahzaib' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'shahzaib@example.com' } })
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Testing contact flow' } })
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Could not send message. Please try again.')
    })
  })
})
