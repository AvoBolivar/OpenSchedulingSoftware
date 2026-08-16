import { useClientStore } from '../stores/useClientStore'
import { useAppointmentStore } from '../stores/useAppointmentStore'
import { usePaymentStore } from '../stores/usePaymentStore'
import { useAccountStore } from '../stores/useAccountStore'
import { useNotificationStore } from '../stores/useNotificationStore'
import { useCategoryStore } from '../stores/useCategoryStore'

export function resetStores(): void {
  useClientStore.setState(useClientStore.getInitialState(), true)
  useAppointmentStore.setState(useAppointmentStore.getInitialState(), true)
  usePaymentStore.setState(usePaymentStore.getInitialState(), true)
  useAccountStore.setState(useAccountStore.getInitialState(), true)
  useNotificationStore.setState(useNotificationStore.getInitialState(), true)
  useCategoryStore.setState(useCategoryStore.getInitialState(), true)
  localStorage.clear()
}
