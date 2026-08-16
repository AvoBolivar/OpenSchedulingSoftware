import { beforeEach, describe, expect, it } from "vitest"
import { buildBackupData } from "./exportData"
import { useClientStore } from "../stores/useClientStore"
import { useAppointmentStore } from "../stores/useAppointmentStore"
import { usePaymentStore } from "../stores/usePaymentStore"
import { resetStores } from "../testUtils/resetStores"
import { buildClient, buildAppointment, buildPayment } from "../testUtils/builders"

describe("buildBackupData", () => {
  beforeEach(() => resetStores())

  it("returns the real store arrays, not the persist middleware's storage envelope", () => {
    const client = buildClient()
    useClientStore.getState().createClient(client)
    const appointment = buildAppointment({ clientID: client.id })
    useAppointmentStore.getState().createAppointment(appointment)
    const payment = buildPayment({ appointmentID: appointment.id })
    usePaymentStore.getState().createPayment(payment)

    const data = buildBackupData()

    expect(Array.isArray(data.clients)).toBe(true)
    expect(Array.isArray(data.appointments)).toBe(true)
    expect(Array.isArray(data.payments)).toBe(true)
    expect(data.clients).toHaveLength(1)
    expect(data.appointments).toHaveLength(1)
    expect(data.payments).toHaveLength(1)
    expect(data.clients[0]).toMatchObject({ name: client.name })
  })
})
