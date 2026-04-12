import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRemindersStore, usePreferencesStore } from '@/store/appStore'
import { translations } from '@/lib/i18n'

interface Props {
  open: boolean
  onClose: () => void
}

export default function AddReminderModal({ open, onClose }: Props) {
  const addReminder = useRemindersStore((s) => s.addReminder)
  const locale = usePreferencesStore((s) => s.locale)
  const t = translations[locale]
  const [providerName, setProviderName] = useState('')
  const [providerAddress, setProviderAddress] = useState('')
  const [providerPhone, setProviderPhone] = useState('')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const [reminderMinutesBefore, setReminderMinutesBefore] = useState(30)
  const [notes, setNotes] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!providerName || !appointmentDate || !appointmentTime) return

    addReminder({
      providerName,
      providerAddress: providerAddress || undefined,
      providerPhone: providerPhone || undefined,
      appointmentDate,
      appointmentTime,
      reminderMinutesBefore,
      notes,
    })

    // Request notification permission
    if (
      typeof Notification !== 'undefined' &&
      Notification.permission === 'default'
    ) {
      Notification.requestPermission()
    }

    // Reset and close
    setProviderName('')
    setProviderAddress('')
    setProviderPhone('')
    setAppointmentDate('')
    setAppointmentTime('')
    setReminderMinutesBefore(30)
    setNotes('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.reminder_modal_title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="r-provider">{t.reminder_provider_label}</Label>
            <Input
              id="r-provider"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              placeholder={t.reminder_provider_placeholder}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-address">{t.reminder_address_label}</Label>
            <Input
              id="r-address"
              value={providerAddress}
              onChange={(e) => setProviderAddress(e.target.value)}
              placeholder={t.reminder_optional_placeholder}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-phone">{t.reminder_phone_label}</Label>
            <Input
              id="r-phone"
              value={providerPhone}
              onChange={(e) => setProviderPhone(e.target.value)}
              placeholder={t.reminder_optional_placeholder}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="r-date">{t.reminder_date_label}</Label>
              <Input
                id="r-date"
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-time">{t.reminder_time_label}</Label>
              <Input
                id="r-time"
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-remind">{t.reminder_remind_label}</Label>
            <select
              id="r-remind"
              value={reminderMinutesBefore}
              onChange={(e) =>
                setReminderMinutesBefore(parseInt(e.target.value, 10))
              }
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value={15}>{t.reminder_15_min}</option>
              <option value={30}>{t.reminder_30_min}</option>
              <option value={60}>{t.reminder_1_hour}</option>
              <option value={120}>{t.reminder_2_hours}</option>
              <option value={1440}>{t.reminder_1_day}</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-notes">{t.reminder_notes_label}</Label>
            <Textarea
              id="r-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.reminder_notes_placeholder}
              rows={2}
            />
          </div>
          <Button type="submit" className="w-full">
            {t.reminder_submit}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
