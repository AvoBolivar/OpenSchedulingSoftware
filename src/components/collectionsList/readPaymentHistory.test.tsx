import { describe, it, expect, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '../../testUtils/render'
import ReadPaymentHistory from './readPaymentHistory'
import { resetStores } from '../../testUtils/resetStores'
import { buildClient, buildAppointment, buildPayment } from '../../testUtils/builders'
import { useClientStore } from '../../stores/useClientStore'
import { useAppointmentStore } from '../../stores/useAppointmentStore'
import { usePaymentStore } from '../../stores/usePaymentStore'

describe('ReadPaymentHistory', () => {
  beforeEach(() => resetStores())

  it('shows the empty state when no payments have been received', () => {
    render(<ReadPaymentHistory />)

    expect(screen.getByText(/no payments received yet/i)).toBeInTheDocument()
  })

  it("renders a received payment's client name, method, and formatted date", () => {
    const client = buildClient({ name: 'Jane Doe' })
    const appointment = buildAppointment({ clientID: client.id })
    const payment = buildPayment({
      appointmentID: appointment.id,
      paymentReceived: true,
      method: 'venmo',
      date: new Date(2026, 0, 15).toDateString(),
    })

    useClientStore.setState({ clients: [client] })
    useAppointmentStore.setState({ appointments: [appointment] })
    usePaymentStore.setState({ payments: [payment] })

    render(<ReadPaymentHistory />)

    const expectedDate = new Date(payment.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('venmo')).toBeInTheDocument()
    expect(screen.getByText(expectedDate)).toBeInTheDocument()
  })

  it('opens the edit modal for the clicked payment', async () => {
    const client = buildClient({ name: 'Jane Doe' })
    const appointment = buildAppointment({ clientID: client.id })
    const payment = buildPayment({ appointmentID: appointment.id, paymentReceived: true })

    useClientStore.setState({ clients: [client] })
    useAppointmentStore.setState({ appointments: [appointment] })
    usePaymentStore.setState({ payments: [payment] })

    render(<ReadPaymentHistory />)

    await userEvent.click(screen.getByRole('button', { name: /jane doe/i }))

    expect(screen.getByRole('dialog', { name: 'Collection' })).toBeInTheDocument()
  })
})
