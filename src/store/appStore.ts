import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { InsuranceType } from '@/lib/cost-estimator'
import type { ScannedCard } from '@/lib/card-scanner'
import type { Locale } from '@/lib/i18n'

// SSR-safe storage: returns localStorage on client, no-op on server
const ssrStorage = createJSONStorage(() =>
  typeof window !== 'undefined'
    ? localStorage
    : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      },
)

// ── Insurance Profile ──

export interface InsuranceProfile {
  insuranceType: InsuranceType | ''
  planName: string
  memberId: string
  groupNumber: string
  insurerPhone: string
  effectiveDate: string
  city: string
  state: string
  stateCode: string
  zip: string
}

const EMPTY_PROFILE: InsuranceProfile = {
  insuranceType: '',
  planName: '',
  memberId: '',
  groupNumber: '',
  insurerPhone: '',
  effectiveDate: '',
  city: '',
  state: '',
  stateCode: '',
  zip: '',
}

interface InsuranceProfileSlice {
  profile: InsuranceProfile
  updateField: <K extends keyof InsuranceProfile>(
    field: K,
    value: InsuranceProfile[K],
  ) => void
  applyScannedCard: (card: ScannedCard) => void
  clearProfile: () => void
}

export const useInsuranceStore = create<InsuranceProfileSlice>()(
  persist(
    (set) => ({
      profile: EMPTY_PROFILE,
      updateField: (field, value) =>
        set((s) => ({ profile: { ...s.profile, [field]: value } })),
      applyScannedCard: (card) =>
        set((s) => ({
          profile: {
            ...s.profile,
            ...(card.insuranceType && { insuranceType: card.insuranceType }),
            ...(card.planName && { planName: card.planName }),
            ...(card.memberId && { memberId: card.memberId }),
            ...(card.groupNumber && { groupNumber: card.groupNumber }),
            ...(card.insurerPhone && { insurerPhone: card.insurerPhone }),
          },
        })),
      clearProfile: () => set({ profile: EMPTY_PROFILE }),
    }),
    { name: 'carecompass:insurance_profile', storage: ssrStorage },
  ),
)

// ── Reminders ──

export interface Reminder {
  id: string
  providerName: string
  providerAddress?: string
  providerPhone?: string
  appointmentDate: string
  appointmentTime: string
  reminderMinutesBefore: number
  notes: string
  notified: boolean
  createdAt: string
}

interface RemindersSlice {
  reminders: Reminder[]
  addReminder: (
    data: Omit<Reminder, 'id' | 'notified' | 'createdAt'>,
  ) => Reminder
  updateReminder: (
    id: string,
    patch: Partial<Omit<Reminder, 'id' | 'createdAt'>>,
  ) => void
  deleteReminder: (id: string) => void
  markNotified: (id: string) => void
}

function byDate(a: Reminder, b: Reminder) {
  return (
    new Date(`${a.appointmentDate}T${a.appointmentTime}`).getTime() -
    new Date(`${b.appointmentDate}T${b.appointmentTime}`).getTime()
  )
}

export const useRemindersStore = create<RemindersSlice>()(
  persist(
    (set) => ({
      reminders: [],
      addReminder: (data) => {
        const reminder: Reminder = {
          ...data,
          id: crypto.randomUUID(),
          notified: false,
          createdAt: new Date().toISOString(),
        }
        set((s) => ({ reminders: [...s.reminders, reminder].sort(byDate) }))
        return reminder
      },
      updateReminder: (id, patch) =>
        set((s) => ({
          reminders: s.reminders
            .map((r) => (r.id === id ? { ...r, ...patch } : r))
            .sort(byDate),
        })),
      deleteReminder: (id) =>
        set((s) => ({
          reminders: s.reminders.filter((r) => r.id !== id),
        })),
      markNotified: (id) =>
        set((s) => ({
          reminders: s.reminders.map((r) =>
            r.id === id ? { ...r, notified: true } : r,
          ),
        })),
    }),
    { name: 'carecompass:reminders', storage: ssrStorage },
  ),
)

// ── Language & Accessibility ──

export type FontSize = 'sm' | 'md' | 'lg'

interface PreferencesSlice {
  locale: Locale
  simpleMode: boolean
  highContrast: boolean
  fontSize: FontSize
  setLocale: (l: Locale) => void
  toggleSimpleMode: () => void
  toggleHighContrast: () => void
  setFontSize: (s: FontSize) => void
}

export const usePreferencesStore = create<PreferencesSlice>()(
  persist(
    (set) => ({
      locale: 'en',
      simpleMode: false,
      highContrast: false,
      fontSize: 'md',
      setLocale: (locale) => set({ locale }),
      toggleSimpleMode: () => set((s) => ({ simpleMode: !s.simpleMode })),
      toggleHighContrast: () =>
        set((s) => ({ highContrast: !s.highContrast })),
      setFontSize: (fontSize) => set({ fontSize }),
    }),
    { name: 'carecompass:preferences', storage: ssrStorage },
  ),
)
