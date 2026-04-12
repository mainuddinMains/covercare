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
import { useRemindersStore } from '@/store/appStore'

interface Props {
  open: boolean
  onClose: () => void
}

export default function AddReminderModal({ open, onClose }: Props) {
  const addReminder = useRemindersStore((s) => s.addReminder)
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
          <DialogTitle>Add Appointment Reminder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="r-provider">Provider Name *</Label>
            <Input
              id="r-provider"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              placeholder="e.g. Dr. Smith"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-address">Address</Label>
            <Input
              id="r-address"
              value={providerAddress}
              onChange={(e) => setProviderAddress(e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-phone">Phone</Label>
            <Input
              id="r-phone"
              value={providerPhone}
              onChange={(e) => setProviderPhone(e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="r-date">Date *</Label>
              <Input
                id="r-date"
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-time">Time *</Label>
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
            <Label htmlFor="r-remind">Remind me (minutes before)</Label>
            <select
              id="r-remind"
              value={reminderMinutesBefore}
              onChange={(e) =>
                setReminderMinutesBefore(parseInt(e.target.value, 10))
              }
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={1440}>1 day</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-notes">Notes</Label>
            <Textarea
              id="r-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Bring insurance card, list of medications..."
              rows={2}
            />
          </div>
          <Button type="submit" className="w-full">
            Add Reminder
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
