import { useClientStore } from '../stores/useClientStore'
import { useEmployeeStore } from '../stores/useEmployeeStore'
import { useAppointmentStore } from '../stores/useAppointmentStore'
import { usePaymentStore } from '../stores/usePaymentStore'
import { useAccountStore } from '../stores/useAccountStore'
import { useNotificationStore } from '../stores/useNotificationStore'
import { useJobStore } from '../stores/useJobStore'

export function resetStores(): void {
  useClientStore.setState(useClientStore.getInitialState(), true)
  useEmployeeStore.setState(useEmployeeStore.getInitialState(), true)
  useAppointmentStore.setState(useAppointmentStore.getInitialState(), true)
  usePaymentStore.setState(usePaymentStore.getInitialState(), true)
  useAccountStore.setState(useAccountStore.getInitialState(), true)
  useNotificationStore.setState(useNotificationStore.getInitialState(), true)
  useJobStore.setState(useJobStore.getInitialState(), true)
  localStorage.clear()
}
