import { createFileRoute } from '@tanstack/react-router'
import RemindersList from '@/components/RemindersList'

export const Route = createFileRoute('/reminders')({
  component: RemindersPage,
})

function RemindersPage() {
  return <RemindersList />
}
