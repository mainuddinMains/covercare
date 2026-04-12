import { useEffect, useRef } from 'react'
import { useSession } from '@/lib/auth-client'
import { setAuthState } from '@/lib/sync'
import { useInsuranceStore, useRemindersStore } from '@/store/appStore'
import {
  getInsuranceProfile,
  getReminders,
  saveInsuranceProfile,
  saveReminder as saveReminderToServer,
} from '@/lib/server/user-data'
import type { Reminder } from '@/store/appStore'

export default function DataSync() {
  const { data: session } = useSession()
  const hydratedRef = useRef(false)

  useEffect(() => {
    const isRealUser = session && !session.user.isAnonymous
    if (!isRealUser) {
      setAuthState(null)
      hydratedRef.current = false
      return
    }

    if (hydratedRef.current) return
    hydratedRef.current = true
    setAuthState(session.user.id)

    // Hydrate insurance profile from D1
    getInsuranceProfile().then((serverProfile) => {
      const localProfile = useInsuranceStore.getState().profile
      const localHasData =
        localProfile.insuranceType ||
        localProfile.planName ||
        localProfile.zip

      if (serverProfile) {
        useInsuranceStore.setState({
          profile: {
            insuranceType: serverProfile.insuranceType as any,
            planName: serverProfile.planName,
            memberId: serverProfile.memberId,
            groupNumber: serverProfile.groupNumber,
            insurerPhone: serverProfile.insurerPhone,
            effectiveDate: serverProfile.effectiveDate,
            city: serverProfile.city,
            state: serverProfile.state,
            stateCode: serverProfile.stateCode,
            zip: serverProfile.zip,
          },
        })
      } else if (localHasData) {
        saveInsuranceProfile({ data: localProfile }).catch(() => {})
      }
    }).catch(() => {})

    // Hydrate reminders from D1
    getReminders().then((serverReminders) => {
      const localReminders = useRemindersStore.getState().reminders

      if (serverReminders.length > 0) {
        const mapped: Reminder[] = serverReminders.map((r) => ({
          id: r.id,
          providerName: r.providerName,
          providerAddress: r.providerAddress ?? undefined,
          providerPhone: r.providerPhone ?? undefined,
          appointmentDate: r.appointmentDate,
          appointmentTime: r.appointmentTime,
          reminderMinutesBefore: r.reminderMinutesBefore,
          notes: r.notes,
          notified: r.notified,
          createdAt: r.createdAt,
        }))
        useRemindersStore.setState({ reminders: mapped })
      } else if (localReminders.length > 0) {
        for (const reminder of localReminders) {
          saveReminderToServer({ data: reminder }).catch(() => {})
        }
      }
    }).catch(() => {})
  }, [session])

  return null
}
