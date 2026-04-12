import { useState, useEffect } from 'react'
import { useRemindersStore, type Reminder } from '@/store/appStore'
import AddReminderModal from './AddReminderModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Plus,
  Trash2,
  Bell,
  Clock,
  MapPin,
  Phone,
} from 'lucide-react'

export default function RemindersList() {
  const { reminders, deleteReminder, markNotified } = useRemindersStore()
  const [showAdd, setShowAdd] = useState(false)

  const now = Date.now()
  const upcoming = reminders.filter(
    (r) =>
      new Date(`${r.appointmentDate}T${r.appointmentTime}`).getTime() > now,
  )
  const past = reminders.filter(
    (r) =>
      new Date(`${r.appointmentDate}T${r.appointmentTime}`).getTime() <= now,
  )

  // Notification polling
  useEffect(() => {
    const check = () => {
      const currentTime = Date.now()
      reminders.forEach((r) => {
        if (r.notified) return
        const apptMs = new Date(
          `${r.appointmentDate}T${r.appointmentTime}`,
        ).getTime()
        const fireAt = apptMs - r.reminderMinutesBefore * 60_000
        if (currentTime >= fireAt && currentTime < apptMs + 60_000) {
          markNotified(r.id)
          if (
            typeof Notification !== 'undefined' &&
            Notification.permission === 'granted'
          ) {
            new Notification('CareCompass - Appointment Reminder', {
              body: `${r.providerName} at ${formatTime(r.appointmentTime)}${r.notes ? `\n${r.notes}` : ''}`,
              tag: `reminder-${r.id}`,
            })
          }
        }
      })
    }

    check()
    const id = setInterval(check, 30_000)
    return () => clearInterval(id)
  }, [reminders, markNotified])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-semibold">Reminders</h1>
          <p className="text-sm text-muted-foreground">
            Keep track of upcoming appointments.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus size={14} className="mr-1" />
          Add
        </Button>
      </div>

      {reminders.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">
          <Bell size={32} className="mx-auto mb-3 opacity-30" />
          <p>No reminders yet.</p>
          <p>Add one to get notified before your appointment.</p>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase text-muted-foreground">
            Upcoming
          </h2>
          {upcoming.map((r) => (
            <ReminderCard
              key={r.id}
              reminder={r}
              onDelete={() => deleteReminder(r.id)}
            />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase text-muted-foreground">
            Past
          </h2>
          {past.map((r) => (
            <ReminderCard
              key={r.id}
              reminder={r}
              onDelete={() => deleteReminder(r.id)}
              past
            />
          ))}
        </div>
      )}

      <AddReminderModal open={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  )
}

function ReminderCard({
  reminder: r,
  onDelete,
  past,
}: {
  reminder: Reminder
  onDelete: () => void
  past?: boolean
}) {
  return (
    <Card className={past ? 'opacity-60' : ''}>
      <CardContent className="flex items-start justify-between gap-2 p-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">{r.providerName}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={12} />
            {r.appointmentDate} at {formatTime(r.appointmentTime)}
          </div>
          {r.providerAddress && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin size={12} />
              {r.providerAddress}
            </div>
          )}
          {r.providerPhone && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone size={12} />
              <a href={`tel:${r.providerPhone}`} className="hover:underline">
                {r.providerPhone}
              </a>
            </div>
          )}
          {r.notes && (
            <p className="text-xs text-muted-foreground">{r.notes}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          aria-label="Delete reminder"
          className="shrink-0"
        >
          <Trash2 size={14} />
        </Button>
      </CardContent>
    </Card>
  )
}

function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`
}
